'use client';

import { useLang } from '@/contexts/LanguageContext';

export default function Features() {
  const { t } = useLang();
  const features = [
    {
      icon: 'fa-shield-alt',
      title: t('features.1.title'),
      desc: t('features.1.desc'),
    },
    {
      icon: 'fa-file-contract',
      title: t('features.2.title'),
      desc: t('features.2.desc'),
    },
    {
      icon: 'fa-hand-holding-usd',
      title: t('features.3.title'),
      desc: t('features.3.desc'),
    },
  ];

  return (
    <section id="tentang" className="py-20 bg-[var(--surface-2)] border-t border-b border-[var(--border-1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-1)] mb-4">
            {t('features.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-700 to-gray-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="border-glow bg-[var(--surface-1)] p-8 rounded-xl text-center group"
            >
              <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className={`fas ${f.icon} text-2xl text-[var(--text-3)] group-hover:text-[var(--text-1)] transition-colors`}></i>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-1)] mb-3">{f.title}</h3>
              <p className="text-[var(--text-4)] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
