import type { BlockContact } from "@/lib/types";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

interface ContactBlockProps {
  data?: BlockContact | null;
}

export default function ContactBlock({ data }: ContactBlockProps) {
  // Use defaults when no CMS data available
  const title = data?.title ?? "พร้อมให้บริการคุณ";
  const subtitle = data?.subtitle ?? "ติดต่อสอบถามหรือนัดหมายได้ทุกช่องทาง";
  
  const hqTitle = data?.hq_title ?? "สำนักงานใหญ่";
  const hqAddress = data?.hq_address ?? "51/14 หมู่บ้าน เสนา88 คลองลำเจียก 8 ถนน นวลจันทร์ กรุงเทพฯ 10230";
  
  const phoneTitle = data?.phone_title ?? "โทรศัพท์";
  const phoneText = data?.phone_text ?? "065 291 6466";
  
  const hoursTitle = data?.hours_title ?? "เวลาทำการ";
  const hoursText = data?.hours_text ?? "เปิดทุกวัน 10:30 - 19:30 น.";
  
  const emailTitle = data?.email_title ?? "อีเมล";
  const emailText = data?.email_text ?? "Baomuedentalclinic@gmail.com";

  // Google Maps embed URL - Siam Paragon as placeholder
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5461478889387!2d100.5299699!3d13.746287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ecde3aee521%3A0x9f43939a2caf2963!2sSiam%20Paragon!5e0!3m2!1sen!2sth!4v1234567890123!5m2!1sen!2sth";

  return (
    <section className="py-16 md:py-24 bg-[#F8F9FB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-start">
          {/* Left Column - Contact Info */}
          <div className="md:col-span-2">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 text-cyan-700 text-sm font-semibold mb-6">
              <Phone className="w-4 h-4" />
              ติดต่อเรา
            </span>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a5fb4] mb-4 leading-tight">
              {title}
            </h2>
            
            {/* Subtitle */}
            <p className="text-slate-500 text-lg mb-10">
              {subtitle}
            </p>

            {/* Contact Info Cards */}
            <div className="space-y-5">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{hqTitle}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {hqAddress}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{phoneTitle}</h3>
                  <p className="text-slate-600 text-sm whitespace-pre-line">
                    {phoneText}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{hoursTitle}</h3>
                  <p className="text-slate-600 text-sm whitespace-pre-line">
                    {hoursText}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{emailTitle}</h3>
                  <p className="text-slate-600 text-sm whitespace-pre-line">
                    {emailText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="md:col-span-3 w-full">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
