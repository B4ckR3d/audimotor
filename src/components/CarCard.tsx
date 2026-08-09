'use client';

import Link from 'next/link';
import { Car } from '@/types';
import { useLang } from '@/contexts/LanguageContext';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const { t } = useLang();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const fuelIcon = car.fuel.toLowerCase().includes('hybrid') ? 'fa-leaf' : 'fa-gas-pump';
  const fuelColor = car.fuel.toLowerCase().includes('hybrid') ? 'text-green-500' : 'text-gray-500';

  return (
    <Link href={`/cars/${car.id}`} className="block group">
      <div className="bg-[var(--surface-card)] rounded-2xl overflow-hidden border border-[var(--border-1)] hover:border-gray-600/60 transition-all duration-500 flex flex-col hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1">
        <div className="relative h-56 overflow-hidden">
          <img
            src={car.image_url || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
            alt={car.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out filter grayscale group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Status badge */}
          <div className="absolute top-4 right-4">
            {car.is_featured ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 backdrop-blur-md text-xs font-bold text-amber-400">
                <i className="fas fa-star text-[10px]"></i> {t('car.featured')}
              </span>
            ) : car.status === 'sold' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 backdrop-blur-md text-xs font-bold text-red-400">
                <i className="fas fa-times-circle text-[10px]"></i> {t('car.sold')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-md text-xs font-bold text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> {t('car.available')}
              </span>
            )}
          </div>

          {/* Year badge */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-gray-700/50 text-xs font-bold text-[var(--text-1)]">
            {car.year}
          </div>
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <div className="mb-1">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[var(--text-5)] mb-1">{car.brand}</p>
            <h3 className="text-lg font-bold text-[var(--text-1)] font-display leading-tight">{car.name}</h3>
          </div>
          <p className="text-[var(--text-5)] text-sm mb-4">{car.model} &middot; {car.color}</p>

          <div className="grid grid-cols-3 gap-0 mb-5 mt-auto">
            <div className="text-center px-2 py-3 rounded-lg bg-[#1c1c20]">
              <i className="fas fa-tachometer-alt text-[var(--text-4)] mb-1.5 text-xs"></i>
              <p className="text-[11px] text-[var(--text-4)] font-medium">{car.mileage.toLocaleString('id-ID')} <span className="text-[var(--text-4)]">{t('car.km')}</span></p>
            </div>
            <div className="text-center px-2 py-3 rounded-lg bg-[#1c1c20]">
              <i className="fas fa-cogs text-[var(--text-4)] mb-1.5 text-xs"></i>
              <p className="text-[11px] text-[var(--text-4)] font-medium">{car.transmission}</p>
            </div>
            <div className="text-center px-2 py-3 rounded-lg bg-[#1c1c20]">
              <i className={`fas ${fuelIcon} ${fuelColor} mb-1.5 text-xs`}></i>
              <p className="text-[11px] text-[var(--text-4)] font-medium">{car.fuel}</p>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-[var(--text-4)] mb-0.5 uppercase tracking-wider">{t('car.cashPrice')}</p>
              <p className="text-lg font-bold text-[var(--text-1)] tracking-tight">{formatPrice(car.price)}</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center group-hover:bg-[var(--text-1)] group-hover:text-black group-hover:border-[var(--text-1)] transition-all duration-300">
              <i className="fas fa-arrow-right text-xs"></i>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
