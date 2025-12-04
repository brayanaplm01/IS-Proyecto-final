"use client";
import { useCartStore, CartProduct } from "@/store/cartStore";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/AuthContext';
import { useState } from 'react';
import CheckoutModal from '@/components/CheckoutModal';
import DeliveryOptionsModal from '@/components/DeliveryOptionsModal';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CarritoPage() {
  const { products, removeFromCart, updateQuantity, clearCart, total } = useCartStore();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [ordenIdForCheckout, setOrdenIdForCheckout] = useState<number | null>(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [selectedDeliveryCost, setSelectedDeliveryCost] = useState<number>(0);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<string>('normal');
  const [selectedDeliveryDescription, setSelectedDeliveryDescription] = useState<string>('Entrega normal (2 a 3 días)');

  const handleCloseCheckoutModal = (paymentSuccessful: boolean) => {
    setIsCheckoutModalOpen(false);
    setOrdenIdForCheckout(null);
    if (paymentSuccessful) {
      clearCart();
    }
  };

  const crearOrdenYAbrirModal = async () => {
    // Verificar si hay productos con cantidad 0
    const hasZeroQuantity = products.some(item => item.cantidad === 0);
    if (hasZeroQuantity) {
      setError("Por favor, elija una cantidad mayor a 0 para todos los productos");
      return;
    }

    if (!user || products.length === 0 || processingCheckout) return;

    setProcessingCheckout(true);

    try {
      const ordenResponse = await fetch(`${API}/api/ordenes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          usuario_id: user.id_usuario,
          usuario_nombre: `${user.nombre} ${user.apellido_paterno}`,
          items: products.map(item => ({
            producto_id: item.id_producto,
            cantidad: item.cantidad,
          })),
        }),
      });

      if (!ordenResponse.ok) {
        const errorData = await ordenResponse.json();
        throw new Error(errorData.error || 'Error al crear la orden');
      }

      const orden = await ordenResponse.json();
      setOrdenIdForCheckout(orden.id);
      setIsDeliveryModalOpen(true);

    } catch (error) {
      console.error('Error creando orden y abriendo modal:', error);
      alert(`Error al proceder al pago: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setProcessingCheckout(false);
    }
  };

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-4xl text-gray-400 mb-4"><i className="fas fa-shopping-cart"></i></div>
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-6">Parece que aún no has añadido nada a tu carrito.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/80 transition font-semibold"
        >Explora productos</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de compras</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4 text-gray-700">Producto</th>
              <th className="text-left py-2 px-4 text-gray-700">Cantidad</th>
              <th className="text-left py-2 px-4 text-gray-700">Precio</th>
              <th className="text-left py-2 px-4 text-gray-700">Subtotal</th>
              <th className="text-left py-2 px-4 text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item: CartProduct) => (
              <tr key={item.id_producto} className="border-b last:border-b-0">
                <td className="py-4 px-4 flex items-center">
                  {item.imagen && <img src={item.imagen} alt={item.nombre} className="w-16 h-16 object-cover mr-4 rounded" />}
                  <div>
                    <div className="font-semibold text-gray-900">{item.nombre}</div>
                    <div className="text-sm text-gray-700">{item.marca?.nombre || '-'}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        updateQuantity(item.id_producto, Math.max(0, item.cantidad - 1));
                        setError(null);
                      }}
                      className="px-2 py-1 border rounded-l-md hover:bg-gray-100 text-gray-900"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-t border-b text-gray-900">{item.cantidad}</span>
                    <button
                      onClick={() => {
                        updateQuantity(item.id_producto, item.cantidad + 1);
                        setError(null);
                      }}
                      className="px-2 py-1 border rounded-r-md hover:bg-gray-100 text-gray-900"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900">${item.precio.toFixed(2)}</td>
                <td className="py-4 px-4 font-semibold text-gray-900">${(item.precio * item.cantidad).toFixed(2)}</td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => {
                      removeFromCart(item.id_producto);
                      setError(null);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={clearCart}
            className="text-red-500 hover:underline font-semibold"
          >Vaciar carrito</button>
          <div className="font-bold text-xl text-gray-800">Total: ${total().toFixed(2)}</div>
        </div>

        <div className="mt-6">
          <button
            onClick={crearOrdenYAbrirModal}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
            disabled={products.length === 0 || loading || processingCheckout}
          >
            {loading ? 'Cargando usuario...' : (user ? (processingCheckout ? 'Procesando...' : 'Proceder al Pago') : 'Iniciar Sesión para Comprar')}
          </button>
        </div>
      </div>

      {isDeliveryModalOpen && (
        <DeliveryOptionsModal
          isOpen={isDeliveryModalOpen}
          onClose={() => setIsDeliveryModalOpen(false)}
          onSelectDelivery={(cost: number, type: string, description: string) => {
            setSelectedDeliveryCost(cost);
            setSelectedDeliveryType(type);
            setSelectedDeliveryDescription(description);
            setIsDeliveryModalOpen(false);
            setIsCheckoutModalOpen(true);
          }}
        />
      )}

      {isCheckoutModalOpen && ordenIdForCheckout !== null && user && (
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={handleCloseCheckoutModal}
          user={user}
          items={products}
          total={total() + selectedDeliveryCost}
          ordenId={ordenIdForCheckout as number}
          deliveryCost={selectedDeliveryCost}
          deliveryType={selectedDeliveryType}
          deliveryDescription={selectedDeliveryDescription}
        />
      )}
    </div>
  );
}
