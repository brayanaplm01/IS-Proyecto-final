'use client';

import { useCartStore, CartProduct } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/AuthContext';
import { useEffect, useState } from 'react';

interface CartProps {
  onOpenCheckoutModal: () => void; // Prop para abrir el modal
}

export interface ShippingMethod {
  type: string;
  description: string;
  cost: number;
}

interface CartState {
  products: CartProduct[];
  shippingMethod: ShippingMethod | null;
  addToCart: (product: CartProduct) => Promise<boolean>;
  removeFromCart: (id_producto: number) => void;
  updateQuantity: (id_producto: number, cantidad: number) => void;
  setShippingMethod: (method: ShippingMethod) => void;
  clearCart: () => void;
  subtotal: () => number;
  shippingCost: () => number;
  total: () => number;
}

export default function Cart({ onOpenCheckoutModal }: CartProps) {
  const products = useCartStore((state) => state.products);
  const { removeFromCart, updateQuantity, total } = useCartStore();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  

  useEffect(() => {
    console.log('Cart component - user state:', user);
  }, [user]);

  const handleCheckout = () => {
    // Verificar si hay productos con cantidad 0
    const hasZeroQuantity = products.some(item => item.cantidad === 0);
    if (hasZeroQuantity) {
      setError("Por favor, elija una cantidad mayor a 0 para todos los productos");
      return;
    }
    
    if (user) {
      onOpenCheckoutModal();
    } else {
      // Manejar el caso de usuario no autenticado
      console.log("Usuario no autenticado");
    }
  };

  // Si no hay productos, no renderizar nada
  if (products.length === 0) {
    return null;
  }

  // Si hay productos, renderiza el contenido del carrito
  return (
    <div className="fixed right-4 top-20 bg-white p-4 rounded-lg shadow-lg w-80">
      <h2 className="text-xl font-semibold mb-4">Carrito de Compras</h2>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {products.map((item: CartProduct) => (
          <div key={item.id_producto} className="flex items-center justify-between border-b pb-2">
            <div className="flex-1">
              <h3 className="font-medium">{item.nombre}</h3>
              <p className="text-sm text-gray-600">${item.precio.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  updateQuantity(item.id_producto, Math.max(0, item.cantidad - 1));
                  setError(null);
                }}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{item.cantidad}</span>
              <button
                onClick={() => {
                  updateQuantity(item.id_producto, item.cantidad + 1);
                  setError(null);
                }}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
              <button
                onClick={() => {
                  removeFromCart(item.id_producto);
                  setError(null);
                }}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between font-semibold mb-4">
          <span>Total:</span>
          <span className="text-gray-800">${total().toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          {user ? 'Proceder al Pago' : 'Iniciar Sesión para Comprar'}
        </button>
      </div>
    </div>
  );
} 