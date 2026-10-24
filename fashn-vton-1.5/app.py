"""Slay Mirror - Minimal Virtual Try-On Web Interface.

Wraps the FASHN VTON v1.5 TryOnPipeline (already tested via
examples/basic_inference.py) in a simple Gradio browser interface.
"""

import os
import traceback
from datetime import datetime

import gradio as gr
from PIL import Image

from fashn_vton import TryOnPipeline

WEIGHTS_DIR = "./weights"
OUTPUT_DIR = "./outputs"
MAX_IMAGE_MB = 10

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load the pipeline once when the app starts (not on every click).
print("Loading TryOnPipeline... this can take a little while the first time.")
pipeline = TryOnPipeline(weights_dir=WEIGHTS_DIR)
print("Pipeline loaded. Starting web interface...")


def validate_image(file_path, label):
    """Basic checks before we trust an uploaded file."""
    if file_path is None:
        return f"Please upload a {label} image."
    size_mb = os.path.getsize(file_path) / (1024 * 1024)
    if size_mb > MAX_IMAGE_MB:
        return f"{label} image is {size_mb:.1f}MB. Please use an image under {MAX_IMAGE_MB}MB."
    try:
        Image.open(file_path).verify()
    except Exception:
        return f"The {label} file doesn't look like a valid image."
    return None


def run_tryon(person_path, garment_path, category):
    """Called when the user clicks the Try On button."""
    error = validate_image(person_path, "person")
    if error:
        return None, error
    error = validate_image(garment_path, "garment")
    if error:
        return None, error

    try:
        person = Image.open(person_path).convert("RGB")
        garment = Image.open(garment_path).convert("RGB")

        result = pipeline(
            person_image=person,
            garment_image=garment,
            category=category,
        )

        output_image = result.images[0]

        # Unique filename so results don't overwrite each other.
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        save_path = os.path.join(OUTPUT_DIR, f"result_{timestamp}.png")
        output_image.save(save_path)

        return output_image, f"Done! Saved as {save_path}"

    except Exception as e:
        # Never crash the app silently - show a real error message.
        print(traceback.format_exc())
        return None, f"Something went wrong during generation: {e}"


with gr.Blocks(title="Slay Mirror - Virtual Try-On") as demo:
    gr.Markdown("# 🪞 Slay Mirror — Virtual Try-On")
    gr.Markdown(
        "Upload a full-body photo and a garment image, pick a category, "
        "and click **Try On** to generate an AI try-on result."
    )

    with gr.Row():
        with gr.Column():
            person_input = gr.Image(
                label="Your Photo (full body)", type="filepath"
            )
        with gr.Column():
            garment_input = gr.Image(
                label="Garment Image", type="filepath"
            )
        with gr.Column():
            result_output = gr.Image(label="Try-On Result")

    category_input = gr.Radio(
        choices=["tops", "bottoms", "one-pieces"],
        value="tops",
        label="Garment Category",
    )

    status_output = gr.Textbox(label="Status", interactive=False)

    tryon_button = gr.Button("Try On", variant="primary")
    def show_loading():
        return None, "Generating... this usually takes about 60-90 seconds. Please wait."

    tryon_button.click(
        fn=show_loading,
        inputs=[],
        outputs=[result_output, status_output],
    ).then(
        fn=run_tryon,
        inputs=[person_input, garment_input, category_input],
        outputs=[result_output, status_output],
    )

if __name__ == "__main__":
    demo.launch()