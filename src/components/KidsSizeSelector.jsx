const KIDS_SIZES = ['2', '4', '6', '8', '10', '12', '14', '16']

export default function KidsSizeSelector({ selectedSize, onSizeChange, quantity, onQuantityChange }) {
  return (
    <div className="flex items-center justify-center gap-4 w-full max-w-md">
      {/* Size selector */}
      <div className="flex items-center gap-1">
        {KIDS_SIZES.map(size => (
          <button
            key={size}
            onClick={() => onSizeChange(size)}
            className={`
              font-game text-[8px] md:text-[10px] w-8 h-9 md:w-9 md:h-10
              border-2 border-black rounded-lg cursor-pointer
              transition-all duration-100
              ${selectedSize === size
                ? 'bg-black text-white shadow-none translate-x-0.5 translate-y-0.5'
                : 'bg-white text-black shadow-[2px_2px_0_black] hover:shadow-[3px_3px_0_black] hover:-translate-x-0.5 hover:-translate-y-0.5'
              }
            `}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-7 bg-gray-600" />

      {/* Quantity selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="w-8 h-8 bg-white border-2 border-black rounded-lg font-game text-sm shadow-[2px_2px_0_black] hover:shadow-[3px_3px_0_black] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
        >
          −
        </button>

        <span className="font-game text-xs w-6 text-center text-white">{quantity}</span>

        <button
          onClick={() => onQuantityChange(Math.min(99, quantity + 1))}
          className="w-8 h-8 bg-white border-2 border-black rounded-lg font-game text-sm shadow-[2px_2px_0_black] hover:shadow-[3px_3px_0_black] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  )
}
