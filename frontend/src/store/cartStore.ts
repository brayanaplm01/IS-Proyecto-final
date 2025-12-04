import { create } from 'zustand';
import { useAuth } from '@/AuthContext';

export interface CartProduct {
  id_producto: number;
  nombre: string;
  precio: number;
  cantidad: number;
  cantidad_maxima: number;
  imagen?: string;
  marca?: { nombre: string };
}

interface CartState {
  products: CartProduct[];
  addToCart: (product: CartProduct) => Promise<boolean>;
  removeFromCart: (id_producto: number) => void;
  updateQuantity: (id_producto: number, cantidad: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  products: [],
  addToCart: async (product) => {
    const isAuthenticated = !!localStorage.getItem('token');
    
    if (!isAuthenticated) {
      return false;
    }

    set((state) => {
      const exists = state.products.find(p => p.id_producto === product.id_producto);
      if (exists) {
        const newQuantity = exists.cantidad + (product.cantidad || 1);
        if (newQuantity > product.cantidad_maxima) {
          return state;
        }
        return {
          products: state.products.map(p =>
            p.id_producto === product.id_producto
              ? { ...p, cantidad: newQuantity }:
              p
          ),
        };
      }
      return { 
        products: [...state.products, { 
          ...product, 
          cantidad: product.cantidad || 1,
          cantidad_maxima: product.cantidad_maxima 
        }] 
      };
    });
    return true;
  },
  removeFromCart: (id_producto) => set(state => ({ products: state.products.filter(p => p.id_producto !== id_producto) })),
  updateQuantity: (id_producto, cantidad) => set(state => {
    const product = state.products.find(p => p.id_producto === id_producto);
    if (!product) return state;
    
    const newQuantity = Math.min(cantidad, product.cantidad_maxima);
    
    return {
      products: state.products.map(p =>
        p.id_producto === id_producto ? { ...p, cantidad: newQuantity } : p
      ),
    };
  }),
  clearCart: () => set({ products: [] }),
  total: () => get().products.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
}));