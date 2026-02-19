"use client";

import { useState, useEffect, useCallback } from "react";
import type { BlockTestimonials } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";

interface TestimonialsBlockProps {
  data?: BlockTestimonials | null;
}

const MASCOT_IMAGE_URL = "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/01adb171-138e-45ee-a5c2-9f1e28c92695_800w.png";

function getImageUrl(item: any): string | null {
  if (!item) return null;
  // Directus files interface stores as array of { directus_files_id: string | { id: string } }
  if (typeof item === "string") return getFileUrl(item as any);
  if (item.directus_files_id) {
    const id = typeof item.directus_files_id === "object" ? item.directus_files_id.id : item.directus_files_id;
    return getFileUrl(id as any);
  }
  if (item.id) return getFileUrl(item.id as any);
  return null;
}

export default function TestimonialsBlock({ data }: TestimonialsBlockProps) {
  const title = data?.section_title ?? "REVIEW!";
  const subtitle = data?.section_description ?? "รีวิวจากคนไข้";

  // Build image URL list from review_images field
  const images: string[] = (data?.review_images ?? [])
    .map(getImageUrl)
    .filter((url): url is string => !!url);

  const hasImages = images.length > 0;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (!hasImages || images.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [hasImages, images.length, nextSlide]);

  return (
    <section className="lg:py-32 pt-24 pb-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #003888 0%, #0047BC 30%, #1a5cc8 60%, #1DAEE0 100%)' }}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-400/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-300/5 rounded-full blur-2xl"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Side - Mascot and Title (30%) */}
          <div className="lg:col-span-4 flex flex-col text-center items-center">
            <h2
              className="md:text-7xl uppercase text-5xl font-black text-white tracking-tighter mb-4 -rotate-2 drop-shadow-lg"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {title}
            </h2>
            <p className="md:text-3xl text-2xl font-bold text-white/80 mb-8">{subtitle}</p>

            <div className="w-56 h-56 lg:w-64 lg:h-72 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl scale-75"></div>
              <img
                src={MASCOT_IMAGE_URL}
                alt="Tooth Mascot"
                className="object-contain w-full h-full relative drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Right Side - Image Slideshow (70%) */}
          <div className="lg:col-span-8 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20" style={{ boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)' }}>

              {hasImages ? (
                <>
                  {/* Slide Image — 16:9 ratio for 1920x1080 screenshots */}
                  <div className="relative w-full aspect-video bg-slate-900">
                    {images.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`รีวิวที่ ${i + 1}`}
                        className={`absolute inset-0 w-full h-full object-contain bg-white transition-opacity duration-700 ${
                          i === currentIndex ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    ))}

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
                          aria-label="รีวิวก่อนหน้า"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6"></path>
                          </svg>
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
                          aria-label="รีวิวถัดไป"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6"></path>
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Slide counter badge */}
                    <div className="absolute top-3 right-3 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur z-10">
                      {currentIndex + 1} / {images.length}
                    </div>
                  </div>

                  {/* Dots Indicator */}
                  {images.length > 1 && (
                    <div className="flex justify-center gap-2 py-3 bg-white">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentIndex(i)}
                          className={`rounded-full transition-all duration-300 ${
                            i === currentIndex
                              ? "w-6 h-2 bg-[#003888]"
                              : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                          }`}
                          aria-label={`ไปที่รีวิวที่ ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Placeholder when no images uploaded yet */
                <div className="w-full aspect-video bg-white/10 flex flex-col items-center justify-center gap-3 text-white/60">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                  <p className="text-sm">อัพโหลดรูป screenshot รีวิวใน Directus</p>
                  <p className="text-xs opacity-60">แนะนำขนาด 1920×1080 px</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
