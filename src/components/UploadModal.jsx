import { useRef, useState } from 'react'

export default function UploadModal({ isOpen, onClose, onUpload }) {
  const fileInputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  if (!isOpen) return null

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/png')) {
      alert('Please upload a PNG file')
      return
    }
    onUpload(file)
    onClose()
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  function handleFileSelect(e) {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white border-4 border-cyan-400 rounded-2xl p-6 w-[90%] max-w-md shadow-[6px_6px_0_black] relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 bg-black text-white rounded-full font-bold text-lg flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer"
        >
          X
        </button>

        <h2 className="font-game text-sm mb-5 text-black">Upload your PNG image</h2>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-3 border-dashed rounded-xl p-10 mb-5 cursor-pointer
            flex flex-col items-center justify-center gap-3
            transition-colors duration-200
            ${dragOver ? 'border-cyan-400 bg-cyan-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'}
          `}
        >
          {/* Cloud icon */}
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#aab" strokeWidth="1.5">
            <path d="M12 16V8m0 0l-3 3m3-3l3 3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 16.7428C21.2215 15.734 22 14.2195 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18695 15.7935" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="font-game text-[9px] text-gray-500">Upload your PNG image</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".png,image/png"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Upload button */}
        <div className="flex justify-end">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="font-game text-xs px-8 py-3 bg-gradient-to-b from-green-400 to-green-600 text-white border-3 border-green-700 rounded-xl shadow-[3px_3px_0_black] hover:shadow-[4px_4px_0_black] active:shadow-[1px_1px_0_black] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            UPLOAD
          </button>
        </div>
      </div>
    </div>
  )
}
