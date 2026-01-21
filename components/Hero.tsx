import { ArrowRight } from 'lucide-react';
import type { BlockHero } from '@/lib/types';

interface HeroProps {
  block: BlockHero;
}

export default function Hero({ block }: HeroProps) {
  return (
    <section className="pt-32 pb-24 md:pt-48 md:pb-32 px-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-neutral-100/20 to-transparent pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {block.badge_text && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-medium text-neutral-500">{block.badge_text}</span>
          </div>
        )}

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter leading-[0.95] mb-6 text-neutral-900 text-balance">
          {block.headline_line1} <br />
          <span className="text-neutral-400">{block.headline_line2}</span>
        </h1>

        {block.description && (
          <p className="text-lg md:text-xl text-neutral-500 max-w-xl mx-auto mb-10 leading-relaxed text-balance font-light">
            {block.description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          {block.primary_cta_text && (
            <a 
              href={block.primary_cta_link || '#'} 
              className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium text-white bg-neutral-900 rounded-full overflow-hidden transition-all hover:scale-105 hover:bg-neutral-800 shadow-lg shadow-neutral-500/20"
            >
              <span className="relative z-10 flex items-center gap-2">
                {block.primary_cta_text}
                <ArrowRight className="w-4 h-4" />
              </span>
            </a>
          )}
          
          {block.secondary_cta_text && (
            <a 
              href={block.secondary_cta_link || '#'} 
              className="group px-8 py-3.5 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-full hover:bg-neutral-50 transition-all hover:border-neutral-300"
            >
              {block.secondary_cta_text}
            </a>
          )}
        </div>

        {/* Abstract UI Representation */}
        <div className="relative max-w-3xl mx-auto animate-float">
          <div className="absolute -inset-1 bg-gradient-to-b from-neutral-200 to-transparent rounded-[2.5rem] blur-sm opacity-50"></div>
          <div className="relative bg-white rounded-[2rem] border border-neutral-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden aspect-[16/10] md:aspect-[2/1] flex flex-col">
            {/* Window Header */}
            <div className="h-12 border-b border-neutral-100 flex items-center px-6 gap-2 bg-[#FAFAFA]/50">
              <div className="w-3 h-3 rounded-full bg-neutral-200"></div>
              <div className="w-3 h-3 rounded-full bg-neutral-200"></div>
              <div className="w-3 h-3 rounded-full bg-neutral-200"></div>
            </div>
            {/* Chat Area */}
            <div className="flex-1 p-8 flex flex-col justify-center gap-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
              {/* Message Left */}
              <div className="self-start max-w-[280px] bg-white border border-neutral-100 shadow-sm rounded-2xl rounded-tl-sm p-4 flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-medium text-neutral-500">S</div>
                <div className="space-y-1">
                  <div className="h-2 w-32 bg-neutral-100 rounded-full"></div>
                  <div className="h-2 w-20 bg-neutral-100 rounded-full"></div>
                </div>
              </div>
              {/* Message Right (Active) */}
              <div className="self-end max-w-[280px] bg-neutral-900 text-white shadow-lg shadow-neutral-900/10 rounded-2xl rounded-tr-sm p-4">
                <p className="text-sm font-light">Did you see the new design? It&apos;s incredibly clean.</p>
              </div>
              {/* Interactive Element */}
              <div className="self-start max-w-[200px] mt-2">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Read 10:42 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}







