import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('ahad_macbook_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { success, info } = useToast();

  useEffect(() => {
    localStorage.setItem('ahad_macbook_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product === product._id);
      if (existing) {
        const updatedQty = existing.quantity + quantity;
        if (product.stock && updatedQty > product.stock) {
          info(`Only ${product.stock} units available in stock.`);
          return prevItems;
        }
        return prevItems.map((item) =>
          item.product === product._id
            ? { ...item, quantity: updatedQty }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '',
            chip: product.chip,
            ram: product.ram,
            storage: product.storage,
            condition: product.condition,
            stock: product.stock,
            quantity,
          },
        ];
      }
    });

    success(`Added ${product.name} to your cart.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
    info('Item removed from cart.');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product === productId) {
          if (item.stock && quantity > item.stock) {
            info(`Max available stock is ${item.stock}`);
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.08 * 100) / 100; // estimated 8% tax
  const shipping = subtotal > 0 ? 0 : 0; // Free 2-day insured Apple shipping
  const total = Math.round((subtotal + tax + shipping) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemsCount,
        subtotal,
        tax,
        shipping,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
