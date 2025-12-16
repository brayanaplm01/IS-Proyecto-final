"use client";

import React, { useState, useEffect } from 'react';
import OrdenDetailModal from './OrdenDetailModal';
import { Orden } from '@/types/ordenes';
import { 
  MagnifyingGlassIcon, 
  ShoppingCartIcon, 
  ClockIcon, 
  CheckCircleIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const OrdenesAdminPage: React.FC = () => {
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterEstado, setFilterEstado] = useState<string>("todos");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedOrden, setSelectedOrden] = useState<Orden | null>(null);

    const API_URL = 'http://localhost:5000';

    useEffect(() => {
        const fetchOrdenes = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${API_URL}/api/ordenes`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data && Array.isArray(data.ordenes)) {
                    setOrdenes(data.ordenes);
                } else {
                    throw new Error('Formato de respuesta de la API inesperado.');
                }

            } catch (err) {
                console.error('Error fetching ordenes:', err);
                setError('Error al cargar las órdenes.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrdenes();
    }, []);

    const handleEstadoChange = async (ordenId: number, nuevoEstado: 'pendiente' | 'entregado') => {
        try {
            const response = await fetch(`${API_URL}/api/ordenes/${ordenId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: nuevoEstado }),
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
            }

            setOrdenes(ordenes.map(orden => 
                orden.id === ordenId ? { ...orden, estado: nuevoEstado } : orden
            ));

            if (selectedOrden && selectedOrden.id === ordenId) {
                 setSelectedOrden(prev => prev ? { ...prev, estado: nuevoEstado } : null);
             }

            console.log(`Estado de la orden ${ordenId} actualizado a ${nuevoEstado}`);

        } catch (err) {
            console.error('Error updating orden status:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            alert(`Error al actualizar el estado: ${errorMessage}`);
        }
    };

    const handleCardClick = (orden: Orden) => {
        setSelectedOrden(orden);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrden(null);
    };

    // Filter and search orders
    const filteredOrdenes = ordenes.filter((orden) => {
        const matchesSearch = 
            orden.id.toString().includes(searchTerm) ||
            (orden.User?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (orden.User?.correo?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
        const matchesEstado = filterEstado === "todos" || orden.estado === filterEstado;
        return matchesSearch && matchesEstado;
    });

    // Pagination
    const totalPages = Math.ceil(filteredOrdenes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrdenes = filteredOrdenes.slice(startIndex, startIndex + itemsPerPage);

    // Reset to page 1 when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterEstado]);

    // Calculate stats
    const totalOrdenes = ordenes.length;
    const pendingCount = ordenes.filter(o => o.estado === 'pendiente').length;
    const deliveredCount = ordenes.filter(o => o.estado === 'entregado').length;
    const totalRevenue = ordenes.reduce((sum, orden) => sum + parseFloat(orden.total.toString()), 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Cargando órdenes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Gestión de Órdenes</h2>
                <p className="text-gray-600 mt-1">Administra y monitorea todas las órdenes del sistema</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium uppercase tracking-wider">Total Órdenes</p>
                            <p className="text-4xl font-bold mt-2">{totalOrdenes}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                            <ShoppingCartIcon className="w-12 h-12" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100 text-sm font-medium uppercase tracking-wider">Pendientes</p>
                            <p className="text-4xl font-bold mt-2">{pendingCount}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                            <ClockIcon className="w-12 h-12" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium uppercase tracking-wider">Entregadas</p>
                            <p className="text-4xl font-bold mt-2">{deliveredCount}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                            <CheckCircleIcon className="w-12 h-12" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Ingresos Totales</p>
                            <p className="text-3xl font-bold mt-2">${totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                            <CurrencyDollarIcon className="w-12 h-12" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por ID de orden, nombre de cliente o correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterEstado("todos")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filterEstado === "todos"
                                ? "bg-gradient-to-r from-orange-600 to-red-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setFilterEstado("pendiente")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filterEstado === "pendiente"
                                ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Pendientes
                    </button>
                    <button
                        onClick={() => setFilterEstado("entregado")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filterEstado === "entregado"
                                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Entregadas
                    </button>
                </div>
            </div>

            {/* Orders Grid */}
            {filteredOrdenes.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <ShoppingCartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {searchTerm || filterEstado !== "todos" ? "No se encontraron órdenes" : "No hay órdenes registradas"}
                    </h3>
                    <p className="text-gray-600">
                        {searchTerm || filterEstado !== "todos"
                            ? "Intenta con otros términos de búsqueda o filtros"
                            : "Las órdenes aparecerán aquí cuando los clientes realicen compras"}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedOrdenes.map((orden) => (
                            <div
                                key={orden.id}
                                onClick={() => handleCardClick(orden)}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-200 hover:border-orange-300"
                            >
                                {/* Header */}
                                <div className={`p-4 ${
                                    orden.estado === 'entregado' 
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                                        : 'bg-gradient-to-r from-yellow-500 to-orange-600'
                                } text-white`}>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold">Orden #{orden.id}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            orden.estado === 'entregado'
                                                ? 'bg-white/30'
                                                : 'bg-white/30'
                                        }`}>
                                            {orden.estado === 'entregado' ? '✓ Entregado' : '⏱ Pendiente'}
                                        </span>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-4 space-y-3">
                                    <div className="flex items-center text-gray-700">
                                        <CurrencyDollarIcon className="w-5 h-5 mr-2 text-green-600" />
                                        <span className="font-semibold text-lg">${parseFloat(orden.total.toString()).toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <CalendarIcon className="w-4 h-4 mr-2" />
                                        {new Date(orden.fecha_orden).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    {orden.User && (
                                        <div className="pt-2 border-t border-gray-200">
                                            <p className="text-sm font-semibold text-gray-900">{orden.User.nombre}</p>
                                            <p className="text-xs text-gray-500">{orden.User.correo}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white rounded-lg shadow-md px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Mostrando <span className="font-semibold">{startIndex + 1}</span> a{" "}
                                    <span className="font-semibold">
                                        {Math.min(startIndex + itemsPerPage, filteredOrdenes.length)}
                                    </span>{" "}
                                    de <span className="font-semibold">{filteredOrdenes.length}</span> órdenes
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Anterior
                                    </button>
                                    <div className="flex gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                    currentPage === page
                                                        ? "bg-gradient-to-r from-orange-600 to-red-600 text-white"
                                                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            {selectedOrden && (
                <OrdenDetailModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    orden={selectedOrden}
                    onEstadoChange={handleEstadoChange}
                />
            )}
        </div>
    );
};

export default OrdenesAdminPage; 