const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

export default function SizeQuantitySelector({ selectedSize, onSizeChange, quantity, onQuantityChange }) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      {/* Size selector */}
      <div className="flex items-center gap-2">
        {SIZES.map(size => (
          <button
            key={size}
            onClick={() => onSizeChange(size)}
            className={`
              font-game text-[10px] md:text-xs w-11 h-11 md:w-13 md:h-13
              border-3 border-black rounded-lg cursor-pointer
              transition-all duration-100
              ${selectedSize === size
                ? 'bg-black text-white shadow-none translate-x-0.5 translate-y-0.5'
                : 'bg-white text-black shadow-[3px_3px_0_black] hover:shadow-[4px_4px_0_black] hover:-translate-x-0.5 hover:-translate-y-0.5'
              }
            `}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="w-10 h-10 bg-white border-3 border-black rounded-lg font-game text-lg shadow-[3px_3px_0_black] hover:shadow-[4px_4px_0_black] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
        >
          −
        </button>

        <span className="font-game text-sm w-10 text-center text-white">{quantity}</span>

        <button
          onClick={() => onQuantityChange(Math.min(99, quantity + 1))}
          className="w-10 h-10 bg-white border-3 border-black rounded-lg font-game text-lg shadow-[3px_3px_0_black] hover:shadow-[4px_4px_0_black] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  )
}
