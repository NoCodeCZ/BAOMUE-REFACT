"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

interface PromotionImage {
  id: number;
  title: string;
  slug: string;
  imageUrl: string;
  cta_link?: string;
}

interface PromotionGalleryProps {
  promotions: PromotionImage[];
}

export default function PromotionGallery({ promotions }: PromotionGalleryProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const total = promotions.length;
  if (total === 0) return null;

  // Responsive: 3 on desktop (>=1024), 2 on tablet (>=640), 1 on mobile
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 640) setItemsPerView(2);
      else setItemsPerView(1);
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const totalPages = Math.ceil(total / itemsPerView);

  // Reset page if out of bounds after resize
  useEffect(() => {
    if (currentPage >= totalPages) setCurrentPage(Math.max(0, totalPages - 1));
  }, [totalPages, currentPage]);

  const nextSlide = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevSlide = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Auto-advance every 4 seconds (pause on hover)
  useEffect(() => {
    if (totalPages <= 1 || isHovered) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [totalPages, isHovered, nextSlide]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((prev) => prev !== null ? (prev + 1) % total : null);
      if (e.key === "ArrowLeft") setLightboxIndex((prev) => prev !== null ? (prev - 1 + total) % total : null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, total]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  // Touch/swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }
  };

  // Each item width as percentage of container
  const itemWidthPercent = 100 / itemsPerView;
  const gapPx = 16; // gap between items

  return (
    <section className="rounded-[32px] overflow-hidden bg-gradient-to-br from-blue-500 to-sky-500 p-6 lg:p-10 text-white relative shadow-lg shadow-blue-500/20">
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-xs font-medium mb-3 text-amber-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="5" y1="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
            โปรโมชั่นพิเศษ
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">โปรโมชั่นสุดคุ้ม</h2>
        </div>

        {/* Gallery Slider */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                gap: `${gapPx}px`,
                transform: `translateX(calc(-${currentPage * 100}% - ${currentPage * gapPx}px))`,
              }}
            >
              {promotions.map((promo, index) => (
                <div
                  key={promo.id}
                  className="flex-shrink-0"
                  style={{ width: `calc(${itemWidthPercent}% - ${((itemsPerView - 1) * gapPx) / itemsPerView}px)` }}
                >
                  <button
                    onClick={() => openLightbox(index)}
                    className="block w-full text-left group cursor-pointer"
                  >
                    <div className="overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow">
                      <img
                        src={promo.imageUrl}
                        alt={promo.title}
                        className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {totalPages > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute -left-2 lg:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
                aria-label="โปรโมชั่นก่อนหน้า"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute -right-2 lg:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
                aria-label="โปรโมชั่นถัดไป"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentPage
                    ? "w-6 h-2 bg-white"
                    : "w-2 h-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`ไปที่หน้าที่ ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-5">
          <Link
            href="/promotions"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            ดูโปรโมชั่นทั้งหมด
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
      {/* Lightbox Overlay */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="ปิด"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>

          {/* Save / Download Button */}
          <a
            href={promotions[lightboxIndex].imageUrl}
            download={`promotion-${promotions[lightboxIndex].slug || promotions[lightboxIndex].id}.jpg`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 right-16 h-10 px-4 bg-white/10 hover:bg-white/20 rounded-full flex items-center gap-2 text-white text-sm font-medium transition-colors z-10"
            aria-label="บันทึกรูปภาพ"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" x2="12" y1="15" y2="3"></line>
            </svg>
            บันทึกรูป
          </a>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-white/70 text-sm z-10">
            {lightboxIndex + 1} / {total}
          </div>

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={promotions[lightboxIndex].imageUrl}
              alt={promotions[lightboxIndex].title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Prev / Next Arrows */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => prev !== null ? (prev - 1 + total) % total : null); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
                aria-label="รูปก่อนหน้า"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => prev !== null ? (prev + 1) % total : null); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
                aria-label="รูปถัดไป"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
