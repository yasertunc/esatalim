import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, MapPin, Tag } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  icon?: string;
}

interface SearchFiltersProps {
  categories?: Category[];
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  condition: string;
  city: string;
  sortBy: string;
}

const conditions = [
  { value: '', label: 'Tümü' },
  { value: 'new', label: 'Sıfır' },
  { value: 'like_new', label: 'Az Kullanılmış' },
  { value: 'good', label: 'İyi Durumda' },
  { value: 'fair', label: 'Orta Durumda' },
  { value: 'poor', label: 'Kötü Durumda' },
];

const cities = [
  '', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 
  'Gaziantep', 'Mersin', 'Kayseri', 'Eskişehir', 'Samsun', 'Denizli', 'Trabzon'
];

const sortOptions = [
  { value: 'createdAt:desc', label: 'En Yeni' },
  { value: 'createdAt:asc', label: 'En Eski' },
  { value: 'price:asc', label: 'Fiyat: Düşükten Yükseğe' },
  { value: 'price:desc', label: 'Fiyat: Yüksekten Düşüğe' },
  { value: 'views:desc', label: 'En Çok Görüntülenen' },
];

const SearchFilters: React.FC<SearchFiltersProps> = ({ categories = [], onFilterChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    condition: searchParams.get('condition') || '',
    city: searchParams.get('city') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt:desc',
  });

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
    onFilterChange?.(filters);
  }, [filters, setSearchParams, onFilterChange]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      city: '',
      sortBy: 'createdAt:desc',
    });
  };

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => value && key !== 'sortBy' && key !== 'search'
  ).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 lg:p-6 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Ürün, kategori veya marka ara..."
            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 focus:border-primary-500 transition-all"
          />
        </div>
        
        <div className="flex gap-3">
          {/* Sort Dropdown */}
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 focus:border-primary-500 transition-all min-w-[180px]"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-5 py-3.5 rounded-xl font-medium transition-all ${
              showFilters || activeFiltersCount > 0
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filtreler</span>
            {activeFiltersCount > 0 && (
              <span className="w-6 h-6 bg-white text-primary-600 rounded-full text-sm flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tag className="inline h-4 w-4 mr-1" />
                Kategori
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ürün Durumu
              </label>
              <select
                value={filters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all"
              >
                {conditions.map(cond => (
                  <option key={cond.value} value={cond.value}>{cond.label}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fiyat Aralığı
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Şehir
              </label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all"
              >
                <option value="">Tüm Şehirler</option>
                {cities.filter(c => c).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium flex items-center"
            >
              {showMoreFilters ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Daha Az Filtre
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Daha Fazla Filtre
                </>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center text-red-600 dark:text-red-400 hover:text-red-700 font-medium"
              >
                <X className="h-4 w-4 mr-1" />
                Filtreleri Temizle
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Tags */}
      {activeFiltersCount > 0 && !showFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.category && (
            <span className="inline-flex items-center px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
              Kategori
              <button onClick={() => handleFilterChange('category', '')} className="ml-2">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.condition && (
            <span className="inline-flex items-center px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
              {conditions.find(c => c.value === filters.condition)?.label}
              <button onClick={() => handleFilterChange('condition', '')} className="ml-2">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <span className="inline-flex items-center px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
              {filters.minPrice || '0'} - {filters.maxPrice || '∞'} ₺
              <button onClick={() => { handleFilterChange('minPrice', ''); handleFilterChange('maxPrice', ''); }} className="ml-2">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.city && (
            <span className="inline-flex items-center px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
              {filters.city}
              <button onClick={() => handleFilterChange('city', '')} className="ml-2">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
