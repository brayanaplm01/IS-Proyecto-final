"use client";
import { useCartStore, CartProduct } from "@/store/cartStore";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/AuthContext';
import { useState } from 'react';
import Image from 'next/image';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
        {/* Header Section */}
        <div className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-300 text-sm font-medium mb-6">
              🛒 Estado del Carrito
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Tu carrito está
              <br />
              <span className="text-gray-300">vacío</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Descubre nuestro catálogo de cámaras y accesorios profesionales. Captura momentos únicos con equipos de alta calidad.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push('/camaras')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Explorar Cámaras
              </button>
              <button
                onClick={() => router.push('/accesorios')}
                className="px-8 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-white rounded-lg font-semibold hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105"
              >
                Ver Accesorios
              </button>
            </div>
          </div>
        </div>
        
        {/* Empty State Icon */}
        <div className="relative py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
                <div className="relative w-full h-full bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700/50 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
      {/* Header Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-300 text-sm font-medium mb-6">
              🛒 Tu Selección
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Carrito de
              <br />
              <span className="text-gray-300">Compras</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Revisa tu selección antes de proceder al pago. Equipos profesionales listos para capturar momentos únicos.
            </p>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-red-300 font-medium">{error}</span>
                </div>
              </div>
            )}
            {/* Products Grid */}
            <div className="space-y-6">
              {products.map((item: CartProduct) => (
                <div key={item.id_producto} className="bg-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-600/50 p-6 hover:bg-gray-700/40 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Product Image & Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-20 h-20 bg-gray-600/50 rounded-xl overflow-hidden flex-shrink-0">
                        {item.imagen ? (
                          <Image 
                            src={item.imagen} 
                            alt={item.nombre} 
                            width={80} 
                            height={80} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{item.nombre}</h3>
                        <p className="text-gray-400">{item.marca?.nombre || 'Marca no especificada'}</p>
                        <p className="text-blue-400 font-medium">${item.precio.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-gray-600/50 rounded-xl border border-gray-500/50">
                        <button
                          onClick={() => {
                            updateQuantity(item.id_producto, Math.max(0, item.cantidad - 1));
                            setError(null);
                          }}
                          className="p-2 hover:bg-gray-500/50 rounded-l-xl transition-colors text-gray-300 hover:text-white"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                          </svg>
                        </button>
                        <span className="px-4 py-2 text-white font-medium min-w-[3rem] text-center">{item.cantidad}</span>
                        <button
                          onClick={() => {
                            updateQuantity(item.id_producto, item.cantidad + 1);
                            setError(null);
                          }}
                          className="p-2 hover:bg-gray-500/50 rounded-r-xl transition-colors text-gray-300 hover:text-white"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Subtotal & Actions */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">Subtotal</p>
                        <p className="text-white font-bold text-xl">${(item.precio * item.cantidad).toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => {
                          removeFromCart(item.id_producto);
                          setError(null);
                        }}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-all duration-200"
                        title="Eliminar producto"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Cart Summary */}
            <div className="mt-8 pt-6 border-t border-gray-600/50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <button
                  onClick={clearCart}
                  className="inline-flex items-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-300 hover:text-red-200 transition-all duration-200 font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Vaciar carrito
                </button>
                
                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-1">Total a pagar</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    ${total().toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={crearOrdenYAbrirModal}
                  disabled={products.length === 0 || loading || processingCheckout}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cargando usuario...
                    </>
                  ) : user ? (
                    processingCheckout ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                        Proceder al Pago
                      </>
                    )
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      Iniciar Sesión para Comprar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
