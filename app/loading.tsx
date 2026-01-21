export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600 px-4">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Outer spinning ring */}
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
          
          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20 inline-block">
          <p className="text-white font-semibold text-lg">กำลังโหลด...</p>
          <p className="text-white/70 text-sm mt-1">Loading...</p>
        </div>
      </div>
    </div>
  );
}







