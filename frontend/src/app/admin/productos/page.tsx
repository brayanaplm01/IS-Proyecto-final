"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/AuthContext";
import CrearProductoModal from "./CrearProductoModal";
import EditarProductoModal from "./EditarProductoModal";

interface Marca { id_marca: number; nombre: string; }
interface Categoria { id_categoria: number; nombre: string; }
interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  cantidad: number;
  imagen: string | null;
  tipo_producto: string;
  id_marca: number | null;
  id_categoria: number | null;
  marca?: Marca; // Optional relation
  categoria?: Categoria; // Optional relation
}

export default function ProductosPage() {
  const { token } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [showCrear, setShowCrear] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  // Mover la definición de fetchData fuera del useEffect
  const fetchData = async () => {
    setLoading(true);
    console.log('Fetching data...');
    try {
      const [prodRes, marcasRes, catRes] = await Promise.all([
        fetch(`${API}/api/productos`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/marcas`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/categorias`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!prodRes.ok) throw new Error('Error fetching productos');
      if (!marcasRes.ok) throw new Error('Error fetching marcas');
      if (!catRes.ok) throw new Error('Error fetching categorias');

      const productosData: any[] = await prodRes.json();
      // Mapear los datos para asegurar que 'stock' es un número y manejar la posible 'cantidad' antigua
      const productosMapeados: Producto[] = productosData.map((p) => ({
        ...p,
        cantidad: parseInt((p.stock !== undefined ? p.stock : (p.cantidad !== undefined ? p.cantidad : 0)) as string), // Asegurar que stock es un número
      }));
      setProductos(productosMapeados);
      setMarcas(await marcasRes.json());
      setCategorias(await catRes.json());
      console.log('Productos fetched:', productosMapeados);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      // Opcional: mostrar un mensaje de error en la UI
    } finally {
      setLoading(false);
    }
  };

  // useEffect para la carga inicial
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]); // Dependencia en token

  const handleEliminar = async (id_producto: number) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    await fetch(`${API}/api/productos/${id_producto}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setProductos(productos.filter((p) => p.id_producto !== id_producto));
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-row items-center mb-4 gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowCrear(true)}
          >
            + Agregar producto
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-600">Cargando productos...</div>
        ) : (
          <div className="w-full overflow-x-auto rounded-xl">
            <table className="w-full min-w-[1300px] rounded shadow overflow-hidden text-sm">
              <thead>
                <tr className="bg-[#181f32]">
                  <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Marca</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Precio</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Cantidad</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider sticky right-0 z-10 bg-[#181f32] min-w-[200px]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto: Producto, idx) => (
                  <tr key={producto.id_producto} className={idx % 2 === 0 ? "bg-white" : "bg-[#f6f7fa]"}>
                    <td className="px-4 py-2 text-gray-900 whitespace-nowrap align-top max-w-[150px] truncate">{producto.nombre}</td>
                    <td className="px-4 py-2 text-gray-900 whitespace-nowrap align-top">{producto.marca?.nombre || '-'}</td>
                    <td className="px-4 py-2 text-gray-900 whitespace-nowrap align-top">${producto.precio}</td>
                    <td className="px-4 py-2 text-gray-900 whitespace-nowrap align-top">{producto.cantidad}</td>
                    <td className="px-4 py-2 text-gray-900 whitespace-nowrap align-top">
                      {producto.cantidad > 0 ? (
                        <span className="text-green-600 font-semibold">Disponible</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Agotado</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-900 whitespace-nowrap align-top">{producto.tipo_producto}</td>
                    <td className={`px-4 py-2 whitespace-nowrap align-top sticky right-0 z-10 min-w-[200px] ${idx % 2 === 0 ? 'bg-white' : 'bg-[#f6f7fa]'}`}>
                      <button className="text-yellow-500 font-bold bg-yellow-100 hover:bg-yellow-200 rounded px-3 py-1 mr-2 transition" onClick={() => setProductoEditar(producto)}>Editar</button>
                      <button className="text-white font-bold bg-red-500 hover:bg-red-600 rounded px-3 py-1 transition" onClick={() => handleEliminar(producto.id_producto)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showCrear && (
        <CrearProductoModal
          marcas={marcas}
          categorias={categorias}
          onClose={() => setShowCrear(false)}
          onSave={async () => {
            setShowCrear(false);
            await fetchData();
          }}
        />
      )}
      {productoEditar && (
        <EditarProductoModal
          producto={productoEditar}
          marcas={marcas}
          categorias={categorias}
          onClose={() => setProductoEditar(null)}
          onSave={async () => {
            setProductoEditar(null);
            await fetchData();
          }}
        />
      )}
    </div>
  );
} 