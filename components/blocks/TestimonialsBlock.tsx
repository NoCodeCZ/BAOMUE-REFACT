"use client";

import { useState } from "react";
import type { BlockTestimonials } from "@/lib/types";

interface TestimonialsBlockProps {
  data?: BlockTestimonials | null;
}

// Sample testimonials data - in production, this would come from Directus
const defaultTestimonials = [
  {
    name: "Chonnasit Manyataon",
    badge: "แนะนำ Sodent",
    text: "คุณหมอมือเบามาก อธิบายทุกขั้นตอน จึงทำให้ไม่ค่อยเกร็งเท่าไหร่ พนักงานหน้าเคาน์เตอร์ สุภาพ เรียบร้อยให้คำแนะนำดีมาก คลินิคมีความสะอาด น่ารัก เหมือนคาเฟ่เลยครับ",
    date: "30 ธันวาคม 2021",
    image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80",
  },
  {
    name: "คุณสมหญิง",
    badge: "แนะนำ Sodent",
    text: "ประทับใจมากค่ะ คุณหมอใจเย็น รักษาเบามือมาก ไม่เจ็บเลย สถานที่สะอาด บรรยากาศดี พนักงานน่ารักมากค่ะ",
    date: "15 มกราคม 2022",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
  {
    name: "คุณวิชัย",
    badge: "แนะนำ Sodent",
    text: "บรรยากาศดี สะอาด ทันสมัย พนักงานน่ารักมากครับ คุณหมอมือเบา อธิบายทุกขั้นตอนชัดเจน",
    date: "20 กุมภาพันธ์ 2022",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
  },
  {
    name: "คุณนภา",
    badge: "แนะนำ Sodent",
    text: "มาทำฟันครั้งแรกที่นี่ ประทับใจมากค่ะ หมอใจดี อธิบายละเอียด ไม่เจ็บเลย จะแนะนำเพื่อนๆ มาค่ะ",
    date: "5 มีนาคม 2022",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80",
  },
  {
    name: "คุณธนพล",
    badge: "แนะนำ Sodent",
    text: "เคยกลัวทำฟันมาก แต่มาที่นี่เปลี่ยนความคิดเลยครับ หมอมือเบา อธิบายทุกอย่าง ไม่เจ็บ แนะนำครับ!",
    date: "12 เมษายน 2022",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
];

// Use the Supabase URL directly since it's a public asset
const MASCOT_IMAGE_URL = "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/01adb171-138e-45ee-a5c2-9f1e28c92695_800w.png";

export default function TestimonialsBlock({ data }: TestimonialsBlockProps) {
  const title = data?.section_title ?? "REVIEW!";
  const subtitle = data?.section_description ?? "รีวิวจากคนไข้";
  
  const testimonials = (data?.testimonials as typeof defaultTestimonials) ?? defaultTestimonials;

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTestimonial = testimonials[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="lg:py-32 bg-slate-50 pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Character and Title */}
          <div className="flex flex-col text-center items-center">
            <h2 
              className="md:text-7xl uppercase text-5xl font-black text-[#0047BC] tracking-tighter mb-4 -rotate-2"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {title}
            </h2>
            <p className="md:text-3xl text-2xl font-bold text-[#003888] mb-8">{subtitle}</p>

            {/* Character Image */}
            <div className="md:w-80 md:h-[450px] flex w-80 h-96 relative items-center justify-center">
              <div className="md:w-72 md:h-96 flex overflow-hidden bg-center w-60 rounded-2xl items-center justify-center">
                <img
                  src={MASCOT_IMAGE_URL}
                  alt="Tooth Mascot"
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Review Slider */}
          <div className="relative">
            {/* Review Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
              {/* Header with Profile */}
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{currentTestimonial.name}</span>
                        <span className="text-red-500">🏷️</span>
                        <span className="text-slate-600 text-sm">{currentTestimonial.badge}</span>
                      </div>
                      <div className="text-slate-500 text-sm flex items-center gap-1">
                        <span>{currentTestimonial.date}</span>
                        <span>·</span>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="19" cy="12" r="1"></circle>
                      <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Review Text */}
              <div className="p-4">
                <p className="text-slate-700 text-base leading-relaxed">{currentTestimonial.text}</p>
              </div>

              {/* Image */}
              <div className="relative">
                <img
                  src={currentTestimonial.image}
                  alt="Review Image"
                  className="w-full h-80 object-cover"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"></path>
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </button>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 py-4">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentIndex ? 'bg-slate-800' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
