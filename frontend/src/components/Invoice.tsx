'use client';

import { useCartStore } from '@/store/cartStore';

interface InvoiceProps {
  deliveryOption?: {
    type: string;
    description: string;
    cost: number;
  };
}

export default function Invoice({ deliveryOption }: InvoiceProps) {
  const { products, total } = useCartStore();
  const currentDate = new Date();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDeliveryDescription = (type: string) => {
    switch (type) {
      case 'normal':
        return 'Entrega normal (2 a 3 días)';
      case 'platino':
        return 'Entrega platino (1 día)';
      case 'oro':
        return 'Entrega oro (siguientes horas)';
      default:
        return 'Entrega normal';
    }
  };

  const subtotal = total();
  const deliveryCost = deliveryOption?.cost || 0;
  const totalWithDelivery = subtotal + deliveryCost;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">SCAM</h1>
        <p className="text-gray-600">Factura de Compra</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Fecha:</span>
          <span className="font-semibold">
            {formatDate(currentDate)}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Número de Factura:</span>
          <span className="font-semibold">
            {`FAC-${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Detalles de la Compra</h2>
        <div className="border-t border-b border-gray-200">
          <div className="grid grid-cols-12 py-2 font-semibold text-sm">
            <div className="col-span-6">Producto</div>
            <div className="col-span-2 text-center">Cantidad</div>
            <div className="col-span-2 text-right">Precio</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          {products.map((product) => (
            <div key={product.id_producto} className="grid grid-cols-12 py-2 text-sm">
              <div className="col-span-6">
                <div className="font-medium">{product.nombre}</div>
                <div className="text-gray-600 text-xs">{product.marca?.nombre}</div>
              </div>
              <div className="col-span-2 text-center">{product.cantidad}</div>
              <div className="col-span-2 text-right">${product.precio.toFixed(2)}</div>
              <div className="col-span-2 text-right">${(product.precio * product.cantidad).toFixed(2)}</div>
            </div>
          ))}
          
          {deliveryOption && (
            <div className="grid grid-cols-12 py-2 text-sm border-t border-gray-200">
              <div className="col-span-6">
                <div className="font-medium">Envío</div>
                <div className="text-gray-600 text-xs">{getDeliveryDescription(deliveryOption.type)}</div>
              </div>
              <div className="col-span-2 text-center">1</div>
              <div className="col-span-2 text-right">${deliveryOption.cost.toFixed(2)}</div>
              <div className="col-span-2 text-right">${deliveryOption.cost.toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {deliveryOption && (
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Costo de envío:</span>
            <span>${deliveryCost.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold mt-4">
          <span>Total:</span>
          <span>${totalWithDelivery.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>¡Gracias por tu compra!</p>
        <p>Para cualquier consulta, contáctanos al 123-456-789</p>
      </div>
    </div>
  );
} 