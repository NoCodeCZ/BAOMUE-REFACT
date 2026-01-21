import Link from 'next/link';
import { getGlobalSettings } from '@/lib/data';

export default async function Navbar() {
  const settings = await getGlobalSettings();
  const siteName = settings?.site_name || 'Aura';

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#FAFAFA]/80 backdrop-blur-xl border-b border-neutral-200/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight text-neutral-900 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-500"></div>
          {siteName}
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-500">
          <a href="#features" className="hover:text-neutral-900 transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-neutral-900 transition-colors">Stories</a>
          <a href="#pricing" className="hover:text-neutral-900 transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="hidden sm:block text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Log in</a>
          <a href="#" className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md">
            Download
          </a>
        </div>
      </div>
    </nav>
  );
}







