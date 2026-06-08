import SizeQuantitySelector from './SizeQuantitySelector'
import OrderSummaryModal from './OrderSummaryModal'

export default function OrderSelector({
  selectedSize, onSizeChange,
  quantity, onQuantityChange,
  hasContent,
  orderSummaryOpen, onOrderSummaryOpen, onOrderSummaryClose,
  onConfirmOrder, orderData,
}) {
  return (
    <>
      <SizeQuantitySelector
        selectedSize={selectedSize}
        onSizeChange={onSizeChange}
        quantity={quantity}
        onQuantityChange={onQuantityChange}
      />

      <button
        onClick={onOrderSummaryOpen}
        disabled={!hasContent}
        className={`
          font-game text-[10px] md:text-xs px-8 py-2.5 border-3 border-black rounded-xl
          transition-all duration-100 cursor-pointer
          ${hasContent
            ? 'bg-gradient-to-b from-green-400 to-green-600 text-white shadow-[5px_5px_0_black] hover:shadow-[6px_6px_0_black] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0_black] active:translate-x-0.5 active:translate-y-0.5'
            : 'bg-gray-300 text-gray-500 shadow-[3px_3px_0_gray] cursor-not-allowed'
          }
        `}
      >
        ADD TO CART
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
