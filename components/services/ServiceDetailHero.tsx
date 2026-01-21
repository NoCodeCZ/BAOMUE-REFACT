import Image from "next/image";
import Link from "next/link";
import { Service } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";

interface ServiceDetailHeroProps {
  service: Service;
}

export default function ServiceDetailHero({ service }: ServiceDetailHeroProps) {
  const imageUrl = service.hero_image 
    ? getFileUrl(service.hero_image as any)
    : "/placeholder-service.jpg";

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
      {/* Image Section */}
      <div className="space-y-4">
        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={service.name}
              width={600}
              height={450}
              className="w-full h-full object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
              <span className="text-slate-400">No image</span>
            </div>
          )}
        </div>
        {/* Gallery thumbnails - not in current Service type, but placeholder for future */}
      </div>
      
      {/* Service Info Section */}
      <div>
        {service.category && typeof service.category === 'object' && (
          <span className="text-cyan-600 font-medium">
            {service.category.name}
          </span>
        )}
        <h1 className="text-3xl md:text-4xl font-display text-slate-900 mt-2 font-semibold">
          {service.name}
        </h1>
        
        {/* Pricing */}
        <div className="flex items-center gap-4 mt-4">
          {service.price_from && (
            <span className="text-2xl md:text-3xl font-semibold text-cyan-600">
              {service.price_from}
            </span>
          )}
          {service.price_starting_from && service.price_starting_from !== service.price_from && (
            <span className="text-lg text-slate-400 line-through">
              {service.price_starting_from}
            </span>
          )}
        </div>
        
        {/* Description */}
        {service.short_description && (
          <p className="text-slate-600 mt-6 text-lg">
            {service.short_description}
          </p>
        )}
        
        {/* Features List - from JSON field if available */}
        {service.features && Array.isArray(service.features) && service.features.length > 0 && (
          <ul className="mt-6 space-y-3">
            {service.features.map((feature, index) => {
              // Handle both string and object formats
              const featureText = typeof feature === 'string' ? feature : feature.title || feature.description || '';
              return (
                <li key={index} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-600">{featureText}</span>
                </li>
              );
            })}
          </ul>
        )}
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href={`/contact?service=${service.slug}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-cyan-600 text-white font-semibold rounded-full hover:bg-cyan-700 transition-colors"
          >
            {service.cta_booking_text || "Book Appointment"}
          </Link>
          <Link
            href={service.cta_line_link || "https://line.me/ti/p/@baomue"}
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-full hover:border-cyan-600 hover:text-cyan-600 transition-colors"
          >
            {service.cta_line_text || "Contact Us"}
          </Link>
        </div>
        
        {/* Duration/Time Info */}
        {service.duration_label && (
          <div className="mt-6 flex items-center gap-2 text-slate-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Treatment time: {service.duration_label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

