'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useLang } from '@/contexts/LanguageContext';

interface HeroData {
  title: string;
  subtitle: string;
  badge: string;
  button_primary_text: string;
  button_primary_link: string;
  button_secondary_text: string;
  button_secondary_link: string;
  background_image: string;
  background_video: string;
}

interface CarSlide {
  image_url: string;
  name: string;
}

const defaultHero: HeroData = {
  title: 'Masa Depan Keluarga Anda Dimulai di Sini.',
  subtitle: 'Kami menghadirkan koleksi mobil bekas premium, terawat, dan berkualitas tinggi khusus untuk kenyamanan dan keamanan perjalanan keluarga Anda.',
  badge: 'Dealer Mobil Keluarga Terpercaya',
  button_primary_text: 'Lihat Koleksi',
  button_primary_link: '/#koleksi',
  button_secondary_text: 'Konsultasi WA',
  button_secondary_link: 'https://wa.me/6281329400272',
  background_image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  background_video: '',
};

export default function Hero() {
  const { lang, t } = useLang();
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [slides, setSlides] = useState<CarSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/hero').then(r => r.json()).catch(() => null),
      fetch('/api/public/gallery').then(r => r.json()).catch(() => []),
    ]).then(([heroData, galleryData]) => {
      if (heroData) setHero(heroData);
      const bgImages: CarSlide[] = [];
      if (galleryData.length > 0) {
        galleryData.forEach((g: any) => {
          bgImages.push({ image_url: g.image_url, name: g.title || 'Showroom' });
        });
      }
      if (bgImages.length === 0) {
        bgImages.push({ image_url: heroData?.background_image || defaultHero.background_image, name: '' });
      }
      setSlides(bgImages);
    });
    setTimeout(() => setLoaded(true), 100);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = useCallback((i: number) => setCurrentSlide(i), []);

  const badgeText = lang === 'en' ? t('hero.badge') : (hero.badge || t('hero.badge'));
  const titleText = lang === 'en' ? t('hero.title') : (hero.title || t('hero.title'));
  const subtitleText = lang === 'en' ? t('hero.subtitle') : (hero.subtitle || t('hero.subtitle'));
  const primaryBtnText = lang === 'en' ? t('hero.btn.collection') : (hero.button_primary_text || t('hero.btn.collection'));
  const secondaryBtnText = lang === 'en' ? t('hero.btn.consult') : (hero.button_secondary_text || t('hero.btn.consult'));

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-all duration-[1500ms] ease-in-out"
            style={{
              opacity: i === currentSlide ? 1 : 0,
              transform: i === currentSlide ? 'scale(1)' : 'scale(1.1)',
            }}
          >
            <img
              src={slide.image_url}
              alt={slide.name || 'Showroom'}
              className="w-full h-full object-cover opacity-25 filter grayscale"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-1)] via-[var(--surface-1)]/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface-1)] via-transparent to-transparent"></div>
        <div className="absolute inset-0 shadow-[inset_0_-200px_200px_rgba(0,0,0,0.5)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-40">
        <div className="max-w-3xl">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border-2)] bg-[var(--surface-3)]/50 backdrop-blur-sm mb-8 transition-all duration-700 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] text-[var(--text-3)] font-medium tracking-[0.2em] uppercase">
              {badgeText}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-[1.1] mb-8 text-[var(--text-1)] whitespace-pre-line">
            {titleText.split(' ').map((word, i) => (
              <span
                key={i}
                className="inline-block mr-[0.25em] transition-all duration-700"
                style={{
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? 'translateY(0)' : 'translateY(50px)',
                  transitionDelay: `${200 + i * 60}ms`,
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          <p
            className={`text-base sm:text-lg text-[var(--text-3)] mb-10 max-w-xl font-light leading-relaxed transition-all duration-700 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            {subtitleText}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={hero.button_primary_link}
              className={`btn-accent px-8 py-4 text-xs uppercase tracking-[0.15em] text-center flex items-center justify-center gap-3 transition-all duration-700 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              {primaryBtnText} <i className="fas fa-arrow-right text-[10px]"></i>
            </Link>
            <a
              href={hero.button_secondary_link}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-outline px-8 py-4 text-xs uppercase tracking-[0.15em] text-center flex items-center justify-center gap-3 transition-all duration-700 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '900ms' }}
            >
              <i className="fab fa-whatsapp text-green-500 text-base"></i> {secondaryBtnText}
            </a>
          </div>
        </div>
      </div>


      {slides.length > 1 && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`transition-all duration-500 ${
                i === currentSlide
                  ? 'w-10 h-1 bg-[var(--accent)]'
                  : 'w-4 h-1 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--surface-1)] to-transparent z-10"></div>
    </section>
  );
}
