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

interface ProductCardProps {
  producto: Producto;
  onAddToCart: (producto: Producto) => void;
  onViewDetails: (producto: Producto) => void;
}

export default function ProductCard({ producto, onAddToCart, onViewDetails }: ProductCardProps) {
  return (
    <div
      className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-gray-800/70"
      onClick={() => onViewDetails(producto)}
    >
      {/* Stock Badge */}
      {producto.cantidad === 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold z-10">
          Agotado
        </div>
      )}
      
      {/* Product Image */}
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
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
          <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <circle cx="8" cy="10" r="2" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 text-white">
            <p className="text-sm font-medium">Ver detalles</p>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        {/* Brand */}
        {producto.marca?.nombre && (
          <span className="inline-block text-xs font-medium text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">
            {producto.marca.nombre}
          </span>
        )}
        
        {/* Name */}
        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
          {producto.nombre}
        </h3>
        
        {/* Description */}
        {producto.descripcion && (
          <p className="text-sm text-gray-400 line-clamp-2">
            {producto.descripcion}
          </p>
        )}
        
        {/* Price and Stock */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            ${producto.precio}
          </div>
          <div className="text-sm text-gray-400">
            Stock: {producto.cantidad}
          </div>
        </div>
        
        {/* Action Button */}
        <button
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
            producto.cantidad === 0
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(producto);
          }}
          disabled={producto.cantidad === 0}
        >
          {producto.cantidad === 0 ? 'Sin Stock' : 'Añadir al Carrito'}
        </button>
      </div>
    </div>
  );
}