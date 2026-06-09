import { useState } from 'react'
import KidsSizeSelector from './KidsSizeSelector'
import OrderSummaryModal from './OrderSummaryModal'

const SHIRT_COLOR_NAMES = {
  '#FFFFFF': 'White', '#C8C8C8': 'Light Gray', '#666666': 'Dark Gray', '#1a1a1a': 'Black',
  '#1B2A4A': 'Navy', '#2563EB': 'Royal Blue', '#7DD3FC': 'Sky Blue', '#DC2626': 'Red',
  '#7F1D1D': 'Burgundy', '#F9A8D4': 'Pink', '#EC4899': 'Hot Pink', '#EA580C': 'Orange',
  '#FACC15': 'Yellow', '#16A34A': 'Green', '#14532D': 'Forest', '#4B5320': 'Olive / IDF', '#7C3AED': 'Purple',
}

const WHATSAPP_PHONE = '972526468894'

function buildWhatsAppMessage(order) {
  const colorName = SHIRT_COLOR_NAMES[order.shirtColor] || order.shirtColor
  const hasFrontDesign = !!order.frontDesign
  const hasBackDesign = !!order.backDesign
  const frontText = order.frontTextSettings?.text?.trim()
  const backText = order.backTextSettings?.text?.trim()

  let designDetails = ''
  if (hasFrontDesign) designDetails += '🖼️ עיצוב קדמי: תמונה ✓\n'
  else if (frontText) designDetails += `🖼️ עיצוב קדמי: טקסט — "${frontText}" ✓\n`
  else designDetails += '🖼️ עיצוב קדמי: ✗\n'

  if (hasBackDesign) designDetails += '🖼️ עיצוב אחורי: תמונה ✓\n'
  else if (backText) designDetails += `🖼️ עיצוב אחורי: טקסט — "${backText}" ✓\n`
  else designDetails += '🖼️ עיצוב אחורי: ✗\n'

  const text = `היי! אני רוצה להזמין חולצת ילדים מאתר T-SHIRT QUEST 🎮

פרטי ההזמנה שלי:
👦 קטגוריה: ילדים
👕 מידה: ${order.selectedSize}
🔢 כמות: ${order.quantity}
🎨 צבע חולצה: ${colorName}
${designDetails}
📋 *העיצוב המדויק שלך הועתק אוטומטית! פשוט תעשה 'הדבק' (Paste / Ctrl+V) פה בצ'אט כדי לצרף את תמונת החולצה להזמנה.*`

  return text
}

export default function KidsOrderSelector({
  selectedSize, onSizeChange,
  quantity, onQuantityChange,
  hasContent,
  orderSummaryOpen, onOrderSummaryOpen, onOrderSummaryClose,
  onConfirmOrder, orderData,
}) {
  const [capturing, setCapturing] = useState(false)

  async function handleCheckout() {
    if (capturing) return
    setCapturing(true)

    try {
      const container = document.getElementById('tshirt-canvas-container')
      const webglCanvas = container?.querySelector('canvas')
      if (!webglCanvas) throw new Error('Canvas element not found')

      const blob = await new Promise((resolve, reject) => {
        webglCanvas.toBlob((b) => {
          if (b) resolve(b)
          else reject(new Error('Failed to create blob'))
        }, 'image/png')
      })

      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ])
      } catch {
        console.warn('[T-Shirt Quest] Clipboard write not supported on this device')
      }

      const message = buildWhatsAppMessage(orderData)
      const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
      window.open(url, '_blank')

      onConfirmOrder()
    } catch (err) {
      console.error('[T-Shirt Quest] Capture failed:', err)
      const message = buildWhatsAppMessage(orderData)
      const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
      window.open(url, '_blank')
      onConfirmOrder()
    } finally {
      setCapturing(false)
    }
  }

  return (
    <>
      <KidsSizeSelector
        selectedSize={selectedSize}
        onSizeChange={onSizeChange}
        quantity={quantity}
        onQuantityChange={onQuantityChange}
      />

      <button
        onClick={handleCheckout}
        disabled={!hasContent || capturing}
        className={`
          font-game text-[10px] md:text-xs px-8 py-2.5 border-3 border-black rounded-xl
          transition-all duration-100 cursor-pointer
          ${hasContent && !capturing
            ? 'bg-gradient-to-b from-green-400 to-green-600 text-white shadow-[5px_5px_0_black] hover:shadow-[6px_6px_0_black] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0_black] active:translate-x-0.5 active:translate-y-0.5'
            : 'bg-gray-300 text-gray-500 shadow-[3px_3px_0_gray] cursor-not-allowed'
          }
        `}
      >
        {capturing ? 'CAPTURING...' : 'ADD TO CART'}
      </button>

      <OrderSummaryModal
        isOpen={orderSummaryOpen}
        onClose={onOrderSummaryClose}
        onConfirm={onConfirmOrder}
        order={orderData}
      />
    </>
  )
}
