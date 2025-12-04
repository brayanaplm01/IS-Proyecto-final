"use client";
import { useEffect, useState } from "react";

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  correo: string;
  telefono?: string;
  rol: string;
}

export default function EditarClienteModal({ open, usuario, onClose }: { open: boolean; usuario: Usuario | null; onClose: () => void }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    telefono: "",
    rol: "cliente"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (usuario) {
      setForm({
        nombre: usuario.nombre || "",
        apellido_paterno: usuario.apellido_paterno || "",
        apellido_materno: usuario.apellido_materno || "",
        telefono: usuario.telefono || "",
        rol: usuario.rol || "cliente"
      });
    }
  }, [usuario, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!usuario) return;
    try {
      const res = await fetch(`http://localhost:5000/api/auth/users/${usuario.id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Error al editar usuario");
      } else {
        setSuccess("Usuario editado exitosamente");
        setTimeout(() => {
          setSuccess("");
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  if (!open || !usuario) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative animate-fadeIn border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-primary text-2xl font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Editar usuario</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none text-gray-900" />
          <input type="text" name="apellido_paterno" placeholder="Apellido paterno" value={form.apellido_paterno} onChange={handleChange} className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none text-gray-900" />
          <input type="text" name="apellido_materno" placeholder="Apellido materno" value={form.apellido_materno} onChange={handleChange} className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none text-gray-900" />
          <input type="email" name="correo" placeholder="Correo" value={usuario.correo} disabled className="w-full px-4 py-2 rounded border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed" />
          <input type="text" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none text-gray-900" />
          <select name="rol" value={form.rol} onChange={handleChange} className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none text-gray-900">
            <option value="cliente">Cliente</option>
            <option value="administrador">Administrador</option>
          </select>
          {error && <div className="text-red-600 text-base text-center font-semibold bg-red-100 rounded py-1">{error}</div>}
          {success && <div className="text-green-600 text-base text-center font-semibold bg-green-100 rounded py-1">{success}</div>}
          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-bold text-lg shadow transition">Guardar cambios</button>
        </form>
      </div>
    </div>
  );
} 