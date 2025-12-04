"use client";
import { useAuth } from "@/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminPanelPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showDenied, setShowDenied] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [formattedSalesData, setFormattedSalesData] = useState<{ labels: string[], data: number[] }>({ labels: [], data: [] });
  const [recentSales, setRecentSales] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.rol !== "administrador")) {
      setShowDenied(true);
      setTimeout(() => {
        router.replace("/");
      }, 1800);
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      const res = await fetch(`${API}/api/dashboard/stats`);
      const data = await res.json();
      setStats(data);
      setLoadingStats(false);
    };
    const fetchSales = async () => {
      const res = await fetch(`${API}/api/dashboard/sales`);
      const data = await res.json();
      setSales(data);

      // Procesar datos para el gráfico
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const labels = data.map((item: any) => monthNames[item.mes - 1] + (item.año ? ` ${item.año}` : '')); // Agregar año si está disponible
      const salesValues = data.map((item: any) => item.ventas);

      setFormattedSalesData({ labels, data: salesValues });
    };
    
    const fetchRecentSales = async () => {
      const res = await fetch(`${API}/api/dashboard/recent-sales`);
      const data = await res.json();
      setRecentSales(data);
    };

    fetchStats();
    fetchSales();
    fetchRecentSales();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="text-gray-700 text-lg font-semibold">Cargando...</div>
      </div>
    );
  }

  if (showDenied && (!user || user.rol !== "administrador")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow text-lg font-semibold">
          Se solicita que se inicie sesión en modo administrador
        </div>
      </div>
    );
  }

  if (!user || user.rol !== "administrador") return null;

  return (
    <div className="p-2 md:p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Panel General</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <MetricCard title="Productos" value={stats?.totalProductos ?? "-"} color="bg-blue-500" />
        <MetricCard title="Accesorios" value={stats?.totalAccesorios ?? "-"} color="bg-purple-500" />
        <MetricCard title="Marcas" value={stats?.totalMarcas ?? "-"} color="bg-green-500" />
        <MetricCard title="Categorías" value={stats?.totalCategorias ?? "-"} color="bg-yellow-500" />
        <MetricCard title="Clientes" value={stats?.totalClientes ?? "-"} color="bg-pink-500" />
      </div>
      
      {/* Contenedor para el gráfico y ventas recientes */}
      <div className="flex flex-col md:flex-row md:gap-6">
        {/* Sección de Ventas por mes (gráfico) */}
        <div className="md:w-2/3 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Ventas por mes</h2>
          <div className="w-full h-96">
            <Bar
              data={{
                labels: formattedSalesData.labels,
                datasets: [
                  {
                    label: "Ventas",
                    data: formattedSalesData.data,
                    backgroundColor: "rgba(59, 130, 246, 0.7)",
                    borderRadius: 8,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                },
                scales: {
                  x: { grid: { display: false } },
                  y: { beginAtZero: true, grid: { color: "#e5e7eb" } },
                },
              }}
            />
          </div>
        </div>
        
        {/* Sección de Ventas Recientes */}
        <div className="md:w-1/3 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Ventas Recientes</h2>
          {/* Aquí irá la lista de ventas recientes */}
          {recentSales.length > 0 ? (
            <ul>
              {recentSales.map((sale) => (
                <li key={sale.id} className="mb-2 pb-2 border-b last:border-b-0 border-gray-200">
                  <div className="flex justify-between text-gray-800">
                    <span className="font-semibold">Orden #{sale.id}</span>
                    <span>${parseFloat(sale.total).toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-600">{sale.usuario_nombre}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No hay ventas recientes.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  return (
    <div className={`rounded-xl shadow-lg p-6 flex flex-col items-center justify-center ${color} text-white`}>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className="text-lg font-semibold tracking-wide">{title}</div>
    </div>
  );
} 