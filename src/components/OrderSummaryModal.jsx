const SHIRT_COLOR_NAMES = {
  '#FFFFFF': 'White', '#C8C8C8': 'Light Gray', '#666666': 'Dark Gray', '#1a1a1a': 'Black',
  '#1B2A4A': 'Navy', '#2563EB': 'Royal Blue', '#7DD3FC': 'Sky Blue', '#DC2626': 'Red',
  '#7F1D1D': 'Burgundy', '#F9A8D4': 'Pink', '#EC4899': 'Hot Pink', '#EA580C': 'Orange',
  '#FACC15': 'Yellow', '#16A34A': 'Green', '#14532D': 'Forest', '#4B5320': 'Olive / IDF', '#7C3AED': 'Purple',
}

export default function OrderSummaryModal({ isOpen, onClose, onConfirm, order }) {
  if (!isOpen) return null

  const { designPreview, shirtColor, selectedSize, quantity, designScale, designY } = order
  const colorName = SHIRT_COLOR_NAMES[shirtColor] || shirtColor

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white border-4 border-green-400 rounded-2xl p-6 w-[90%] max-w-sm shadow-[6px_6px_0_black] relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 bg-black text-white rounded-full font-bold text-lg flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer"
        >
          X
        </button>

        <h2 className="font-game text-sm mb-5 text-black">Order Summary</h2>

        {/* Preview */}
        <div className="flex justify-center mb-5">
          <div className="relative w-[140px] h-[160px]">
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
            {designPreview && (
              <div
                className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none"
                style={{ top: `${designY}%`, width: `${45 * designScale}%`, maxWidth: '85%' }}
              >
                <img src={designPreview} alt="Design" className="w-full h-auto object-contain" draggable={false} />
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-5 border-2 border-gray-200 rounded-xl p-4">
          <div className="flex justify-between">
            <span className="font-game text-[9px] text-gray-500">Color</span>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border border-gray-300 inline-block" style={{ backgroundColor: shirtColor }} />
              <span className="font-game text-[9px] text-black">{colorName}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="font-game text-[9px] text-gray-500">Size</span>
            <span className="font-game text-[9px] text-black">{selectedSize}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-game text-[9px] text-gray-500">Quantity</span>
            <span className="font-game text-[9px] text-black">{quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-game text-[9px] text-gray-500">Design Scale</span>
            <span className="font-game text-[9px] text-black">{Math.round(designScale * 100)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="font-game text-[9px] text-gray-500">Design</span>
            <span className="font-game text-[9px] text-black">{designPreview ? '✓ Ready' : '✗ None'}</span>
          </div>
        </div>

        {/* Confirm */}
        <button
          onClick={onConfirm}
          className="w-full font-game text-sm py-4 bg-gradient-to-b from-green-400 to-green-600 text-white border-3 border-green-700 rounded-xl shadow-[4px_4px_0_black] hover:shadow-[5px_5px_0_black] active:shadow-[1px_1px_0_black] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          CONFIRM ORDER
        </button>
      </div>
    </div>
  )
}
