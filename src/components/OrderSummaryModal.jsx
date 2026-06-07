import { useState } from 'react'

const SHIRT_COLOR_NAMES = {
  '#FFFFFF': 'White', '#C8C8C8': 'Light Gray', '#666666': 'Dark Gray', '#1a1a1a': 'Black',
  '#1B2A4A': 'Navy', '#2563EB': 'Royal Blue', '#7DD3FC': 'Sky Blue', '#DC2626': 'Red',
  '#7F1D1D': 'Burgundy', '#F9A8D4': 'Pink', '#EC4899': 'Hot Pink', '#EA580C': 'Orange',
  '#FACC15': 'Yellow', '#16A34A': 'Green', '#14532D': 'Forest', '#4B5320': 'Olive / IDF', '#7C3AED': 'Purple',
}

const WHATSAPP_PHONE = '972526468894'

function buildWhatsAppUrl(order) {
  const colorName = SHIRT_COLOR_NAMES[order.shirtColor] || order.shirtColor
  const hasFront = !!order.frontDesign
  const hasBack = !!order.backDesign
  const text = `היי! אני רוצה להזמין חולצה מאתר T-SHIRT QUEST 🎮

פרטי ההזמנה שלי:
👕 מידה: ${order.selectedSize}
🔢 כמות: ${order.quantity}
🎨 צבע חולצה: ${colorName}
📐 גודל עיצוב: ${Math.round(order.designScale * 100)}%
🖼️ עיצוב קדמי: ${hasFront ? '✓' : '✗'}
🖼️ עיצוב אחורי: ${hasBack ? '✓' : '✗'}

🖼️ קבצי העיצוב שלי מצורפים כאן.`

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
}

export default function OrderSummaryModal({ isOpen, onClose, onConfirm, order }) {
  const [showCheckout, setShowCheckout] = useState(false)

  if (!isOpen) return null

  const { designPreview, shirtColor, selectedSize, quantity, designScale, designY } = order
  const colorName = SHIRT_COLOR_NAMES[shirtColor] || shirtColor

  function handleWhatsAppCheckout() {
    onConfirm()
    window.open(buildWhatsAppUrl(order), '_blank')
  }

  function handleClose() {
    setShowCheckout(false)
    onClose()
  }

  if (showCheckout) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={handleClose}>
        <div
          className="bg-white border-4 border-[#25D366] rounded-2xl p-6 w-[90%] max-w-sm shadow-[6px_6px_0_black] relative text-center"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 w-8 h-8 bg-black text-white rounded-full font-bold text-lg flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer"
          >
            X
          </button>

          <div className="text-4xl mb-4 mt-2">🎮✨</div>
          <h2 className="font-game text-xs mb-4 text-black leading-relaxed">
            ALMOST THERE!
          </h2>
          <p className="text-sm text-gray-600 mb-2 leading-relaxed" dir="rtl">
            כדי להשלים את ההזמנה, לחצו על הכפתור למטה למעבר ישיר לוואטסאפ שלנו.
          </p>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed" dir="rtl">
            התשלום יתבצע בנוחות באמצעות אפליקציית <strong className="text-[#6C5CE7]">ביט (Bit)</strong> 💳
          </p>

          <div className="space-y-2 mb-5 border-2 border-gray-200 rounded-xl p-3 text-left">
            <div className="flex justify-between">
              <span className="font-game text-[8px] text-gray-500">Size</span>
              <span className="font-game text-[8px] text-black">{selectedSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-game text-[8px] text-gray-500">Qty</span>
              <span className="font-game text-[8px] text-black">{quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-game text-[8px] text-gray-500">Color</span>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full border border-gray-300 inline-block" style={{ backgroundColor: shirtColor }} />
                <span className="font-game text-[8px] text-black">{colorName}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleWhatsAppCheckout}
            className="w-full font-game text-[10px] py-4 bg-[#25D366] text-white border-3 border-[#128C7E] rounded-xl shadow-[4px_4px_0_black] hover:shadow-[5px_5px_0_black] active:shadow-[1px_1px_0_black] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white flex-shrink-0">
              <path d="M16.004 3.2C9.158 3.2 3.6 8.758 3.6 15.604c0 2.186.573 4.322 1.66 6.207L3.2 28.8l7.2-2.016a12.35 12.35 0 005.604 1.34c6.846 0 12.396-5.55 12.396-12.396S22.85 3.2 16.004 3.2zm0 22.632a10.18 10.18 0 01-5.19-1.418l-.372-.222-3.858 1.08 1.098-3.792-.244-.388A10.14 10.14 0 015.76 15.6c0-5.646 4.6-10.24 10.252-10.24 5.646 0 10.228 4.594 10.228 10.24 0 5.652-4.59 10.232-10.236 10.232zm5.616-7.668c-.308-.154-1.824-.9-2.106-.998-.282-.102-.488-.154-.694.154-.204.308-.796.998-.976 1.204-.18.204-.358.23-.666.076-.308-.154-1.3-.478-2.478-1.526-.916-.816-1.534-1.824-1.714-2.132-.18-.308-.02-.474.134-.628.14-.138.308-.358.462-.538.154-.18.204-.308.308-.514.102-.204.05-.384-.026-.538-.076-.154-.694-1.672-.952-2.29-.25-.6-.504-.52-.694-.528l-.59-.01a1.135 1.135 0 00-.822.386c-.282.308-1.078 1.054-1.078 2.57 0 1.518 1.104 2.984 1.258 3.19.154.204 2.174 3.32 5.268 4.656.736.318 1.31.508 1.758.65.738.236 1.41.202 1.942.122.592-.088 1.824-.746 2.082-1.466.258-.72.258-1.338.18-1.466-.076-.128-.282-.204-.59-.358z" />
            </svg>
            המשך לתשלום בוואטסאפ
          </button>

          <p className="font-game text-[7px] text-gray-400 mt-3">
            DON'T FORGET TO ATTACH YOUR DESIGN FILE!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={handleClose}>
      <div
        className="bg-white border-4 border-green-400 rounded-2xl p-6 w-[90%] max-w-sm shadow-[6px_6px_0_black] relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
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
            <span className="font-game text-[9px] text-gray-500">Front</span>
            <span className="font-game text-[9px] text-black">{order.frontDesign ? '✓ Ready' : '✗ None'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-game text-[9px] text-gray-500">Back</span>
            <span className="font-game text-[9px] text-black">{order.backDesign ? '✓ Ready' : '✗ None'}</span>
          </div>
        </div>

        {/* Checkout via WhatsApp */}
        <button
          onClick={() => setShowCheckout(true)}
          className="w-full font-game text-sm py-4 bg-gradient-to-b from-green-400 to-green-600 text-white border-3 border-green-700 rounded-xl shadow-[4px_4px_0_black] hover:shadow-[5px_5px_0_black] active:shadow-[1px_1px_0_black] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          BUY NOW 🛒
        </button>
      </div>
    </div>
  )
}
