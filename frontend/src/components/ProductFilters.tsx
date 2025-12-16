"use client";
import { useState } from "react";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";

interface Marca {
  nombre: string;
}

interface Categoria {
  nombre: string;
}

interface ProductFiltersProps {
  marcas: Marca[];
  categorias: Categoria[];
  onFilterChange: (filters: FilterState) => void;
  productCount: number;
}

export interface FilterState {
  searchTerm: string;
  selectedMarca: string;
  selectedCategoria: string;
  priceRange: [number, number];
  sortBy: 'nombre' | 'precio-asc' | 'precio-desc' | 'stock';
  onlyAvailable: boolean;
}

export default function ProductFilters({ 
  marcas, 
  categorias, 
  onFilterChange, 
  productCount 
}: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedMarca: "",
    selectedCategoria: "",
    priceRange: [0, 10000],
    sortBy: 'nombre',
    onlyAvailable: false
  });

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetState: FilterState = {
      searchTerm: "",
      selectedMarca: "",
      selectedCategoria: "",
      priceRange: [0, 10000],
      sortBy: 'nombre',
      onlyAvailable: false
    };
    setFilters(resetState);
    onFilterChange(resetState);
  };

  const hasActiveFilters = 
    filters.searchTerm !== "" || 
    filters.selectedMarca !== "" || 
    filters.selectedCategoria !== "" || 
    filters.priceRange[0] !== 0 || 
    filters.priceRange[1] !== 10000 ||
    filters.onlyAvailable;

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos por nombre..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            showFilters || hasActiveFilters
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700'
          }`}
        >
          <FunnelIcon className="w-5 h-5" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
              ●
            </span>
          )}
        </button>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          <span className="text-white font-semibold">{productCount}</span> productos encontrados
        </p>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-6 animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <AdjustmentsHorizontalIcon className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Filtros Avanzados</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Marca Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Marca
              </label>
              <div className="relative">
                <select
                  value={filters.selectedMarca}
                  onChange={(e) => updateFilter('selectedMarca', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Todas las marcas</option>
                  {marcas.map((marca, index) => (
                    <option key={index} value={marca.nombre}>
                      {marca.nombre}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Categoria Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoría
              </label>
              <div className="relative">
                <select
                  value={filters.selectedCategoria}
                  onChange={(e) => updateFilter('selectedCategoria', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((categoria, index) => (
                    <option key={index} value={categoria.nombre}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ordenar por
              </label>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value as FilterState['sortBy'])}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="nombre">Nombre (A-Z)</option>
                  <option value="precio-asc">Precio: Menor a Mayor</option>
                  <option value="precio-desc">Precio: Mayor a Menor</option>
                  <option value="stock">Stock Disponible</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Disponibilidad
              </label>
              <label className="flex items-center gap-3 px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 transition-all">
                <input
                  type="checkbox"
                  checked={filters.onlyAvailable}
                  onChange={(e) => updateFilter('onlyAvailable', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-white text-sm">Solo disponibles</span>
              </label>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Rango de precio: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) => updateFilter('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                className="w-32 px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                className="w-32 px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
