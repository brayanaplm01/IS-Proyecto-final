"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/AuthContext'; // Asumiendo que useAuth es necesario para obtener token o verificar admin
import OrdenCard from '@/components/OrdenCard'; // Importar el componente OrdenCard
import { Orden } from '@/types/ordenes'; // Importar la interfaz Orden desde el archivo de tipos

const OrdenesAdminPage: React.FC = () => {
    const { user } = useAuth(); // Si se necesita autenticación o info del usuario
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // Nuevos estados para los conteos
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [deliveredCount, setDeliveredCount] = useState<number>(0);

    // Nuevo estado para el modal y la orden seleccionada
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedOrden, setSelectedOrden] = useState<Orden | null>(null);

    // URL de la API para obtener órdenes (ajusta si es diferente)
    const API_URL = 'http://localhost:5000'; // Apuntar directamente al puerto del backend

    useEffect(() => {
        // Función para obtener las órdenes del backend
        const fetchOrdenes = async () => {
            try {
                setLoading(true);
                setError(null);

                // TODO: Añadir token de autenticación si la API lo requiere
                const response = await fetch(`${API_URL}/api/ordenes`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data && Array.isArray(data.ordenes)) {
                    const fetchedOrdenes: Orden[] = data.ordenes;
                    setOrdenes(fetchedOrdenes);

                    // Calcular conteos de estado
                    const pending = fetchedOrdenes.filter(o => o.estado === 'pendiente').length;
                    const delivered = fetchedOrdenes.filter(o => o.estado === 'entregado').length;
                    setPendingCount(pending);
                    setDeliveredCount(delivered);

                } else {
                    throw new Error('Formato de respuesta de la API inesperado.');
                }

            } catch (err: any) {
                console.error('Error fetching ordenes:', err);
                setError('Error al cargar las órdenes.');
                // Resetear conteos si hay error
                setPendingCount(0);
                setDeliveredCount(0);
            } finally {
                setLoading(false);
            }
        };

        fetchOrdenes();
    }, []); // Se ejecuta solo una vez al montar el componente

    // Función para actualizar el estado de una orden
    const handleEstadoChange = async (ordenId: number, nuevoEstado: 'pendiente' | 'entregado') => {
        try {
            // TODO: Añadir token de autenticación si la API lo requiere
            const response = await fetch(`${API_URL}/api/ordenes/${ordenId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // Si se usa autenticación
                },
                body: JSON.stringify({ estado: nuevoEstado }),
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
            }

            // Opcional: Actualizar el estado en el frontend sin volver a cargar todas las órdenes
            setOrdenes(ordenes.map(orden => 
                orden.id === ordenId ? { ...orden, estado: nuevoEstado } : orden
            ));

            // Si la orden actualizada es la que está en el modal, actualizar también el modal
            if (selectedOrden && selectedOrden.id === ordenId) {
                 setSelectedOrden(prev => prev ? { ...prev, estado: nuevoEstado } : null);
             }

            console.log(`Estado de la orden ${ordenId} actualizado a ${nuevoEstado}`);

        } catch (err: any) {
            console.error('Error updating orden status:', err);
            // Mostrar error al usuario
             alert(`Error al actualizar el estado: ${err.message}`);
        }
    };

    // Función para manejar el clic en una tarjeta de orden
    const handleCardClick = (orden: Orden) => {
        setSelectedOrden(orden);
        setIsModalOpen(true);
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrden(null); // Limpiar la orden seleccionada al cerrar
    };

    if (loading) return <div className="text-center mt-8">Cargando órdenes...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
    if (!loading && !error && ordenes.length === 0) return <div className="text-center mt-8">No hay órdenes para mostrar.</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 dark:text-gray-900">Gestión de Órdenes</h1>

            {/* Sección de Tarjetas de Resumen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Aquí irán las tarjetas. Usaré un div simple por ahora */}
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
                    <span className="block sm:inline font-bold text-lg">{pendingCount}</span>
                    <span className="block sm:inline ml-2">Órdenes Pendientes</span>
                </div>
                 <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                    <span className="block sm:inline font-bold text-lg">{deliveredCount}</span>
                    <span className="block sm:inline ml-2">Órdenes Entregadas</span>
                </div>
            </div>

            {/* Sección de Tarjetas de Órdenes */}
            {/* Reemplazar la tabla con un div grid para las tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ordenes.map(orden => (
                    <OrdenCard
                        key={orden.id}
                        orden={orden}
                         // Pasar la función de clic a la tarjeta
                        onClick={() => handleCardClick(orden)}
                        // Ya no pasamos handleEstadoChange aquí, se manejará en el modal
                        // handleEstadoChange={handleEstadoChange}
                    />
                ))}
            </div>

            {/* Renderizar el Modal de Detalles de Orden (se creará en el siguiente paso) */}
            {/*
             {selectedOrden && (
                 <OrdenDetailModal
                     isOpen={isModalOpen}
                     onClose={handleCloseModal}
                     orden={selectedOrden}
                     onEstadoChange={handleEstadoChange} // Pasar la función para actualizar estado
                 />
             )}
            */}

        </div>
    );
};

export default OrdenesAdminPage; 