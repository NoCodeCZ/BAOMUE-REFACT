import type { BlockBooking } from "@/lib/types";

interface BookingBlockProps {
  data?: BlockBooking | null;
}

export default function BookingBlock({ data }: BookingBlockProps) {
  if (!data) return null;

  const title = data.title ?? "นัดหมายออนไลน์";
  const subtitle = data.subtitle ?? "กรอกข้อมูลเพื่อจองคิวรับบริการ ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง";
  const phoneLabel = data.phone_label ?? "โทรศัพท์";
  const phoneNumber = data.phone_number ?? "096 915 9391";
  const lineLabel = data.line_label ?? "Line Official";
  const lineHandle = data.line_handle ?? "@TOOTHBOX";
  const hoursLabel = data.hours_label ?? "เวลาทำการ";
  const hoursValue = data.hours_value ?? "10:00 - 21:00 น.";

  return (
    <section className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="grid lg:grid-cols-5">
            <div className="lg:col-span-2 bg-gradient-to-br from-[#1DAEE0] to-[#0e8fc4] p-8 lg:p-10 text-white">
              <h3 className="text-2xl font-semibold mb-4">
                {title}
              </h3>
              <p className="text-white/80 mb-8">
                {subtitle}
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
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
                      className="w-6 h-6"
                    >
                      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">
                      {phoneLabel}
                    </div>
                    <div className="font-semibold">
                      {phoneNumber}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="font-black text-xs">LINE</span>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">
                      {lineLabel}
                    </div>
                    <div className="font-semibold">
                      {lineHandle}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
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
                      className="w-6 h-6"
                    >
                      <path d="M12 6v6l4 2"></path>
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">
                      {hoursLabel}
                    </div>
                    <div className="font-semibold">
                      {hoursValue}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 p-8 lg:p-10">
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      ชื่อ-นามสกุล *
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-[#1DAEE0] focus:ring-2 focus:ring-[#1DAEE0]/20 outline-none transition-all"
                      placeholder="กรุณากรอกชื่อ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      เบอร์โทรศัพท์ *
                    </label>
                    <input
                      type="tel"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-[#1DAEE0] focus:ring-2 focus:ring-[#1DAEE0]/20 outline-none transition-all"
                      placeholder="08X-XXX-XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    เลือกสาขา *
                  </label>
                  <select className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-[#1DAEE0] focus:ring-2 focus:ring-[#1DAEE0]/20 outline-none transition-all bg-white">
                    <option value="">-- เลือกสาขา --</option>
                    <option value="siam">สาขาสยาม</option>
                    <option value="thonglor">สาขาทองหล่อ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    บริการที่ต้องการ *
                  </label>
                  <select className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-[#1DAEE0] focus:ring-2 focus:ring-[#1DAEE0]/20 outline-none transition-all bg-white">
                    <option value="">-- เลือกบริการ --</option>
                    <option value="checkup">ตรวจสุขภาพฟัน</option>
                    <option value="scaling">ขูดหินปูน</option>
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      วันที่สะดวก *
                    </label>
                    <input
                      type="date"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-[#1DAEE0] focus:ring-2 focus:ring-[#1DAEE0]/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      เวลาที่สะดวก *
                    </label>
                    <select className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-[#1DAEE0] focus:ring-2 focus:ring-[#1DAEE0]/20 outline-none transition-all bg-white">
                      <option value="">-- เลือกเวลา --</option>
                      {["10:00", "11:00", "12:00", "13:00", "14:00"].map((time) => (
                        <option key={time} value={time}>
                          {time} น.
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-14 bg-[#1DAEE0] text-white font-semibold rounded-xl hover:bg-[#0e9fd0] transition-colors flex items-center justify-center gap-2"
                >
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
                    className="w-5 h-5"
                  >
                    <path d="M8 2v4"></path>
                    <path d="M16 2v4"></path>
                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                    <path d="M3 10h18"></path>
                    <path d="m9 16 2 2 4-4"></path>
                  </svg>
                  ยืนยันการนัดหมาย
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

