import { Check } from 'lucide-react';
import type { BlockPricing, PagePricingPlan } from '@/lib/types';

interface PricingProps {
  block: BlockPricing;
  plans: PagePricingPlan[];
}

export default function Pricing({ block, plans }: PricingProps) {
  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
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

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative group ${
                plan.is_featured
                  ? 'relative'
                  : 'p-8 rounded-[2rem] border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 transition-colors'
              }`}
            >
              {plan.is_featured && (
                <>
                  <div className="absolute -inset-[1px] bg-gradient-to-b from-neutral-200 via-neutral-100 to-white rounded-[2rem] -z-10"></div>
                  <div className="relative p-8 rounded-[2rem] bg-white shadow-xl shadow-neutral-200/40 border border-transparent">
                    <div className="absolute top-0 right-0 p-6">
                      {plan.badge_text && (
                        <span className="bg-neutral-900 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full">
                          {plan.badge_text}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      {plan.plan_name}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-semibold tracking-tight text-neutral-900">
                        {plan.price}
                      </span>
                      {plan.price_period && (
                        <span className="text-neutral-500 text-sm">
                          {plan.price_period}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-4 mb-8">
                      {plan.features?.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 text-sm text-neutral-600">
                          <Check className="w-4 h-4 text-neutral-900" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {plan.cta_text && (
                      <a
                        href={plan.cta_link || '#'}
                        className="block w-full py-3 px-6 rounded-full bg-neutral-900 text-center text-sm font-medium text-white hover:bg-neutral-800 transition-all shadow-md"
                      >
                        {plan.cta_text}
                      </a>
                    )}
                  </div>
                </>
              )}

              {!plan.is_featured && (
                <>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    {plan.plan_name}
                  </h3>
                  <div className="text-4xl font-semibold tracking-tight text-neutral-900 mb-6">
                    {plan.price}
                    {plan.price_period && (
                      <span className="text-sm text-neutral-500">{plan.price_period}</span>
                    )}
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features?.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm text-neutral-600">
                        <Check className="w-4 h-4 text-neutral-900" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {plan.cta_text && (
                    <a
                      href={plan.cta_link || '#'}
                      className="block w-full py-3 px-6 rounded-full border border-neutral-200 text-center text-sm font-medium text-neutral-900 hover:bg-white transition-colors"
                    >
                      {plan.cta_text}
                    </a>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}







