const CATEGORIES = [
  { id: 'adults', emoji: '👕', label: 'ADULTS', hebrew: 'בוגרים', color: 'pink' },
  { id: 'kids',   emoji: '👦', label: 'KIDS',   hebrew: 'ילדים',  color: 'cyan' },
  { id: 'caps',   emoji: '🧢', label: 'CAPS',   hebrew: 'כובעים', color: 'yellow' },
  { id: 'mugs',   emoji: '☕', label: 'MUGS',   hebrew: 'כוסות',  color: 'purple' },
  { id: 'bags',   emoji: '🎒', label: 'BAGS',   hebrew: 'תיקים',  color: 'green' },
]

const colorStyles = {
  pink:   { gradient: 'from-pink-400 to-pink-600',   border: 'border-pink-300',   shadow: '0 0 30px rgba(255,0,150,0.4), 0 0 60px rgba(255,0,150,0.15)', hoverShadow: '0 0 45px rgba(255,0,150,0.6), 0 0 80px rgba(255,0,150,0.25)' },
  cyan:   { gradient: 'from-cyan-400 to-cyan-600',   border: 'border-cyan-300',   shadow: '0 0 30px rgba(0,200,255,0.4), 0 0 60px rgba(0,200,255,0.15)', hoverShadow: '0 0 45px rgba(0,200,255,0.6), 0 0 80px rgba(0,200,255,0.25)' },
  yellow: { gradient: 'from-yellow-300 to-yellow-500', border: 'border-yellow-200', shadow: '0 0 30px rgba(255,200,0,0.4), 0 0 60px rgba(255,200,0,0.15)', hoverShadow: '0 0 45px rgba(255,200,0,0.6), 0 0 80px rgba(255,200,0,0.25)' },
  purple: { gradient: 'from-purple-400 to-purple-600', border: 'border-purple-300', shadow: '0 0 30px rgba(150,0,255,0.4), 0 0 60px rgba(150,0,255,0.15)', hoverShadow: '0 0 45px rgba(150,0,255,0.6), 0 0 80px rgba(150,0,255,0.25)' },
  green:  { gradient: 'from-green-400 to-green-600',  border: 'border-green-300',  shadow: '0 0 30px rgba(0,200,100,0.4), 0 0 60px rgba(0,200,100,0.15)', hoverShadow: '0 0 45px rgba(0,200,100,0.6), 0 0 80px rgba(0,200,100,0.25)' },
}

export default function MainMenu({ onSelectCategory }) {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-6 md:gap-8 px-4 py-4">
      {/* Title block */}
      <div className="text-center">
        <h2
          className="font-game text-lg md:text-2xl text-cyan-300 tracking-wide drop-shadow-[0_0_15px_rgba(0,200,255,0.5)]"
          style={{ textShadow: '0 0 20px rgba(0,200,255,0.4), 0 2px 0 #000' }}
        >
          T-SHIRT QUEST
        </h2>
        <p
          className="font-game text-[9px] md:text-xs text-yellow-300 tracking-[0.3em] mt-1"
          style={{ textShadow: '0 0 12px rgba(255,200,0,0.4)' }}
        >
          SPACE CUSTOMIZER
        </p>
        <div className="mt-2 h-0.5 w-40 md:w-56 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
      </div>

      {/* Subtitle */}
      <p className="font-game text-[8px] md:text-[10px] text-gray-400 tracking-widest">
        SELECT YOUR MISSION
      </p>

      {/* Category buzzers */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 w-full max-w-md md:max-w-lg">
        {CATEGORIES.map((cat) => {
          const s = colorStyles[cat.color]
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`
                group relative cursor-pointer select-none
                bg-gradient-to-b ${s.gradient}
                border-4 border-black rounded-2xl
                px-3 py-4 md:px-5 md:py-5
                shadow-[6px_6px_0_black]
                hover:shadow-[8px_8px_0_black] hover:-translate-x-0.5 hover:-translate-y-0.5
                active:shadow-[2px_2px_0_black] active:translate-x-1 active:translate-y-1
                transition-all duration-100
                flex flex-col items-center gap-1.5
              `}
              style={{ boxShadow: `6px 6px 0 black, ${s.shadow}` }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `8px 8px 0 black, ${s.hoverShadow}`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = `6px 6px 0 black, ${s.shadow}`}
            >
              {/* Highlight reflection */}
              <div className="absolute inset-x-3 top-1.5 h-[35%] bg-white/20 rounded-xl blur-[2px] pointer-events-none" />

              <span className="text-2xl md:text-3xl relative z-10">{cat.emoji}</span>
              <span className="font-game text-[10px] md:text-xs text-white relative z-10 drop-shadow-[1px_2px_0_rgba(0,0,0,0.5)] tracking-wider">
                {cat.label}
              </span>
              <span className="font-game text-[8px] md:text-[9px] text-white/80 relative z-10" dir="rtl">
                {cat.hebrew}
              </span>
            </button>
          )
        })}
      </div>

      {/* Bottom decoration */}
      <div className="flex items-center gap-2 mt-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_rgba(0,255,100,0.5)]" />
        <span className="font-game text-[7px] text-gray-500 tracking-widest">SYSTEMS ONLINE</span>
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(0,200,255,0.5)]" />
      </div>
    </div>
  )
}
