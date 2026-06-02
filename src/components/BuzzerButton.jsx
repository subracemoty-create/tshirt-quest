const colorMap = {
  pink: {
    outer: 'from-pink-300 to-pink-500',
    inner: 'from-pink-400 to-pink-600',
    shadow: '0 0 25px rgba(255,0,150,0.5), 0 0 50px rgba(255,0,150,0.2)',
    hoverShadow: '0 0 35px rgba(255,0,150,0.7), 0 0 60px rgba(255,0,150,0.3)',
  },
  cyan: {
    outer: 'from-cyan-200 to-cyan-400',
    inner: 'from-cyan-300 to-cyan-500',
    shadow: '0 0 25px rgba(0,200,255,0.5), 0 0 50px rgba(0,200,255,0.2)',
    hoverShadow: '0 0 35px rgba(0,200,255,0.7), 0 0 60px rgba(0,200,255,0.3)',
  },
  yellow: {
    outer: 'from-yellow-200 to-yellow-400',
    inner: 'from-yellow-300 to-yellow-500',
    shadow: '0 0 25px rgba(255,200,0,0.5), 0 0 50px rgba(255,200,0,0.2)',
    hoverShadow: '0 0 35px rgba(255,200,0,0.7), 0 0 60px rgba(255,200,0,0.3)',
  },
  purple: {
    outer: 'from-purple-300 to-purple-500',
    inner: 'from-purple-400 to-purple-600',
    shadow: '0 0 25px rgba(150,0,255,0.5), 0 0 50px rgba(150,0,255,0.2)',
    hoverShadow: '0 0 35px rgba(150,0,255,0.7), 0 0 60px rgba(150,0,255,0.3)',
  },
}

export default function BuzzerButton({ label, color = 'pink', onClick }) {
  const c = colorMap[color]

  return (
    <button
      onClick={onClick}
      className="group relative cursor-pointer select-none transition-all duration-100 active:translate-y-1"
    >
      {/* Black elliptical base */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[120%] h-5 bg-gradient-to-b from-gray-800 to-black rounded-[50%]" />

      {/* Outer glow ring */}
      <div
        className={`relative z-10 w-28 h-14 md:w-32 md:h-16 rounded-[50%] bg-gradient-to-b ${c.outer} flex items-center justify-center transition-shadow duration-200`}
        style={{ boxShadow: c.shadow }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = c.hoverShadow}
        onMouseLeave={e => e.currentTarget.style.boxShadow = c.shadow}
      >
        {/* Inner dome */}
        <div className={`w-[88%] h-[80%] rounded-[50%] bg-gradient-to-b ${c.inner} flex items-center justify-center relative overflow-hidden group-active:scale-95 transition-transform`}>
          {/* Highlight reflection */}
          <div className="absolute inset-x-2 top-0.5 h-[45%] bg-white/35 rounded-[50%] blur-[1px]" />

          <span className="font-game text-[9px] md:text-[11px] text-white relative z-10 drop-shadow-[1px_2px_0_rgba(0,0,0,0.4)] tracking-wider">
            {label}
          </span>
        </div>
      </div>
    </button>
  )
}
