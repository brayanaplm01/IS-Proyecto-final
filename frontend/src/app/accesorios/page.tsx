"use client";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Definir interfaces para el producto
interface ProductoAPI {
  id_producto: number;
  nombre: string;
  descripcion?: string;
  precio: string | number;
  cantidad: string | number;
  imagen?: string;
  tipo_producto: string;
  marca?: { nombre: string };
  categoria?: { nombre: string };
}

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  tipo_producto: string;
  marca?: { nombre: string };
  categoria?: { nombre: string };
}

export default function AccesoriosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const { onLoginClick } = useAuth();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching productos from:', `${API}/api/productos`);
        
        const res = await fetch(`${API}/api/productos`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Productos recibidos:', data);
        
        const productosData = data.map((p: ProductoAPI): Producto => ({
          ...p,
          precio: parseFloat(String(p.precio)),
          cantidad: parseInt(String(p.cantidad)),
        }));
        
        const accesorios = productosData.filter((p: Producto) => p.tipo_producto === "accesorio");
        console.log('Accesorios filtrados:', accesorios);
        
        setProductos(accesorios);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setError(`Error al cargar productos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const handleAddToCart = async (producto: Producto) => {
    if (producto.cantidad === 0) {
      setError("Stock agotado, por favor elija otro producto");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const success = await addToCart({
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      cantidad_maxima: producto.cantidad,
      imagen: producto.imagen,
      marca: producto.marca,
    });

    if (!success) {
      setShowLoginMessage(true);
      setTimeout(() => setShowLoginMessage(false), 3000);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white px-2 sm:px-4 md:px-8 py-8">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center sm:text-left">Accesorios</h1>
        <p className="mb-8 text-gray-300 text-center sm:text-left">Descubre los diferentes accesorios para tener un trabajo eficiente.</p>
        
        {showLoginMessage && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span>Debes iniciar sesión para agregar productos al carrito</span>
              <button 
                onClick={() => onLoginClick?.()} 
                className="underline font-semibold hover:text-gray-200"
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="fixed top-4 right-4 bg-red-100 text-red-700 p-4 rounded-lg shadow-lg z-50 max-w-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-400">Cargando accesorios...</div>
        ) : productos.length === 0 ? (
          <div className="text-center text-gray-400">
            {error ? "Error al cargar accesorios" : "No hay accesorios disponibles"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {productos.map((producto, idx) => (
              <div
                key={producto.id_producto || idx}
                className="[perspective:1000px] cursor-pointer"
                onClick={() => setProductoSeleccionado(producto)}
              >
                <div className="relative w-full h-80 transition-transform duration-500 [transform-style:preserve-3d] group hover:[transform:rotateY(180deg)]">
                  {/* Cara frontal */}
                  <div className="absolute inset-0 bg-gray-800 rounded-lg p-4 flex flex-col items-center shadow [backface-visibility:hidden]">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-700 rounded flex items-center justify-center mb-4 overflow-hidden">
                      {producto.imagen ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={producto.imagen} 
                          alt={producto.nombre} 
                          className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded shadow-lg"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <svg 
                        className={`w-12 h-12 sm:w-16 sm:h-16 text-gray-400 ${producto.imagen ? 'hidden' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        viewBox="0 0 24 24"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <circle cx="8" cy="10" r="2" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                    <div className="flex justify-between w-full mb-2 text-sm sm:text-base">
                      <span className="font-semibold truncate">{producto.nombre}</span>
                      <span className="font-bold">${producto.precio}</span>
                    </div>
                    <div className="text-3xl font-logo mb-6 text-center">SCAM</div>
                    {/*<button
                      className="w-full border border-primary text-primary rounded py-1 hover:bg-primary hover:text-white transition text-xs sm:text-base"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(producto);
                      }}
                    >Añadir al carrito</button>*/}
                  </div>
                  {/* Cara trasera */}
                  <div className="absolute inset-0 bg-gray-900 rounded-lg p-4 flex flex-col items-center justify-center shadow [transform:rotateY(180deg)] [backface-visibility:hidden] text-xs sm:text-base">
                    <div className="text-lg font-bold mb-2 text-center">{producto.nombre}</div>
                    <div className="text-sm text-gray-300 mb-2 text-center">{producto.descripcion || "Sin descripción"}</div>
                    <div className="text-sm mb-1"><span className="font-semibold">Marca:</span> {producto.marca?.nombre || "-"}</div>
                    <div className="text-sm mb-1"><span className="font-semibold">Categoría:</span> {producto.categoria?.nombre || "-"}</div>
                    <div className="text-sm mb-1"><span className="font-semibold">Precio:</span> ${producto.precio}</div>
                    <div className="text-sm mb-1"><span className="font-semibold">Cantidad:</span> {producto.cantidad}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Modal de producto */}
        {productoSeleccionado && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn px-2">
            <div className="bg-gray-900 rounded-xl shadow-2xl p-4 sm:p-8 max-w-xs sm:max-w-lg w-full relative scale-90 animate-growIn">
              <button
                onClick={() => setProductoSeleccionado(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-primary text-2xl font-bold"
                aria-label="Cerrar"
              >
                ×
              </button>
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 sm:w-60 sm:h-60 bg-gray-800 rounded flex items-center justify-center mb-6 overflow-hidden">
                  {productoSeleccionado.imagen ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={productoSeleccionado.imagen} 
                      alt={productoSeleccionado.nombre} 
                      className="w-36 h-36 sm:w-56 sm:h-56 object-cover rounded shadow-lg"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <svg 
                    className={`w-16 h-16 sm:w-20 sm:h-20 text-gray-400 ${productoSeleccionado.imagen ? 'hidden' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <circle cx="8" cy="10" r="2" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
                <div className="text-xl sm:text-2xl font-bold mb-2 text-center">{productoSeleccionado.nombre}</div>
                <div className="text-gray-300 mb-2 text-center text-sm sm:text-base">{productoSeleccionado.descripcion || "Sin descripción"}</div>
                <div className="text-sm mb-1"><span className="font-semibold">Marca:</span> {productoSeleccionado.marca?.nombre || "-"}</div>
                <div className="text-sm mb-1"><span className="font-semibold">Categoría:</span> {productoSeleccionado.categoria?.nombre || "-"}</div>
                <div className="text-sm mb-1"><span className="font-semibold">Precio:</span> ${productoSeleccionado.precio}</div>
                <div className="text-sm mb-1"><span className="font-semibold">Cantidad:</span> {productoSeleccionado.cantidad}</div>
                <button
                  className="mt-6 w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary/80 transition text-xs sm:text-base"
                  onClick={() => {
                    handleAddToCart(productoSeleccionado);
                    setProductoSeleccionado(null);
                  }}
                >Añadir al carrito</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// Animaciones Tailwind personalizadas (agrega en tailwind.config.js):
// 'fadeIn': 'fadeIn 0.2s ease',
// 'growIn': 'growIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// @keyframes growIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
