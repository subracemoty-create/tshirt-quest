import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Edges } from '@react-three/drei'
import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import * as THREE from 'three'

function isDarkColor(hex) {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 0.299 + g * 0.587 + b * 0.114) < 100
}

const PRESETS = {
  center:     { x: 0,     y: 0.1,  scale: 1.0,  label: 'מרכז' },
  leftChest:  { x: 0.08,  y: 0.22, scale: 0.38, label: 'חזה שמאל' },
  rightChest: { x: -0.08, y: 0.22, scale: 0.38, label: 'חזה ימין' },
}

const STEP = 0.03

function useDesignTexture(url) {
  const [texture, setTexture] = useState(null)
  useEffect(() => {
    if (!url) { setTexture(null); return }
    new THREE.TextureLoader().load(url, (t) => {
      t.colorSpace = THREE.SRGBColorSpace
      setTexture(t)
    })
  }, [url])
  return texture
}

/* ── Text-to-texture: renders typed text (straight or curved) onto a canvas ── */

function drawCurvedText(ctx, text, cx, cy, radius) {
  const isRTL = /[֐-׿]/.test(text.trim()[0] || '')
  const chars = isRTL ? text.split('').reverse() : text.split('')

  const charWidths = chars.map(ch => ctx.measureText(ch).width)
  const totalWidth = charWidths.reduce((a, b) => a + b, 0)
  const totalAngle = Math.min(totalWidth / radius, Math.PI * 0.9)
  const scale = totalAngle / totalWidth

  ctx.save()
  ctx.translate(cx, cy)

  let angle = -totalAngle / 2
  for (let i = 0; i < chars.length; i++) {
    const halfChar = (charWidths[i] * scale) / 2
    angle += halfChar
    ctx.save()
    ctx.rotate(angle)
    ctx.translate(0, -radius)
    ctx.fillText(chars[i], 0, 0)
    ctx.restore()
    angle += halfChar
  }

  ctx.restore()
}

function useTextTexture(settings) {
  const [texture, setTexture] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!settings?.text?.trim()) {
      setTexture(prev => { if (prev) prev.dispose(); return null })
      return
    }

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas')
      canvasRef.current.width = 512
      canvasRef.current.height = 512
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let cancelled = false

    /* Wait for the chosen Google Font to be ready */
    document.fonts.load(`bold 48px "${settings.font}"`).then(() => {
      if (cancelled) return

      ctx.clearRect(0, 0, 512, 512)

      const len = settings.text.length
      const fontSize = Math.min(110, Math.max(28, 500 / Math.max(len * 0.72, 1)))

      ctx.font = `bold ${fontSize}px "${settings.font}"`
      ctx.fillStyle = settings.color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      if (settings.curved) {
        drawCurvedText(ctx, settings.text, 256, 370, 190)
      } else {
        ctx.fillText(settings.text, 256, 256, 480)
      }

      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      setTexture(prev => { if (prev) prev.dispose(); return tex })
    })

    return () => { cancelled = true }
  }, [settings?.text, settings?.color, settings?.font, settings?.curved])

  return texture
}

/* ── Shirt shape ── */

function createShirtShape() {
  const s = new THREE.Shape()
  s.moveTo(-0.12, 0.95)
  s.quadraticCurveTo(-0.05, 1.0, 0, 1.0)
  s.quadraticCurveTo(0.05, 1.0, 0.12, 0.95)
  s.lineTo(0.45, 0.88)
  s.lineTo(0.62, 0.72)
  s.lineTo(0.48, 0.64)
  s.quadraticCurveTo(0.38, 0.6, 0.35, 0.55)
  s.lineTo(0.32, -0.05)
  s.quadraticCurveTo(0.32, -0.1, 0.28, -0.1)
  s.lineTo(-0.28, -0.1)
  s.quadraticCurveTo(-0.32, -0.1, -0.32, -0.05)
  s.lineTo(-0.35, 0.55)
  s.quadraticCurveTo(-0.38, 0.6, -0.48, 0.64)
  s.lineTo(-0.62, 0.72)
  s.lineTo(-0.45, 0.88)
  s.lineTo(-0.12, 0.95)
  return s
}

/* ── 3D T-Shirt mesh + overlays ── */

function TShirt({ shirtColor, frontDesign, backDesign, frontLayout, backLayout, activeSide, controlsRef, frontTextSettings, backTextSettings }) {
  const meshRef = useRef()
  const frontTex = useDesignTexture(frontDesign)
  const backTex = useDesignTexture(backDesign)
  const frontTextTex = useTextTexture(frontTextSettings)
  const backTextTex = useTextTexture(backTextSettings)
  const targetAzimuth = useRef(0)

  const geometry = useMemo(() => {
    const shape = createShirtShape()
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 3,
    })
    geo.center()
    return geo
  }, [])

  useEffect(() => {
    targetAzimuth.current = activeSide === 'back' ? Math.PI : 0
  }, [activeSide])

  useFrame(() => {
    const controls = controlsRef?.current
    if (!controls) return
    const cur = controls.getAzimuthalAngle()
    let diff = targetAzimuth.current - cur
    while (diff > Math.PI) diff -= Math.PI * 2
    while (diff < -Math.PI) diff += Math.PI * 2
    if (Math.abs(diff) > 0.01) {
      controls.setAzimuthalAngle(cur + diff * 0.1)
      controls.update()
    }
  })

  const fds = frontLayout.scale * 0.45
  const bds = backLayout.scale * 0.45

  return (
    <group position={[0, 0.45, 0]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial color={shirtColor} roughness={0.3} metalness={0.0} side={THREE.DoubleSide} />
      </mesh>

      {/* ── Front design image ── */}
      {frontTex && (
        <mesh position={[frontLayout.x, frontLayout.y, 0.03]}>
          <planeGeometry args={[fds, fds]} />
          <meshStandardMaterial
            map={frontTex}
            transparent
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>
      )}

      {/* ── Front text overlay ── */}
      {frontTextTex && (
        <mesh position={[frontLayout.x, frontLayout.y, 0.035]}>
          <planeGeometry args={[fds, fds]} />
          <meshBasicMaterial
            map={frontTextTex}
            transparent
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </mesh>
      )}

      {/* ── Back design image ── */}
      {backTex && (
        <mesh position={[backLayout.x, backLayout.y, -0.03]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[bds, bds]} />
          <meshStandardMaterial
            map={backTex}
            transparent
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>
      )}

      {/* ── Back text overlay ── */}
      {backTextTex && (
        <mesh position={[backLayout.x, backLayout.y, -0.035]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[bds, bds]} />
          <meshBasicMaterial
            map={backTextTex}
            transparent
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </mesh>
      )}
    </group>
  )
}

/* ── Scene ── */

function Scene({ frontDesign, backDesign, shirtColor, activeSide, frontLayout, backLayout, frontTextSettings, backTextSettings }) {
  const controlsRef = useRef()

  return (
    <>
      <ambientLight intensity={2.5} />
      <directionalLight position={[3, 5, 5]} intensity={2.0} />
      <directionalLight position={[-3, 3, -4]} intensity={1.0} />
      <pointLight position={[0, 2, 3]} intensity={0.8} />
      {/* Rim lights */}
      <pointLight position={[-2, 1, -1]} intensity={0.6} color="#4488ff" />
      <pointLight position={[2, 1, -1]} intensity={0.6} color="#4488ff" />
      <pointLight position={[0, -1, 2]} intensity={0.4} color="#6644cc" />

      <TShirt
        shirtColor={shirtColor}
        frontDesign={frontDesign}
        backDesign={backDesign}
        frontLayout={frontLayout}
        backLayout={backLayout}
        activeSide={activeSide}
        controlsRef={controlsRef}
        frontTextSettings={frontTextSettings}
        backTextSettings={backTextSettings}
      />

      <OrbitControls
        ref={controlsRef}
        target={[0, 0.45, 0]}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.6}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}

/* ── Exported wrapper with controls bar ── */

export default function ShirtCanvas3D({
  frontDesign, backDesign, shirtColor, activeSide,
  frontLayout, backLayout, onLayoutChange,
  frontTextSettings, backTextSettings,
}) {
  const layout = activeSide === 'front' ? frontLayout : backLayout

  const update = useCallback((patch) => {
    onLayoutChange(activeSide, patch)
  }, [activeSide, onLayoutChange])

  const applyPreset = useCallback((key) => {
    const p = PRESETS[key]
    update({ x: p.x, y: p.y, scale: p.scale })
  }, [update])

  const nudge = useCallback((axis, dir) => {
    if (axis === 'y') {
      update({ y: Math.max(-0.2, Math.min(0.4, layout.y + dir * STEP)) })
    } else {
      update({ x: Math.max(-0.25, Math.min(0.25, layout.x + dir * STEP)) })
    }
  }, [layout.x, layout.y, update])

  const matchesPreset = (p) =>
    Math.abs(layout.x - p.x) < 0.005 &&
    Math.abs(layout.y - p.y) < 0.005 &&
    Math.abs(layout.scale - p.scale) < 0.005

  return (
    <div className="w-full max-w-md aspect-[4/5] relative flex-1 min-h-0">
      <Canvas
        camera={{ position: [0, 0.5, 2.5], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Scene
          frontDesign={frontDesign}
          backDesign={backDesign}
          shirtColor={shirtColor}
          activeSide={activeSide}
          frontLayout={frontLayout}
          backLayout={backLayout}
          frontTextSettings={frontTextSettings}
          backTextSettings={backTextSettings}
        />
      </Canvas>

      {/* Controls bar */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/85 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-cyan-500/40">
        {/* Zoom */}
        <button
          onClick={() => update({ scale: Math.max(0.2, layout.scale - 0.1) })}
          className="font-game text-sm text-white hover:text-cyan-400 cursor-pointer px-1"
        >−</button>
        <span className="font-game text-[10px] text-cyan-400 min-w-[3rem] text-center">
          {Math.round(layout.scale * 100)}%
        </span>
        <button
          onClick={() => update({ scale: Math.min(2, layout.scale + 0.1) })}
          className="font-game text-sm text-white hover:text-cyan-400 cursor-pointer px-1"
        >+</button>

        <div className="w-px h-6 bg-cyan-500/30" />

        {/* Direction pad */}
        <button
          onClick={() => nudge('x', -1)}
          className="font-game text-xs text-white hover:text-yellow-400 cursor-pointer px-0.5"
        >◀</button>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => nudge('y', 1)}
            className="font-game text-[10px] text-white hover:text-yellow-400 cursor-pointer leading-none"
          >▲</button>
          <button
            onClick={() => nudge('y', -1)}
            className="font-game text-[10px] text-white hover:text-yellow-400 cursor-pointer leading-none"
          >▼</button>
        </div>
        <button
          onClick={() => nudge('x', 1)}
          className="font-game text-xs text-white hover:text-yellow-400 cursor-pointer px-0.5"
        >▶</button>

        <div className="w-px h-6 bg-cyan-500/30" />

        {/* Presets */}
        {Object.entries(PRESETS).map(([key, p]) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            className={`
              font-game text-[8px] md:text-[9px] px-2.5 py-1 rounded border cursor-pointer transition-all
              ${matchesPreset(p)
                ? 'border-cyan-400 text-cyan-400 bg-cyan-400/15'
                : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white'
              }
            `}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
