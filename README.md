# Slay Mirror — AI Virtual Try-On & Fashion Shop (College Demo)

Slay Mirror is a demo e-commerce platform that lets users virtually try on
clothing using a real, pretrained AI model — upload a photo, pick a garment,
and see a photorealistic generated image of yourself wearing it.

This project was built as a college demonstration. The AI model itself is
an existing, pretrained, open-source model (not trained from scratch);
the website, backend, and integration code are original work built around it.

---

## What's Reused vs. What We Built

| Component | Source |
|---|---|
| Virtual try-on AI model (FASHN VTON v1.5) | Pretrained, from [fashn-AI/fashn-vton-1.5](https://github.com/fashn-AI/fashn-vton-1.5) (Apache-2.0 license) |
| Pose detection (DWPose) | Bundled with the FASHN repo |
| Human parsing (FASHN Human Parser) | Auto-downloaded by the FASHN repo |
| React shopping website (catalog, cart, routing) | Built for this project |
| FastAPI backend (`/try-on` endpoint) | Built for this project |
| Gradio test interface (`app.py`) | Built for this project |

---

## Features

- Browse a product catalog with real garment photos
- Add items to a shopping cart (quantity, remove)
- Click "Try On" on any cart item to open a dedicated try-on page
- Upload a full-body photo and generate a real AI try-on result
- Download the generated result
- Input validation and error handling throughout

---

## Tech Stack

- **AI Model:** FASHN VTON v1.5 (PyTorch, diffusion-based, maskless virtual try-on)
- **Frontend:** React (Vite) + Tailwind CSS + React Router
- **Backend:** FastAPI (Python) + Uvicorn
- **Pose Detection:** DWPose (ONNX Runtime)

---

## Project Structure
SlayMirror/
├── fashn-vton-1.5/ # Cloned AI model repo (pretrained, Apache-2.0)
│ ├── weights/ # Downloaded model weights (not in git - see below)
│ └── app.py # Gradio test interface we built
├── backend/ # FastAPI backend we built
│ └── main.py
├── frontend/ # React website we built
│ └── src/
│ ├── pages/ # CatalogPage, CartPage, TryOnPage
│ ├── context/ # CartContext (cart state)
│ └── data/ # products.js (sample product data)
├── PROJECT_PROGRESS.md # Development log
└── README.md # This file

---

## Setup Instructions

### Prerequisites
- Windows 10/11
- NVIDIA GPU with CUDA support (tested on RTX 4050, 6GB VRAM)
- Anaconda/Miniconda
- Node.js (v18+)
- Git

### 1. Clone this repository
```bash
git clone <your-repo-url>
cd SlayMirror
```

### 2. Set up the Python environment
```bash
conda create --prefix ./envs/vton python=3.11 -y
conda activate ./envs/vton
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu126
cd fashn-vton-1.5
pip install -e .
pip install gradio fastapi uvicorn python-multipart
```

### 3. Download the AI model weights
```bash
python scripts/download_weights.py --weights-dir ./weights
```
This downloads ~2GB of pretrained weights from Hugging Face.

### 4. Start the backend (Terminal 1)
```bash
cd backend
conda activate ../envs/vton
uvicorn main:app --reload --port 8000
```

### 5. Start the frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

### 6. Open the website
Go to `http://localhost:5173` in your browser.

---

## Known Limitations

1. **Body shape drift**: The model can subtly alter body proportions during
   generation, especially when the garment's reference photo has a different
   body shape than the user. This is a known limitation shared across
   current open-source virtual try-on models (FASHN, CatVTON, IDM-VTON),
   not specific to this integration.

2. **No person-detection validation**: Uploaded images are checked for
   being valid image files, but not for actually containing a person.
   FASHN's public API doesn't expose a pose-detection confidence score,
   so this isn't currently caught with a clean error.

3. **GPU VRAM**: Tested successfully on a 6GB RTX 4050, taking approximately
   60-90 seconds per generation.

---

## License & Attribution

This project uses FASHN VTON v1.5, licensed under Apache-2.0, by FASHN AI.
See their [repository](https://github.com/fashn-AI/fashn-vton-1.5) for full
license and citation details. All original code in `backend/` and `frontend/`
in this repository was written for this project.