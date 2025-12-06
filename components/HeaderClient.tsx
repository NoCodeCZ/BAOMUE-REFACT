"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationItem, Page } from "@/lib/types";

// Helper function to get the URL for a navigation item
function getNavigationUrl(item: NavigationItem): string {
  // If external URL is provided, use it
  if (item.url) {
    return item.url;
  }
  
  // If linked to a page, use the page slug
  if (item.page) {
    if (typeof item.page === 'object' && 'slug' in item.page) {
      const page = item.page as Page;
      return `/${page.slug === 'home' ? '' : page.slug}`;
    }
  }
  
  // Fallback to #
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
    <header className="sticky z-50 bg-white/80 border-slate-100 border-b top-0 backdrop-blur-md">
      <div className="flex h-20 max-w-7xl mr-auto ml-auto pr-6 pl-6 items-center justify-between">
        <div className="flex gap-3 items-center">
          <div className="flex flex-col leading-none">
            <Link
              href="/"
              className="flex transition-all duration-300 hover:scale-105 hover:rotate-1 hover:shadow-lg cursor-pointer group bg-white/40 border-white/40 border rounded-2xl pt-1.5 pr-4 pb-1.5 pl-1.5 shadow-md backdrop-blur-xl gap-x-3 items-center"
            >
              <div className="relative w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-inner overflow-hidden group-hover:rotate-12 transition-transform duration-500">
                <div className="bg-white/20 absolute top-0 right-0 bottom-0 left-0"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-sm w-[20px] h-[20px]"
                  style={{ color: "rgb(255, 255, 255)", width: 20, height: 20 }}
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <div className="flex flex-col leading-none justify-center">
                <span className="group-hover:text-blue-600 transition-colors text-base font-semibold text-slate-800 tracking-tight">
                  {siteName}
                </span>
                <span className="text-[0.6rem] font-normal tracking-wide text-slate-500 uppercase">
                  Dental Clinic
                </span>
              </div>
            </Link>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100/80 backdrop-blur-2xl rounded-full border border-white/40 shadow-sm ring-1 ring-black/5">
          {navigationItems.map((item) => {
            const url = getNavigationUrl(item);
            const hasChildren = item.children && item.children.length > 0;
            const active = isActive(item);

            if (hasChildren) {
              return (
                <div key={item.id} className="group relative">
                  <button
                    className={`flex items-center gap-1 px-4 py-2 text-[15px] font-medium rounded-full hover:text-slate-900 hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer ${
                      active ? "text-slate-900 bg-white shadow-sm" : "text-slate-500"
                    }`}
                  >
                    {item.title}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-down w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity"
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </button>
                  {/* Dropdown menu - you can implement this later */}
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                href={url}
                target={item.target || '_self'}
                className={`px-4 py-2 text-[15px] font-medium rounded-full hover:text-slate-900 hover:bg-white hover:shadow-sm transition-all duration-200 ${
                  active ? "text-slate-900 bg-white shadow-sm" : "text-slate-500"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hidden md:inline-flex items-center justify-center hover:bg-slate-50 hover:border-slate-400 transition-all text-lg font-medium text-slate-900 h-11 border-slate-300 border rounded-lg pr-6 pl-6"
          >
            ติดต่อเลย
          </a>
          <button
            type="button"
            className="lg:hidden text-slate-600 pt-2 pr-2 pb-2 pl-2"
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu w-[24px] h-[24px]"
              style={{ width: 24, height: 24, color: "rgb(71, 85, 105)" }}
            >
              <path d="M4 5h16"></path>
              <path d="M4 12h16"></path>
              <path d="M4 19h16"></path>
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
                  className={`py-1 hover:text-slate-900 transition-colors ${
                    active ? "text-slate-900 font-semibold" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              );
            })}
            <a
              href="#"
              className="mt-2 inline-flex h-11 px-4 items-center justify-center rounded-lg border border-slate-300 text-slate-900 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all"
            >
              ติดต่อเลย
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

