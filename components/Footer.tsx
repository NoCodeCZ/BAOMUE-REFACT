import type { BlockFooter } from '@/lib/types';

interface FooterProps {
  block?: BlockFooter;
}

export default function Footer({ block }: FooterProps) {
  const content = block?.content;
  
  return (
    <footer className="bg-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mr-auto ml-auto pr-6 pl-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          {/* Logo & Description */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex gap-3 mb-6 items-center">
              <img 
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c4b9c3ac-abfd-48b9-b61e-6a6a55621186_320w.png"
                alt="Logo" 
                className="h-12 w-auto"
              />
            </div>
            <p className="leading-relaxed text-base font-normal text-white/70 mb-8">
              {content?.description || 'สร้างรอยยิ้มที่มั่นใจ ด้วยบริการที่ใส่ใจทุกรายละเอียด โดยทีมทันตแพทย์ผู้เชี่ยวชาญ'}
            </p>
            <div className="flex gap-3">
              <a href="#" className="flex hover:bg-[#1DAEE0] hover:text-white transition-all duration-300 text-white/70 bg-white/10 w-10 h-10 rounded-full items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="flex hover:bg-[#1DAEE0] hover:text-white transition-all duration-300 text-white/70 bg-white/10 w-10 h-10 rounded-full items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="flex hover:bg-[#1DAEE0] hover:text-white transition-all duration-300 text-white/70 bg-white/10 w-10 h-10 rounded-full items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                  <path d="m10 15 5-3-5-3z"></path>
                </svg>
              </a>
              <a href="#" className="flex hover:bg-[#1DAEE0] hover:text-white transition-all duration-300 text-white/70 bg-white/10 w-10 h-10 rounded-full items-center justify-center">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* บริการ Column */}
          <div className="lg:col-span-1">
            <h4 className="text-base font-semibold text-white mb-5">บริการ</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-[#1DAEE0] transition-colors text-sm font-normal text-white/60">ทันตกรรมทั่วไป</a></li>
              <li><a href="#" className="hover:text-[#1DAEE0] transition-colors text-sm font-normal text-white/60">จัดฟัน</a></li>
              <li><a href="#" className="hover:text-[#1DAEE0] transition-colors text-sm font-normal text-white/60">รากเทียม</a></li>
              <li><a href="#" className="hover:text-[#1DAEE0] transition-colors text-sm font-normal text-white/60">ฟอกสีฟัน</a></li>
              <li><a href="#" className="hover:text-[#1DAEE0] transition-colors text-sm font-normal text-white/60">วีเนียร์</a></li>
            </ul>
          </div>

          {/* ข้อมูล Column */}
          <div className="lg:col-span-1">
            <h4 className="text-base font-semibold text-white mb-5">ข้อมูล</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-[#1DAEE0] transition-colors text-sm font-normal text-white/60">เกี่ยวกับเรา</a></li>
              <li><a href="#" className="hover:text-[#1DAEE0] transition-colors text-sm font-normal text-white/60">ทีมทันตแพทย์</a></li>
              <li><a href="#" className="hover:text-[#1DAEE0] transition-colors text-sm font-normal text-white/60">สาขา</a></li>
              <li><a href="#" className="hover:text-[#1DAEE0] transition-colors text-sm font-normal text-white/60">บทความ</a></li>
              <li><a href="#" className="hover:text-[#1DAEE0] transition-colors text-sm font-normal text-white/60">โปรโมชั่น</a></li>
            </ul>
          </div>

          {/* ติดต่อเรา Column */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-base font-semibold text-white mb-5">ติดต่อเรา</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="flex shrink-0 bg-[#1DAEE0]/20 w-9 h-9 rounded-full items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1DAEE0]">
                    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                  </svg>
                </div>
                <span className="text-sm font-normal text-white/70">096 915 9391</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex shrink-0 bg-[#1DAEE0]/20 w-9 h-9 rounded-full items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1DAEE0]">
                    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  </svg>
                </div>
                <span className="text-sm font-normal text-white/70">Baomuedentalclinic@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex shrink-0 bg-[#06c755]/20 w-9 h-9 rounded-full items-center justify-center">
                  <span className="font-black text-[8px] text-[#06c755]">LINE</span>
                </div>
                <span className="text-sm font-normal text-white/70">@BAOMUE</span>
              </li>
            </ul>
            {/* QR Code Box */}
            <div className="inline-flex bg-white/5 border-white/10 border rounded-2xl mt-6 pt-4 pr-4 pb-4 pl-4 gap-x-4 gap-y-4 items-center">
              <div className="flex bg-white w-16 h-16 rounded-xl items-center justify-center">
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
                <div className="text-sm font-medium text-white mb-0.5">Add LINE</div>
                <div className="text-xs font-normal text-white/50">@BAOMUE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row border-t border-white/10 pt-8 gap-x-4 gap-y-4 items-center justify-between">
          <p className="text-sm font-normal text-white/50">
            {content?.copyright || '© 2024 คลินิกทันตกรรมเบามือ. All rights reserved.'}
          </p>
          <div className="flex gap-x-6 gap-y-6 items-center">
            <a href="#" className="hover:text-white transition-colors text-sm font-normal text-white/50">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors text-sm font-normal text-white/50">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
