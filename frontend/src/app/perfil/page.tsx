"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/AuthContext";
import { useRouter } from "next/navigation";
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  PencilSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  XMarkIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Orden {
  id: number;
  fecha_orden: string;
  total: string | number;
  estado: string;
  costo_envio: string | number;
  descripcion_envio: string;
  DetalleOrdens: {
    cantidad: number;
    subtotal: string | number;
    Producto: {
      id: number;
      nombre: string;
      precio: string | number;
    };
  }[];
}

export default function PerfilPage() {
  const { user, token, login } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showHistorial, setShowHistorial] = useState(false);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    telefono: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    
    setFormData({
      nombre: user.nombre || "",
      apellido_paterno: user.apellido_paterno || "",
      apellido_materno: user.apellido_materno || "",
      correo: user.correo || "",
      telefono: user.telefono || "",
      password: "",
      confirmPassword: ""
    });
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validar que las contraseñas coincidan si se está cambiando
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      setLoading(false);
      return;
    }

    try {
      const updateData: Record<string, string> = {
        nombre: formData.nombre,
        apellido_paterno: formData.apellido_paterno,
        apellido_materno: formData.apellido_materno,
        correo: formData.correo,
        telefono: formData.telefono
      };

      // Solo incluir password si se está cambiando
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`${API}/api/auth/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el perfil');
      }

      const data = await response.json();
      
      // Actualizar el usuario en el contexto
      login(token!, data.usuario);
      
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      setIsEditing(false);
      
      // Limpiar campos de contraseña
      setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
      
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Error al actualizar el perfil' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;
    
    setFormData({
      nombre: user.nombre || "",
      apellido_paterno: user.apellido_paterno || "",
      apellido_materno: user.apellido_materno || "",
      correo: user.correo || "",
      telefono: user.telefono || "",
      password: "",
      confirmPassword: ""
    });
    setIsEditing(false);
    setMessage(null);
  };

  const loadOrdenes = async () => {
    setLoadingOrdenes(true);
    try {
      const response = await fetch(`${API}/api/ordenes/mis-compras`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar las órdenes');
      }

      const data = await response.json();
      setOrdenes(data);
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Error al cargar el historial de compras' });
    } finally {
      setLoadingOrdenes(false);
    }
  };

  const handleOpenHistorial = () => {
    setShowHistorial(true);
    loadOrdenes();
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'pagado':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'entregado':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'cancelado':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
              <p className="text-gray-400">Administra tu información personal</p>
            </div>
            
            {!isEditing && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleOpenHistorial}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Historial de Compras</span>
                  <span className="sm:hidden">Historial</span>
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Editar Perfil</span>
                  <span className="sm:hidden">Editar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
              : 'bg-red-500/20 border border-red-500/50 text-red-400'
          }`}>
            {message.type === 'success' ? (
              <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
            ) : (
              <XCircleIcon className="w-5 h-5 flex-shrink-0" />
            )}
            <p>{message.text}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
          {/* Header with Avatar */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <UserIcon className="w-10 h-10 text-white" />
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">
                  {user.nombre} {user.apellido_paterno}
                </h2>
                <p className="text-blue-100 capitalize">{user.rol}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    className={`w-full px-4 py-3 rounded-lg bg-gray-900 border ${
                      isEditing ? 'border-gray-600 text-white' : 'border-gray-700 text-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Apellido Paterno *
                  </label>
                  <input
                    type="text"
                    name="apellido_paterno"
                    value={formData.apellido_paterno}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    className={`w-full px-4 py-3 rounded-lg bg-gray-900 border ${
                      isEditing ? 'border-gray-600 text-white' : 'border-gray-700 text-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    name="apellido_materno"
                    value={formData.apellido_materno}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-lg bg-gray-900 border ${
                      isEditing ? 'border-gray-600 text-white' : 'border-gray-700 text-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900 border ${
                        isEditing ? 'border-gray-600 text-white' : 'border-gray-700 text-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Información de Contacto</h3>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900 border ${
                      isEditing ? 'border-gray-600 text-white' : 'border-gray-700 text-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  />
                </div>
              </div>
            </div>

            {/* Change Password (only when editing) */}
            {isEditing && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Cambiar Contraseña</h3>
                <p className="text-sm text-gray-400 mb-4">Deja estos campos vacíos si no deseas cambiar tu contraseña</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={6}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      minLength={6}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Confirma tu contraseña"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Modal de Historial de Compras */}
      {showHistorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBagIcon className="w-8 h-8 text-white" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Historial de Compras</h2>
                  <p className="text-purple-100 text-sm">Todas tus órdenes realizadas</p>
                </div>
              </div>
              <button
                onClick={() => setShowHistorial(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 overflow-y-auto flex-1">
              {loadingOrdenes ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
              ) : ordenes.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBagIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No tienes compras realizadas</p>
                  <p className="text-gray-500 text-sm mt-2">Tus órdenes aparecerán aquí</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ordenes.map((orden) => (
                    <div
                      key={orden.id}
                      className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all"
                    >
                      {/* Header de la Orden */}
                      <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-700">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              Orden #{orden.id}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoColor(orden.estado)}`}>
                              {orden.estado.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {new Date(orden.fecha_orden).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                            {orden.descripcion_envio && (
                              <div className="flex items-center gap-1">
                                <span>📦 {orden.descripcion_envio}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-400">
                            ${(parseFloat(String(orden.total || 0)) + parseFloat(String(orden.costo_envio || 0))).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                      </div>

                      {/* Productos */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-300 mb-3">Productos:</h4>
                        {orden.DetalleOrdens.map((detalle, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="text-white font-medium">{detalle.Producto.nombre}</p>
                              <p className="text-sm text-gray-400">
                                Cantidad: {detalle.cantidad} × ${parseFloat(String(detalle.Producto.precio || 0)).toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-semibold">
                                ${parseFloat(String(detalle.subtotal || 0)).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Resumen de Costos */}
                      <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>Subtotal:</span>
                          <span>${parseFloat(String(orden.total || 0)).toFixed(2)}</span>
                        </div>
                        {parseFloat(String(orden.costo_envio || 0)) > 0 && (
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>Envío:</span>
                            <span>${parseFloat(String(orden.costo_envio || 0)).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-gray-600">
                          <span>Total:</span>
                          <span className="text-purple-400">
                            ${(parseFloat(String(orden.total || 0)) + parseFloat(String(orden.costo_envio || 0))).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer del Modal */}
            <div className="p-4 bg-gray-900/50 border-t border-gray-700">
              <button
                onClick={() => setShowHistorial(false)}
                className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
