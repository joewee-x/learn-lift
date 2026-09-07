import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const KEY = 'learnhub_cart';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('learnhub_wishlist')) || []; } catch { return []; }
  });

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('learnhub_wishlist', JSON.stringify(wishlist)), [wishlist]);

  const addToCart = (course) => setCart((c) => (c.find((x) => x.id === course.id) ? c : [...c, course]));
  const removeFromCart = (id) => setCart((c) => c.filter((x) => x.id !== id));
  const clearCart = () => setCart([]);

  const toggleWishlist = (course) =>
    setWishlist((w) => (w.find((x) => x.id === course.id) ? w.filter((x) => x.id !== course.id) : [...w, course]));
  const isWishlisted = (id) => wishlist.some((c) => c.id === id);

  const subtotal = cart.reduce((sum, c) => sum + c.price, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, subtotal, wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
