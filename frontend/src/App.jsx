import { Routes, Route } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage";
import CartPage from "./pages/CartPage";
import TryOnPage from "./pages/TryOnPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/try-on/:productId" element={<TryOnPage />} />
    </Routes>
  );
}

export default App;