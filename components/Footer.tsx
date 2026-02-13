import type { BlockFooter } from '@/lib/types';
import { getFooterBlock } from '@/lib/data';

interface FooterProps {
  block?: BlockFooter;
  data?: any;
}

// Social icon components
const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'line':
      return <span className="font-black text-[9px]">LINE</span>;
    case 'facebook':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      );
    case 'instagram':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
        </svg>
      );
    case 'tiktok':
      return (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
        </svg>
      );
    default:
      return null;
  }
};

const socialStyles: Record<string, string> = {
  line: 'bg-[#06c755]/80 hover:bg-[#06c755] text-white',
  facebook: 'bg-white/15 hover:bg-[#1877F2] text-white/80 hover:text-white',
  instagram: 'bg-white/15 hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] text-white/80 hover:text-white',
  tiktok: 'bg-white/15 hover:bg-white text-white/80 hover:text-black',
};

export default async function Footer({ block, data }: FooterProps) {
  // If no data provided, fetch block_footer from Directus directly
  let footerData = block || data || null;
  if (!footerData) {
    footerData = await getFooterBlock(1);
  }
  const d = footerData || {};
  const legacy = d?.content;

  // CMS data with fallbacks — prefer new fields, fallback to legacy content JSON
  const description = d?.description || legacy?.description || 'เบามืออย่างหนัก เพื่อรอยยิ้มในทุกครั้ง';
  const menuLinks = d?.menu_links || legacy?.product_links || [
    { text: 'หน้าแรก', href: '/' },
    { text: 'ABOUT US', href: '/about-us' },
    { text: 'โปรโมชั่น', href: '/promotions' },
    { text: 'ผลงานของเรา', href: '/our-work' },
    { text: 'บทความ', href: '/blog' },
    { text: 'ติดต่อเรา', href: '/contact' },
  ];
  const serviceLinks = d?.service_links || legacy?.company_links || [
    { text: 'ทันตกรรมทั่วไป', href: '/services' },
    { text: 'จัดฟัน', href: '/services' },
    { text: 'รากเทียม', href: '/services' },
    { text: 'ฟอกสีฟัน', href: '/services' },
    { text: 'วีเนียร์', href: '/services' },
  ];
  const socialLinks = d?.social_links || legacy?.social_links || [
    { platform: 'line', href: 'https://page.line.me/962mvvui?oat_content=url&openQrModal=true' },
    { platform: 'facebook', href: 'https://www.facebook.com/baomuedentalclinic' },
    { platform: 'instagram', href: 'https://www.instagram.com/baomuedentalclinic' },
    { platform: 'tiktok', href: 'https://www.tiktok.com/@baomuedentalclinic' },
  ];
  const copyright = d?.copyright_text || legacy?.copyright || '';
  const contactAddress = d?.contact_address || legacy?.contact_address || '51/14 หมู่บ้าน เสนา88 คลองลำเจียก 8 ถนน นวลจันทร์ กรุงเทพฯ 10230';
  const contactPhone = d?.contact_phone || legacy?.contact_phone || '065-291-6466';
  const contactEmail = d?.contact_email || legacy?.contact_email || 'Baomuedentalclinic@gmail.com';
  const contactHours = d?.contact_hours || legacy?.contact_hours || 'เปิดให้บริการทุกวัน 10.30 - 19.30 น.';

  return (
    <footer style={{ background: '#003888' }}>
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Logo & Social Icons */}
          <div className="col-span-2 lg:col-span-3">
            <div className="mb-6 inline-block bg-white rounded-2xl p-3 shadow-lg">
              <img 
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c4b9c3ac-abfd-48b9-b61e-6a6a55621186_320w.png"
                alt="Baomue Dental Clinic" 
                className="h-16 w-auto"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {description}
            </p>
            {/* Social Icons - CMS driven */}
            <div className="flex gap-3">
              {socialLinks.map((social: any, idx: number) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex w-10 h-10 rounded-full items-center justify-center transition-all duration-300 ${socialStyles[social.platform] || 'bg-white/15 text-white/80 hover:bg-white/25'}`}
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>
          </div>

          {/* MENU Column - CMS driven */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">MENU</h4>
            <ul className="space-y-3">
              {menuLinks.map((link: any, idx: number) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-[#1DAEE0] transition-colors text-sm text-white/70">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* บริการ Column - CMS driven */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">บริการ</h4>
            <ul className="space-y-3">
              {serviceLinks.map((link: any, idx: number) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-[#1DAEE0] transition-colors text-sm text-white/70">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ติดต่อเรา Column */}
          <div className="col-span-2 lg:col-span-5">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">ติดต่อเรา</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1DAEE0] shrink-0 mt-0.5">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="text-sm text-white/70 leading-relaxed">{contactAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1DAEE0] shrink-0">
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                </svg>
                <span className="text-sm text-white/70">{contactPhone}</span>
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1DAEE0] shrink-0">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <span className="text-sm text-white/70">{contactEmail}</span>
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1DAEE0] shrink-0">
                  <path d="M12 6v6l4 2"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                <span className="text-sm text-white/70">{contactHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-xs text-white/40">
            {copyright || `© ${new Date().getFullYear()} คลินิกทันตกรรมเบามือ (Baomue Dental Clinic). All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
