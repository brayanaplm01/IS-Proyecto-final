import React from 'react';
import { Orden } from '@/types/ordenes';
import { 
  XMarkIcon, 
  UserIcon, 
  EnvelopeIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface OrdenDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orden: Orden;
  onEstadoChange: (ordenId: number, nuevoEstado: 'pendiente' | 'entregado') => Promise<void>;
}

const OrdenDetailModal: React.FC<OrdenDetailModalProps> = ({ isOpen, onClose, orden, onEstadoChange }) => {
  if (!isOpen) return null;

  const handleEstadoToggle = async () => {
    const nuevoEstado = orden.estado === 'pendiente' ? 'entregado' : 'pendiente';
    await onEstadoChange(orden.id, nuevoEstado);
  };

  // Helper function to safely convert to number
  const safeToFixed = (value: unknown, decimals: number = 2): string => {
    if (value === null || value === undefined) return '0.00';
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(num) ? '0.00' : num.toFixed(decimals);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fadeIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`p-6 text-white ${
          orden.estado === 'entregado'
            ? 'bg-gradient-to-r from-green-600 to-emerald-600'
            : 'bg-gradient-to-r from-yellow-600 to-orange-600'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <ShoppingBagIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Orden #{orden.id}</h3>
                <p className="text-sm opacity-90">Detalles de la orden</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          {orden.User && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <UserIcon className="w-5 h-5 mr-2" />
                Información del Cliente
              </h4>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">{orden.User.nombre || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{orden.User.correo || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center text-blue-700 mb-2">
                <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">${safeToFixed(orden.total)}</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center text-purple-700 mb-2">
                <CalendarIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Fecha</span>
              </div>
              <p className="text-lg font-semibold text-purple-900">
                {new Date(orden.fecha_orden).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className={`rounded-lg p-4 ${
              orden.estado === 'entregado' ? 'bg-green-50' : 'bg-yellow-50'
            }`}>
              <div className={`flex items-center mb-2 ${
                orden.estado === 'entregado' ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {orden.estado === 'entregado' ? (
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                ) : (
                  <ClockIcon className="w-5 h-5 mr-2" />
                )}
                <span className="text-sm font-medium">Estado</span>
              </div>
              <p className={`text-lg font-semibold ${
                orden.estado === 'entregado' ? 'text-green-900' : 'text-yellow-900'
              }`}>
                {orden.estado === 'entregado' ? 'Entregado' : 'Pendiente'}
              </p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <ShoppingBagIcon className="w-5 h-5 mr-2" />
              Productos Ordenados
            </h4>
            {orden.DetalleOrdens && orden.DetalleOrdens.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Producto</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Cantidad</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Precio Unit.</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orden.DetalleOrdens.map((detalle) => (
                      <tr key={detalle.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-900">
                            {detalle.Producto?.nombre || 'Producto no disponible'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm text-gray-700">{detalle.cantidad || 0}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm text-gray-700">${safeToFixed(detalle.precioUnitario)}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm font-semibold text-gray-900">${safeToFixed(detalle.subtotal)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-900">Total:</td>
                      <td className="px-4 py-3 text-right font-bold text-lg text-gray-900">
                        ${safeToFixed(orden.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay productos en esta orden</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cerrar
            </button>
            <button
              onClick={handleEstadoToggle}
              className={`px-6 py-2.5 rounded-lg transition-all font-medium shadow-lg hover:shadow-xl ${
                orden.estado === 'pendiente'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                  : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white'
              }`}
            >
              {orden.estado === 'pendiente' ? 'Marcar como Entregado' : 'Marcar como Pendiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdenDetailModal;
