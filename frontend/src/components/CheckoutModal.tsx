'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: (paymentSuccessful: boolean) => void;
  user: any; // Considerar tipar el usuario
  items: any[]; // Considerar tipar los items del carrito
  total: number; // Total del carrito
  ordenId: number; // Ahora es requerido
  deliveryCost: number; // Nuevo: costo de envío seleccionado
  deliveryType?: string;
  deliveryDescription?: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  user, 
  items, 
  total, 
  ordenId, 
  deliveryCost,
  deliveryType = 'normal',
  deliveryDescription = 'Entrega normal (2 a 3 días)'
}: CheckoutModalProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingPago, setLoadingPago] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facturaUrl, setFacturaUrl] = useState<string | null>(null);
  const clearCart = useCartStore((state) => state.clearCart);

  // Resetear estado cuando el modal se abre o cierra, y disparar generación de QR
  useEffect(() => {
    if (isOpen && ordenId) {
      setQrCode(null); // Limpiar QR anterior
      setLoadingPago(true);
      setError(null);
      setFacturaUrl(null);

      handleGenerarQR(ordenId);
    }
  }, [isOpen, ordenId]); // Dependencias: modal abierto y ordenId disponible

  // Renombramos handleProcederPago a handleGenerarQR
  const handleGenerarQR = async (currentOrdenId: number) => { // Acepta ordenId como argumento
    setLoadingPago(true);
    setError(null);
    setQrCode(null); // Limpiar QR anterior

    try {
      // Generar QR
      // NOTA: Aquí necesitaremos pasar el costo de envío desde el frontend eventualmente
      const qrResponse = await fetch(`${API}/api/ordenes/${currentOrdenId}/qr?deliveryCost=${deliveryCost}`, {
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
      setError(err instanceof Error ? err.message : 'Error al generar el código QR');
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
          metodo_pago: 'qr',
          tipo_envio: deliveryType,
          descripcion_envio: deliveryDescription,
          costo_envio: deliveryCost
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from backend:', response.status, errorData);
        throw new Error(errorData.error || 'Error al procesar el pago');
      }

      const responseData = await response.json();
      console.log('Payment processed successfully. Response data:', responseData);

      const { factura_url } = responseData;
      setFacturaUrl(factura_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago');
    } finally {
      setLoadingPago(false);
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6 relative scale-90 animate-growIn text-gray-900 dark:text-white">
        <button
          onClick={() => onClose(!!facturaUrl)}
          className="absolute top-3 right-3 text-gray-400 hover:text-primary text-2xl font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>

        {!ordenId && !error && loadingPago && (
             <div className="text-center">Creando orden...</div>
        )}

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        {!ordenId && !error && !loadingPago && (
             <div className="text-center">Preparando checkout...</div> // Estado inicial antes de crear la orden
        )}

        {/* Estado: Orden creada, mostrar QR */}
        {ordenId && !facturaUrl && !error && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Escanea para Pagar</h2>
            {qrCode ? (
              <div className="flex justify-center mb-4">
                 {/* Usar etiqueta img en lugar de Image de next/image en un modal simple */}
                 <img
                   src={qrCode}
                   alt="Código QR de pago"
                   width={200}
                   height={200}
                   className="border p-2 bg-white"
                 />
               </div>
            ) : (
              <div className="text-center mb-4">Generando QR...</div>
            )}
            <p className="mb-4 text-gray-700 dark:text-gray-300">Total: ${total.toFixed(2)}</p>
            <button
              onClick={handleConfirmarPago}
              disabled={loadingPago || !qrCode} // Deshabilitar hasta que el QR esté cargado
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              {loadingPago ? 'Confirmando...' : 'Confirmar Pago Completado'} {/* Simular confirmación */} 
            </button>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{/* Instrucción de pago real */}</p>
          </div>
        )}

        {/* Estado: Pago completado, mostrar enlace a factura */}
        {facturaUrl && !error && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-green-600">¡Pago Exitoso!</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Tu pago ha sido procesado y la factura está disponible.</p>
            <a
              href={`${API}${facturaUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              onClick={() => onClose(true)} // Cerrar modal al abrir factura
            >
              Descargar Factura
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 