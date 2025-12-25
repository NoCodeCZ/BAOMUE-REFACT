'use client';

import { useEffect, useState } from 'react';

export default function PromotionsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const moveCarousel = (direction: number) => {
    setCurrentSlide((prev) => (prev + direction + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const promotions = [
    {
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80',
      badge: 'ฟรี!',
      badgeGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      title: 'ตรวจฟัน + ขูดหินปูน',
      description: 'สำหรับลูกค้าใหม่',
    },
    {
      image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800&q=80',
      badge: 'ลด 30%',
      badgeGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      title: 'จัดฟันใส Invisalign',
      description: 'เริ่มต้นเพียง ฿59,000',
    },
    {
      image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80',
      badge: 'ผ่อน 0%',
      badgeGradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      title: 'ฟอกสีฟัน Zoom',
      description: 'ผ่อนได้สูงสุด 10 เดือน',
    },
    {
      image: 'https://images.unsplash.com/photo-1629946832022-c327f74956e0?w=800&q=80',
      badge: 'พิเศษ',
      badgeGradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      title: 'รากฟันเทียม Premium',
      description: 'รับประกัน 10 ปี',
    },
  ];

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {promotions.map((promo, idx) => (
            <div key={idx} className="w-full flex-shrink-0">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%)',
                  }}
                ></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span 
                    className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full mb-3"
                    style={{ background: promo.badgeGradient }}
                  >
                    {promo.badge}
                  </span>
                  <h4 className="text-white font-semibold text-xl mb-1">{promo.title}</h4>
                  <p className="text-sm text-white/70">{promo.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => moveCarousel(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-white transition-colors z-10"
        style={{
          background: 'rgba(255,255,255,0.9)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6"></path>
        </svg>
      </button>
      <button
        onClick={() => moveCarousel(1)}
        className="-translate-y-1/2 flex hover:bg-white transition-colors z-10 text-slate-700 w-10 h-10 rounded-full absolute top-1/2 right-3 items-center justify-center"
        style={{
          background: 'rgba(255,255,255,0.9)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {promotions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-2 h-2 rounded-full transition-opacity ${
              idx === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}







