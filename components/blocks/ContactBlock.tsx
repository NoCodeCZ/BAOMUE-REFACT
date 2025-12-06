import type { BlockContact, BlockLocations } from "@/lib/types";

interface ContactBlockProps {
  data?: BlockContact | null;
  locations?: BlockLocations | null;
}

export default function ContactBlock({ data, locations }: ContactBlockProps) {
  if (!data) return null;

  const title = data.title ?? "พร้อมให้บริการคุณ";
  const subtitle = data.subtitle ?? "ติดต่อสอบถามหรือนัดหมายได้ทุกช่องทาง";
  const hqTitle = data.hq_title ?? "สำนักงานใหญ่";
  const hqAddress = data.hq_address ?? "ชั้น 5 สยามพารากอน ถ.พระราม 1แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ 10330";
  const phoneTitle = data.phone_title ?? "โทรศัพท์";
  const phoneText = data.phone_text ?? "096 915 9391 (Call Center) 02-XXX-XXXX (สำนักงานใหญ่)";
  const hoursTitle = data.hours_title ?? "เวลาทำการ";
  const hoursText = data.hours_text ?? "เปิดทุกวัน 10:00 - 21:00 น.(เฉพาะสาขาในห้าง)";
  const emailTitle = data.email_title ?? "อีเมล";
  const emailText = data.email_text ?? "contact@toothbox.com booking@toothbox.com";
  const mapEmbedUrl = locations?.map_embed_url ?? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5461478889387!2d100.5299699!3d13.746287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ecde3aee521%3A0x9f43939a2caf2963!2sSiam%20Paragon!5e0!3m2!1sen!2sth!4v1234567890123!5m2!1sen!2sth";

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-600 text-sm font-semibold mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"></path>
                <path d="M15 5.764v15"></path>
                <path d="M9 3.236v15"></path>
              </svg>
              ติดต่อเรา
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6">
              {title}
            </h2>
            <p className="text-xl text-slate-500 mb-10">
              {subtitle}
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-7 h-7 text-[#1DAEE0]"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {hqTitle}
                  </h4>
                  <p className="text-slate-600">
                    {hqAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-7 h-7 text-[#1DAEE0]"
                  >
                    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {phoneTitle}
                  </h4>
                  <p className="text-slate-600">
                    {phoneText}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-7 h-7 text-[#1DAEE0]"
                  >
                    <path d="M12 6v6l4 2"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {hoursTitle}
                  </h4>
                  <p className="text-slate-600">
                    {hoursText}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-7 h-7 text-[#1DAEE0]"
                  >
                    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {emailTitle}
                  </h4>
                  <p className="text-slate-600">
                    {emailText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 h-[500px]">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

