import type { BlockContact } from "@/lib/types";
import { MapPin, Phone, Clock, Mail, Navigation, MessageCircle, ExternalLink } from "lucide-react";

interface ContactBlockProps {
  data?: BlockContact | null;
}

export default function ContactBlock({ data }: ContactBlockProps) {
  const title = data?.title ?? "ติดต่อเรา";
  const subtitle = data?.subtitle ?? "พร้อมให้บริการและดูแลรอยยิ้มของคุณ";
  
  const hqAddress = data?.hq_address ?? "51/14 หมู่บ้าน เสนา88 คลองลำเจียก 8 ถนน นวลจันทร์ กรุงเทพฯ 10230";
  const phoneText = data?.phone_text ?? "065-291-6466";
  const hoursText = data?.hours_text ?? "เปิดให้บริการทุกวัน 10.30 - 19.30 น.";
  const emailText = data?.email_text ?? "Baomuedentalclinic@gmail.com";

  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.313303113568!2d100.6362926745162!3d13.820216095707012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d63397c753a35%3A0x5bf24a307a48d354!2z4LiE4Lil4Li04LiZ4Li04LiB4LiX4Lix4LiZ4LiV4LiB4Lij4Lij4Lih4LmA4Lia4Liy4Lih4Li34LitIChCYW9tdWUgRGVudGFsIENsaW5pYyk!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth";
  const phoneClean = phoneText.replace(/[^0-9]/g, '');

  return (
    <section className="relative overflow-hidden">
      {/* Hero Header */}
      <div className="relative py-20 md:py-28" style={{ background: 'linear-gradient(135deg, #003888 0%, #0a5eb8 50%, #1DAEE0 100%)' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5"></div>
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-white/5"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8">
            <Phone className="w-4 h-4" />
            Contact Us
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-5 tracking-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="bg-slate-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">

          {/* Contact Info Strip — 4 items in a single row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-32 md:-mt-36 relative z-20 mb-12">
            {/* ที่อยู่ */}
            <a
              href="https://maps.app.goo.gl/ZNa16odjDvikrwGp6"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">ที่อยู่คลินิก</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed flex-1">{hqAddress}</p>
              <span className="inline-flex items-center gap-1 text-blue-600 text-xs font-semibold mt-3 group-hover:underline">
                นำทาง <Navigation className="w-3 h-3" />
              </span>
            </a>

            {/* โทรศัพท์ */}
            <a
              href={`tel:${phoneClean}`}
              className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">โทรศัพท์</h3>
              </div>
              <p className="text-2xl font-bold text-slate-900 tracking-wide flex-1">{phoneText}</p>
              <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold mt-3 group-hover:underline">
                โทรเลย <ExternalLink className="w-3 h-3" />
              </span>
            </a>

            {/* เวลาทำการ */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">เวลาทำการ</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed flex-1">{hoursText}</p>
              <div className="flex items-center gap-1.5 mt-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-emerald-600 text-xs font-semibold">เปิดให้บริการ</span>
              </div>
            </div>

            {/* อีเมล */}
            <a
              href={`mailto:${emailText}`}
              className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">อีเมล</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed break-all flex-1">{emailText}</p>
              <span className="inline-flex items-center gap-1 text-violet-600 text-xs font-semibold mt-3 group-hover:underline">
                ส่งอีเมล <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          </div>

          {/* Map + Sidebar */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map — full width on mobile, 2/3 on desktop */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Baomue Dental Clinic</h3>
                      <p className="text-xs text-slate-500">คลินิกทันตกรรมเบามือ</p>
                    </div>
                  </div>
                  <a
                    href="https://maps.app.goo.gl/ZNa16odjDvikrwGp6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                    style={{ background: 'linear-gradient(135deg, #003888 0%, #1DAEE0 100%)' }}
                  >
                    <Navigation className="w-4 h-4" />
                    เปิดแผนที่
                  </a>
                </div>
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block w-full"
                />
              </div>
            </div>

            {/* Sidebar — LINE + Social + Quick CTA */}
            <div className="space-y-5">
              {/* LINE Official */}
              <a
                href="https://page.line.me/962mvvui?oat_content=url&openQrModal=true"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#06c755] flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <span className="font-black text-xs">LINE</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm">LINE Official</h3>
                  <p className="text-slate-500 text-xs">@baomuedentalclinic</p>
                </div>
                <MessageCircle className="w-5 h-5 text-slate-400 ml-auto shrink-0 group-hover:text-[#06c755] transition-colors" />
              </a>

              {/* Social Links */}
              <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm mb-4">ติดตามเรา</h3>
                <div className="flex gap-3">
                  <a href="https://www.facebook.com/baomuedentalclinic" target="_blank" rel="noopener noreferrer" className="flex w-11 h-11 rounded-xl bg-slate-100 hover:bg-[#1877F2] text-slate-500 hover:text-white items-center justify-center transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href="https://www.instagram.com/baomuedentalclinic" target="_blank" rel="noopener noreferrer" className="flex w-11 h-11 rounded-xl bg-slate-100 hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] text-slate-500 hover:text-white items-center justify-center transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                  </a>
                  <a href="https://www.tiktok.com/@baomuedentalclinic" target="_blank" rel="noopener noreferrer" className="flex w-11 h-11 rounded-xl bg-slate-100 hover:bg-black text-slate-500 hover:text-white items-center justify-center transition-all duration-300">
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path></svg>
                  </a>
                </div>
              </div>

              {/* Quick Call CTA */}
              <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #003888 0%, #1DAEE0 100%)' }}>
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/10"></div>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-1">โทรนัดหมายด่วน</h3>
                  <p className="text-white/70 text-sm mb-4 leading-relaxed">
                    ทีมงานพร้อมให้บริการทุกวัน
                  </p>
                  <a
                    href={`tel:${phoneClean}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#003888] font-bold text-lg hover:bg-white/90 transition-colors shadow-lg w-full justify-center"
                  >
                    <Phone className="w-5 h-5" />
                    {phoneText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
