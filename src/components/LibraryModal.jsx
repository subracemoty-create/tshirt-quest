import { useState, useRef, useEffect } from 'react'

const CATEGORIES = [
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'cartoons', label: 'Cartoons', emoji: '🎨' },
  { id: 'israeli', label: 'Israeli', emoji: '🇮🇱' },
  { id: 'retro', label: 'Retro', emoji: '👾' },
]

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function LibraryModal({ isOpen, onClose, onSelectDesign, library, onAddToLibrary, onRemoveFromLibrary, onMoveToCategory, isAdmin, onAdminLogin }) {
  const [activeCategory, setActiveCategory] = useState('music')
  const [uploading, setUploading] = useState(false)
  const [pinPromptOpen, setPinPromptOpen] = useState(false)
  const [pinValue, setPinValue] = useState('')
  const [pinError, setPinError] = useState(false)
  const fileInputRef = useRef(null)
  const pinInputRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      setPinPromptOpen(false)
      setPinValue('')
      setPinError(false)
      return
    }
    function handleEsc(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const items = library[activeCategory] || []

  async function handleFileAdd(e) {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setUploading(true)
    try {
      const results = await Promise.all(files.map(f => fileToBase64(f)))
      results.forEach((dataUrl, i) => {
        onAddToLibrary(activeCategory, {
          id: `${Date.now()}-${i}`,
          url: dataUrl,
          name: files[i].name,
        })
      })
    } catch (err) {
      console.error('Failed to read files:', err)
    }
    setUploading(false)
    e.target.value = ''
  }

  function handlePinSubmit() {
    const success = onAdminLogin(pinValue)
    if (success) {
      setPinPromptOpen(false)
      setPinValue('')
      setPinError(false)
    } else {
      setPinError(true)
      setPinValue('')
    }
  }

  function handleLockClick() {
    if (isAdmin) return
    setPinPromptOpen(true)
    setPinError(false)
    setPinValue('')
    setTimeout(() => pinInputRef.current?.focus(), 50)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white border-4 border-purple-500 rounded-2xl p-5 w-[95%] max-w-lg shadow-[6px_6px_0_black] relative max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 bg-black text-white rounded-full font-bold text-lg flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer z-10"
        >
          X
        </button>

        {/* Title row with hidden lock */}
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-game text-sm text-black">Design Library</h2>
          {!isAdmin && (
            <button
              onClick={handleLockClick}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-purple-500 transition-all cursor-pointer text-base opacity-50 hover:opacity-100 hover:scale-110 rounded-lg hover:bg-purple-50"
            >
              🔒
            </button>
          )}
          {isAdmin && (
            <span className="font-game text-[7px] px-2 py-0.5 bg-purple-100 text-purple-600 border border-purple-300 rounded-full">
              ADMIN
            </span>
          )}
        </div>

        {/* PIN prompt */}
        {pinPromptOpen && !isAdmin && (
          <div className="mb-3 p-3 bg-gray-50 border-2 border-gray-200 rounded-xl flex items-center gap-2">
            <input
              ref={pinInputRef}
              type="password"
              maxLength={4}
              value={pinValue}
              onChange={e => { setPinValue(e.target.value); setPinError(false) }}
              onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}
              placeholder="PIN"
              className={`w-20 text-center font-game text-[10px] px-2 py-1.5 border-2 rounded-lg outline-none ${pinError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
            />
            <button
              onClick={handlePinSubmit}
              className="font-game text-[8px] px-3 py-1.5 bg-purple-500 text-white border-2 border-purple-700 rounded-lg shadow-[1px_1px_0_black] hover:shadow-[2px_2px_0_black] cursor-pointer"
            >
              GO
            </button>
            <button
              onClick={() => setPinPromptOpen(false)}
              className="font-game text-[8px] px-2 py-1.5 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              ✕
            </button>
            {pinError && <span className="font-game text-[7px] text-red-500">Wrong PIN</span>}
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                font-game text-[8px] md:text-[9px] px-3 py-2 rounded-lg border-2 whitespace-nowrap cursor-pointer transition-all
                ${activeCategory === cat.id
                  ? 'bg-purple-500 text-white border-purple-700 shadow-[2px_2px_0_black]'
                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                }
              `}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto min-h-[200px]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
              <span className="text-4xl mb-3">📁</span>
              <p className="font-game text-[9px]">No designs yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {items.map(item => (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => { onSelectDesign(item.url); onClose() }}
                    className="w-full aspect-square bg-gray-50 border-2 border-gray-200 rounded-xl p-2 hover:border-purple-400 hover:shadow-[2px_2px_0_black] transition-all cursor-pointer flex items-center justify-center"
                  >
                    <img src={item.url} alt={item.name} className="max-w-full max-h-full object-contain" />
                  </button>

                  {/* Admin: delete button */}
                  {isAdmin && (
                    <button
                      onClick={() => onRemoveFromLibrary(activeCategory, item.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600 shadow-[1px_1px_0_black]"
                    >
                      ×
                    </button>
                  )}

                  {/* Admin: category reassignment dropdown */}
                  {isAdmin && (
                    <select
                      value=""
                      onChange={e => {
                        if (e.target.value) onMoveToCategory(activeCategory, e.target.value, item.id)
                      }}
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-[90%] text-[9px] font-game bg-white border border-purple-300 rounded px-0.5 py-0.5 cursor-pointer shadow-sm"
                    >
                      <option value="">Move to…</option>
                      {CATEGORIES.filter(c => c.id !== activeCategory).map(c => (
                        <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin: upload to category */}
        {isAdmin && (
          <div className="mt-4 pt-3 border-t-2 border-dashed border-gray-300 flex items-center justify-between">
            <span className="font-game text-[8px] text-gray-500">Admin: Add to {CATEGORIES.find(c => c.id === activeCategory)?.label} (bulk)</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="font-game text-[9px] px-4 py-2 bg-gradient-to-b from-purple-400 to-purple-600 text-white border-2 border-purple-700 rounded-lg shadow-[2px_2px_0_black] hover:shadow-[3px_3px_0_black] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {uploading ? '...' : '+ ADD'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={handleFileAdd}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  )
}
