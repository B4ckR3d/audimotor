'use client';

import { useEffect, useState } from 'react';
import { Promotion } from '@/types';
import { useLang } from '@/contexts/LanguageContext';

export default function PromotionsSection() {
  const { t } = useLang();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/promotions')
      .then(r => r.json())
      .then(d => setPromotions(d))
      .catch(() => setPromotions([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (promotions.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promotions.length]);

  if (loading) return null;
  if (promotions.length === 0) return null;

  const isValid = (d: string) => d && d !== 'null' && !isNaN(Date.parse(d));

  return (
    <section className="py-24 bg-[var(--surface-1)] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent)]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-[var(--accent)] text-sm tracking-[0.2em] uppercase font-semibold mb-4">Promotions</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--text-1)]">
            {t('promotions.title')}
          </h2>
          <div className="w-16 h-0.5 bg-[var(--accent)] mx-auto mt-6"></div>
        </div>

        <div className="relative">
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((p, i) => (
              <div
                key={p.id}
                className="group relative bg-gradient-to-b from-[#151518] to-[#101012] rounded-2xl border border-[var(--border-1)] hover:border-[var(--accent)]/40 transition-all duration-500 overflow-hidden"
              >
                {/* Image */}
                {p.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                    {p.discount_text && (
                      <div className="absolute top-3 left-3 bg-[var(--accent)] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {p.discount_text}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101012] to-transparent" />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-[var(--text-1)] font-bold text-lg mb-2 font-display">{p.title}</h3>
                  {p.description && (
                    <p className="text-[var(--text-4)] text-sm leading-relaxed mb-4">{p.description}</p>
                  )}
                  {isValid(p.start_date) && isValid(p.end_date) && (
                    <div className="flex items-center gap-2 text-xs text-[var(--text-4)]">
                      <i className="fas fa-calendar-alt text-[var(--accent)]"></i>
                      {new Date(p.start_date).toLocaleDateString('id-ID')} - {new Date(p.end_date).toLocaleDateString('id-ID')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Dots nav */}
          {promotions.length > 3 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: Math.min(promotions.length, 6) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
