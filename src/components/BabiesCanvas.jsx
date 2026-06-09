import BabyOnesie3D from './BabyOnesie3D'

export default function BabiesCanvas({
  frontDesign, backDesign, shirtColor,
  activeSide, onActiveSideChange,
  frontLayout, backLayout, onLayoutChange,
  frontTextSettings, backTextSettings,
}) {
  return (
    <>
      <BabyOnesie3D
        frontDesign={frontDesign}
        backDesign={backDesign}
        shirtColor={shirtColor}
        activeSide={activeSide}
        frontLayout={frontLayout}
        backLayout={backLayout}
        onLayoutChange={onLayoutChange}
        frontTextSettings={frontTextSettings}
        backTextSettings={backTextSettings}
      />

      <div className="flex gap-3">
        <button
          onClick={() => onActiveSideChange('front')}
          className={`font-game text-[8px] md:text-[9px] px-3 md:px-4 py-1.5 border-2 rounded-lg transition-all cursor-pointer ${
            activeSide === 'front'
              ? 'border-cyan-400 text-cyan-400 bg-black/80 shadow-[0_0_12px_rgba(0,255,255,0.3)]'
              : 'border-gray-600 text-gray-400 bg-black/60 hover:border-gray-400'
          }`}
        >
          FRONT GRAPHIC
        </button>
        <button
          onClick={() => onActiveSideChange('back')}
          className={`font-game text-[8px] md:text-[9px] px-3 md:px-4 py-1.5 border-2 rounded-lg transition-all cursor-pointer ${
            activeSide === 'back'
              ? 'border-pink-400 text-pink-400 bg-black/80 shadow-[0_0_12px_rgba(255,0,255,0.3)]'
              : 'border-gray-600 text-gray-400 bg-black/60 hover:border-gray-400'
          }`}
        >
          BACK GRAPHIC
        </button>
      </div>
    </>
  )
}
