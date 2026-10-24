import { Link } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

function CatalogPage() {
  const { addToCart, totalItems } = useCart();

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rose-600">Slay Mirror</h1>
          <p className="text-sm text-stone-500">Demo store — try before you buy, virtually</p>
        </div>
        <Link
          to="/cart"
          className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-4 py-2 rounded-full hover:bg-rose-100 transition-colors"
        >
          <span className="text-rose-600 font-medium">🛍 Cart</span>
          <span className="bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {totalItems}
          </span>
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-72 object-cover bg-stone-100"
              />
              <div className="p-4">
                <span className="text-xs font-medium text-rose-500 uppercase tracking-wide">
                  {product.category}
                </span>
                <h2 className="text-lg font-semibold text-stone-800 mt-1">
                  {product.name}
                </h2>
                <p className="text-sm text-stone-500 mt-1">{product.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-stone-900">
                    Rs. {product.price}
                  </span>
                  {product.tryOnReady && (
                    <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full font-medium">
                      Try-on ready
                    </span>
                  )}
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full mt-4 bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default CatalogPage;