const TEXT_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Gold', hex: '#F59E0B' },
  { name: 'Green', hex: '#16A34A' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Orange', hex: '#EA580C' },
]

const FONTS = [
  { id: 'Rubik', label: 'מודרני', labelEn: 'Bold', sample: 'אבג Hello' },
  { id: 'Heebo', label: 'נקי', labelEn: 'Clean', sample: 'אבג Hello' },
  { id: 'Assistant', label: 'קלאסי', labelEn: 'Classic', sample: 'אבג Hello' },
]

export default function TextPanel({ isOpen, onClose, textSettings, onTextChange, activeSide }) {
  if (!isOpen) return null

  const { text, color, font, curved } = textSettings

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white border-4 border-cyan-400 rounded-2xl p-6 w-[92%] max-w-sm shadow-[6px_6px_0_black] relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 bg-black text-white rounded-full font-bold text-lg flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer"
        >
          X
        </button>

        {/* Header */}
        <h2 className="font-game text-xs mb-4 text-black">
          Add Text — <span className={activeSide === 'front' ? 'text-cyan-500' : 'text-pink-500'}>{activeSide === 'front' ? 'FRONT' : 'BACK'}</span>
        </h2>

        {/* Text input */}
        <input
          type="text"
          value={text}
          onChange={e => onTextChange({ text: e.target.value })}
          placeholder="...הקלד טקסט"
          className="w-full px-4 py-3 border-3 border-black rounded-xl text-lg font-bold text-center bg-gray-50 shadow-[3px_3px_0_black] focus:outline-none focus:border-cyan-400 focus:shadow-[3px_3px_0_rgba(0,200,255,0.4)] transition-all mb-4"
          style={{ fontFamily: font }}
          dir="auto"
          maxLength={30}
          autoFocus
        />

        {/* Text color */}
        <div className="mb-4">
          <p className="font-game text-[7px] text-gray-500 mb-2">Text Color</p>
          <div className="flex gap-2.5 justify-center flex-wrap">
            {TEXT_COLORS.map(c => (
              <button
                key={c.hex}
                onClick={() => onTextChange({ color: c.hex })}
                className={`w-8 h-8 rounded-full border-3 cursor-pointer transition-all duration-150 hover:scale-115 ${
                  color === c.hex
                    ? 'border-cyan-400 scale-115 shadow-[0_0_10px_rgba(0,255,255,0.5)]'
                    : 'border-black shadow-[2px_2px_0_black] hover:shadow-[3px_3px_0_black]'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Font selection */}
        <div className="mb-4">
          <p className="font-game text-[7px] text-gray-500 mb-2">Font</p>
          <div className="flex gap-2">
            {FONTS.map(f => (
              <button
                key={f.id}
                onClick={() => onTextChange({ font: f.id })}
                className={`flex-1 py-2 px-1.5 rounded-xl border-3 cursor-pointer transition-all duration-150 ${
                  font === f.id
                    ? 'border-cyan-400 bg-cyan-50 shadow-[0_0_10px_rgba(0,255,255,0.3)] scale-105'
                    : 'border-black bg-white shadow-[3px_3px_0_black] hover:shadow-[4px_4px_0_black] hover:-translate-y-0.5'
                }`}
              >
                <span style={{ fontFamily: f.id, fontWeight: 700 }} className="text-sm block leading-tight text-black" dir="auto">
                  {f.sample}
                </span>
                <span className="font-game text-[6px] text-gray-400 mt-1 block">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Curve toggle */}
        <button
          onClick={() => onTextChange({ curved: !curved })}
          className={`w-full py-2.5 rounded-xl border-3 font-game text-[9px] cursor-pointer transition-all duration-150 ${
            curved
              ? 'border-cyan-400 bg-cyan-400 text-white shadow-[0_0_14px_rgba(0,255,255,0.4)] scale-[1.02]'
              : 'border-black bg-white text-black shadow-[3px_3px_0_black] hover:shadow-[4px_4px_0_black] hover:-translate-y-0.5'
          }`}
        >
          {curved ? 'Curved ON' : 'Curve Text'}
          <span className="block text-[7px] mt-0.5 opacity-70">{curved ? 'טקסט קשתי פעיל' : 'טקסט קשתי'}</span>
        </button>

        {/* Clear text */}
        {text && (
          <button
            onClick={() => onTextChange({ text: '' })}
            className="w-full mt-3 py-2 rounded-xl border-3 border-red-400 bg-red-50 text-red-500 font-game text-[8px] cursor-pointer shadow-[2px_2px_0_black] hover:bg-red-100 transition-all"
          >
            Clear Text
          </button>
        )}
      </div>
    </div>
  )
}
