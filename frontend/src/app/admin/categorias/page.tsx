"use client";
import { useEffect, useState } from "react";
import CrearCategoriaModal from "./CrearCategoriaModal";
import EditarCategoriaModal from "./EditarCategoriaModal";
import { useAuth } from "@/AuthContext";

interface Categoria { id_categoria: number; nombre: string; }

export default function CategoriasPage() {
  const { token } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [showCrear, setShowCrear] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCategorias = async () => {
      setLoading(true);
      const res = await fetch(`${API}/api/categorias`, { headers: { Authorization: `Bearer ${token}` } });
      setCategorias(await res.json());
      setLoading(false);
    };
    if (token) fetchCategorias();
  }, [token]);

  const handleEliminar = async (id_categoria: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    await fetch(`${API}/api/categorias/${id_categoria}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategorias(categorias.filter((c) => c.id_categoria !== id_categoria));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-900">Categorías</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowCrear(true)}
        >
          + Agregar categoría
        </button>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-600">Cargando categorías...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full rounded shadow overflow-hidden">
            <thead>
              <tr className="bg-[#181f32]">
                <th className="px-3 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Nombre</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria, idx) => (
                <tr key={categoria.id_categoria} className={idx % 2 === 0 ? "bg-white" : "bg-[#f6f7fa]"}>
                  <td className="px-3 py-2 text-gray-900 whitespace-nowrap">{categoria.nombre}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <button className="text-yellow-500 font-bold bg-yellow-100 hover:bg-yellow-200 rounded px-3 py-1 mr-2 transition" onClick={() => setCategoriaEditar(categoria)}>Editar</button>
                    <button className="text-white font-bold bg-red-500 hover:bg-red-600 rounded px-3 py-1 transition" onClick={() => handleEliminar(categoria.id_categoria)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showCrear && (
        <CrearCategoriaModal
          onClose={() => setShowCrear(false)}
          onSave={(nueva: Categoria) => {
            setCategorias([...categorias, nueva]);
            setShowCrear(false);
          }}
        />
      )}
      {categoriaEditar && (
        <EditarCategoriaModal
          categoria={categoriaEditar}
          onClose={() => setCategoriaEditar(null)}
          onSave={(actualizada: Categoria) => {
            setCategorias(categorias.map(c => c.id_categoria === actualizada.id_categoria ? actualizada : c));
            setCategoriaEditar(null);
          }}
        />
      )}
    </div>
  );
} 