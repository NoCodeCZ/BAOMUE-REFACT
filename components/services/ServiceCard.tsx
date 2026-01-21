import Image from "next/image";
import Link from "next/link";
import { Service } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const imageUrl = service.hero_image 
    ? getFileUrl(service.hero_image as any)
    : "/placeholder-service.jpg";
  
  return (
    <Link 
      href={`/services/${service.slug}`}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
    >
      <div className="aspect-video overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={service.name}
            width={400}
            height={225}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <span className="text-slate-400 text-sm">No image</span>
          </div>
        )}
      </div>
      <div className="p-6">
        {service.category && typeof service.category === 'object' && (
          <span className="text-cyan-600 text-sm font-medium">
            {service.category.name}
          </span>
        )}
        <h3 className="text-xl font-semibold text-slate-900 mt-1 group-hover:text-cyan-600 transition-colors">
          {service.name}
        </h3>
        {service.short_description && (
          <p className="text-slate-600 mt-2 line-clamp-2">
            {service.short_description}
          </p>
        )}
        <div className="flex items-center justify-between mt-4">
          {service.price_from && (
            <span className="text-lg font-semibold text-cyan-600">
              {service.price_from}
            </span>
          )}
          <span className="text-cyan-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            View Details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

