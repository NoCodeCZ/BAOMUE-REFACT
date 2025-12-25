import type { BlockContact } from "@/lib/types";
import { Phone, MessageCircle, Facebook, Mail, MapPin } from "lucide-react";

interface ContactBlockProps {
  data?: BlockContact | null;
}

export default function ContactBlock({ data }: ContactBlockProps) {
  if (!data) return null;

  const title = data.title ?? "ติดต่อ & จองคิว";
  const subtitle = data.subtitle ?? "ติดต่อเราได้หลากหลายช่องทาง หรือนัดหมายออนไลน์ได้ตลอด 24 ชั่วโมง";
  
  // Contact channel data
  const phoneNumber = data.phone_number ?? "065 291 6466";
  const phoneHours = data.phone_hours ?? "เปิดให้บริการ 10:00 - 21:00 น.";
  const lineHandle = data.line_handle ?? "@BAOMUEDENTALCLINIC";
  const lineResponseTime = data.line_response_time ?? "ตอบกลับภายใน 5 นาที";
  const facebookPage = data.facebook_page ?? "BAOMUE Dental Clinic";
  const facebookDescription = data.facebook_description ?? "ติดตามข่าวสาร & โปรโมชั่น";
  const emailAddress = data.email_address ?? "Baomuedentalclinic@gmail.com";
  const emailResponseTime = data.email_response_time ?? "ตอบกลับภายใน 24 ชั่วโมง";
  
  // Map data
  const mapEmbedUrl = data.map_embed_url ?? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5461478889387!2d100.5299699!3d13.746287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ecde3aee521%3A0x9f43939a2caf2963!2sSiam%20Paragon!5e0!3m2!1sen!2sth!4v1234567890123!5m2!1sen!2sth";
  const mapAddress = data.map_address ?? "51/14 หมู่บ้าน เสนา88 คลองลำเจียก 8 ถนน นวลจันทร์ กรุงเทพฯ 10230";
  const mapLinkText = data.map_link_text ?? "ดูเส้นทางใน Google Maps";

  return (
    <div className="space-y-6">
      {/* Contact Channels Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">ช่องทางติดต่อ</h2>
        <p className="text-slate-500 text-sm mb-6">เลือกช่องทางที่สะดวกสำหรับคุณ</p>

        <div className="space-y-4">
          {/* Phone Card */}
          <a
            href={`tel:${phoneNumber.replace(/\s/g, "")}`}
            className="group bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-slate-100 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-500/20">
              <Phone className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                โทรศัพท์
              </div>
              <div className="text-lg font-bold text-slate-900">{phoneNumber}</div>
              <div className="text-xs text-slate-500">{phoneHours}</div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-300 group-hover:text-blue-500 transition-colors"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </a>

          {/* LINE Card */}
          <a
            href="#"
            className="group bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-slate-100 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#06C755] flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-500/20 font-bold text-xs tracking-tight">
              LINE
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                LINE OFFICIAL
              </div>
              <div className="text-lg font-bold text-slate-900">{lineHandle}</div>
              <div className="text-xs text-slate-500">{lineResponseTime}</div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-300 group-hover:text-[#06C755] transition-colors"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </a>

          {/* Facebook Card */}
          <a
            href="#"
            className="group bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-slate-100 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
              <Facebook className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                FACEBOOK PAGE
              </div>
              <div className="text-lg font-bold text-slate-900 truncate">{facebookPage}</div>
              <div className="text-xs text-slate-500">{facebookDescription}</div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-300 group-hover:text-[#1877F2] transition-colors"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </a>

          {/* Email Card */}
          <a
            href={`mailto:${emailAddress}`}
            className="group bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-slate-100 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#A855F7] flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-500/20">
              <Mail className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                อีเมล
              </div>
              <div className="text-sm font-bold text-slate-900 truncate">{emailAddress}</div>
              <div className="text-xs text-slate-500">{emailResponseTime}</div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-300 group-hover:text-[#A855F7] transition-colors"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </a>
        </div>
      </div>

      {/* Map Section */}
      <div className="pt-4">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          ที่ตั้งคลินิก
        </h3>
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm">
          <div className="rounded-xl overflow-hidden mb-3 bg-slate-100">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="150"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block"
            ></iframe>
          </div>
          <div className="px-1">
            <p className="text-sm font-medium text-slate-900 leading-snug">{mapAddress}</p>
            <a
              href="#"
              className="inline-flex items-center gap-1 text-blue-500 text-xs font-semibold mt-2 hover:text-blue-600"
            >
              <MapPin className="w-3 h-3" />
              {mapLinkText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
