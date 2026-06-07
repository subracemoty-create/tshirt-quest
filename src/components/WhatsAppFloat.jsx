export default function WhatsAppFloat() {
  const phone = '972526468894'
  const message = encodeURIComponent('היי! הגעתי מאתר T-SHIRT QUEST ואשמח לשמוע פרטים נוספים 🎮')
  const href = `https://wa.me/${phone}?text=${message}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center border-3 border-black shadow-[3px_3px_0_black] hover:shadow-[4px_4px_0_black] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[1px_1px_0_black] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer animate-whatsapp-pulse"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
        <path d="M16.004 3.2C9.158 3.2 3.6 8.758 3.6 15.604c0 2.186.573 4.322 1.66 6.207L3.2 28.8l7.2-2.016a12.35 12.35 0 005.604 1.34c6.846 0 12.396-5.55 12.396-12.396S22.85 3.2 16.004 3.2zm0 22.632a10.18 10.18 0 01-5.19-1.418l-.372-.222-3.858 1.08 1.098-3.792-.244-.388A10.14 10.14 0 015.76 15.6c0-5.646 4.6-10.24 10.252-10.24 5.646 0 10.228 4.594 10.228 10.24 0 5.652-4.59 10.232-10.236 10.232zm5.616-7.668c-.308-.154-1.824-.9-2.106-.998-.282-.102-.488-.154-.694.154-.204.308-.796.998-.976 1.204-.18.204-.358.23-.666.076-.308-.154-1.3-.478-2.478-1.526-.916-.816-1.534-1.824-1.714-2.132-.18-.308-.02-.474.134-.628.14-.138.308-.358.462-.538.154-.18.204-.308.308-.514.102-.204.05-.384-.026-.538-.076-.154-.694-1.672-.952-2.29-.25-.6-.504-.52-.694-.528l-.59-.01a1.135 1.135 0 00-.822.386c-.282.308-1.078 1.054-1.078 2.57 0 1.518 1.104 2.984 1.258 3.19.154.204 2.174 3.32 5.268 4.656.736.318 1.31.508 1.758.65.738.236 1.41.202 1.942.122.592-.088 1.824-.746 2.082-1.466.258-.72.258-1.338.18-1.466-.076-.128-.282-.204-.59-.358z" />
      </svg>
    </a>
  )
}
