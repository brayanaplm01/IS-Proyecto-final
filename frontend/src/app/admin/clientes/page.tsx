"use client";
import { useEffect, useState } from "react";
import CrearClienteModal from "./CrearClienteModal";
import EditarClienteModal from "./EditarClienteModal";
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, UsersIcon, PlusIcon, UserCircleIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  correo: string;
  telefono?: string;
  rol: string;
}

export default function ClientesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRol, setFilterRol] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Cargar usuarios
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/users");
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      setError("Error al cargar usuarios");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Eliminar usuario
  const handleEliminar = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setUsuarios(usuarios.filter(u => u.id_usuario !== id));
      } else {
        alert("No se pudo eliminar el usuario");
      }
    } catch {
      alert("Error de conexión");
    }
  };

  // Filter and search users
  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellido_paterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRol = filterRol === "todos" || usuario.rol === filterRol;
    return matchesSearch && matchesRol;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsuarios = filteredUsuarios.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRol]);

  // Calculate stats
  const totalClientes = usuarios.filter(u => u.rol === "cliente").length;
  const totalAdmins = usuarios.filter(u => u.rol === "administrador").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-gray-600 mt-1">Administra clientes y usuarios del sistema</p>
        </div>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-semibold"
          onClick={() => setModalOpen(true)}
        >
          <PlusIcon className="w-5 h-5" />
          Nuevo Usuario
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium uppercase tracking-wider">Total Usuarios</p>
              <p className="text-4xl font-bold mt-2">{usuarios.length}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <UsersIcon className="w-12 h-12" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Clientes</p>
              <p className="text-4xl font-bold mt-2">{totalClientes}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <UserCircleIcon className="w-12 h-12" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium uppercase tracking-wider">Administradores</p>
              <p className="text-4xl font-bold mt-2">{totalAdmins}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <ShieldCheckIcon className="w-12 h-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterRol("todos")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterRol === "todos"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterRol("cliente")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterRol === "cliente"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Clientes
          </button>
          <button
            onClick={() => setFilterRol("administrador")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterRol === "administrador"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Administradores
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando usuarios...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      ) : filteredUsuarios.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm || filterRol !== "todos" ? "No se encontraron usuarios" : "No hay usuarios registrados"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterRol !== "todos"
              ? "Intenta con otros términos de búsqueda o filtros"
              : "Comienza agregando tu primer usuario"}
          </p>
          {!searchTerm && filterRol === "todos" && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold"
            >
              Agregar Primer Usuario
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-gray-900">
                  <th className="w-16 px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="w-32 px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="w-40 px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedUsuarios.map((usuario, idx) => (
                  <tr
                    key={usuario.id_usuario}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {startIndex + idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {usuario.nombre.charAt(0).toUpperCase()}{usuario.apellido_paterno.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {usuario.nombre} {usuario.apellido_paterno} {usuario.apellido_materno}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{usuario.correo}</div>
                      <div className="text-sm text-gray-500">{usuario.telefono || "Sin teléfono"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          usuario.rol === "administrador"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {usuario.rol === "administrador" ? "Admin" : "Cliente"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setUsuarioEditar(usuario);
                            setEditarModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEliminar(usuario.id_usuario)}
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
                    {Math.min(startIndex + itemsPerPage, filteredUsuarios.length)}
                  </span>{" "}
                  de <span className="font-semibold">{filteredUsuarios.length}</span> usuarios
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
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
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
      <CrearClienteModal open={modalOpen} onClose={() => { setModalOpen(false); fetchUsuarios(); }} />
      <EditarClienteModal open={editarModalOpen} usuario={usuarioEditar} onClose={() => { setEditarModalOpen(false); setUsuarioEditar(null); fetchUsuarios(); }} />
    </div>
  );
} 