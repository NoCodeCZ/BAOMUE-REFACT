import { Service } from "@/lib/types";

interface ServiceDetailContentProps {
  service: Service;
}

export default function ServiceDetailContent({ service }: ServiceDetailContentProps) {
  return (
    <div className="mt-12 lg:mt-16">
      {/* Main Content */}
      {service.long_description && (
        <section className="prose prose-lg prose-slate max-w-none">
          <div className="text-slate-600 leading-relaxed whitespace-pre-line">
            {service.long_description}
          </div>
        </section>
      )}
      
      {/* Treatment Process - from JSON field if available */}
      {service.process_steps && Array.isArray(service.process_steps) && service.process_steps.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Treatment Process</h2>
          <div className="grid gap-6">
            {service.process_steps.map((step, index) => {
              // Handle both object and simple formats
              const stepData = typeof step === 'object' ? step : { title: `Step ${index + 1}`, description: step };
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-semibold">
                    {stepData.number || index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{stepData.title}</h3>
                    <p className="text-slate-600 mt-1">{stepData.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
      
      {/* Highlights Section - from Service type */}
      {service.highlights && service.highlights.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Key Highlights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {service.highlights.map((highlight, index) => (
              <div key={index} className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-2">{highlight.title}</h3>
                <p className="text-slate-600 text-sm">{highlight.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

