'use client';

import { useEffect, useState } from 'react';
import { GalleryItem } from '@/types';
import { useLang } from '@/contexts/LanguageContext';

export default function GallerySection() {
  const { t } = useLang();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch('/api/public/gallery')
      .then(r => r.json())
      .then(d => setItems(d))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-[var(--surface-1)]">
        <div className="max-w-7xl mx-auto px-4 text-center text-[var(--text-4)]">
          <i className="fas fa-spinner fa-spin text-3xl"></i>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <>
      <section id="gallery" className="py-24 bg-[var(--surface-1)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cpath d=M30 5 L55 17.5 L55 42.5 L30 55 L5 42.5 L5 17.5 Z fill=none stroke=white stroke-width=0.5/%3E%3C/svg%3E")',
          backgroundSize: '60px 60px'
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-[var(--accent)] text-sm tracking-[0.2em] uppercase font-semibold mb-4">Our Gallery</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--text-1)]">
              {t('gallery.title')}
            </h2>
            <div className="w-16 h-0.5 bg-[var(--accent)] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setLightbox(item)}
                className="group relative overflow-hidden rounded-xl border border-[var(--border-1)] hover:border-[var(--accent)]/50 transition-all duration-500 cursor-pointer text-left"
                style={{ aspectRatio: i % 3 === 0 ? '4/3' : '3/4' }}
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-[var(--text-1)] font-bold text-lg">{item.title}</h3>
                  {item.description && (
                    <p className="text-[var(--text-4)] text-sm mt-1">{item.description}</p>
                  )}
                  <span className="inline-block text-[var(--accent)] text-xs uppercase tracking-wider mt-2 font-semibold">
                    {item.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-[var(--text-1)]/60 hover:text-[var(--text-1)] text-2xl transition-colors z-10"
          >
            <i className="fas fa-times"></i>
          </button>
          <div
            className="max-w-5xl max-h-[90vh] relative"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={lightbox.image_url}
              alt={lightbox.title}
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
            <div className="text-center mt-4">
              <h3 className="text-[var(--text-1)] text-xl font-bold">{lightbox.title}</h3>
              {lightbox.description && (
                <p className="text-[var(--text-4)] mt-1">{lightbox.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
