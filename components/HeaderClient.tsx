"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationItem, Page } from "@/lib/types";

// Helper function to get the URL for a navigation item
function getNavigationUrl(item: NavigationItem): string {
  if (item.url) {
    return item.url;
  }
  if (item.page) {
    if (typeof item.page === 'object' && 'slug' in item.page) {
      const page = item.page as Page;
      return `/${page.slug === 'home' ? '' : page.slug}`;
    }
  }
  return '#';
}

interface HeaderClientProps {
  navigationItems: NavigationItem[];
  siteName?: string;
  logo?: string;
}

export default function HeaderClient({ navigationItems, siteName = "BAOMUE", logo }: HeaderClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (item: NavigationItem): boolean => {
    const url = getNavigationUrl(item);
    if (url === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(url) || false;
  };

  return (
    <header className="sticky z-50 bg-white/95 border-slate-200 border-b top-0 backdrop-blur-lg shadow-sm">
      <div className="flex h-20 max-w-7xl mr-auto ml-auto pr-6 pl-6 items-center justify-between">
        <div className="flex gap-3 items-center">
          <div className="flex flex-col leading-none">
            <Link
              href="/"
              className="flex transition-all duration-300 hover:scale-105 cursor-pointer group items-center gap-3"
            >
              <div className="shrink-0 flex overflow-hidden items-center justify-start">
                <img 
                  src={logo || "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c4b9c3ac-abfd-48b9-b61e-6a6a55621186_320w.png"} 
                  alt="Logo" 
                  className="w-[100px] h-auto"
                  style={{
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                    borderRadius: '20px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                    border: '0.5px solid rgba(0, 0, 0, 0.08)',
                    backdropFilter: 'blur(20px)',
                  }}
                />
              </div>
            </Link>
          </div>
        </div>

        <nav 
          className="hidden lg:flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5"
        >
          {navigationItems.map((item) => {
            const url = getNavigationUrl(item);
            const active = isActive(item);

            return (
              <Link
                key={item.id}
                href={url}
                target={item.target || '_self'}
                className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                  active 
                    ? "text-white bg-blue-600 shadow-md" 
                    : "text-slate-700 hover:bg-white hover:text-blue-600"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center justify-center text-sm font-semibold text-white h-11 rounded-full px-6 bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
          >
            ติดต่อเรา
          </Link>
          <button 
            className="lg:hidden text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16"></path>
              <path d="M4 12h16"></path>
              <path d="M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md">
          <nav className="flex flex-col px-6 py-4 space-y-3 text-base font-medium text-slate-700">
            {navigationItems.map((item) => {
              const url = getNavigationUrl(item);
              const active = isActive(item);

              return (
                <Link
                  key={item.id}
                  href={url}
                  target={item.target || '_self'}
                  className={`py-2 px-4 rounded-lg transition-colors ${
                    active ? "text-white bg-blue-600" : "hover:bg-slate-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
