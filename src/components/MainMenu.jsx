const CATEGORIES = [
  { id: 'adults', emoji: '👕', label: 'ADULTS', hebrew: 'בוגרים', color: 'pink' },
  { id: 'kids',   emoji: '👦', label: 'KIDS',   hebrew: 'ילדים',  color: 'cyan' },
  { id: 'caps',   emoji: '🧢', label: 'CAPS',   hebrew: 'כובעים', color: 'yellow' },
  { id: 'mugs',   emoji: '☕', label: 'MUGS',   hebrew: 'כוסות',  color: 'purple' },
  { id: 'bags',   emoji: '🎒', label: 'BAGS',   hebrew: 'תיקים',  color: 'green' },
  { id: 'babies', emoji: '👶', label: 'BABIES', hebrew: 'תינוקות', color: 'orange' },
]

const colorStyles = {
  pink:   { gradient: 'from-pink-400 to-pink-600',   border: 'border-pink-300',   shadow: '0 0 30px rgba(255,0,150,0.4), 0 0 60px rgba(255,0,150,0.15)', hoverShadow: '0 0 45px rgba(255,0,150,0.6), 0 0 80px rgba(255,0,150,0.25)' },
  cyan:   { gradient: 'from-cyan-400 to-cyan-600',   border: 'border-cyan-300',   shadow: '0 0 30px rgba(0,200,255,0.4), 0 0 60px rgba(0,200,255,0.15)', hoverShadow: '0 0 45px rgba(0,200,255,0.6), 0 0 80px rgba(0,200,255,0.25)' },
  yellow: { gradient: 'from-yellow-300 to-yellow-500', border: 'border-yellow-200', shadow: '0 0 30px rgba(255,200,0,0.4), 0 0 60px rgba(255,200,0,0.15)', hoverShadow: '0 0 45px rgba(255,200,0,0.6), 0 0 80px rgba(255,200,0,0.25)' },
  purple: { gradient: 'from-purple-400 to-purple-600', border: 'border-purple-300', shadow: '0 0 30px rgba(150,0,255,0.4), 0 0 60px rgba(150,0,255,0.15)', hoverShadow: '0 0 45px rgba(150,0,255,0.6), 0 0 80px rgba(150,0,255,0.25)' },
  green:  { gradient: 'from-green-400 to-green-600',  border: 'border-green-300',  shadow: '0 0 30px rgba(0,200,100,0.4), 0 0 60px rgba(0,200,100,0.15)', hoverShadow: '0 0 45px rgba(0,200,100,0.6), 0 0 80px rgba(0,200,100,0.25)' },
  orange: { gradient: 'from-orange-400 to-orange-600', border: 'border-orange-300', shadow: '0 0 30px rgba(255,140,0,0.4), 0 0 60px rgba(255,140,0,0.15)', hoverShadow: '0 0 45px rgba(255,140,0,0.6), 0 0 80px rgba(255,140,0,0.25)' },
}

export default function MainMenu({ onSelectCategory }) {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-4 md:gap-6 px-4 py-4">
      {/* Widescreen title */}
      <div className="w-full max-w-6xl mx-auto px-4 text-center">
        <h2
          className="text-3xl md:text-5xl lg:text-6xl text-white uppercase leading-none tracking-tight"
          style={{
            fontFamily: '"Rubik Mono One", sans-serif',
            textShadow: '4px 4px 0 #06b6d4, 0 0 20px rgba(6,182,212,0.6), 0 0 40px rgba(6,182,212,0.3)',
          }}
        >
          CREATE YOUR QUEST
        </h2>
        <p
          className="text-lg md:text-2xl lg:text-3xl text-cyan-300 mt-1 md:mt-2"
          dir="rtl"
          style={{ fontFamily: '"Rubik Mono One", sans-serif' }}
        >
          מעבדת העיצוב שלך
        </p>
      </div>

      {/* Wide sub-headline */}
      <div className="w-full max-w-5xl mx-auto px-4">
        <p
          className="font-game text-[8px] md:text-[11px] lg:text-sm text-center leading-relaxed text-white tracking-widest"
          style={{
            textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.2)',
          }}
        >
          🧬 CHOOSE FROM OUR LIBRARY OR UPLOAD YOUR OWN PNG • בחר מהספרייה או העלה עיצוב משלך
        </p>
      </div>

      {/* Wide pill badge */}
      <div
        className="w-full max-w-xl md:max-w-2xl mx-auto bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 border-4 border-black rounded-full px-6 md:px-10 py-2.5 md:py-3 text-center shadow-[6px_6px_0_black]"
        dir="rtl"
      >
        <span
          className="text-[10px] md:text-sm lg:text-base font-bold text-black tracking-wide"
          style={{ fontFamily: '"Rubik Mono One", sans-serif' }}
        >
          ⚡ פתח משימה ובחר קטגוריה להתחלת העיצוב
        </span>
      </div>

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
