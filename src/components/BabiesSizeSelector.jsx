const BABY_SIZES = ['0-6M', '6-12M', '12-18M', '18-24M']

export default function BabiesSizeSelector({ selectedSize, onSizeChange, quantity, onQuantityChange }) {
  return (
    <div className="flex items-center justify-center gap-4 w-full max-w-md">
      <div className="flex items-center gap-1.5">
        {BABY_SIZES.map(size => (
          <button
            key={size}
            onClick={() => onSizeChange(size)}
            className={`
              font-game text-[7px] md:text-[9px] px-2 py-2 md:px-2.5 md:py-2.5
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

      <div className="w-px h-7 bg-gray-600" />

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
