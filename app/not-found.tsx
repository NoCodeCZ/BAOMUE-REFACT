import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="text-center max-w-md px-6">
        <h2 className="text-4xl font-semibold text-neutral-900 mb-4">404</h2>
        <p className="text-neutral-500 mb-6">Page not found</p>
        <Link
          href="/"
          className="inline-block bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2 rounded-full transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}







