"use client";

import { useState } from "react";
import type { BlockTestimonials } from "@/lib/types";

interface TestimonialsBlockProps {
  data?: BlockTestimonials | null;
}

export default function TestimonialsBlock({ data }: TestimonialsBlockProps) {
  if (!data) return null;

  const title = data.title ?? "เสียงจากลูกค้าของเรา";
  const subtitle = data.subtitle ?? "รีวิวจริงจากลูกค้าที่ไว้วางใจเรา";
  
  const testimonials = (data.testimonials as any[]) ?? [
    {
      name: "คุณสมชาย",
      text: "คุณหมอมือเบามาก อธิบายทุกขั้นตอน จึงทำให้ไม่ค่อยเกร็งเท่าไหร่ พนักงานหน้าเคาน์เตอร์ สุภาพ เรียบร้อยให้คำแนะนำดีมาก คลินิคมีความสะอาด น่ารัก เหมือนคาเฟ่เลยครับ",
      date: "30 ธันวาคม 2021",
      image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800&q=80",
    },
    {
      name: "คุณมาลี",
      text: "ประทับใจมากค่ะ คุณหมอใจเย็น รักษาเบามือมาก ไม่เจ็บเลย แนะนำเลยค่ะ",
      date: "15 มกราคม 2022",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80",
    },
    {
      name: "คุณวิชัย", 
      text: "บรรยากาศดี สะอาด ทันสมัย พนักงานน่ารักมากครับ",
      date: "20 กุมภาพันธ์ 2022",
      image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80",
    },
  ];

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
      <div className="max-w-7xl mr-auto ml-auto pr-6 pl-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex text-sm font-semibold text-slate-50 bg-[#F59E0B] rounded-full mb-6 px-4 py-2 gap-x-2 gap-y-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"></path>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"></path>
            </svg>
            รีวิว
          </div>
          <h2 className="md:text-5xl text-4xl font-semibold tracking-tight mb-6" style={{ color: '#003888' }}>
            {title}
          </h2>
          <p className="text-xl" style={{ color: '#1DAEE0' }}>{subtitle}</p>
        </div>

        <div className="flex items-center justify-center gap-x-6 gap-y-6">
          {/* Google Review Stats */}
          <div className="hidden lg:flex flex-col items-center justify-center bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_160x56dp.png" alt="Google" className="h-8 mb-4" />
            <div className="text-4xl font-bold text-slate-900 mb-1">4.9</div>
            <div className="flex text-amber-400 gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                </svg>
              ))}
            </div>
            <p className="text-slate-500 text-sm">1,234 รีวิว</p>
          </div>

          {/* Review Card */}
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{currentTestimonial.name}</span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="text-slate-500 text-sm flex items-center gap-1">
                      <span>{currentTestimonial.date}</span>
                      <span>·</span>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
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
              <img src={currentTestimonial.image} alt="Review Image" className="w-full h-80 object-cover" />
              
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
                <span 
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-slate-800' : 'bg-slate-300'}`}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


