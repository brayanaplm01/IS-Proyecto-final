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
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  CameraIcon,
  WrenchScrewdriverIcon,
  TagIcon,
  FolderIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Stats {
  totalProductos?: number;
  totalAccesorios?: number;
  totalMarcas?: number;
  totalCategorias?: number;
  totalClientes?: number;
}

interface SaleData {
  mes: number;
  año?: number;
  ventas: number;
}

interface RecentSale {
  id: number;
  total: string | number;
  usuario_nombre?: string;
}

export default function AdminPanelPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showDenied, setShowDenied] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [formattedSalesData, setFormattedSalesData] = useState<{ labels: string[], data: number[] }>({ labels: [], data: [] });
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);

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
      const res = await fetch(`${API}/api/dashboard/stats`);
      const data: Stats = await res.json();
      setStats(data);
    };
    const fetchSales = async () => {
      const res = await fetch(`${API}/api/dashboard/sales`);
      const data: SaleData[] = await res.json();

      // Procesar datos para el gráfico
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const labels = data.map((item) => monthNames[item.mes - 1] + (item.año ? ` ${item.año}` : ''));
      const salesValues = data.map((item) => item.ventas);

      setFormattedSalesData({ labels, data: salesValues });
    };
    
    const fetchRecentSales = async () => {
      const res = await fetch(`${API}/api/dashboard/recent-sales`);
      const data: RecentSale[] = await res.json();
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
    <div className="p-2 md:p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Panel General</h1>
          <p className="text-gray-600 text-lg">Resumen de actividades y estadísticas</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Sistema Activo</span>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard 
          title="Productos" 
          value={stats?.totalProductos ?? "-"} 
          icon={<CameraIcon className="w-8 h-8" />}
          gradient="from-blue-500 to-blue-600"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <MetricCard 
          title="Accesorios" 
          value={stats?.totalAccesorios ?? "-"} 
          icon={<WrenchScrewdriverIcon className="w-8 h-8" />}
          gradient="from-purple-500 to-purple-600"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <MetricCard 
          title="Marcas" 
          value={stats?.totalMarcas ?? "-"} 
          icon={<TagIcon className="w-8 h-8" />}
          gradient="from-green-500 to-green-600"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <MetricCard 
          title="Categorías" 
          value={stats?.totalCategorias ?? "-"} 
          icon={<FolderIcon className="w-8 h-8" />}
          gradient="from-yellow-500 to-yellow-600"
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <MetricCard 
          title="Clientes" 
          value={stats?.totalClientes ?? "-"} 
          icon={<UsersIcon className="w-8 h-8" />}
          gradient="from-pink-500 to-pink-600"
          iconBg="bg-pink-100"
          iconColor="text-pink-600"
        />
      </div>
      
      {/* Charts and Recent Sales Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />
                Ventas Mensuales
              </h2>
              <p className="text-sm text-gray-600 mt-1">Rendimiento de ventas por mes</p>
            </div>
          </div>
          <div className="w-full h-80">
            <Bar
              data={{
                labels: formattedSalesData.labels,
                datasets: [
                  {
                    label: "Ventas ($)",
                    data: formattedSalesData.data,
                    backgroundColor: "rgba(59, 130, 246, 0.8)",
                    borderRadius: 8,
                    borderWidth: 0,
                    hoverBackgroundColor: "rgba(37, 99, 235, 0.9)",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { 
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                      boxWidth: 12,
                      padding: 15,
                      font: { size: 12 }
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { size: 14, weight: 'bold' as const },
                    bodyFont: { size: 13 },
                    callbacks: {
                      label: function(context) {
                        return `Ventas: $${context.parsed.y.toLocaleString()}`;
                      }
                    }
                  },
                },
                scales: {
                  x: { 
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                  },
                  y: { 
                    beginAtZero: true, 
                    grid: { color: "#f3f4f6" },
                    ticks: { 
                      font: { size: 11 },
                      callback: function(value) {
                        return '$' + value.toLocaleString();
                      }
                    }
                  },
                },
              }}
            />
          </div>
        </div>
        
        {/* Recent Sales - Takes 1 column */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCartIcon className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Ventas Recientes</h2>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
            {recentSales.length > 0 ? (
              recentSales.map((sale, index) => (
                <div 
                  key={sale.id} 
                  className="flex items-start justify-between p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 transition-all duration-300 border border-gray-200 hover:border-blue-300 cursor-pointer group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        #{sale.id}
                      </span>
                      <span className="text-xs text-gray-500">
                        {index === 0 ? 'Más reciente' : `Hace ${index + 1}h`}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {sale.usuario_nombre || 'Cliente'}
                    </div>
                    <div className="flex items-center gap-1">
                      <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                      <span className="text-lg font-bold text-green-600">
                        ${typeof sale.total === 'number' ? sale.total.toFixed(2) : parseFloat(sale.total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCartIcon className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No hay ventas recientes</p>
                <p className="text-sm text-gray-400 mt-1">Las ventas aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  icon, 
  gradient, 
  iconBg, 
  iconColor 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
      {/* Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className="relative p-6">
        {/* Icon Circle */}
        <div className={`${iconBg} ${iconColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        
        {/* Value */}
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {value}
        </div>
        
        {/* Title */}
        <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title}
        </div>
        
        {/* Decorative Element */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
      </div>
    </div>
  );
} 