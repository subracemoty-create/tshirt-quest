import { useRef, useCallback } from 'react'

export default function ShirtCanvas({ designPreview, shirtColor = '#C8C8C8', designScale = 1, onScaleChange, designY = 22, onDesignYChange }) {
  const MIN_SCALE = 0.3
  const MAX_SCALE = 2.5
  const STEP = 0.15
  const MIN_Y = 5
  const MAX_Y = 75

  const dragState = useRef(null)
  const containerRef = useRef(null)

  const startDrag = useCallback((startClientY) => {
    dragState.current = { startClientY, startDesignY: designY }
  }, [designY])

  const moveDrag = useCallback((clientY) => {
    if (!dragState.current || !containerRef.current) return
    const containerHeight = containerRef.current.offsetHeight
    const deltaPixels = clientY - dragState.current.startClientY
    const deltaPct = (deltaPixels / containerHeight) * 100
    const newY = Math.min(MAX_Y, Math.max(MIN_Y, dragState.current.startDesignY + deltaPct))
    onDesignYChange(newY)
  }, [onDesignYChange])

  const endDrag = useCallback(() => {
    dragState.current = null
  }, [])

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    startDrag(e.clientY)
    const onMove = (ev) => moveDrag(ev.clientY)
    const onUp = () => { endDrag(); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [startDrag, moveDrag, endDrag])

  const handleTouchStart = useCallback((e) => {
    startDrag(e.touches[0].clientY)
    const onMove = (ev) => { ev.preventDefault(); moveDrag(ev.touches[0].clientY) }
    const onEnd = () => { endDrag(); window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd) }
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onEnd)
  }, [startDrag, moveDrag, endDrag])

  return (
    <div className="relative flex flex-col items-center">
      {/* Rainbow border frame */}
      <div
        className="relative p-[6px] rounded-2xl shadow-[4px_4px_0_black]"
        style={{
          background: 'conic-gradient(from 180deg, #ff00aa, #aa00ff, #5500ff, #00aaff, #00ffaa, #aaff00, #ffaa00, #ff5500, #ff00aa)',
        }}
      >
        <div className="bg-white rounded-xl p-4 md:p-6 min-h-[340px] min-w-[290px] md:min-w-[380px] flex flex-col items-center justify-center relative overflow-hidden">

          {/* Title */}
          {!designPreview && (
            <p
              className="font-game text-[10px] md:text-xs text-center mb-3 bg-clip-text text-transparent leading-relaxed"
              style={{ backgroundImage: 'linear-gradient(90deg, #ff6600, #ff0066, #cc00ff)' }}
            >
              Drag & Drop your<br/>design here
            </p>
          )}

          {/* T-shirt SVG */}
          <div ref={containerRef} className="relative w-[230px] h-[250px] md:w-[300px] md:h-[310px]">
            <svg viewBox="0 0 280 300" className="w-full h-full">
              <path
                d="M70,0 L0,60 L30,90 L60,70 L60,280 C60,290 65,295 75,295 L205,295 C215,295 220,290 220,280 L220,70 L250,90 L280,60 L210,0 L180,20 C170,28 160,32 140,32 C120,32 110,28 100,20 Z"
                fill={shirtColor}
                stroke="#999"
                strokeWidth="1.5"
              />
              <path
                d="M100,20 C110,30 120,35 140,35 C160,35 170,30 180,20"
                fill="none"
                stroke="#aaa"
                strokeWidth="1.5"
              />
            </svg>

            {/* Draggable design on shirt */}
            {designPreview && (
              <div
                className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                style={{
                  top: `${designY}%`,
                  width: `${45 * designScale}%`,
                  maxWidth: '85%',
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                <img
                  src={designPreview}
                  alt="Your design"
                  className="w-full h-auto object-contain drop-shadow-md pointer-events-none"
                  draggable={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resize controls */}
      {designPreview && (
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => onScaleChange(Math.max(MIN_SCALE, designScale - STEP))}
            disabled={designScale <= MIN_SCALE}
            className="w-10 h-10 rounded-full bg-white border-3 border-black shadow-[2px_2px_0_black] font-game text-lg text-black flex items-center justify-center hover:bg-gray-100 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            −
          </button>

          <span className="font-game text-[9px] text-gray-600 w-14 text-center">
            {Math.round(designScale * 100)}%
          </span>

          <button
            onClick={() => onScaleChange(Math.min(MAX_SCALE, designScale + STEP))}
            disabled={designScale >= MAX_SCALE}
            className="w-10 h-10 rounded-full bg-white border-3 border-black shadow-[2px_2px_0_black] font-game text-lg text-black flex items-center justify-center hover:bg-gray-100 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}
