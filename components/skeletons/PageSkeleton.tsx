export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-sky-600 px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="h-12 bg-white/10 rounded-2xl w-64 mb-8 animate-pulse"></div>
        
        {/* Content skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 animate-pulse"
            >
              <div className="h-48 bg-white/20 rounded-xl mb-4"></div>
              <div className="h-6 bg-white/20 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-full mb-1"></div>
              <div className="h-4 bg-white/20 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

