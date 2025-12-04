"use client";

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  tipo_producto: string;
  marca?: { nombre: string };
  categoria?: { nombre: string };
}

interface ProductModalProps {
  producto: Producto | null;
  onClose: () => void;
  onAddToCart: (producto: Producto) => void;
}

export default function ProductModal({ producto, onClose, onAddToCart }: ProductModalProps) {
  if (!producto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full relative border border-gray-700/50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-700 hover:bg-red-500 text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 group"
          aria-label="Cerrar"
        >
          <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center">
          {/* Product Image */}
          <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl overflow-hidden mb-6 shadow-xl">
            {producto.imagen ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={producto.imagen} 
                alt={producto.nombre} 
                className="w-full h-full object-cover"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`${producto.imagen ? 'hidden' : 'flex'} w-full h-full items-center justify-center`}>
              <svg className="w-20 h-20 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <circle cx="8" cy="10" r="2" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          </div>

          {/* Product Details */}
          <div className="text-center w-full space-y-4">
            {/* Brand */}
            {producto.marca?.nombre && (
              <span className="inline-block text-sm font-medium text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">
                {producto.marca.nombre}
              </span>
            )}

            {/* Name */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {producto.nombre}
            </h2>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed">
              {producto.descripcion || "Sin descripción disponible"}
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="bg-gray-800/50 rounded-xl p-3">
                <p className="text-gray-400 text-sm">Categoría</p>
                <p className="text-white font-medium">{producto.categoria?.nombre || "N/A"}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3">
                <p className="text-gray-400 text-sm">Stock</p>
                <p className="text-white font-medium">{producto.cantidad}</p>
              </div>
            </div>

            {/* Price */}
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm mb-2">Precio</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                ${producto.precio}
              </p>
            </div>

            {/* Add to Cart Button */}
            <button
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                producto.cantidad === 0
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl'
              }`}
              onClick={() => {
                onAddToCart(producto);
                onClose();
              }}
              disabled={producto.cantidad === 0}
            >
              {producto.cantidad === 0 ? 'Producto Agotado' : 'Añadir al Carrito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}