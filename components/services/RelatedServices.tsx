import { Service } from "@/lib/types";
import ServiceCard from "./ServiceCard";

interface RelatedServicesProps {
  services: Service[];
  currentServiceId: number;
}

export default function RelatedServices({ services, currentServiceId }: RelatedServicesProps) {
  const relatedServices = services
    .filter(s => s.id !== currentServiceId)
    .slice(0, 3);
  
  if (relatedServices.length === 0) return null;
  
  return (
    <section className="mt-16 pt-12 border-t border-slate-200">
      <h2 className="text-2xl font-semibold text-slate-900 mb-8">Related Services</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedServices.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}

