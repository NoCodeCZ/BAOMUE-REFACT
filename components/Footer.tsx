import { Twitter, Github, Instagram } from 'lucide-react';
import type { BlockFooter } from '@/lib/types';

interface FooterProps {
  block: BlockFooter;
}

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  github: Github,
  instagram: Instagram,
};

export default function Footer({ block }: FooterProps) {
  const content = block.content;
  if (!content) return null;

  return (
    <footer className="bg-[#FAFAFA] pt-20 pb-10 border-t border-neutral-200/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="text-lg font-semibold tracking-tight text-neutral-900 flex items-center gap-2 mb-4">
              <div className="w-4 h-4 rounded-full bg-neutral-800"></div>
              {content.site_name || 'Aura'}
            </a>
            {content.description && (
              <p className="text-neutral-400 text-sm font-light">
                {content.description}
              </p>
            )}
          </div>
          
          {content.product_links && content.product_links.length > 0 && (
            <div>
              <h4 className="font-medium text-neutral-900 mb-4 text-sm">Product</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                {content.product_links.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="hover:text-neutral-900 transition-colors">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {content.company_links && content.company_links.length > 0 && (
            <div>
              <h4 className="font-medium text-neutral-900 mb-4 text-sm">Company</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                {content.company_links.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="hover:text-neutral-900 transition-colors">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {content.legal_links && content.legal_links.length > 0 && (
            <div>
              <h4 className="font-medium text-neutral-900 mb-4 text-sm">Legal</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                {content.legal_links.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="hover:text-neutral-900 transition-colors">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neutral-200">
          {content.copyright && (
            <div className="text-xs text-neutral-400 mb-4 md:mb-0">
              {content.copyright}
            </div>
          )}
          {content.social_links && content.social_links.length > 0 && (
            <div className="flex gap-4">
              {content.social_links.map((link, index) => {
                const IconComponent = socialIconMap[link.platform] || Twitter;
                return (
                  <a
                    key={index}
                    href={link.href}
                    className="text-neutral-400 hover:text-neutral-900 transition-colors"
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}







