'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLang();
  const [brandName, setBrandName] = useState('Audi Motor');
  const [brandLogo, setBrandLogo] = useState('');

  useEffect(() => {
    fetch('/api/public/settings')
      .then(res => res.json())
      .then(data => {
        if (data.brand_name) setBrandName(data.brand_name);
        if (data.brand_logo_url) setBrandLogo(data.brand_logo_url);
      })
      .catch(() => {});
  }, []);

  return (
    <footer id="kontak" className="bg-[var(--surface-2)] border-t border-[var(--border-1)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center bg-gray-900 overflow-hidden">
                {brandLogo ? (
                  <img src={brandLogo} alt={brandName} className="w-full h-full object-cover" />
                ) : (
                  <i className="fas fa-car-side text-[var(--text-4)]"></i>
                )}
              </div>
              <span className="font-display font-bold text-xl text-chrome-effect uppercase">{brandName}</span>
            </div>
            <p className="text-[var(--text-4)] text-sm leading-relaxed max-w-sm mb-6">
              {t('footer.desc')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded bg-gray-900 border border-[var(--border-1)] flex items-center justify-center text-[var(--text-4)] hover:text-[var(--text-1)] hover:border-gray-500 transition-all">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded bg-gray-900 border border-[var(--border-1)] flex items-center justify-center text-[var(--text-4)] hover:text-[var(--text-1)] hover:border-gray-500 transition-all">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded bg-gray-900 border border-[var(--border-1)] flex items-center justify-center text-[var(--text-4)] hover:text-[var(--text-1)] hover:border-gray-500 transition-all">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[var(--text-1)] font-bold mb-6 font-display">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              <li><Link href="/#koleksi" className="text-[var(--text-4)] hover:text-[var(--text-1)] text-sm transition-colors">{t('footer.collection')}</Link></li>
              <li><Link href="/admin" className="text-[var(--text-4)] hover:text-[var(--text-1)] text-sm transition-colors">{t('footer.credit')}</Link></li>
              <li><span className="text-[var(--text-4)] text-sm transition-colors">{t('footer.consignment')}</span></li>
              <li><Link href="/#tentang" className="text-[var(--text-4)] hover:text-[var(--text-1)] text-sm transition-colors">{t('footer.about')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[var(--text-1)] font-bold mb-6 font-display">{t('footer.contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt text-[var(--text-5)] mt-1"></i>
                <span className="text-[var(--text-4)] text-sm">
                  Jl. Jendral Sudirman No. 123,<br />Jakarta Selatan, 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-phone-alt text-[var(--text-5)]"></i>
                <span className="text-[var(--text-4)] text-sm">021 - 555 - 0123</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fab fa-whatsapp text-[var(--text-5)]"></i>
                <span className="text-[var(--text-4)] text-sm">0812 - 3456 - 7890</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border-1)] pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[var(--text-4)] text-xs text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {brandName}. {t('footer.copyright')}
          </p>
          <div className="text-[var(--text-4)] text-xs flex gap-4">
            <a href="#" className="hover:text-gray-400">{t('footer.terms')}</a>
            <a href="#" className="hover:text-gray-400">{t('footer.privacy')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
