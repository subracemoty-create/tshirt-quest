import { useEffect, useRef } from 'react'

export default function StarField({ count = 80 }) {
  const ref = useRef(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    // Static stars
    for (let i = 0; i < 120; i++) {
      const star = document.createElement('div')
      const size = Math.random() * 2 + 0.5
      const x = Math.random() * 100
      const y = Math.random() * 100
      const opacity = Math.random() * 0.6 + 0.2
      const twinkleDuration = Math.random() * 3 + 2

      star.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        border-radius: 50%;
        background: ${Math.random() > 0.8 ? '#aaccff' : Math.random() > 0.5 ? '#ffe8cc' : '#ffffff'};
        opacity: ${opacity};
        animation: twinkle-star ${twinkleDuration}s ease-in-out ${Math.random() * 3}s infinite alternate;
      `
      container.appendChild(star)
    }

    // Floating stars
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div')
      star.className = 'star'
      const size = Math.random() * 1.5 + 0.5
      const left = Math.random() * 100
      const delay = Math.random() * 20
      const duration = Math.random() * 15 + 10

      star.style.width = `${size}px`
      star.style.height = `${size}px`
      star.style.left = `${left}%`
      star.style.bottom = `-5%`
      star.style.animationDelay = `${delay}s`
      star.style.animationDuration = `${duration}s`
      star.style.opacity = '0'

      container.appendChild(star)
    }

    // Add twinkle keyframe
    if (!document.getElementById('twinkle-keyframe')) {
      const style = document.createElement('style')
      style.id = 'twinkle-keyframe'
      style.textContent = `@keyframes twinkle-star { 0% { opacity: 0.2; transform: scale(1); } 100% { opacity: 1; transform: scale(1.3); } }`
      document.head.appendChild(style)
    }

    return () => { container.innerHTML = '' }
  }, [count])

  return <div ref={ref} className="stars-layer" />
}
