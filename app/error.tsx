'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="text-center max-w-md px-6">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
          Something went wrong!
        </h2>
        <p className="text-neutral-500 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2 rounded-full transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}







