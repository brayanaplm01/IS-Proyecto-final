"use client";
import { useEffect, useState, useMemo } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/AuthContext";

// Components
import PageHeader from "@/components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import Notification from "@/components/Notification";
import ProductFilters, { FilterState } from "@/components/ProductFilters";

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
  id_marca?: number;
  id_categoria?: number;
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

interface Marca {
  id_marca: number;
  nombre: string;
}

interface Categoria {
  id_categoria: number;
  nombre: string;
}

export default function AccesoriosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedMarca: "",
    selectedCategoria: "",
    priceRange: [0, 10000],
    sortBy: 'nombre',
    onlyAvailable: false
  });
  const addToCart = useCartStore((state) => state.addToCart);
  const { onLoginClick } = useAuth();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar productos, marcas y categorías en paralelo
        const [resProductos, resMarcas, resCategorias] = await Promise.all([
          fetch(`${API}/api/productos`),
          fetch(`${API}/api/marcas`),
          fetch(`${API}/api/categorias`)
        ]);
        
        if (!resProductos.ok || !resMarcas.ok || !resCategorias.ok) {
          throw new Error('Error al cargar datos');
        }
        
        const dataProductos = await resProductos.json();
        const dataMarcas: Marca[] = await resMarcas.json();
        const dataCategorias: Categoria[] = await resCategorias.json();
        
        // Guardar marcas y categorías para los filtros
        setMarcas(dataMarcas);
        setCategorias(dataCategorias);
        
        // Mapear productos con sus marcas y categorías
        const productosData = dataProductos.map((p: ProductoAPI): Producto => {
          const marca = p.id_marca ? dataMarcas.find(m => m.id_marca === p.id_marca) : undefined;
          const categoria = p.id_categoria ? dataCategorias.find(c => c.id_categoria === p.id_categoria) : undefined;
          
          return {
            ...p,
            precio: parseFloat(String(p.precio)),
            cantidad: parseInt(String(p.cantidad)),
            marca: marca ? { nombre: marca.nombre } : undefined,
            categoria: categoria ? { nombre: categoria.nombre } : undefined
          };
        });
        
        const accesorios = productosData.filter((p: Producto) => p.tipo_producto === "accesorio");
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

  // Aplicar filtros y ordenamiento
  const productosFiltrados = useMemo(() => {
    let filtered = [...productos];

    // Filtro por búsqueda
    if (filters.searchTerm) {
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        p.marca?.nombre.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Filtro por marca
    if (filters.selectedMarca) {
      filtered = filtered.filter(p => p.marca?.nombre === filters.selectedMarca);
    }

    // Filtro por categoría
    if (filters.selectedCategoria) {
      filtered = filtered.filter(p => p.categoria?.nombre === filters.selectedCategoria);
    }

    // Filtro por precio
    filtered = filtered.filter(p =>
      p.precio >= filters.priceRange[0] && p.precio <= filters.priceRange[1]
    );

    // Filtro por disponibilidad
    if (filters.onlyAvailable) {
      filtered = filtered.filter(p => p.cantidad > 0);
    }

    // Ordenamiento
    switch (filters.sortBy) {
      case 'nombre':
        filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'precio-asc':
        filtered.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        filtered.sort((a, b) => b.precio - a.precio);
        break;
      case 'stock':
        filtered.sort((a, b) => b.cantidad - a.cantidad);
        break;
    }

    return filtered;
  }, [productos, filters]);

  return (
    <main className="min-h-screen w-full">
      {/* Page Header */}
      <PageHeader
        badge="Equipos Complementarios"
        title="Accesorios"
        subtitle="Profesionales"
        description="Descubre los mejores accesorios fotográficos para complementar tu equipo. Desde lentes hasta trípodes, todo lo que necesitas para un trabajo eficiente y profesional."
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

          {/* Filters */}
          {!loading && productos.length > 0 && (
            <ProductFilters
              marcas={marcas}
              categorias={categorias}
              onFilterChange={setFilters}
              productCount={productosFiltrados.length}
            />
          )}

          {/* Content */}
          {loading ? (
            <LoadingSpinner message="Cargando accesorios profesionales..." />
          ) : productos.length === 0 ? (
            <EmptyState
              icon={
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              title={error ? "Error al cargar accesorios" : "No hay accesorios disponibles"}
              description="Inténtalo de nuevo más tarde o contacta con soporte."
            />
          ) : productosFiltrados.length === 0 ? (
            <EmptyState
              title="No se encontraron productos"
              description="Intenta ajustar los filtros de búsqueda para encontrar lo que buscas."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {productosFiltrados.map((producto) => (
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
