'use client';

import { useState } from 'react';
import { Car } from '@/types';
import CarGrid from './CarGrid';
import { useLang } from '@/contexts/LanguageContext';

interface CarCatalogProps {
  cars: Car[];
}

const ALL = 'all';

export default function CarCatalog({ cars }: CarCatalogProps) {
  const { t } = useLang();
  const [selectedBrand, setSelectedBrand] = useState(ALL);
  const [searchQuery, setSearchQuery] = useState('');

  const brands = [ALL, ...Array.from(new Set(cars.map((c) => c.brand)))].sort((a, b) => {
    if (a === ALL) return -1;
    if (b === ALL) return 1;
    return a.localeCompare(b);
  });

  const filteredCars = cars.filter((car) => {
    const matchBrand = selectedBrand === ALL || car.brand === selectedBrand;
    const matchSearch =
      searchQuery === '' ||
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBrand && matchSearch;
  });

  return (
    <div>
      {/* Search + Brand Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
        {/* Search bar */}
        <div className="relative flex-1 w-full max-w-md">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-4)] text-sm"></i>
          <input
            type="text"
            placeholder={t('catalog.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-1)] text-sm text-[var(--text-1)] placeholder-[var(--text-4)] focus:outline-none focus:border-gray-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-4)] hover:text-[var(--text-1)] transition-colors"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          )}
        </div>

        {/* Brand pills */}
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => setSelectedBrand(brand)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                selectedBrand === brand
                  ? 'bg-white text-black'
                  : 'bg-[var(--surface-card)] text-[var(--text-4)] border border-[var(--border-1)] hover:border-gray-600 hover:text-[var(--text-1)]'
              }`}
            >
              {brand === ALL ? t('catalog.all') : brand}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {filteredCars.length > 0 && (
        <p className="text-[var(--text-4)] text-sm mb-6">
          {t('catalog.showing')
            .replace('{shown}', filteredCars.length.toString())
            .replace('{total}', cars.length.toString())}
        </p>
      )}

      <CarGrid cars={filteredCars} />
    </div>
  );
}
