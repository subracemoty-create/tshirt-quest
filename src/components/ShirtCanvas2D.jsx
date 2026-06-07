import { useCallback } from 'react'

const PRESETS = {
  center: { x: 50, y: 40, scale: 1.0, label: 'מרכז' },
  leftChest: { x: 62, y: 28, scale: 0.38, label: 'חזה שמאל' },
  rightChest: { x: 38, y: 28, scale: 0.38, label: 'חזה ימין' },
}

const Y_STEP = 3

function TShirtSVG({ color }) {
  return (
    <svg viewBox="0 0 520 420" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shirt body */}
      <path
        d={`
          M 175 60
          Q 195 46, 220 42
          Q 242 38, 260 38
          Q 278 38, 300 42
          Q 325 46, 345 60

          L 420 96
          L 458 134
          Q 461 138, 458 142
          L 406 176
          Q 402 179, 398 176
          L 362 148
          L 362 370
          Q 362 380, 352 380
          L 168 380
          Q 158 380, 158 370
          L 158 148
          L 122 176
          Q 118 179, 114 176
          L 62 142
          Q 59 138, 62 134
          L 100 96
          Z
        `}
        fill={color}
        stroke="#00000030"
        strokeWidth="2"
      />
      {/* Collar */}
      <path
        d={`
          M 188 60
          Q 206 76, 228 80
          Q 246 84, 260 84
          Q 274 84, 292 80
          Q 314 76, 332 60
        `}
        fill="none"
        stroke="#00000018"
        strokeWidth="2.5"
      />
      {/* Armhole seams */}
      <path
        d={`
          M 158 148 Q 172 138, 182 124
          M 362 148 Q 348 138, 338 124
        `}
        fill="none"
        stroke="#00000010"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export default function ShirtCanvas2D({
  activeSide,
  frontDesign,
  backDesign,
  shirtColor,
  frontLayout,
  backLayout,
  onLayoutChange,
}) {
  const design = activeSide === 'front' ? frontDesign : backDesign
  const layout = activeSide === 'front' ? frontLayout : backLayout

  const update = useCallback((patch) => {
    onLayoutChange(activeSide, patch)
  }, [activeSide, onLayoutChange])

  const applyPreset = useCallback((key) => {
    const p = PRESETS[key]
    update({ x: p.x, y: p.y, scale: p.scale })
  }, [update])

  const nudgeY = useCallback((dir) => {
    update({ y: Math.max(10, Math.min(85, layout.y + dir * Y_STEP)) })
  }, [layout.y, update])

  const designSizePx = layout.scale * 55

  return (
    <div className="flex flex-col items-center min-h-0 flex-1 select-none">
      {/* T-shirt area — fills available space */}
      <div className="relative w-full max-w-sm flex-1 min-h-0">
        <div className="absolute inset-0">
          <TShirtSVG color={shirtColor} />
        </div>

        {/* Design overlay */}
        {design && (
          <img
            src={design}
            alt="Design"
            draggable={false}
            className="absolute pointer-events-none"
            style={{
              width: `${designSizePx}%`,
              left: `${layout.x}%`,
              top: `${layout.y}%`,
              transform: 'translate(-50%, -50%)',
              maxHeight: '60%',
              objectFit: 'contain',
            }}
          />
        )}

        {/* "Drag & Drop" hint when no design */}
        {!design && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="font-game text-[9px] md:text-[10px] text-cyan-400/60 text-center leading-relaxed mt-[-10%]">
              Drag &amp; Drop your<br />design here
            </p>
          </div>
        )}

        {/* Side indicator badge */}
        <div className="absolute top-1 right-1">
          <span className={`
            font-game text-[6px] px-1.5 py-0.5 rounded border
            ${activeSide === 'front'
              ? 'border-cyan-500/40 text-cyan-400 bg-cyan-400/10'
              : 'border-pink-500/40 text-pink-400 bg-pink-400/10'
            }
          `}>
            {activeSide === 'front' ? 'FRONT' : 'BACK'}
          </span>
        </div>
      </div>

      {/* === Controls bar — flows below the shirt === */}
      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur rounded-xl px-2.5 py-1.5 border border-cyan-500/30 shrink-0">
        {/* Zoom */}
        <button
          onClick={() => update({ scale: Math.max(0.2, layout.scale - 0.1) })}
          className="font-game text-[10px] text-white hover:text-cyan-400 cursor-pointer px-1"
        >−</button>
        <span className="font-game text-[7px] text-cyan-400 min-w-[2rem] text-center">
          {Math.round(layout.scale * 100)}%
        </span>
        <button
          onClick={() => update({ scale: Math.min(2, layout.scale + 0.1) })}
          className="font-game text-[10px] text-white hover:text-cyan-400 cursor-pointer px-1"
        >+</button>

        <div className="w-px h-4 bg-cyan-500/30 mx-0.5" />

        {/* Y nudge */}
        <button
          onClick={() => nudgeY(-1)}
          className="font-game text-[8px] text-white hover:text-yellow-400 cursor-pointer px-0.5"
          title="מעלה"
        >▲</button>
        <button
          onClick={() => nudgeY(1)}
          className="font-game text-[8px] text-white hover:text-yellow-400 cursor-pointer px-0.5"
          title="מטה"
        >▼</button>

        <div className="w-px h-4 bg-cyan-500/30 mx-0.5" />

        {/* Presets */}
        {Object.entries(PRESETS).map(([key, p]) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            className={`
              font-game text-[5px] md:text-[6px] px-1.5 py-0.5 rounded border cursor-pointer transition-all
              ${layout.x === p.x && layout.y === p.y && layout.scale === p.scale
                ? 'border-cyan-400 text-cyan-400 bg-cyan-400/15'
                : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white'
              }
            `}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
