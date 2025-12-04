import React from 'react';
import { Orden } from '@/types/ordenes'; // Importar la interfaz Orden

interface OrdenDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    orden: Orden | null; // Puede ser null si el modal no está abierto o no hay orden seleccionada
    onEstadoChange: (ordenId: number, nuevoEstado: 'pendiente' | 'entregado') => Promise<void>;
}

const OrdenDetailModal: React.FC<OrdenDetailModalProps> = ({ isOpen, onClose, orden, onEstadoChange }) => {
    // No renderizar si el modal no está abierto o no hay orden
    if (!isOpen || !orden) {
        return null;
    }

    // Función para manejar el cambio de estado y cerrar el modal
    const handleEstadoChangeAndClose = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nuevoEstado = e.target.value as 'pendiente' | 'entregado';
        await onEstadoChange(orden.id, nuevoEstado);
        // Podrías decidir cerrar el modal automáticamente después de cambiar el estado, o no.
        // onClose();
    };


    return (
        // Overlay del modal
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center" onClick={onClose}>
            {/* Contenido del modal */}
            <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}> {/* Evitar que el clic en el contenido cierre el modal */}
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Detalles de Orden #{orden.id}</h3>
                    <div className="mt-2 px-7 py-3 text-left">
                        <p className="text-sm text-gray-800">
                            ID Orden: <span className="font-semibold">{orden.id}</span>
                        </p>
                         <p className="text-sm text-gray-800">
                            ID Usuario: <span className="font-semibold">{orden.User?.id || 'N/A'}</span>
                        </p>
                         <p className="text-sm text-gray-800">
                            Total: {/* @ts-expect-error // Ignorar error de tipo */}
                             <span className="font-semibold">{'$ ' + parseFloat(orden.total).toFixed(2)}</span>
                        </p>
                         <p className="text-sm text-gray-800">
                            Fecha: <span className="font-semibold">{new Date(orden.fecha_orden).toLocaleDateString()}</span>
                        </p>
                        {/* Aquí podrías añadir más detalles como productos, etc. */}

                         {/* Selector de Estado */}
                         <div className="flex items-center mt-4">
                             <label htmlFor={`estado-modal-${orden.id}`} className="mr-2 text-gray-800">Estado:</label>
                             <select
                                 id={`estado-modal-${orden.id}`}
                                 value={orden.estado === 'pendiente' || orden.estado === 'entregado' ? orden.estado : 'pendiente'}
                                 onChange={handleEstadoChangeAndClose} // Usar la nueva función
                                 className="border rounded px-2 py-1 text-sm"
                             >
                                 <option value="pendiente">Pendiente</option>
                                 <option value="entregado">Entregado</option>
                             </select>
                         </div>

                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            id="ok-btn"
                            className="px-4 py-2 bg-indigo-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={onClose} // Botón para cerrar el modal
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdenDetailModal; 