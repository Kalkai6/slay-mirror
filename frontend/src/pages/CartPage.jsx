import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rose-600">Slay Mirror</h1>
          <p className="text-sm text-stone-500">Your Cart</p>
        </div>
        <Link to="/" className="text-rose-600 font-medium hover:underline">
          ← Back to shop
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-500 text-lg">Your cart is empty.</p>
            <Link
              to="/"
              className="inline-block mt-4 bg-rose-600 hover:bg-rose-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-stone-200 rounded-xl p-4 flex gap-4 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg bg-stone-100"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-stone-800">{item.name}</h3>
                    <p className="text-sm text-stone-500">{item.category}</p>
                    <p className="text-stone-900 font-bold mt-1">Rs. {item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                  {item.tryOnReady && (
                    <Link
                      to={`/try-on/${item.id}`}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ml-2"
                    >
                      Try On
                    </Link>
                  )}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-rose-500 hover:text-rose-700 text-sm font-medium ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-white border border-stone-200 rounded-xl p-6 flex items-center justify-between">
              <span className="text-lg font-semibold text-stone-700">Total</span>
              <span className="text-2xl font-bold text-stone-900">Rs. {totalPrice}</span>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default CartPage;