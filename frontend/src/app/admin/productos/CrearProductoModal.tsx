import { useState, ChangeEvent, FormEvent } from "react";
import CustomSelect from '@/components/CustomSelect';

const API = process.env.NEXT_PUBLIC_API_URL;

interface Marca { id_marca: number; nombre: string; }
interface Categoria { id_categoria: number; nombre: string; }

interface CrearProductoModalProps {
  marcas: Marca[];
  categorias: Categoria[];
  onClose: () => void;
  onSave: (producto: any) => void; // Considerar tipar 'producto' más adelante
}

export default function CrearProductoModal({ marcas, categorias, onClose, onSave }: CrearProductoModalProps) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    id_marca: "",
    id_categoria: "",
    precio: "",
    cantidad: "",
    imagen: "",
    tipo_producto: "camara",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Validación básica
    if (!form.nombre || !form.precio || !form.cantidad || !form.tipo_producto) {
      setError("Completa todos los campos obligatorios");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API}/api/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          id_marca: form.id_marca || null,
          id_categoria: form.id_categoria || null,
          precio: parseFloat(form.precio),
          cantidad: parseInt(form.cantidad),
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error response from backend:', res.status, errorData);
        throw new Error(errorData.error || 'Error al crear producto');
      }
      const nuevo = await res.json();
      onSave(nuevo);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(`Error al crear producto: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Agregar producto</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="w-full px-3 py-2 rounded border" required />
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="w-full px-3 py-2 rounded border" />
          <CustomSelect
            options={marcas.map(m => ({ value: m.id_marca, label: m.nombre }))}
            value={form.id_marca}
            onChange={(value) => setForm({ ...form, id_marca: value as string })}
            placeholder="Selecciona marca"
            className="w-full"
          />
          <CustomSelect
            options={categorias.map(c => ({ value: c.id_categoria, label: c.nombre }))}
            value={form.id_categoria}
            onChange={(value) => setForm({ ...form, id_categoria: value as string })}
            placeholder="Selecciona categoría"
            className="w-full"
          />
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