'use client';

import ScrollReveal from './ScrollReveal';
import { useLang } from '@/contexts/LanguageContext';

interface StatsBarProps {
  totalUnits: number;
  brands: string[];
}

export default function StatsBar({ totalUnits, brands }: StatsBarProps) {
  const { t } = useLang();
  const stats = [
    { value: `${totalUnits}+`, label: t('stats.units') },
    { value: `${brands.length}`, label: t('stats.brands') },
    { value: '150+', label: t('stats.inspection') },
    { value: '100%', label: t('stats.legal') },
  ];

  return (
    <section className="py-12 bg-[var(--surface-1)] border-b border-[var(--border-1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <ScrollReveal
              key={i}
              animation="animate-scale-in"
              delay={i * 100}
            >
              <div className="text-center p-6 bg-[var(--surface-3)] border border-[var(--border-1)] group hover:border-[var(--border-2)] transition-colors">
                <p className="text-3xl font-bold text-[var(--text-1)] mb-1 text-chrome-shimmer">{s.value}</p>
                <p className="text-[10px] text-[var(--text-5)] tracking-[0.2em] uppercase">{s.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
