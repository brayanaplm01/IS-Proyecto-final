"use client";
import { useState } from "react";

export default function CrearClienteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    contraseña: "",
    telefono: "",
    rol: "cliente"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Error al crear usuario");
      } else {
        setSuccess("Usuario creado exitosamente");
        setForm({
          nombre: "",
          apellido_paterno: "",
          apellido_materno: "",
          correo: "",
          contraseña: "",
          telefono: "",
          rol: "cliente"
        });
        setTimeout(() => {
          setSuccess("");
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  if (!open) return null;

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
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Nuevo usuario</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none text-gray-900" />
          <input type="text" name="apellido_paterno" placeholder="Apellido paterno" value={form.apellido_paterno} onChange={handleChange} className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none text-gray-900" />
          <input type="text" name="apellido_materno" placeholder="Apellido materno" value={form.apellido_materno} onChange={handleChange} className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none text-gray-900" />
          <input type="email" name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none text-gray-900" />
          <input type="password" name="contraseña" placeholder="Contraseña" value={form.contraseña} onChange={handleChange} className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none text-gray-900" />
          <input type="text" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none text-gray-900" />
          <select name="rol" value={form.rol} onChange={handleChange} className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none text-gray-900">
            <option value="cliente">Cliente</option>
            <option value="administrador">Administrador</option>
          </select>
          {error && <div className="text-red-600 text-base text-center font-semibold bg-red-100 rounded py-1">{error}</div>}
          {success && <div className="text-green-600 text-base text-center font-semibold bg-green-100 rounded py-1">{success}</div>}
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-lg shadow transition">Crear usuario</button>
        </form>
      </div>
    </div>
  );
} 