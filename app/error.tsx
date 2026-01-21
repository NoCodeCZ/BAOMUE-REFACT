'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600 px-4">
      <div className="text-center max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            เกิดข้อผิดพลาด
          </h1>
          
          <p className="text-white/90 text-lg mb-2">
            Something went wrong!
          </p>
          
          {error.message && (
            <p className="text-white/70 text-sm mb-8 font-mono bg-white/10 rounded-lg p-3">
              {error.message}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="group h-12 px-6 rounded-2xl bg-white text-[#003888] font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-lg"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              ลองอีกครั้ง
            </button>
            
            <Link
              href="/"
              className="h-12 px-6 rounded-2xl bg-white/10 backdrop-blur-xl text-white font-semibold border border-white/20 flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
            >
              <Home className="w-4 h-4" />
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}







