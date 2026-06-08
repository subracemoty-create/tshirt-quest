import BuzzerButton from './BuzzerButton'
import UploadModal from './UploadModal'
import ColorPickerModal from './ColorPickerModal'
import LibraryModal from './LibraryModal'
import TextPanel from './TextPanel'

export default function ControlPanel({
  colorPickerOpen, onColorPickerOpen, onColorPickerClose,
  shirtColor, onColorSelect,
  textPanelOpen, onTextPanelOpen, onTextPanelClose,
  activeTextSettings, onTextChange, activeSide,
  uploadModalOpen, onUploadModalOpen, onUploadModalClose,
  onUpload,
  libraryOpen, onLibraryOpen, onLibraryClose,
  onSelectDesign, library, onAddToLibrary, onRemoveFromLibrary, onMoveToCategory, isAdmin, onAdminLogin,
}) {
  return (
    <>
      {/* Buzzer buttons */}
      <div className="flex items-end gap-3 md:gap-6 flex-wrap justify-center">
        <BuzzerButton label="COLOR" color="pink" onClick={onColorPickerOpen} />
        <BuzzerButton label="TEXT" color="cyan" onClick={onTextPanelOpen} />
        <BuzzerButton label="UPLOAD" color="yellow" onClick={onUploadModalOpen} />
        <BuzzerButton label="LIBRARY" color="purple" onClick={onLibraryOpen} />
      </div>

      {/* Modals / Panels */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={onUploadModalClose}
        onUpload={onUpload}
      />

      <ColorPickerModal
        isOpen={colorPickerOpen}
        onClose={onColorPickerClose}
        currentColor={shirtColor}
        onColorSelect={onColorSelect}
      />

      <TextPanel
        isOpen={textPanelOpen}
        onClose={onTextPanelClose}
        textSettings={activeTextSettings}
        onTextChange={onTextChange}
        activeSide={activeSide}
      />

      <LibraryModal
        isOpen={libraryOpen}
        onClose={onLibraryClose}
        onSelectDesign={onSelectDesign}
        library={library}
        onAddToLibrary={onAddToLibrary}
        onRemoveFromLibrary={onRemoveFromLibrary}
        onMoveToCategory={onMoveToCategory}
        isAdmin={isAdmin}
        onAdminLogin={onAdminLogin}
      />
    </>
  )
}
