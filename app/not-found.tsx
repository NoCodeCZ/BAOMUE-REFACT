'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600 px-4">
      <div className="text-center max-w-lg w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="text-8xl md:text-9xl font-black text-white/20 tracking-tighter absolute -top-4 -left-4 select-none">
                404
              </div>
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center relative z-10">
                <Search className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight relative z-10">
            ไม่พบหน้าที่ต้องการ
          </h1>
          
          <p className="text-white/90 text-lg mb-2">
            Page not found
          </p>
          
          <p className="text-white/70 text-base mb-8">
            หน้าที่คุณกำลังมองหาอาจถูกลบ ย้าย หรือไม่มีอยู่
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="group h-12 px-6 rounded-2xl bg-white text-[#003888] font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-lg"
            >
              <Home className="w-4 h-4" />
              กลับหน้าหลัก
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="h-12 px-6 rounded-2xl bg-white/10 backdrop-blur-xl text-white font-semibold border border-white/20 flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              กลับไปก่อนหน้า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}







