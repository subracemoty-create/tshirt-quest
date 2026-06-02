const SHIRT_COLORS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Light Gray', hex: '#C8C8C8' },
  { name: 'Dark Gray', hex: '#666666' },
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'Navy', hex: '#1B2A4A' },
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Sky Blue', hex: '#7DD3FC' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Burgundy', hex: '#7F1D1D' },
  { name: 'Pink', hex: '#F9A8D4' },
  { name: 'Hot Pink', hex: '#EC4899' },
  { name: 'Orange', hex: '#EA580C' },
  { name: 'Yellow', hex: '#FACC15' },
  { name: 'Green', hex: '#16A34A' },
  { name: 'Forest', hex: '#14532D' },
  { name: 'Olive / IDF', hex: '#4B5320' },
  { name: 'Purple', hex: '#7C3AED' },
]

export default function ColorPickerModal({ isOpen, onClose, currentColor, onColorSelect }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white border-4 border-pink-400 rounded-2xl p-6 w-[90%] max-w-sm shadow-[6px_6px_0_black] relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 bg-black text-white rounded-full font-bold text-lg flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer"
        >
          X
        </button>

        <h2 className="font-game text-sm mb-5 text-black">Pick shirt color</h2>

        <div className="grid grid-cols-4 gap-3">
          {SHIRT_COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => { onColorSelect(c.hex); onClose() }}
              className={`
                w-full aspect-square rounded-xl border-3 cursor-pointer
                transition-all duration-150 hover:scale-110
                ${currentColor === c.hex
                  ? 'border-pink-500 shadow-[0_0_12px_rgba(255,0,150,0.5)] scale-110'
                  : 'border-black shadow-[2px_2px_0_black] hover:shadow-[3px_3px_0_black]'
                }
              `}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            >
              {currentColor === c.hex && (
                <span className="text-lg drop-shadow-[0_0_2px_white]">
                  {c.hex === '#1a1a1a' || c.hex === '#1B2A4A' || c.hex === '#7F1D1D' || c.hex === '#14532D' || c.hex === '#666666'
                    ? '✦'
                    : '✦'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
