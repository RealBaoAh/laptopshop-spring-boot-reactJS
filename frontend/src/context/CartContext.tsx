import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  price: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
}

interface Cart {
  items: CartItem[];
  totalPrice: number;
  sum: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<boolean>;
  removeFromCart: (cartDetailId: number) => Promise<boolean>;
  updateCartItems: (items: { id: number; quantity: number }[]) => Promise<boolean>;
  clearCartLocal: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/api/cart');
      setCart(res.data);
    } catch (e) {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: number, quantity: number) => {
    try {
      const res = await api.post('/api/cart/add', { productId, quantity });
      if (res.data && res.data.success) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const removeFromCart = async (cartDetailId: number) => {
    try {
      const res = await api.delete(`/api/cart/items/${cartDetailId}`);
      if (res.data && res.data.success) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const updateCartItems = async (items: { id: number; quantity: number }[]) => {
    try {
      const res = await api.put('/api/cart/items', items);
      if (res.data && res.data.success) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const clearCartLocal = () => {
    setCart(null);
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, removeFromCart, updateCartItems, clearCartLocal }}>
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
