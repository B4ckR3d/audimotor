'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLang } from '@/contexts/LanguageContext';
import { Car } from '@/types';

export default function CarsPage() {
  const { t } = useLang();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [favIds, setFavIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch('/api/cars')
      .then((r) => r.json())
      .then((data) => {
        setCars(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const brands = useMemo(
    () => ['all', ...Array.from(new Set(cars.map((c) => c.brand)))].sort((a, b) => a === 'all' ? -1 : b === 'all' ? 1 : a.localeCompare(b)),
    [cars]
  );

  const filtered = useMemo(() => {
    let result = [...cars];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q)
      );
    }

    if (brandFilter !== 'all') {
      result = result.filter((c) => c.brand === brandFilter);
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'year-desc':
        result.sort((a, b) => b.year - a.year);
        break;
      case 'year-asc':
        result.sort((a, b) => a.year - b.year);
        break;
      default:
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [cars, search, brandFilter, sortBy]);

  const toggleFav = (id: number) => {
    setFavIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(p);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 pb-20 bg-[var(--surface-1)]">
          <div className="flex items-center justify-center h-96">
            <i className="fas fa-spinner fa-spin text-3xl text-[var(--text-5)]"></i>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--surface-1)]">
        {/* -- Banner -- */}
        <div className="relative pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[var(--surface-1)]"></div>
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-semibold tracking-wider uppercase mb-4">
              {cars.length} {t('cars.units')}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--text-1)] mb-4">
              {t('cars.title')}
            </h1>
            <p className="text-[var(--text-4)] text-lg max-w-2xl mx-auto">
              {t('cars.subtitle')}
            </p>

            {/* Search bar */}
            <div className="relative max-w-lg mx-auto mt-8">
              <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-4)] text-sm"></i>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('cars.search')}
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[var(--surface-card)] border border-[var(--border-1)] text-sm text-[var(--text-1)] placeholder-[var(--text-4)] focus:outline-none focus:border-gray-500 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-4)] hover:text-[var(--text-1)] transition-colors">
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* -- Content -- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 rounded-2xl bg-[var(--surface-card)] border border-[var(--border-1)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold tracking-wider text-[var(--text-5)] uppercase mr-1">{t('cars.brand')}</span>
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setBrandFilter(b)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${brandFilter === b ? "bg-[var(--accent)] text-black" : "bg-[var(--surface-1)] text-[var(--text-3)] hover:text-[var(--text-1)]"}`}
                >
                  {b === 'all' ? t('cars.all') : b}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <i className="fas fa-sort text-[var(--text-5)] text-xs"></i>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[var(--surface-1)] border border-[var(--border-1)] rounded-lg px-3 py-2 text-xs font-medium text-[var(--text-3)] focus:outline-none focus:border-gray-500 cursor-pointer"
              >
                <option value="newest">{t('cars.sort.newest')}</option>
                <option value="price-asc">{t('cars.sort.priceAsc')}</option>
                <option value="price-desc">{t('cars.sort.priceDesc')}</option>
                <option value="year-desc">{t('cars.sort.yearDesc')}</option>
                <option value="year-asc">{t('cars.sort.yearAsc')}</option>
              </select>
            </div>
          </div>

          {/* Results info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-[var(--text-4)]">
              <span className="font-semibold text-[var(--text-1)]">{filtered.length}</span> {t('cars.found')}
            </p>
          </div>

          {/* Grid - Shopee/Tokopedia style */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto rounded-full border border-[var(--border-1)] bg-[var(--surface-card)] flex items-center justify-center mb-6">
                <i className="fas fa-car-side text-3xl text-[var(--text-4)]"></i>
              </div>
              <p className="text-[var(--text-4)] text-lg font-medium">{t('cars.empty')}</p>
              <p className="text-[var(--text-4)] text-sm mt-2">{t('cars.empty.sub')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((car, i) => (
                <div
                  key={car.id}
                  className="group bg-[var(--surface-card)] rounded-2xl overflow-hidden border border-[var(--border-1)] hover:border-gray-600/60 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${(i % 12) * 60}ms` }}
                >
                  {/* Image */}
                  <Link href={`/cars/${car.id}`} className="block relative aspect-[4/3] overflow-hidden">
                    <img
                      src={car.image_url || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Year badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-gray-700/50 text-xs font-bold text-white">
                      {car.year}
                    </span>

                    {/* Status badge */}
                    {car.status === 'sold' ? (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-red-500/70 backdrop-blur-sm text-xs font-bold text-white">
                        {t('car.sold')}
                      </span>
                    ) : car.is_featured ? (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-amber-500/70 backdrop-blur-sm text-xs font-bold text-white">
                        <i className="fas fa-star mr-1 text-[10px]"></i> {t('car.featured')}
                      </span>
                    ) : null}

                    {/* Wishlist button */}
                    <button
                      onClick={(e) => { e.preventDefault(); toggleFav(car.id); }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
                    >
                      <i className="fas fa-heart text-xs"></i>
                    </button>
                  </Link>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--text-5)] mb-0.5">{car.brand}</p>
                    <Link href={`/cars/${car.id}`}>
                      <h3 className="text-sm font-bold text-[var(--text-1)] leading-tight mb-1 hover:text-[var(--accent)] transition-colors line-clamp-1">
                        {car.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-[var(--text-5)] mb-2 line-clamp-1">{car.model} &middot; {car.color}</p>

                    {/* Price */}
                    <p className="text-base font-bold text-[var(--accent)] mb-3">
                      {formatPrice(car.price)}
                    </p>

                    {/* Specs row */}
                    <div className="flex items-center gap-3 text-[10px] text-[var(--text-4)] pb-3 mb-3 border-b border-[var(--border-1)]">
                      <span className="flex items-center gap-1">
                        <i className="fas fa-tachometer-alt text-[9px]"></i>
                        {car.mileage.toLocaleString('id-ID')} KM
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="fas fa-cogs text-[9px]"></i>
                        {car.transmission}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="fas fa-gas-pump text-[9px]"></i>
                        {car.fuel}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/cars/${car.id}`}
                        className="flex-1 px-3 py-2 rounded-lg bg-[var(--surface-1)] border border-[var(--border-1)] text-center text-[11px] font-semibold text-[var(--text-3)] hover:text-[var(--text-1)] hover:border-gray-600 transition-all"
                      >
                        <i className="fas fa-info-circle mr-1"></i> {t('cars.detail')}
                      </Link>
                      <a
                        href={`https://wa.me/6281234567890?text=Halo%20Audi%20Motor,%20saya%20tertarik%20dengan%20${encodeURIComponent(car.name)}%20tahun%20${car.year}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2 rounded-lg bg-green-600/20 border border-green-600/30 text-center text-[11px] font-semibold text-green-400 hover:bg-green-600/30 hover:border-green-500 transition-all"
                      >
                        <i className="fab fa-whatsapp mr-1"></i> {t('cars.wa')}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

