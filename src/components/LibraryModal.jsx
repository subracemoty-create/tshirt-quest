import { useState, useRef } from 'react'

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

export default function LibraryModal({ isOpen, onClose, onSelectDesign, library, onAddToLibrary, onRemoveFromLibrary, isAdmin }) {
  const [activeCategory, setActiveCategory] = useState('music')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const items = library[activeCategory] || []

  async function handleFileAdd(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const dataUrl = await fileToBase64(file)
      onAddToLibrary(activeCategory, {
        id: Date.now().toString(),
        url: dataUrl,
        name: file.name,
      })
    } catch (err) {
      console.error('Failed to read file:', err)
    }
    setUploading(false)
    e.target.value = ''
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

        <h2 className="font-game text-sm mb-4 text-black">Design Library</h2>

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

                  {/* Admin delete */}
                  {isAdmin && (
                    <button
                      onClick={() => onRemoveFromLibrary(activeCategory, item.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600 shadow-[1px_1px_0_black]"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin upload */}
        {isAdmin && (
          <div className="mt-4 pt-3 border-t-2 border-dashed border-gray-300 flex items-center justify-between">
            <span className="font-game text-[8px] text-gray-500">Admin: Add to {CATEGORIES.find(c => c.id === activeCategory)?.label}</span>
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
              onChange={handleFileAdd}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  )
}
