'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import PermissionGuard from '@/components/PermissionGuard';
import { useLang } from '@/contexts/LanguageContext';
import { Car } from '@/types';

interface Stats {
  total: number;
  available: number;
  sold: number;
  featured: number;
  totalValue: number;
}

export default function AdminPage() {
  const { t } = useLang();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ total: 0, available: 0, sold: 0, featured: 0, totalValue: 0 });

  const fetchCars = async () => {
    try {
      const res = await fetch('/api/cars');
      const data = await res.json();
      setCars(data);

      const total = data.length;
      const available = data.filter((c: Car) => c.status === 'available').length;
      const sold = data.filter((c: Car) => c.status === 'sold').length;
      const featured = data.filter((c: Car) => c.is_featured).length;
      const totalValue = data.reduce((sum: number, c: Car) => sum + c.price, 0);

      setStats({ total, available, sold, featured, totalValue });
    } catch (err) {
      console.error('Gagal mengambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm(t('dashboard.deleteConfirm'))) return;
    try {
      const res = await fetch(`/api/admin/cars/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCars();
      } else {
        alert('Gagal menghapus mobil');
      }
    } catch {
      alert('Gagal menghapus mobil');
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <PermissionGuard section="cars" action="read">
    <div className="flex min-h-screen bg-[var(--surface-1)]">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-[var(--text-1)]">{t('dashboard.title')}</h1>
              <p className="text-[var(--text-4)] text-sm mt-1">{t('dashboard.subtitle')}</p>
            </div>
            <Link
              href="/admin/add"
              className="btn-chrome px-5 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2"
            >
              <i className="fas fa-plus"></i> {t('dashboard.addCar')}
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <i className="fas fa-spinner fa-spin text-3xl text-[var(--text-5)]"></i>
              <p className="text-[var(--text-4)] mt-4">{t('dashboard.loading')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-[var(--surface-card)] rounded-xl border border-[var(--border-1)] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[var(--text-4)] text-sm">{t('dashboard.totalCars')}</span>
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <i className="fas fa-car text-blue-400"></i>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[var(--text-1)]">{stats.total}</p>
                  <p className="text-[var(--text-5)] text-xs mt-1">{t('dashboard.unitsRegistered')}</p>
                </div>

                <div className="bg-[var(--surface-card)] rounded-xl border border-[var(--border-1)] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[var(--text-4)] text-sm">{t('dashboard.available')}</span>
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <i className="fas fa-check-circle text-green-400"></i>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-green-400">{stats.available}</p>
                  <p className="text-[var(--text-5)] text-xs mt-1">{t('dashboard.readyToSell')}</p>
                </div>

                <div className="bg-[var(--surface-card)] rounded-xl border border-[var(--border-1)] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[var(--text-4)] text-sm">{t('dashboard.sold')}</span>
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <i className="fas fa-hand-holding-usd text-red-400"></i>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-red-400">{stats.sold}</p>
                  <p className="text-[var(--text-5)] text-xs mt-1">{t('dashboard.unitsSold')}</p>
                </div>

                <div className="bg-[var(--surface-card)] rounded-xl border border-[var(--border-1)] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[var(--text-4)] text-sm">{t('dashboard.totalValue')}</span>
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <i className="fas fa-coins text-amber-400"></i>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-[var(--text-1)]">{formatPrice(stats.totalValue)}</p>
                  <p className="text-[var(--text-5)] text-xs mt-1">{t('dashboard.inventoryValue')}</p>
                </div>
              </div>

              <div className="bg-[var(--surface-card)] rounded-xl border border-[var(--border-1)] overflow-hidden">
                <div className="p-6 border-b border-[var(--border-1)]">
                  <h2 className="text-lg font-bold text-[var(--text-1)]">{t('dashboard.inventory')}</h2>
                </div>
                {cars.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="fas fa-car-side text-4xl text-[var(--text-5)] mb-4"></i>
                    <p className="text-[var(--text-4)]">{t('dashboard.empty')}</p>
                    <Link href="/admin/add" className="btn-chrome inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm mt-4">
                      <i className="fas fa-plus"></i> {t('dashboard.addCar')}
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--border-1)] text-[var(--text-4)]">
                          <th className="text-left py-4 px-6 font-medium">{t('dashboard.table.car')}</th>
                          <th className="text-left py-4 px-6 font-medium">{t('dashboard.table.year')}</th>
                          <th className="text-left py-4 px-6 font-medium">{t('dashboard.table.price')}</th>
                          <th className="text-left py-4 px-6 font-medium">{t('dashboard.table.km')}</th>
                          <th className="text-left py-4 px-6 font-medium">{t('dashboard.table.status')}</th>
                          <th className="text-right py-4 px-6 font-medium">{t('dashboard.table.action')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cars.map((car) => (
                          <tr key={car.id} className="border-b border-[var(--border-1)] hover:bg-[var(--surface-2)]/50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <img
                                  src={car.image_url || '/placeholder-car.jpg'}
                                  alt={car.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                  <p className="text-[var(--text-1)] font-medium">{car.brand} {car.name}</p>
                                  <p className="text-[var(--text-5)] text-xs">{car.model}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-[var(--text-3)]">{car.year}</td>
                            <td className="py-4 px-6 text-[var(--text-1)] font-medium">{formatPrice(car.price)}</td>
                            <td className="py-4 px-6 text-[var(--text-3)]">{car.mileage.toLocaleString('id-ID')}</td>
                            <td className="py-4 px-6">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                car.status === 'available' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                                car.status === 'sold' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                                'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
                              }`}>
                                {car.status === 'available' ? t('dashboard.available') : car.status === 'sold' ? t('dashboard.sold') : t('dashboard.table.status')}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  href={`/admin/edit/${car.id}`}
                                  className="px-3 py-1.5 rounded border border-[var(--border-1)] text-[var(--text-3)] hover:text-[var(--text-1)] hover:border-[var(--text-5)] transition-colors text-xs"
                                >
                                  {t('dashboard.edit')}
                                </Link>
                                <button
                                  onClick={() => handleDelete(car.id)}
                                  className="px-3 py-1.5 rounded border border-red-900 text-red-400 hover:bg-red-900/30 transition-colors text-xs"
                                >
                                  {t('dashboard.delete')}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
    </PermissionGuard>
  );
}
