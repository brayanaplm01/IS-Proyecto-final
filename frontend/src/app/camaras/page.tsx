"use client";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/AuthContext";

// Components
import PageHeader from "@/components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import Notification from "@/components/Notification";

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

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CamarasPage() {
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
        
        const res = await fetch(`${API}/api/productos`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        const productosData = data.map((p: ProductoAPI): Producto => ({
          ...p,
          precio: parseFloat(String(p.precio)),
          cantidad: parseInt(String(p.cantidad)),
        }));
        
        const camaras = productosData.filter((p: Producto) => p.tipo_producto === "camara");
        setProductos(camaras);
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
    <main className="min-h-screen w-full">
      {/* Page Header */}
      <PageHeader
        badge="Catálogo Profesional"
        title="Cámaras"
        subtitle="Profesionales"
        description="Encuentra la cámara perfecta para cada momento. Equipos de alta calidad para capturar tus mejores recuerdos con precisión profesional."
      />

      {/* Products Section */}
      <section className="relative py-16 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Notifications */}
          {showLoginMessage && (
            <Notification
              type="error"
              message="Debes iniciar sesión para agregar productos al carrito"
              actionButton={{
                text: "Iniciar sesión",
                onClick: () => onLoginClick?.()
              }}
            />
          )}

          {error && (
            <Notification
              type="error"
              message={error}
            />
          )}

          {/* Content */}
          {loading ? (
            <LoadingSpinner message="Cargando cámaras profesionales..." />
          ) : productos.length === 0 ? (
            <EmptyState
              title={error ? "Error al cargar cámaras" : "No hay cámaras disponibles"}
              description="Inténtalo de nuevo más tarde o contacta con soporte."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {productos.map((producto) => (
                <ProductCard
                  key={producto.id_producto}
                  producto={producto}
                  onAddToCart={handleAddToCart}
                  onViewDetails={setProductoSeleccionado}
                />
              ))}
            </div>
          )}

          {/* Product Modal */}
          <ProductModal
            producto={productoSeleccionado}
            onClose={() => setProductoSeleccionado(null)}
            onAddToCart={handleAddToCart}
          />
        </div>
      </section>
    </main>
  );
}

