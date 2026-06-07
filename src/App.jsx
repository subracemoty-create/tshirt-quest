import { useState, useCallback, useEffect, useMemo } from 'react'
import Header from './components/Header'
import ShirtCanvas3D from './components/ShirtCanvas3D'
import BuzzerButton from './components/BuzzerButton'
import UploadModal from './components/UploadModal'
import ColorPickerModal from './components/ColorPickerModal'
import LibraryModal from './components/LibraryModal'
import SizeQuantitySelector from './components/SizeQuantitySelector'
import OrderSummaryModal from './components/OrderSummaryModal'
import StarField from './components/StarField'
import WhatsAppFloat from './components/WhatsAppFloat'

function isDarkColor(hex) {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 0.299 + g * 0.587 + b * 0.114) < 100
}

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
  const [originalFile, setOriginalFile] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [shirtColor, setShirtColor] = useState('#C8C8C8')
  const [frontLayout, setFrontLayout] = useState({ x: 0, y: 0.1, scale: 1.0 })
  const [backLayout, setBackLayout] = useState({ x: 0, y: 0.1, scale: 1.0 })
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false)
  const [library, setLibrary] = useState(loadLibrary)
  const [activeSide, setActiveSide] = useState('front')
  const [frontDesign, setFrontDesign] = useState(null)
  const [backDesign, setBackDesign] = useState(null)

  const hasDesign = !!(frontDesign || backDesign)
  const darkShirt = useMemo(() => isDarkColor(shirtColor), [shirtColor])

  useEffect(() => {
    saveLibrary(library)
  }, [library])

  const handleLayoutChange = useCallback((side, patch) => {
    if (side === 'front') {
      setFrontLayout(prev => ({ ...prev, ...patch }))
    } else {
      setBackLayout(prev => ({ ...prev, ...patch }))
    }
  }, [])

  const handleUpload = useCallback((file) => {
    setOriginalFile(file)
    const url = URL.createObjectURL(file)
    if (activeSide === 'front') {
      setFrontDesign(url)
    } else {
      setBackDesign(url)
    }
  }, [activeSide])

  const handleSelectFromLibrary = useCallback((url) => {
    if (activeSide === 'front') {
      setFrontDesign(url)
    } else {
      setBackDesign(url)
    }
    setOriginalFile(null)
  }, [activeSide])

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
      designPreview: frontDesign || backDesign,
      frontDesign,
      backDesign,
      shirtColor,
      selectedSize,
      quantity,
      frontLayout,
      backLayout,
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
      {darkShirt ? <div className="sky-bg" /> : <StarField count={80} />}

      <div className="cockpit-hull" />
      <div className="cockpit-top" />
      <div className="cockpit-bottom" />
      <div className="cockpit-left" />
      <div className="cockpit-right" />
      <div className="window-frame" />

      <div className="rivet" style={{ top: '12%', left: '8%' }} />
      <div className="rivet" style={{ top: '12%', right: '8%' }} />
      <div className="rivet" style={{ bottom: '14%', left: '8%' }} />
      <div className="rivet" style={{ bottom: '14%', right: '8%' }} />
      <div className="rivet" style={{ top: '50%', left: '3.5%' }} />
      <div className="rivet" style={{ top: '50%', right: '3.5%' }} />

      <div className="dash-light green" style={{ left: '15%' }} />
      <div className="dash-light blue" style={{ left: '18%' }} />
      <div className="dash-light red" style={{ right: '15%' }} />
      <div className="dash-light green" style={{ right: '18%' }} />

      <div className="cockpit-content h-screen overflow-hidden">
        <Header cartCount={cartCount} level={1} />

        <main
          className="flex-1 min-h-0 flex flex-col items-center justify-center gap-1.5 px-4 py-1"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
        >
          <ShirtCanvas3D
            frontDesign={frontDesign}
            backDesign={backDesign}
            shirtColor={shirtColor}
            activeSide={activeSide}
            frontLayout={frontLayout}
            backLayout={backLayout}
            onLayoutChange={handleLayoutChange}
          />

          {/* Front / Back selector */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveSide('front')}
              className={`font-game text-[8px] md:text-[9px] px-3 md:px-4 py-1.5 border-2 rounded-lg transition-all cursor-pointer ${
                activeSide === 'front'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10 shadow-[0_0_12px_rgba(0,255,255,0.3)]'
                  : 'border-gray-600 text-gray-400 hover:border-gray-400'
              }`}
            >
              FRONT GRAPHIC
            </button>
            <button
              onClick={() => setActiveSide('back')}
              className={`font-game text-[8px] md:text-[9px] px-3 md:px-4 py-1.5 border-2 rounded-lg transition-all cursor-pointer ${
                activeSide === 'back'
                  ? 'border-pink-400 text-pink-400 bg-pink-400/10 shadow-[0_0_12px_rgba(255,0,255,0.3)]'
                  : 'border-gray-600 text-gray-400 hover:border-gray-400'
              }`}
            >
              BACK GRAPHIC
            </button>
          </div>

          {/* Buzzer buttons */}
          <div className="flex items-end gap-3 md:gap-6 flex-wrap justify-center">
            <BuzzerButton label="COLOR" color="pink" onClick={() => setColorPickerOpen(true)} />
            <BuzzerButton label="TEXT" color="cyan" onClick={() => {}} />
            <BuzzerButton label="UPLOAD" color="yellow" onClick={() => setUploadModalOpen(true)} />
            <BuzzerButton label="LIBRARY" color="purple" onClick={() => setLibraryOpen(true)} />
          </div>

          <SizeQuantitySelector
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            quantity={quantity}
            onQuantityChange={setQuantity}
          />

          <button
            onClick={() => setOrderSummaryOpen(true)}
            disabled={!hasDesign}
            className={`
              font-game text-[10px] md:text-xs px-8 py-2.5 border-3 border-black rounded-xl
              transition-all duration-100 cursor-pointer
              ${hasDesign
                ? 'bg-gradient-to-b from-green-400 to-green-600 text-white shadow-[5px_5px_0_black] hover:shadow-[6px_6px_0_black] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0_black] active:translate-x-0.5 active:translate-y-0.5'
                : 'bg-gray-300 text-gray-500 shadow-[3px_3px_0_gray] cursor-not-allowed'
              }
            `}
          >
            ADD TO CART
          </button>
        </main>
      </div>

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

      <WhatsAppFloat />
    </>
  )
}

export default App
