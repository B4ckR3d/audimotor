'use client';

import Link from 'next/link';
import { Car } from '@/types';
import CarCard from './CarCard';
import { useLang } from '@/contexts/LanguageContext';

interface CarGridProps {
  cars: Car[];
}

const MAX_HOMEPAGE = 6;

export default function CarGrid({ cars }: CarGridProps) {
  const { t } = useLang();
  if (cars.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto rounded-full border border-[var(--border-1)] bg-[var(--surface-card)] flex items-center justify-center mb-6">
          <i className="fas fa-car-side text-3xl text-[var(--text-4)]"></i>
        </div>
        <p className="text-[var(--text-4)] text-lg font-medium">{t('catalog.empty')}</p>
        <p className="text-[var(--text-4)] text-sm mt-2">{t('catalog.empty.sub')}</p>
      </div>
    );
  }
  const showMore = cars.length > MAX_HOMEPAGE;
  const displayCars = showMore ? cars.slice(0, MAX_HOMEPAGE) : cars;
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayCars.map((car, index) => (
          <div
            key={car.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${(index % MAX_HOMEPAGE) * 80}ms` }}
          >
            <CarCard car={car} />
          </div>
        ))}
      </div>
      {showMore && (
        <div className="flex justify-center mt-16">
          <Link
            href="/cars"
            className="group relative px-10 py-4 rounded-xl border border-[var(--border-1)] bg-[var(--surface-card)] hover:border-gray-500 transition-all duration-300 text-sm font-semibold tracking-wide text-[var(--text-3)] hover:text-[var(--text-1)] flex items-center gap-3 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-gray-800/0 via-gray-800/50 to-gray-800/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <span className="relative">{t('catalog.seeAll')}</span>
            <i className="fas fa-arrow-right relative text-xs group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>
      )}
    </div>
  );
}