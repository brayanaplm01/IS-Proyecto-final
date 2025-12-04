import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function EditarProductoModal({ producto, marcas, categorias, onClose, onSave }) {
  const [form, setForm] = useState({ ...producto });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!form.nombre || !form.precio || !form.cantidad || !form.tipo_producto) {
      setError("Completa todos los campos obligatorios");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API}/api/productos/${producto.id_producto}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          id_marca: form.id_marca || null,
          id_categoria: form.id_categoria || null,
          precio: parseFloat(form.precio),
          cantidad: parseInt(form.cantidad),
        }),
      });
      if (!res.ok) throw new Error("Error al actualizar producto");
      const actualizado = await res.json();
      onSave(actualizado);
    } catch (err) {
      setError("Error al actualizar producto");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Editar producto</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="w-full px-3 py-2 rounded border" required />
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="w-full px-3 py-2 rounded border" />
          <select name="id_marca" value={form.id_marca || ""} onChange={handleChange} className="w-full px-3 py-2 rounded border">
            <option value="">Selecciona marca</option>
            {marcas.map((m) => <option key={m.id_marca} value={m.id_marca}>{m.nombre}</option>)}
          </select>
          <select name="id_categoria" value={form.id_categoria || ""} onChange={handleChange} className="w-full px-3 py-2 rounded border">
            <option value="">Selecciona categoría</option>
            {categorias.map((c) => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
          </select>
          <input name="precio" value={form.precio} onChange={handleChange} placeholder="Precio" type="number" step="0.01" className="w-full px-3 py-2 rounded border" required />
          <input name="cantidad" value={form.cantidad} onChange={handleChange} placeholder="Cantidad" type="number" className="w-full px-3 py-2 rounded border" required />
          <input name="imagen" value={form.imagen} onChange={handleChange} placeholder="URL de imagen" className="w-full px-3 py-2 rounded border" />
          <select name="tipo_producto" value={form.tipo_producto} onChange={handleChange} className="w-full px-3 py-2 rounded border" required>
            <option value="camara">Cámara</option>
            <option value="accesorio">Accesorio</option>
          </select>
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