"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/AuthContext";
import CrearProductoModal from "./CrearProductoModal";
import EditarProductoModal from "./EditarProductoModal";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface Marca { id_marca: number; nombre: string; }
interface Categoria { id_categoria: number; nombre: string; }
interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  cantidad: number;
  imagen: string | null;
  tipo_producto: string;
  id_marca: number | null;
  id_categoria: number | null;
  marca?: Marca; // Optional relation
  categoria?: Categoria; // Optional relation
}

export default function ProductosPage() {
  const { token } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [showCrear, setShowCrear] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const API = process.env.NEXT_PUBLIC_API_URL;

  // useEffect para la carga inicial
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, marcasRes, catRes] = await Promise.all([
          fetch(`${API}/api/productos`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/marcas`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/categorias`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (!prodRes.ok) throw new Error('Error fetching productos');
        if (!marcasRes.ok) throw new Error('Error fetching marcas');
        if (!catRes.ok) throw new Error('Error fetching categorias');

        const productosData: unknown[] = await prodRes.json();
        const productosMapeados: Producto[] = (productosData as Producto[]).map((p) => ({
          ...p,
          cantidad: parseInt(String(p.cantidad || 0)),
          precio: parseFloat(String(p.precio || 0)),
        }));
        setProductos(productosMapeados);
        setMarcas(await marcasRes.json());
        setCategorias(await catRes.json());
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleEliminar = async (id_producto: number) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    await fetch(`${API}/api/productos/${id_producto}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setProductos(productos.filter((p) => p.id_producto !== id_producto));
  };

  // Filtrar productos
  const filteredProducts = productos.filter((producto) => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.marca?.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "todos" || producto.tipo_producto === filterType;
    return matchesSearch && matchesType;
  });

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const totalProductos = productos.filter(p => p.tipo_producto === 'camara').length;
  const totalAccesorios = productos.filter(p => p.tipo_producto === 'accesorio').length;
  const totalStock = productos.reduce((sum, p) => sum + p.cantidad, 0);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Productos</h1>
          <p className="text-gray-600">Administra el catálogo de cámaras y accesorios</p>
        </div>
        <button
          onClick={() => setShowCrear(true)}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          <PlusIcon className="w-5 h-5" />
          Agregar Producto
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-sm font-medium opacity-90">Total Cámaras</div>
          <div className="text-3xl font-bold mt-2">{totalProductos}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-sm font-medium opacity-90">Total Accesorios</div>
          <div className="text-3xl font-bold mt-2">{totalAccesorios}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-sm font-medium opacity-90">Stock Total</div>
          <div className="text-3xl font-bold mt-2">{totalStock}</div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre o marca..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900"
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange("todos")}
              className={`px-6 py-3 rounded-xl font-medium transition ${
                filterType === "todos"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos ({productos.length})
            </button>
            <button
              onClick={() => handleFilterChange("camara")}
              className={`px-6 py-3 rounded-xl font-medium transition ${
                filterType === "camara"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cámaras ({totalProductos})
            </button>
            <button
              onClick={() => handleFilterChange("accesorio")}
              className={`px-6 py-3 rounded-xl font-medium transition ${
                filterType === "accesorio"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Accesorios ({totalAccesorios})
            </button>
          </div>
        </div>
      </div>
      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando productos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <PhotoIcon className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-600 font-medium">No se encontraron productos</p>
            <p className="text-sm text-gray-400 mt-1">Intenta con otro término de búsqueda</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="w-20 px-3 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Imagen</th>
                  <th className="w-48 px-3 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Producto</th>
                  <th className="w-28 px-3 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Marca</th>
                  <th className="w-28 px-3 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Categoría</th>
                  <th className="w-24 px-3 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Precio</th>
                  <th className="w-16 px-3 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Stock</th>
                  <th className="w-28 px-3 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                  <th className="w-24 px-3 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Tipo</th>
                  <th className="w-40 px-3 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentProducts.map((producto: Producto) => (
                  <tr key={producto.id_producto} className="hover:bg-blue-50 transition-colors">
                    <td className="px-3 py-4">
                      <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {producto.imagen ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={producto.imagen} 
                            alt={producto.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <PhotoIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="font-semibold text-gray-900 text-sm truncate">{producto.nombre}</div>
                      {producto.descripcion && (
                        <div className="text-xs text-gray-500 truncate">{producto.descripcion}</div>
                      )}
                    </td>
                    <td className="px-3 py-4 text-gray-700 text-sm truncate">
                      {producto.id_marca ? marcas.find(m => m.id_marca === producto.id_marca)?.nombre || '-' : '-'}
                    </td>
                    <td className="px-3 py-4 text-gray-700 text-sm truncate">
                      {producto.id_categoria ? categorias.find(c => c.id_categoria === producto.id_categoria)?.nombre || '-' : '-'}
                    </td>
                    <td className="px-3 py-4">
                      <span className="font-bold text-green-600 text-sm">${typeof producto.precio === 'number' ? producto.precio.toFixed(2) : parseFloat(String(producto.precio)).toFixed(2)}</span>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <span className="font-semibold text-gray-900 text-sm">{producto.cantidad}</span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex justify-center">
                        {producto.cantidad > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            <CheckCircleIcon className="w-3 h-3" />
                            Disponible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            <XCircleIcon className="w-3 h-3" />
                            Agotado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex justify-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          producto.tipo_producto === 'camara' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {producto.tipo_producto === 'camara' ? 'Cámara' : 'Accesorio'}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => setProductoEditar(producto)}
                          className="flex items-center gap-1 px-2 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition font-medium text-xs"
                          title="Editar"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEliminar(producto.id_producto)}
                          className="flex items-center gap-1 px-2 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium text-xs"
                          title="Eliminar"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredProducts.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Mostrando <span className="font-semibold">{startIndex + 1}</span> a{' '}
              <span className="font-semibold">{Math.min(endIndex, filteredProducts.length)}</span> de{' '}
              <span className="font-semibold">{filteredProducts.length}</span> productos
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Anterior
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition ${
                          currentPage === page
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
      {showCrear && (
        <CrearProductoModal
          marcas={marcas}
          categorias={categorias}
          onClose={() => setShowCrear(false)}
          onSave={async () => {
            setShowCrear(false);
            // Refetch data
            if (token) {
              const res = await fetch(`${API}/api/productos`, { headers: { Authorization: `Bearer ${token}` } });
              const data: unknown[] = await res.json();
              setProductos((data as Producto[]).map((p) => ({ 
                ...p, 
                cantidad: parseInt(String(p.cantidad || 0)),
                precio: parseFloat(String(p.precio || 0))
              })));
            }
          }}
        />
      )}
      {productoEditar && (
        <EditarProductoModal
          producto={productoEditar}
          marcas={marcas}
          categorias={categorias}
          onClose={() => setProductoEditar(null)}
          onSave={async () => {
            setProductoEditar(null);
            // Refetch data
            if (token) {
              const res = await fetch(`${API}/api/productos`, { headers: { Authorization: `Bearer ${token}` } });
              const data: unknown[] = await res.json();
              setProductos((data as Producto[]).map((p) => ({ 
                ...p, 
                cantidad: parseInt(String(p.cantidad || 0)),
                precio: parseFloat(String(p.precio || 0))
              })));
            }
          }}
        />
      )}
    </div>
  );
} 