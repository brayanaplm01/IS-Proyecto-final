import React from 'react';
import { Orden } from '@/types/ordenes'; // Importar la interfaz Orden desde el archivo de tipos

interface OrdenRowProps {
    orden: Orden;
    handleEstadoChange: (ordenId: number, nuevoEstado: 'pendiente' | 'entregado') => Promise<void>;
}

const OrdenRow: React.FC<OrdenRowProps> = ({ orden, handleEstadoChange }) => {
    return (
        <tr key={orden.id}>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{orden.id.toString()}</p></td>
            {/* Mostrando ID del usuario, o 'N/A' si no está disponible */}
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{orden.User?.id || 'N/A'}</p></td>
            {/* @ts-expect-error // Ignorar error de tipo en la siguiente línea */}
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{'$' + parseFloat(orden.total).toFixed(2)}</p></td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{new Date(orden.fecha_orden).toLocaleDateString()}</p></td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <select
                    value={orden.estado === 'pendiente' || orden.estado === 'entregado' ? orden.estado : 'pendiente'}
                    onChange={(e) => handleEstadoChange(orden.id, e.target.value as 'pendiente' | 'entregado')}
                    className="border rounded px-2 py-1 text-sm"
                >
                    <option value="pendiente">Pendiente</option>
                    <option value="entregado">Entregado</option>
                </select>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                {/* Aquí podrías añadir un enlace o botón para ver detalles de la orden si es necesario */}
                {/* <button className="text-indigo-600 hover:text-indigo-900">Ver Detalles</button> */}
            </td>
        </tr>
    );
};

export default OrdenRow; 