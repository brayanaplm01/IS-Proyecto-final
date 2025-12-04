import { useState } from "react";
import { useAuth } from "@/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CrearMarcaModal({ onClose, onSave }) {
  const { token } = useAuth();
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!nombre) {
      setError("El nombre es obligatorio");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API}/api/marcas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nombre }),
      });
      if (!res.ok) throw new Error("Error al crear marca");
      const nueva = await res.json();
      onSave(nueva);
    } catch (err) {
      setError("Error al crear marca");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Agregar marca</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="nombre" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" className="w-full px-3 py-2 rounded border" required />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{loading ? "Guardando..." : "Guardar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
} 