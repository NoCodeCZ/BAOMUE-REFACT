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
      image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800&q=80',
      badge: 'ลด 30%',
      title: 'จัดฟันใส Invisalign',
      description: 'เริ่มต้นเพียง ฿59,000',
    },
    {
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80',
      badge: 'ฟรี!',
      title: 'ตรวจฟัน + ขูดหินปูน',
      description: 'สำหรับลูกค้าใหม่',
    },
    {
      image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80',
      badge: 'ผ่อน 0%',
      title: 'ฟอกสีฟัน Zoom',
      description: 'ผ่อนได้สูงสุด 10 เดือน',
    },
    {
      image: 'https://images.unsplash.com/photo-1629946832022-c327f74956e0?w=800&q=80',
      badge: 'พิเศษ',
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
                  className="absolute top-0 right-0 bottom-0 left-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 40%, transparent 100%)',
                  }}
                ></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block bg-[#1DAEE0] text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
                    {promo.badge}
                  </span>
                  <h4 className="text-white font-semibold text-lg">{promo.title}</h4>
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
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
      >
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
        >
          <path d="m15 18-6-6 6-6"></path>
        </svg>
      </button>
      <button
        onClick={() => moveCarousel(1)}
        className="-translate-y-1/2 flex hover:bg-white/30 transition-colors z-10 text-white bg-white/20 w-10 h-10 rounded-full absolute top-1/2 right-2 backdrop-blur items-center justify-center"
      >
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
        >
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
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







