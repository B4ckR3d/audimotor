'use client';

import { useEffect, useState } from 'react';
import ScrollReveal from './ScrollReveal';
import { useLang } from '@/contexts/LanguageContext';

interface Testimonial {
  id: number;
  customer_name: string;
  customer_avatar: string;
  rating: number;
  comment: string;
  car_purchased: string;
  is_active: boolean;
  sort_order: number;
}

export default function Testimonials() {
  const { t } = useLang();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch('/api/public/testimonials')
      .then(res => res.json())
      .then((data: Testimonial[]) => {
        setTestimonials(data);
      })
      .catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimoni" className="section-spacing bg-[var(--surface-1)] border-t border-[var(--border-1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="animate-fade-in-up" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-1)] mb-4">
            {t('testimonials.title')}
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--text-5)] to-transparent mx-auto"></div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((tItem, i) => (
            <ScrollReveal
              key={tItem.id}
              animation="animate-fade-in-up"
              delay={i * 150}
            >
              <div className="bg-[var(--surface-3)] border border-[var(--border-1)] p-6 hover:border-[var(--border-2)] transition-colors h-full card-hover">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: tItem.rating }).map((_, i) => (
                    <i key={i} className="fas fa-star text-[var(--accent)] text-sm"></i>
                  ))}
                  {Array.from({ length: 5 - tItem.rating }).map((_, i) => (
                    <i key={i} className="fas fa-star text-[var(--border-1)] text-sm"></i>
                  ))}
                </div>
                <p className="text-[var(--text-2)] text-sm leading-relaxed mb-6">
                  &ldquo;{tItem.comment}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--surface-4)] border border-[var(--border-1)] flex items-center justify-center overflow-hidden">
                    {tItem.customer_avatar ? (
                      <img src={tItem.customer_avatar} alt={tItem.customer_name} className="w-full h-full object-cover" />
                    ) : (
                      <i className="fas fa-user text-[var(--text-4)] text-sm"></i>
                    )}
                  </div>
                  <div>
                    <p className="text-[var(--text-1)] text-sm font-semibold">{tItem.customer_name}</p>
                    {tItem.car_purchased && (
                      <p className="text-[var(--text-4)] text-xs">{tItem.car_purchased}</p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
