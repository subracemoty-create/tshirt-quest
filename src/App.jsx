import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import Header from './components/Header'
import MainMenu from './components/MainMenu'
import TshirtCanvas from './components/TshirtCanvas'
import ControlPanel from './components/ControlPanel'
import OrderSelector from './components/OrderSelector'
import StarField from './components/StarField'
import WhatsAppFloat from './components/WhatsAppFloat'

function isDarkColor(hex) {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 0.299 + g * 0.587 + b * 0.114) < 100
}

const ADMIN_PIN = '1234'
const LIBRARY_STORAGE_KEY = 'tshirt-quest-library'
const DEFAULT_TEXT = { text: '', color: '#000000', font: 'Rubik', curved: false }

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
  /* ── State ── */
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('tshirt-quest-view') || 'menu')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [originalFile, setOriginalFile] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [shirtColor, setShirtColor] = useState('#C8C8C8')
  const [frontLayout, setFrontLayout] = useState({ x: 0, y: 0.1, scale: 1.0 })
  const [backLayout, setBackLayout] = useState({ x: 0, y: 0.1, scale: 1.0 })
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [textPanelOpen, setTextPanelOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false)
  const [library, setLibrary] = useState(loadLibrary)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeSide, setActiveSide] = useState('front')
  const [frontDesign, setFrontDesign] = useState(null)
  const [backDesign, setBackDesign] = useState(null)
  const [frontTextSettings, setFrontTextSettings] = useState({ ...DEFAULT_TEXT })
  const [backTextSettings, setBackTextSettings] = useState({ ...DEFAULT_TEXT })

  useEffect(() => {
    localStorage.setItem('tshirt-quest-view', currentView)
  }, [currentView])

  /* ── Derived ── */
  const activeTextSettings = activeSide === 'front' ? frontTextSettings : backTextSettings
  const hasContent = !!(frontDesign || backDesign || frontTextSettings.text.trim() || backTextSettings.text.trim())
  const darkShirt = useMemo(() => isDarkColor(shirtColor), [shirtColor])

  /* ── Side effects ── */
  const libraryHydrated = useRef(false)
  useEffect(() => {
    if (!libraryHydrated.current) { libraryHydrated.current = true; return }
    saveLibrary(library)
  }, [library])

  /* ── Handlers ── */
  const handleLayoutChange = useCallback((side, patch) => {
    if (side === 'front') {
      setFrontLayout(prev => ({ ...prev, ...patch }))
    } else {
      setBackLayout(prev => ({ ...prev, ...patch }))
    }
  }, [])

  const handleTextChange = useCallback((patch) => {
    if (activeSide === 'front') {
      setFrontTextSettings(prev => ({ ...prev, ...patch }))
      if ('text' in patch && patch.text.trim()) {
        setFrontDesign(null)
      }
    } else {
      setBackTextSettings(prev => ({ ...prev, ...patch }))
      if ('text' in patch && patch.text.trim()) {
        setBackDesign(null)
      }
    }
  }, [activeSide])

  const handleUpload = useCallback((file) => {
    setOriginalFile(file)
    const url = URL.createObjectURL(file)
    if (activeSide === 'front') {
      setFrontDesign(url)
      setFrontTextSettings({ ...DEFAULT_TEXT })
    } else {
      setBackDesign(url)
      setBackTextSettings({ ...DEFAULT_TEXT })
    }
  }, [activeSide])

  const handleSelectFromLibrary = useCallback((url) => {
    if (activeSide === 'front') {
      setFrontDesign(url)
      setFrontTextSettings({ ...DEFAULT_TEXT })
    } else {
      setBackDesign(url)
      setBackTextSettings({ ...DEFAULT_TEXT })
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

  const handleMoveToCategory = useCallback((fromCategory, toCategory, itemId) => {
    setLibrary(prev => {
      const item = (prev[fromCategory] || []).find(i => i.id === itemId)
      if (!item) return prev
      return {
        ...prev,
        [fromCategory]: prev[fromCategory].filter(i => i.id !== itemId),
        [toCategory]: [...(prev[toCategory] || []), item],
      }
    })
  }, [])

  const handleAdminLogin = useCallback((pin) => {
    if (pin === ADMIN_PIN) { setIsAdmin(true); return true }
    return false
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
      frontTextSettings,
      backTextSettings,
    }
  }

  function handleConfirmOrder() {
    const printData = getPrintData()
    setCartCount(prev => prev + printData.quantity)
    setOrderSummaryOpen(false)
    console.log('[T-Shirt Quest] Order confirmed — print data:', printData)
  }

  /* ── Render ── */
  return (
    <>
      {darkShirt ? (
        <div className="sky-bg">
          <div className="cloud-layer far" />
          <div className="cloud-layer mid" />
          <div className="cloud-layer near" />
          <div className="cloud-layer haze" />
        </div>
      ) : (
        <StarField count={80} />
      )}

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

        {currentView === 'menu' ? (
          <MainMenu onSelectCategory={(id) => setCurrentView(id)} />
        ) : (
          <main
            className="flex-1 min-h-0 flex flex-col items-center justify-center gap-1.5 px-4 py-1"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
          >
            <button
              onClick={() => setCurrentView('menu')}
              className="absolute top-16 left-4 z-40 font-game text-[7px] md:text-[8px] px-3 py-1.5 bg-black/70 text-gray-400 border border-gray-600 rounded-lg hover:text-cyan-400 hover:border-cyan-400/50 transition-all cursor-pointer backdrop-blur-sm"
            >
              ◀ חזרה לתפריט
            </button>

            <TshirtCanvas
              frontDesign={frontDesign}
              backDesign={backDesign}
              shirtColor={shirtColor}
              activeSide={activeSide}
              onActiveSideChange={setActiveSide}
              frontLayout={frontLayout}
              backLayout={backLayout}
              onLayoutChange={handleLayoutChange}
              frontTextSettings={frontTextSettings}
              backTextSettings={backTextSettings}
            />

            <ControlPanel
              colorPickerOpen={colorPickerOpen}
              onColorPickerOpen={() => setColorPickerOpen(true)}
              onColorPickerClose={() => setColorPickerOpen(false)}
              shirtColor={shirtColor}
              onColorSelect={setShirtColor}
              textPanelOpen={textPanelOpen}
              onTextPanelOpen={() => setTextPanelOpen(true)}
              onTextPanelClose={() => setTextPanelOpen(false)}
              activeTextSettings={activeTextSettings}
              onTextChange={handleTextChange}
              activeSide={activeSide}
              uploadModalOpen={uploadModalOpen}
              onUploadModalOpen={() => setUploadModalOpen(true)}
              onUploadModalClose={() => setUploadModalOpen(false)}
              onUpload={handleUpload}
              libraryOpen={libraryOpen}
              onLibraryOpen={() => setLibraryOpen(true)}
              onLibraryClose={() => { setLibraryOpen(false); setIsAdmin(false) }}
              onSelectDesign={handleSelectFromLibrary}
              library={library}
              onAddToLibrary={handleAddToLibrary}
              onRemoveFromLibrary={handleRemoveFromLibrary}
              onMoveToCategory={handleMoveToCategory}
              isAdmin={isAdmin}
              onAdminLogin={handleAdminLogin}
            />

            <OrderSelector
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              quantity={quantity}
              onQuantityChange={setQuantity}
              hasContent={hasContent}
              orderSummaryOpen={orderSummaryOpen}
              onOrderSummaryOpen={() => setOrderSummaryOpen(true)}
              onOrderSummaryClose={() => setOrderSummaryOpen(false)}
              onConfirmOrder={handleConfirmOrder}
              orderData={getPrintData()}
            />
          </main>
        )}
      </div>

      <WhatsAppFloat />
    </>
  )
}

export default App
