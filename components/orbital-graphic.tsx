export function OrbitalGraphic() {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {/* Outer orbit */}
      <div className="absolute w-[300px] h-[300px] border-2 border-[#F3F3F3] rounded-full animate-[spin_20s_linear_infinite]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#B9FF66] rounded-full flex items-center justify-center">
          <span className="text-[#191A23] text-xl">↑</span>
        </div>
      </div>

      {/* Middle orbit */}
      <div className="absolute w-[220px] h-[220px] border-2 border-[#F3F3F3] rounded-full animate-[spin_15s_linear_infinite_reverse]">
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#191A23] rounded-full flex items-center justify-center">
          <span className="text-white text-xl">→</span>
        </div>
      </div>

      {/* Inner orbit */}
      <div className="absolute w-[140px] h-[140px] border-2 border-[#F3F3F3] rounded-full animate-[spin_10s_linear_infinite]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 bg-[#B9FF66] rounded-full flex items-center justify-center">
          <span className="text-[#191A23] text-xl">↓</span>
        </div>
      </div>

      {/* Center */}
      <div className="w-16 h-16 bg-[#191A23] rounded-full z-10"></div>
    </div>
  )
}

