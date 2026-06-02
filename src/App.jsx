import { useState, useCallback, useEffect } from 'react'
import Header from './components/Header'
import ShirtCanvas from './components/ShirtCanvas'
import BuzzerButton from './components/BuzzerButton'
import UploadModal from './components/UploadModal'
import ColorPickerModal from './components/ColorPickerModal'
import LibraryModal from './components/LibraryModal'
import SizeQuantitySelector from './components/SizeQuantitySelector'
import OrderSummaryModal from './components/OrderSummaryModal'
import StarField from './components/StarField'

const IS_ADMIN = true
const LIBRARY_STORAGE_KEY = 'tshirt-quest-library'

function loadLibrary() {
  try {
    const saved = localStorage.getItem(LIBRARY_STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.warn('Failed to load library from storage:', e)
  }
  return { music: [], cartoons: [], israeli: [], retro: [] }
}

function saveLibrary(library) {
  try {
    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(library))
  } catch (e) {
    console.warn('Failed to save library to storage:', e)
  }
}

function App() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [designPreview, setDesignPreview] = useState(null)
  const [originalFile, setOriginalFile] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [designScale, setDesignScale] = useState(1)
  const [designY, setDesignY] = useState(22)
  const [shirtColor, setShirtColor] = useState('#C8C8C8')
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false)
  const [library, setLibrary] = useState(loadLibrary)

  useEffect(() => {
    saveLibrary(library)
  }, [library])

  const handleUpload = useCallback((file) => {
    setOriginalFile(file)
    const previewUrl = URL.createObjectURL(file)
    setDesignPreview(previewUrl)
    setDesignScale(1)
    setDesignY(22)
  }, [])

  const handleSelectFromLibrary = useCallback((url) => {
    setDesignPreview(url)
    setOriginalFile(null)
    setDesignScale(1)
    setDesignY(22)
  }, [])

  const handleAddToLibrary = useCallback((categoryId, item) => {
    setLibrary(prev => ({
      ...prev,
      [categoryId]: [...(prev[categoryId] || []), item],
    }))
  }, [])

  const handleRemoveFromLibrary = useCallback((categoryId, itemId) => {
    setLibrary(prev => ({
      ...prev,
      [categoryId]: (prev[categoryId] || []).filter(i => i.id !== itemId),
    }))
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'image/png') {
      handleUpload(file)
    }
  }, [handleUpload])

  function getPrintData() {
    return {
      originalFile,
      designPreview,
      shirtColor,
      selectedSize,
      quantity,
      designScale,
      designY,
    }
  }

  function handleConfirmOrder() {
    const printData = getPrintData()
    setCartCount(prev => prev + printData.quantity)
    setOrderSummaryOpen(false)
    console.log('[T-Shirt Quest] Order confirmed — print data:', printData)
  }

  return (
    <>
      {/* Stars visible through the window */}
      <StarField count={80} />

      {/* UFO Cockpit frame layers */}
      <div className="cockpit-hull" />
      <div className="cockpit-top" />
      <div className="cockpit-bottom" />
      <div className="cockpit-left" />
      <div className="cockpit-right" />
      <div className="window-frame" />

      {/* Rivets on the hull corners */}
      <div className="rivet" style={{ top: '12%', left: '8%' }} />
      <div className="rivet" style={{ top: '12%', right: '8%' }} />
      <div className="rivet" style={{ bottom: '14%', left: '8%' }} />
      <div className="rivet" style={{ bottom: '14%', right: '8%' }} />
      <div className="rivet" style={{ top: '50%', left: '3.5%' }} />
      <div className="rivet" style={{ top: '50%', right: '3.5%' }} />

      {/* Dashboard indicator lights */}
      <div className="dash-light green" style={{ left: '15%' }} />
      <div className="dash-light blue" style={{ left: '18%' }} />
      <div className="dash-light red" style={{ right: '15%' }} />
      <div className="dash-light green" style={{ right: '18%' }} />

      {/* App content — visible through the cockpit window */}
      <div className="cockpit-content">
        <Header cartCount={cartCount} level={1} />

        <main
          className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-6"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
        >
          <ShirtCanvas
            designPreview={designPreview}
            designScale={designScale}
            onScaleChange={setDesignScale}
            designY={designY}
            onDesignYChange={setDesignY}
            shirtColor={shirtColor}
          />

          {/* Buzzer buttons */}
          <div className="flex items-end gap-4 md:gap-8 flex-wrap justify-center">
            <BuzzerButton label="COLOR" color="pink" onClick={() => setColorPickerOpen(true)} />
            <BuzzerButton label="TEXT" color="cyan" onClick={() => {}} />
            <BuzzerButton label="UPLOAD" color="yellow" onClick={() => setUploadModalOpen(true)} />
            <BuzzerButton label="LIBRARY" color="purple" onClick={() => setLibraryOpen(true)} />
          </div>

          {/* Size & Quantity */}
          <SizeQuantitySelector
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            quantity={quantity}
            onQuantityChange={setQuantity}
          />

          {/* Add to Cart */}
          <button
            onClick={() => setOrderSummaryOpen(true)}
            disabled={!designPreview}
            className={`
              font-game text-sm md:text-base px-10 py-4 border-4 border-black rounded-2xl
              transition-all duration-100 cursor-pointer
              ${designPreview
                ? 'bg-gradient-to-b from-green-400 to-green-600 text-white shadow-[5px_5px_0_black] hover:shadow-[6px_6px_0_black] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0_black] active:translate-x-0.5 active:translate-y-0.5'
                : 'bg-gray-300 text-gray-500 shadow-[3px_3px_0_gray] cursor-not-allowed'
              }
            `}
          >
            ADD TO CART
          </button>

          <p className="font-game text-[10px] text-cyan-400/50 mt-1">Unlock Achievements!</p>
        </main>
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
      />

      <ColorPickerModal
        isOpen={colorPickerOpen}
        onClose={() => setColorPickerOpen(false)}
        currentColor={shirtColor}
        onColorSelect={setShirtColor}
      />

      <LibraryModal
        isOpen={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelectDesign={handleSelectFromLibrary}
        library={library}
        onAddToLibrary={handleAddToLibrary}
        onRemoveFromLibrary={handleRemoveFromLibrary}
        isAdmin={IS_ADMIN}
      />

      <OrderSummaryModal
        isOpen={orderSummaryOpen}
        onClose={() => setOrderSummaryOpen(false)}
        onConfirm={handleConfirmOrder}
        order={getPrintData()}
      />
    </>
  )
}

export default App
