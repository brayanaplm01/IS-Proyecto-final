"use client";
import { useEffect, useState } from "react";
import CrearMarcaModal from "./CrearMarcaModal";
import EditarMarcaModal from "./EditarMarcaModal";
import { useAuth } from "@/AuthContext";
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, TagIcon, PlusIcon } from "@heroicons/react/24/outline";

interface Marca { 
  id_marca: number; 
  nombre: string; 
}

export default function MarcasPage() {
  const { token } = useAuth();
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [showCrear, setShowCrear] = useState(false);
  const [marcaEditar, setMarcaEditar] = useState<Marca | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchMarcas = async () => {
      setLoading(true);
      const res = await fetch(`${API}/api/marcas`, { headers: { Authorization: `Bearer ${token}` } });
      setMarcas(await res.json());
      setLoading(false);
    };
    if (token) fetchMarcas();
  }, [token]);

  const handleEliminar = async (id_marca: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta marca?")) return;
    await fetch(`${API}/api/marcas/${id_marca}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setMarcas(marcas.filter((m) => m.id_marca !== id_marca));
  };

  // Filter brands by search term
  const filteredMarcas = marcas.filter((marca) =>
    marca.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredMarcas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMarcas = filteredMarcas.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Marcas</h2>
          <p className="text-gray-600 mt-1">Administra las marcas de productos</p>
        </div>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold"
          onClick={() => setShowCrear(true)}
        >
          <PlusIcon className="w-5 h-5" />
          Agregar Marca
        </button>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Total Marcas</p>
            <p className="text-4xl font-bold mt-2">{marcas.length}</p>
          </div>
          <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
            <TagIcon className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar marca por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando marcas...</p>
          </div>
        </div>
      ) : filteredMarcas.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <TagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? "No se encontraron marcas" : "No hay marcas registradas"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "Comienza agregando tu primera marca"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCrear(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold"
            >
              Agregar Primera Marca
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-gray-900">
                  <th className="w-20 px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Nombre de la Marca
                  </th>
                  <th className="w-48 px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedMarcas.map((marca, idx) => (
                  <tr
                    key={marca.id_marca}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {startIndex + idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {marca.nombre.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{marca.nombre}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setMarcaEditar(marca)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEliminar(marca.id_marca)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando <span className="font-semibold">{startIndex + 1}</span> a{" "}
                  <span className="font-semibold">
                    {Math.min(startIndex + itemsPerPage, filteredMarcas.length)}
                  </span>{" "}
                  de <span className="font-semibold">{filteredMarcas.length}</span> marcas
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showCrear && (
        <CrearMarcaModal
          onClose={() => setShowCrear(false)}
          onSave={(nueva: Marca) => {
            setMarcas([...marcas, nueva]);
            setShowCrear(false);
          }}
        />
      )}
      {marcaEditar && (
        <EditarMarcaModal
          marca={marcaEditar}
          onClose={() => setMarcaEditar(null)}
          onSave={(actualizada: Marca) => {
            setMarcas(marcas.map(m => m.id_marca === actualizada.id_marca ? actualizada : m));
            setMarcaEditar(null);
          }}
        />
      )}
    </div>
  );
} 