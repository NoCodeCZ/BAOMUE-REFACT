import { Zap, Layers, ShieldCheck } from 'lucide-react';
import type { BlockFeatures, PageFeature } from '@/lib/types';

interface FeaturesProps {
  block: BlockFeatures;
  features: PageFeature[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  zap: Zap,
  layers: Layers,
  'shield-check': ShieldCheck,
};

export default function Features({ block, features }: FeaturesProps) {
  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16 md:text-center max-w-2xl mx-auto">
          {block.section_title && (
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 mb-4">
              {block.section_title}
            </h2>
          )}
          {block.section_description && (
            <p className="text-neutral-500 text-lg font-light">
              {block.section_description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon ? iconMap[feature.icon] || Zap : Zap;
            const isWide = feature.layout_type === 'wide';
            const isDark = feature.layout_type === 'dark';
            
            if (isWide) {
              return (
                <div key={feature.id} className="md:col-span-2 group relative p-8 md:p-12 rounded-[2rem] bg-neutral-50 border border-neutral-100 overflow-hidden transition-all hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center mb-6 shadow-sm">
                        <IconComponent className="w-6 h-6 text-neutral-900" />
                      </div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                      {feature.description && (
                        <p className="text-neutral-500 leading-relaxed max-w-sm">
                          {feature.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Custom UI Toggle Representation */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm w-fit self-start md:self-end">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-neutral-600">{feature.title}</span>
                        <label className="flex items-center cursor-pointer relative">
                          <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (isDark) {
              return (
                <div key={feature.id} className="md:col-span-2 group relative p-8 md:p-12 rounded-[2rem] bg-neutral-900 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-neutral-800 rounded-full blur-[80px] opacity-40 translate-x-1/2 -translate-y-1/2"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="max-w-md">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur-md">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      {feature.description && (
                        <p className="text-neutral-400 leading-relaxed">
                          {feature.description}
                        </p>
                      )}
                    </div>
                    {feature.visual_data?.performance_metric && (
                      <div className="text-5xl md:text-7xl font-bold tracking-tighter text-neutral-800 group-hover:text-neutral-700 transition-colors select-none">
                        {feature.visual_data.performance_metric}
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <div key={feature.id} className="relative p-8 md:p-10 rounded-[2rem] bg-neutral-50 border border-neutral-100 overflow-hidden group">
                <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center mb-6 shadow-sm">
                  <IconComponent className="w-6 h-6 text-neutral-900" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                {feature.description && (
                  <p className="text-neutral-500 leading-relaxed mb-8">
                    {feature.description}
                  </p>
                )}
                {/* Visual */}
                <div className="space-y-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  <div className="h-10 w-full bg-white rounded-xl shadow-sm border border-neutral-100"></div>
                  <div className="h-10 w-full bg-white rounded-xl shadow-sm border border-neutral-100 opacity-60"></div>
                  <div className="h-10 w-full bg-white rounded-xl shadow-sm border border-neutral-100 opacity-30"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}







