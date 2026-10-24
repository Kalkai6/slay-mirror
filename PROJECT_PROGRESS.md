# Slay Mirror — Project Progress

## Phase 0: Environment Setup — COMPLETE
- GPU: NVIDIA RTX 4050 Laptop, 6GB VRAM, Driver 561.00, CUDA 12.6
- Project location: D:\SlayMirror
- Conda environment: D:\SlayMirror\envs\vton (Python 3.11.17)
- PyTorch: 2.14.1+cu126 (CUDA confirmed working via torch.cuda.is_available())

## Phase 1: Core Virtual Try-On Model — COMPLETE
- Model: FASHN VTON v1.5 (https://github.com/fashn-AI/fashn-vton-1.5)
- License: Apache-2.0
- Weights downloaded: model.safetensors (~2GB) + DWPose ONNX models
- Tested successfully:
  - FASHN sample person + sample garment (category: tops)
  - Real user photo + sample garment (category: tops)
  - Real user photo + new garment (category: one-pieces)
- Average inference time: ~76 seconds per image (30 sampling steps, 2.55s/it)
- Known issue (non-blocking): onnxruntime-gpu CUDA execution provider fails
  to load (missing cublasLt64_13.dll), so DWPose pose detection runs on CPU
  instead of GPU. Main diffusion model still runs on GPU successfully.

## Next: Phase 2 — Build minimal upload/try-on web interface
## Phase 2: Minimal Web Interface — COMPLETE
- Built with Gradio 6.30.0, wrapping the same TryOnPipeline used in Phase 1
- File: fashn-vton-1.5/app.py
- Runs locally at http://127.0.0.1:7860
- Features implemented and tested:
  - Upload person photo + garment image
  - Category selector (tops / bottoms / one-pieces)
  - Try On button triggers real AI inference
  - Live "processing" status shown during generation (~60-90s)
  - Result image displayed with built-in download icon
  - Input validation (missing/invalid files show clear errors, no crash)
  - Delete/clear uploaded images via built-in "X" icon
  - Results saved with unique timestamped filenames (outputs/result_<timestamp>.png)
    so repeated try-ons don't overwrite each other

## Next: Phase 3 — React + FastAPI shopping website with cart,
connected to this same TryOnPipeline

## Known Limitation (to revisit later)
- The pretrained model can subtly alter body proportions/shape when generating
  results, especially when the garment's reference photo has a different
  body shape than the user's photo. This is a known limitation of current
  open-source virtual try-on models in general (FASHN, CatVTON, IDM-VTON all
  share this to some degree), not a bug in our integration code.
- To revisit: check FASHN's documentation for any fidelity/guidance-scale
  parameters, or test with closer-fitting original photos.

## Known Limitations (to revisit together later)

1. **Body shape/proportion drift**: The pretrained model can subtly alter
   body proportions when generating results, especially when the garment's
   reference photo has a different body shape than the user's photo. This
   is a known limitation shared by current open-source virtual try-on
   models in general (FASHN, CatVTON, IDM-VTON), not a bug in our
   integration code.

2. **No person-detection validation**: The backend validates that an
   upload is a technically valid image file, but does not verify the
   image actually contains a person. Uploading a non-person image (tested
   with a screenshot of a data table) did not error out - pose detection
   likely failed silently and the pipeline produced a nonsensical cropped
   result instead of a clear error. FASHN's public API does not expose a
   pose-detection confidence score, so a real fix would require either
   digging into undocumented internals or adding a separate pose-detection
   pre-check - deliberately deferred for now to stay focused on the core
   milestone.

Both to be investigated together after the core project is finalized.