'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/AuthContext';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const { products: items, total: cartTotal, clearCart } = useCartStore();
  const { user, loading } = useAuth();
  const [ordenId, setOrdenId] = useState<number | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingPago, setLoadingPago] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facturaUrl, setFacturaUrl] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!loading && (!user || items.length === 0)) {
      router.push(user ? '/carrito' : '/login');
    }
  }, [user, loading, items, router]);

  const handleProcederPago = async () => {
    if (!user || items.length === 0) return;
    
    setLoadingPago(true);
    setError(null);

    try {
      const ordenResponse = await fetch(`${API}/api/ordenes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          usuario_id: user.id_usuario,
          items: items.map(item => ({
            producto_id: item.id_producto,
            cantidad: item.cantidad
          }))
        })
      });

      if (!ordenResponse.ok) {
        const errorData = await ordenResponse.json();
        throw new Error(errorData.error || 'Error al crear la orden');
      }

      const orden = await ordenResponse.json();
      setOrdenId(orden.id);

      const qrResponse = await fetch(`${API}/api/ordenes/${orden.id}/qr`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!qrResponse.ok) {
         const errorData = await qrResponse.json();
         throw new Error(errorData.error || 'Error al generar el código QR');
      }

      const { qrCode } = await qrResponse.json();
      setQrCode(qrCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago');
    } finally {
      setLoadingPago(false);
    }
  };

  const handleConfirmarPago = async () => {
    if (!ordenId) return;

    setLoadingPago(true);
    setError(null);

    try {
      const response = await fetch(`${API}/api/ordenes/${ordenId}/pago`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          metodo_pago: 'qr'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al procesar el pago');
      }

      const { factura_url } = await response.json();
      setFacturaUrl(factura_url);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago');
    } finally {
      setLoadingPago(false);
    }
  };

  if (loading || (!user && !loading) || items.length === 0) {
     return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  if (ordenId && !facturaUrl) {
     return (
       <div className="container mx-auto px-4 py-8">
         <h1 className="text-3xl font-bold mb-8">Checkout</h1>

         <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Escanea el código QR para pagar</h2>
          {qrCode && (
            <div className="flex justify-center mb-6">
              <Image
                src={qrCode}
                alt="Código QR de pago"
                width={200}
                height={200}
                className="border p-2"
              />
            </div>
          )}
          <p className="mb-4">Total a pagar: ${cartTotal().toFixed(2)}</p>
          <button
            onClick={handleConfirmarPago}
            disabled={loadingPago}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {loadingPago ? 'Procesando...' : 'Confirmar Pago'}
          </button>
        </div>
         {error && (
           <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
             {error}
           </div>
         )}
       </div>
     );
  }

  if (facturaUrl) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-4 text-green-600">¡Pago Completado!</h2>
          <p className="mb-4">Tu factura está lista para descargar.</p>
          <a
            href={`${API}${facturaUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Descargar Factura
          </a>
          <button
            onClick={() => router.push('/')}
            className="mt-4 block w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
          >
            Volver al Inicio
          </button>
        </div>
        {error && (
           <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
             {error}
           </div>
         )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id_producto} className="flex justify-between items-center">
              <span>{item.nombre} x {item.cantidad}</span>
              <span>${(item.precio * item.cantidad).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${cartTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleProcederPago}
          disabled={loadingPago || items.length === 0}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loadingPago ? 'Procesando...' : 'Proceder al Pago'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
} 