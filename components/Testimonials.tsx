import { Star } from 'lucide-react';
import type { BlockTestimonials, PageTestimonial } from '@/lib/types';

interface TestimonialsProps {
  block: BlockTestimonials;
  testimonials: PageTestimonial[];
}

export default function Testimonials({ block, testimonials }: TestimonialsProps) {
  return (
    <section id="testimonials" className="py-24 bg-[#FAFAFA] border-t border-neutral-200/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          {block.section_title && (
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              {block.section_title}
            </h2>
          )}
          {block.section_description && (
            <p className="text-neutral-500">
              {block.section_description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="gradient-border-mask p-6 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="flex gap-1 mb-4 text-neutral-900">
                {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-neutral-700 leading-relaxed mb-6 font-medium">
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-xs font-semibold text-neutral-600">
                  {testimonial.avatar_initial || testimonial.author_name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">
                    {testimonial.author_name}
                  </div>
                  {testimonial.role && (
                    <div className="text-xs text-neutral-400">
                      {testimonial.role}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}







