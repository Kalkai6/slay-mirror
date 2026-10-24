import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { products } from "../data/products";

const API_BASE = "http://127.0.0.1:8000";

function TryOnPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(productId));

  const [personFile, setPersonFile] = useState(null);
  const [personPreview, setPersonPreview] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500">Product not found.</p>
      </div>
    );
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPersonFile(file);
    setPersonPreview(URL.createObjectURL(file));
    setResultUrl(null);
    setStatus("");
  }

  async function handleTryOn() {
    if (!personFile) {
      setStatus("Please upload a full-body photo first.");
      return;
    }

    setLoading(true);
    setStatus("Generating... this usually takes about 60-90 seconds.");
    setResultUrl(null);

    try {
      const garmentResponse = await fetch(product.image);
      const garmentBlob = await garmentResponse.blob();

      const formData = new FormData();
      formData.append("person_image", personFile);
      formData.append("garment_image", garmentBlob, "garment.jpg");
      formData.append("category", product.category);

      const response = await fetch(`${API_BASE}/try-on`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Generation failed.");
      }

      const resultBlob = await response.blob();
      setResultUrl(URL.createObjectURL(resultBlob));
      setStatus("Done! Your try-on result is ready.");
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-rose-600">Slay Mirror</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-rose-600 font-medium hover:underline"
        >
          ← Back
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold text-stone-800 mb-6">
          Try On: {product.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Your photo upload */}
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-sm font-medium text-stone-600 mb-2">Your Photo</p>
            <label className="block border-2 border-dashed border-stone-300 rounded-lg h-72 flex items-center justify-center cursor-pointer hover:border-rose-400 overflow-hidden bg-stone-100">
              {personPreview ? (
                <img
                  src={personPreview}
                  alt="You"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-stone-400 text-sm">Click to upload</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Garment preview */}
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-sm font-medium text-stone-600 mb-2">Garment</p>
            <div className="w-full h-72 flex items-center justify-center bg-stone-100 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Result */}
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-sm font-medium text-stone-600 mb-2">Result</p>
            <div className="w-full h-72 flex items-center justify-center bg-stone-100 rounded-lg overflow-hidden">
              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt="Try-on result"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-stone-400 text-sm">
                  {loading ? "Generating..." : "No result yet"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleTryOn}
            disabled={loading}
            className="bg-rose-600 hover:bg-rose-700 disabled:bg-stone-300 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            {loading ? "Generating..." : "Try On"}
          </button>
          {resultUrl && (
            <a
              href={resultUrl}
              download={`slaymirror-tryon-${product.id}.png`}
              className="text-rose-600 font-medium hover:underline"
            >
              Download Result
            </a>
          )}
        </div>

        {status && <p className="mt-4 text-sm text-stone-600">{status}</p>}
      </main>
    </div>
  );
}

export default TryOnPage;