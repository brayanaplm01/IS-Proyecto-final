"use client";
import { useEffect, useState } from "react";
import CrearMarcaModal from "./CrearMarcaModal";
import EditarMarcaModal from "./EditarMarcaModal";
import { useAuth } from "@/AuthContext";

interface Marca { id_marca: number; nombre: string; }

export default function MarcasPage() {
  const { token } = useAuth();
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [showCrear, setShowCrear] = useState(false);
  const [marcaEditar, setMarcaEditar] = useState<Marca | null>(null);
  const [loading, setLoading] = useState(true);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-900">Marcas</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowCrear(true)}
        >
          + Agregar marca
        </button>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-600">Cargando marcas...</div>
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
              {marcas.map((marca, idx) => (
                <tr key={marca.id_marca} className={idx % 2 === 0 ? "bg-white" : "bg-[#f6f7fa]"}>
                  <td className="px-3 py-2 text-gray-900 whitespace-nowrap">{marca.nombre}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <button className="text-yellow-500 font-bold bg-yellow-100 hover:bg-yellow-200 rounded px-3 py-1 mr-2 transition" onClick={() => setMarcaEditar(marca)}>Editar</button>
                    <button className="text-white font-bold bg-red-500 hover:bg-red-600 rounded px-3 py-1 transition" onClick={() => handleEliminar(marca.id_marca)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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