export default function Header({ cartCount = 0, level = 1 }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#0a0a1a]/80 backdrop-blur-md border-b-2 border-cyan-500/30 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🛸</span>
        <h1 className="font-game text-sm md:text-base tracking-tight text-cyan-300 uppercase drop-shadow-[0_0_8px_rgba(0,200,255,0.4)]">
          T-Shirt Quest
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Cart */}
        <button className="relative p-2 hover:scale-110 transition-transform">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-game w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_6px_rgba(255,0,0,0.5)]">
              {cartCount}
            </span>
          )}
        </button>

        {/* Level badge */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-cyan-400/50 flex items-center justify-center shadow-[0_0_10px_rgba(255,200,0,0.4)]">
          <span className="font-game text-[10px] text-black">{level}</span>
        </div>
      </div>
    </header>
  )
}
