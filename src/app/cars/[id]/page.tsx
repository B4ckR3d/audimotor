'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLang } from '@/contexts/LanguageContext';
import { Car } from '@/types';

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLang();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/cars/${id}`)
      .then(res => res.json())
      .then(data => {
        setCar(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-32 pb-20 bg-[var(--surface-1)] flex items-center justify-center">
          <i className="fas fa-spinner fa-spin text-3xl text-[var(--text-5)]"></i>
        </main>
        <Footer />
      </>
    );
  }

  if (!car) {
    return <>{notFound()}</>;
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const fuelIcon = car.fuel.toLowerCase().includes('hybrid') ? 'fa-leaf' : 'fa-gas-pump';

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-20 bg-[var(--surface-1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/#koleksi" className="inline-flex items-center gap-2 text-[var(--text-4)] hover:text-[var(--text-1)] mb-8 transition-colors">
            <i className="fas fa-arrow-left"></i> {t('car.back')}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden border-glow">
              <img src={car.image_url} alt={car.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded text-sm font-bold text-[var(--text-1)] border border-[var(--border-1)]">
                {car.is_featured ? t('car.featured') : t('car.available')}
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-display font-bold text-[var(--text-1)] mb-2">
                {car.brand} {car.name}
              </h1>
              <p className="text-[var(--text-4)] text-lg mb-6">{car.model} - {car.year}</p>

              <div className="text-3xl font-bold text-[var(--text-1)] mb-8">
                {formatPrice(car.price)}
                <p className="text-sm text-[var(--text-5)] font-normal mt-1">{t('car.cashPrice')}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: t('car.specs.km'), value: `${car.mileage.toLocaleString('id-ID')} KM`, icon: 'fa-tachometer-alt' },
                  { label: t('car.specs.transmission'), value: car.transmission, icon: 'fa-cogs' },
                  { label: t('car.specs.fuel'), value: car.fuel, icon: fuelIcon },
                  { label: t('car.specs.color'), value: car.color, icon: 'fa-palette' },
                ].map((item, i) => (
                  <div key={i} className="bg-[var(--surface-card)] p-4 rounded-xl border border-[var(--border-1)]">
                    <i className={`fas ${item.icon} text-[var(--text-5)]`}></i>
                    <p className="text-xs text-[var(--text-5)] mb-1">{item.label}</p>
                    <p className="text-[var(--text-1)] font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>

              {car.description && (
                <div className="mb-8">
                  <h3 className="text-[var(--text-1)] font-bold mb-3 font-display">{t('car.description')}</h3>
                  <p className="text-[var(--text-4)] text-sm leading-relaxed">{car.description}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`https://wa.me/6281234567890?text=Halo%20Audi%20Motor,%20saya%20tertarik%20dengan%20${car.brand}%20${car.name}%20tahun%20${car.year}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-chrome px-8 py-4 rounded-md font-semibold text-center tracking-wide text-sm flex items-center justify-center gap-2"
                >
                  <i className="fab fa-whatsapp text-lg"></i> {t('car.whatsapp')}
                </a>
                <a href="tel:0215550123" className="px-8 py-4 rounded-md border border-[var(--border-2)] hover:border-[var(--text-4)] text-[var(--text-1)] font-semibold text-center tracking-wide text-sm transition-colors flex items-center justify-center gap-2">
                  <i className="fas fa-phone-alt"></i> {t('car.phone')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
