export interface Producto {
    id: number;
    nombre: string;
    // Añadir otros campos del producto si son necesarios para la interfaz de Orden
    precio?: number; // Si el precio se incluye en el detalle de la orden
}

export interface DetalleOrden {
    id: number;
    orden_id: number;
    producto_id: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    Producto: Producto | null; // Incluir la información del producto asociado
}

export interface User {
    id: number;
    nombre: string;
    correo: string;
    // Añadir otros campos del usuario si son necesarios para la interfaz de Orden
}

export interface Orden {
    id: number;
    usuario_id: number;
    total: number;
    estado: 'pendiente' | 'entregado';
    fecha_orden: string; // Asegurarnos de que el nombre del campo coincide con el backend
    User: User | null; // Mantenemos esto por ahora, aunque no lo usaremos para mostrar el ID
    DetalleOrdens: DetalleOrden[] | null; // Los detalles pueden ser null o un array vacío
    // Añadir otros campos de la orden si son necesarios (fecha_pago, metodo_pago, etc.)
} 