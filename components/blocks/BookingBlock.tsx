"use client";

import { useState } from "react";
import type { BlockBooking } from "@/lib/types";
import { trackMeta } from "@/lib/analytics/meta-client";

interface BookingBlockProps {
  data?: BlockBooking | null;
}

export default function BookingBlock({ data }: BookingBlockProps) {
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    branch: "",
    service: "",
    date: "",
    time: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = data?.title ?? "นัดหมายออนไลน์";
  const subtitle = data?.subtitle ?? "กรอกข้อมูลเพื่อจองคิวรับบริการ ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง";
  const phoneLabel = data?.phone_label ?? "โทรศัพท์";
  const phoneNumber = data?.phone_number ?? "065-291-6466";
  const lineLabel = data?.line_label ?? "Line Official";
  const lineHandle = data?.line_handle ?? "@baomuedentalclinic";
  const hoursLabel = data?.hours_label ?? "เวลาทำการ";
  const hoursValue = data?.hours_value ?? "เปิดให้บริการทุกวัน 10.30 - 19.30 น.";

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formState.name.trim()) {
      setError("กรุณากรอกชื่อ-นามสกุล");
      return;
    }
    if (!formState.phone.trim()) {
      setError("กรุณากรอกเบอร์โทรศัพท์");
      return;
    }
    if (!formState.branch) {
      setError("กรุณาเลือกสาขา");
      return;
    }
    if (!formState.service) {
      setError("กรุณาเลือกบริการที่ต้องการ");
      return;
    }
    if (!formState.date) {
      setError("กรุณาเลือกวันที่สะดวก");
      return;
    }
    if (!formState.time) {
      setError("กรุณาเลือกเวลาที่สะดวก");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "form",
          formId: 1,
          data: {
            form_type: "booking",
            name: formState.name,
            phone: formState.phone,
            branch: formState.branch,
            service: formState.service,
            preferred_date: formState.date,
            preferred_time: formState.time,
            note: formState.note,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      // Meta conversion: Lead (Pixel + CAPI, deduplicated by event_id).
      // Name/phone are used for advanced matching (hashed server-side).
      trackMeta("Lead", {
        userData: { firstName: formState.name, phone: formState.phone },
        customData: {
          content_name: "Booking Form",
          content_category: formState.service || "booking",
          branch: formState.branch,
        },
      });

      setIsSuccess(true);
      setFormState({ name: "", phone: "", branch: "", service: "", date: "", time: "", note: "" });
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="md:text-6xl text-4xl font-bold tracking-tight mb-4" style={{ color: '#003888' }}>
            จองคิวออนไลน์
          </h2>
          <p className="md:text-2xl text-lg text-slate-500">
            นัดหมายง่ายๆ เพียงกรอกข้อมูล ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="grid lg:grid-cols-5">
            {/* Left Panel - Dark overlay for contrast */}
            <div 
              className="lg:col-span-2 relative overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/60594a47-3752-4dde-a3ce-322e195f7684_800w.png)' }}
              ></div>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0, 56, 136, 0.92) 0%, rgba(29, 174, 224, 0.88) 100%)' }}></div>
              
              <div className="relative z-10 p-8 lg:p-10 h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-3">
                  {title}
                </h3>
                <p className="text-white/80 mb-10 leading-relaxed">
                  {subtitle}
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex text-white bg-white/20 backdrop-blur-sm w-12 h-12 rounded-xl items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-white/70">{phoneLabel}</div>
                      <div className="font-semibold text-white text-lg">{phoneNumber}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex text-white bg-green-500/60 backdrop-blur-sm w-12 h-12 rounded-xl items-center justify-center shrink-0">
                      <span className="font-black text-xs">LINE</span>
                    </div>
                    <div>
                      <div className="text-sm text-white/70">{lineLabel}</div>
                      <div className="font-semibold text-white text-lg">{lineHandle}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex text-white bg-white/20 backdrop-blur-sm w-12 h-12 rounded-xl items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 6v6l4 2"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-white/70">{hoursLabel}</div>
                      <div className="font-semibold text-white text-lg">{hoursValue}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Form */}
            <div className="lg:col-span-3 p-8 lg:p-10">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-8 w-full">
                    <svg
                      className="w-16 h-16 mx-auto text-green-500 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-lg font-semibold text-green-800 mb-2">
                      ส่งข้อมูลนัดหมายสำเร็จ!
                    </p>
                    <p className="text-green-700">
                      ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="mt-6 text-sm text-green-600 hover:text-green-800 underline"
                    >
                      นัดหมายอีกครั้ง
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        ชื่อ-นามสกุล *
                      </label>
                      <input
                        type="text"
                        value={formState.name}
                        onChange={(e) => handleChange("name", e.target.value)}
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
                        value={formState.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-[#1DAEE0] focus:ring-2 focus:ring-[#1DAEE0]/20 outline-none transition-all"
                        placeholder="08X-XXX-XXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      เลือกสาขา *
                    </label>
                    <select
                      value={formState.branch}
                      onChange={(e) => handleChange("branch", e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-[#1DAEE0] focus:ring-2 focus:ring-[#1DAEE0]/20 outline-none transition-all bg-white"
                    >
                      <option value="">-- เลือกสาขา --</option>
                      <option value="sena88">สาขาเสนา88 (นวลจันทร์)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      บริการที่ต้องการ *
                    </label>
                    <select
                      value={formState.service}
                      onChange={(e) => handleChange("service", e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-[#1DAEE0] focus:ring-2 focus:ring-[#1DAEE0]/20 outline-none transition-all bg-white"
                    >
                      <option value="">-- เลือกบริการ --</option>
                      <option value="general">ทันตกรรมทั่วไป</option>
                      <option value="orthodontics">จัดฟัน</option>
                      <option value="implant">รากเทียม</option>
                      <option value="veneer">วีเนียร์</option>
                      <option value="whitening">ฟอกสีฟัน</option>
                      <option value="crown">ครอบฟัน</option>
                      <option value="other">อื่นๆ</option>
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        วันที่สะดวก *
                      </label>
                      <input
                        type="date"
                        value={formState.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-[#1DAEE0] focus:ring-2 focus:ring-[#1DAEE0]/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        เวลาที่สะดวก *
                      </label>
                      <select
                        value={formState.time}
                        onChange={(e) => handleChange("time", e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-[#1DAEE0] focus:ring-2 focus:ring-[#1DAEE0]/20 outline-none transition-all bg-white"
                      >
                        <option value="">-- เลือกเวลา --</option>
                        {["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"].map((time) => (
                          <option key={time} value={time}>
                            {time} น.
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      หมายเหตุ (ถ้ามี)
                    </label>
                    <textarea
                      rows={3}
                      value={formState.note}
                      onChange={(e) => handleChange("note", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#1DAEE0] focus:ring-2 focus:ring-[#1DAEE0]/20 outline-none transition-all resize-none"
                      placeholder="รายละเอียดเพิ่มเติม..."
                    ></textarea>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-[#1DAEE0] text-white font-semibold rounded-xl hover:bg-[#0e9fd0] disabled:bg-[#1DAEE0]/50 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      "กำลังส่งข้อมูล..."
                    ) : (
                      <>
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
                        ยืนยันการจองคิว
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
