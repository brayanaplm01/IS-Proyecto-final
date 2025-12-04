"use client";
import { useEffect, useState } from "react";
import CrearClienteModal from "./CrearClienteModal";
import EditarClienteModal from "./EditarClienteModal";
import { FaUserPlus } from "react-icons/fa";

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <button
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-bold shadow transition z-10"
          onClick={() => setModalOpen(true)}
        >
          <FaUserPlus /> Nuevo usuario
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto border border-gray-200">
        {loading ? (
          <div className="text-gray-600">Cargando...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#232946] text-white">
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">Nombre</th>
                <th className="p-3 font-semibold">Correo</th>
                <th className="p-3 font-semibold">Teléfono</th>
                <th className="p-3 font-semibold">Rol</th>
                <th className="p-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, idx) => (
                <tr key={u.id_usuario} className={idx % 2 === 0 ? "bg-[#f4f6fa] border-b" : "bg-white border-b"}>
                  <td className="p-3 text-gray-800">{u.id_usuario}</td>
                  <td className="p-3 text-gray-900 font-medium">{u.nombre} {u.apellido_paterno} {u.apellido_materno}</td>
                  <td className="p-3 text-gray-700">{u.correo}</td>
                  <td className="p-3 text-gray-700">{u.telefono}</td>
                  <td className="p-3 text-gray-700 capitalize">{u.rol}</td>
                  <td className="p-3 flex gap-2">
                    <button className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 font-bold" onClick={() => { setUsuarioEditar(u); setEditarModalOpen(true); }}>Editar</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 font-bold" onClick={() => handleEliminar(u.id_usuario)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <CrearClienteModal open={modalOpen} onClose={() => { setModalOpen(false); fetchUsuarios(); }} />
      <EditarClienteModal open={editarModalOpen} usuario={usuarioEditar} onClose={() => { setEditarModalOpen(false); setUsuarioEditar(null); fetchUsuarios(); }} />
    </div>
  );
} 