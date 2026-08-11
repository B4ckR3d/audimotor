'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/contexts/LanguageContext';

interface ContactInfo {
  id: number;
  contact_type: string;
  contact_value: string;
  label: string;
}

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
}

const contactIconMap: Record<string, string> = {
  address: 'fas fa-map-marker-alt',
  phone: 'fas fa-phone-alt',
  whatsapp: 'fab fa-whatsapp',
  email: 'fas fa-envelope',
  fax: 'fas fa-fax',
};

const DEFAULT_SOCIAL: SocialLink[] = [
  { id: -1, platform: 'tiktok', url: '#', icon: 'fab fa-tiktok' },
  { id: -2, platform: 'instagram', url: '#', icon: 'fab fa-instagram' },
  { id: -3, platform: 'whatsapp', url: '#', icon: 'fab fa-whatsapp' },
];

export default function Footer() {
  const { t } = useLang();
  const [brandName, setBrandName] = useState('Audi Motor');
  const [brandLogo, setBrandLogo] = useState('');
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(DEFAULT_SOCIAL);

  useEffect(() => {
    fetch('/api/public/settings')
      .then(res => res.json())
      .then(data => {
        if (data.brand_name) setBrandName(data.brand_name);
        if (data.brand_logo_url) setBrandLogo(data.brand_logo_url);
      })
      .catch(() => {});

    fetch('/api/public/contact')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setContacts(data.filter((c: ContactInfo) => c.contact_type !== 'map'));
        }
      })
      .catch(() => {});

    fetch('/api/public/social')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Pastikan WhatsApp selalu ada di social links
          const hasWhatsapp = data.some((l: SocialLink) => l.platform === 'whatsapp');
          if (!hasWhatsapp) {
            data.push({ id: -3, platform: 'whatsapp', url: '#', icon: 'fab fa-whatsapp' });
          }
          setSocialLinks(data);
        }
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
              {socialLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded bg-gray-900 border border-[var(--border-1)] flex items-center justify-center text-[var(--text-4)] hover:text-[var(--text-1)] hover:border-gray-500 transition-all"
                >
                  <i className={link.icon || `fab fa-${link.platform}`}></i>
                </a>
              ))}
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
              {contacts.map(c => (
                <li key={c.id} className="flex items-start gap-3">
                  <i className={`${contactIconMap[c.contact_type] || 'fas fa-info-circle'} text-[var(--text-5)] mt-1`}></i>
                  {c.contact_type === 'phone' ? (
                    <a href={`tel:${c.contact_value}`} className="text-[var(--text-4)] text-sm hover:text-[var(--text-1)] transition-colors">
                      {c.contact_value}
                    </a>
                  ) : c.contact_type === 'whatsapp' ? (
                    <a href={`https://wa.me/${c.contact_value.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-[var(--text-4)] text-sm hover:text-[var(--text-1)] transition-colors">
                      {c.contact_value}
                    </a>
                  ) : c.contact_type === 'email' ? (
                    <a href={`mailto:${c.contact_value}`} className="text-[var(--text-4)] text-sm hover:text-[var(--text-1)] transition-colors">
                      {c.contact_value}
                    </a>
                  ) : (
                    <span className="text-[var(--text-4)] text-sm">{c.contact_value}</span>
                  )}
                </li>
              ))}
              {contacts.length === 0 && (
                <li className="text-[var(--text-4)] text-sm">-</li>
              )}
              {/* Instagram & Facebook links di contact section */}
              {socialLinks.filter(l => l.platform === 'instagram' || l.platform === 'facebook').map(link => (
                <li key={`social-${link.id}`} className="flex items-start gap-3">
                  <i className={`${link.icon || `fab fa-${link.platform}`} text-[var(--text-5)] mt-1`}></i>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[var(--text-4)] text-sm hover:text-[var(--text-1)] transition-colors">
                    {link.platform === 'instagram' ? 'audimotor_' : 'Sammy Mukti'}
                  </a>
                </li>
              ))}
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

