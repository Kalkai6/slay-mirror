"""Slay Mirror - FastAPI backend with real virtual try-on inference."""

import io
import os
import traceback
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image

from fashn_vton import TryOnPipeline

# Absolute path to the weights we downloaded in Phase 1.
WEIGHTS_DIR = r"D:\SlayMirror\fashn-vton-1.5\weights"
OUTPUT_DIR = r"D:\SlayMirror\backend\outputs"
MAX_IMAGE_MB = 10
VALID_CATEGORIES = {"tops", "bottoms", "one-pieces"}

os.makedirs(OUTPUT_DIR, exist_ok=True)

app = FastAPI(title="Slay Mirror API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the pipeline once, when the server starts (slow - do it once, not per request).
print("Loading TryOnPipeline... this can take a little while.")
pipeline = TryOnPipeline(weights_dir=WEIGHTS_DIR)
print("Pipeline loaded. Backend ready.")


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Slay Mirror API is running"}


async def read_and_validate_image(upload: UploadFile, label: str) -> Image.Image:
    contents = await upload.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_IMAGE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"{label} image is {size_mb:.1f}MB. Please use an image under {MAX_IMAGE_MB}MB.",
        )
    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(
            status_code=400,
            detail=f"The {label} file doesn't look like a valid image.",
        )
    return image


@app.post("/try-on")
async def try_on(
    person_image: UploadFile = File(...),
    garment_image: UploadFile = File(...),
    category: str = Form(...),
):
    if category not in VALID_CATEGORIES:
        raise HTTPException(
            status_code=400,
            detail=f"Category must be one of {sorted(VALID_CATEGORIES)}.",
        )

    person = await read_and_validate_image(person_image, "person")
    garment = await read_and_validate_image(garment_image, "garment")

    try:
        result = pipeline(
            person_image=person,
            garment_image=garment,
            category=category,
        )
        output_image = result.images[0]

        # Save a copy on disk too, same pattern as the Gradio app.
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        save_path = os.path.join(OUTPUT_DIR, f"result_{timestamp}.png")
        output_image.save(save_path)

        # Stream the image back directly to the browser.
        buffer = io.BytesIO()
        output_image.save(buffer, format="PNG")
        buffer.seek(0)
        return StreamingResponse(buffer, media_type="image/png")

    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Something went wrong during generation: {e}",
        )