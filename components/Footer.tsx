import type { BlockFooter } from '@/lib/types';

interface FooterProps {
  block: BlockFooter;
}

export default function Footer({ block }: FooterProps) {
  const content = block.content;
  if (!content) return null;

  return (
    <footer className="bg-slate-950 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c4b9c3ac-abfd-48b9-b61e-6a6a55621186_320w.png" 
                alt="Logo" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-white/70 text-base leading-relaxed mb-8">
              {content.description || 'สร้างรอยยิ้มที่มั่นใจ ด้วยบริการที่ใส่ใจทุกรายละเอียด โดยทีมทันตแพทย์ผู้เชี่ยวชาญ'}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#1DAEE0] hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#1DAEE0] hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#1DAEE0] hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                  <path d="m10 15 5-3-5-3z"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#1DAEE0] hover:text-white transition-all duration-300">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Service Links Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-base mb-5">บริการ</h4>
            <ul className="space-y-3">
              {content.product_links && content.product_links.length > 0 ? (
                content.product_links.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">
                      {link.text}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">ทันตกรรมทั่วไป</a></li>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">จัดฟัน</a></li>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">รากเทียม</a></li>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">ฟอกสีฟัน</a></li>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">วีเนียร์</a></li>
                </>
              )}
            </ul>
          </div>

          {/* Info Links Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-base mb-5">ข้อมูล</h4>
            <ul className="space-y-3">
              {content.company_links && content.company_links.length > 0 ? (
                content.company_links.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">
                      {link.text}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">เกี่ยวกับเรา</a></li>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">ทีมทันตแพทย์</a></li>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">สาขา</a></li>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">บทความ</a></li>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">โปรโมชั่น</a></li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-semibold text-base mb-5">ติดต่อเรา</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1DAEE0]/20 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1DAEE0]">
                    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                  </svg>
                </div>
                <span className="text-white/70 text-sm">096 915 9391</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1DAEE0]/20 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1DAEE0]">
                    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  </svg>
                </div>
                <span className="text-white/70 text-sm">contact@baomue.com</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#06c755]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#06c755] text-[8px] font-black">LINE</span>
                </div>
                <span className="text-white/70 text-sm">@BAOMUE</span>
              </li>
            </ul>

            {/* QR Code */}
            <div className="inline-flex gap-4 bg-white/5 border-white/10 border rounded-2xl mt-6 pt-4 pr-4 pb-4 pl-4 items-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <svg className="w-12 h-12" viewBox="0 0 100 100">
                  <rect fill="#000" x="10" y="10" width="20" height="20"></rect>
                  <rect fill="#000" x="70" y="10" width="20" height="20"></rect>
                  <rect fill="#000" x="10" y="70" width="20" height="20"></rect>
                  <rect fill="#000" x="40" y="40" width="20" height="20"></rect>
                  <rect fill="#000" x="35" y="10" width="10" height="10"></rect>
                  <rect fill="#000" x="55" y="10" width="10" height="10"></rect>
                  <rect fill="#000" x="10" y="35" width="10" height="10"></rect>
                  <rect fill="#000" x="10" y="55" width="10" height="10"></rect>
                </svg>
              </div>
              <div>
                <div className="text-white font-medium text-sm mb-0.5">Add LINE</div>
                <div className="text-white/50 text-xs">@BAOMUE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            {content.copyright || '© 2024 คลินิกทันตกรรมเบามือ. All rights reserved.'}
          </p>
          <div className="flex items-center gap-6">
            {content.legal_links && content.legal_links.length > 0 ? (
              content.legal_links.map((link, index) => (
                <a key={index} href={link.href} className="text-white/50 text-sm hover:text-white transition-colors">
                  {link.text}
                </a>
              ))
            ) : (
              <>
                <a href="#" className="text-white/50 text-sm hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-white/50 text-sm hover:text-white transition-colors">Terms of Service</a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}







