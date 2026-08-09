'use client';

import ScrollReveal from './ScrollReveal';
import { useLang } from '@/contexts/LanguageContext';

export default function CatalogHeader() {
  const { t } = useLang();

  return (
    <ScrollReveal animation="animate-fade-in-up" className="flex flex-col md:flex-row justify-between items-end mb-16">
      <div>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-1)] mb-4">
          {t('catalog.title')}
        </h2>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--text-5)] to-transparent mb-4"></div>
        <p className="text-[var(--text-3)] max-w-2xl text-sm md:text-base">
          {t('catalog.subtitle')}
        </p>
      </div>
    </ScrollReveal>
  );
}
