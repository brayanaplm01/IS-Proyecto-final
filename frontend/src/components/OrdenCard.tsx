import React from 'react';
import { Orden } from '@/types/ordenes'; // Importar la interfaz Orden

interface OrdenCardProps {
    orden: Orden;
    onClick: () => void;
}

const OrdenCard: React.FC<OrdenCardProps> = ({ orden, onClick }) => {
    // Determinar color de la tarjeta según el estado (ejemplo simple)
    const cardColor = orden.estado === 'entregado' ? 'bg-green-100 border-green-400' : 'bg-yellow-100 border-yellow-400';
    const textColor = orden.estado === 'entregado' ? 'text-green-700' : 'text-yellow-700';

    return (
        <div
            className={`border rounded-lg shadow p-4 flex flex-col cursor-pointer ${cardColor} ${textColor}`}
            onClick={onClick}
        >
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">Orden #{orden.id}</h3>
                <span className="text-sm text-gray-600">ID Usuario: {orden.usuario_id || 'N/A'}</span>
            </div>
            <div className="mb-2">
                <p className="text-gray-800">
                    Total: {/* @ts-expect-error // Ignorar error de tipo en la siguiente línea */}
                    <span className="font-semibold">{'$ ' + parseFloat(orden.total).toFixed(2)}</span>
                </p>
                <p className="text-gray-800">
                    Fecha: <span className="font-semibold">{new Date(orden.fecha_orden).toLocaleDateString()}</span>
                </p>
            </div>
            {/* Puedes añadir un botón "Ver Detalles" aquí si creas una página de detalle de orden */}
            {/* <button className="mt-4 text-indigo-600 hover:text-indigo-900 self-start">Ver Detalles</button> */}
        </div>
    );
};

export default OrdenCard; 