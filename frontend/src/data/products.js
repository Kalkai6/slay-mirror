// Sample product data for Slay Mirror demo store.
// Images are real garment photos used in Phase 1 try-on testing.
// Prices are mock values - this is a demo, no real payments.

export const products = [
  {
    id: 1,
    name: "Classic Black Crew-Neck Tee",
    price: 499,
    category: "tops",       // must match FASHN categories: tops / bottoms / one-pieces
    image: "/garments/black-tshirt.webp",
    description: "A simple black cotton t-shirt, perfect for everyday wear.",
    tryOnReady: true,
  },
  {
    id: 2,
    name: "Floral Tiered Maxi Dress",
    price: 1899,
    category: "one-pieces",
    image: "/garments/floral-dress.jpeg",
    description: "A flowy white floral dress with a tiered skirt and short sleeves.",
    tryOnReady: true,
  },
];