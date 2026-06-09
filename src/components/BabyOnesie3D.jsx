import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import * as THREE from 'three'

const PRESETS = {
  center:     { x: 0,     y: 0.18, scale: 0.8,  label: 'מרכז' },
  leftChest:  { x: 0.07,  y: 0.32, scale: 0.32, label: 'חזה שמאל' },
  rightChest: { x: -0.07, y: 0.32, scale: 0.32, label: 'חזה ימין' },
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

function createOnesieShape() {
  const s = new THREE.Shape()
  s.moveTo(-0.10, 0.95)
  s.quadraticCurveTo(-0.04, 1.0, 0, 1.0)
  s.quadraticCurveTo(0.04, 1.0, 0.10, 0.95)
  s.lineTo(0.35, 0.88)
  s.lineTo(0.48, 0.75)
  s.lineTo(0.36, 0.68)
  s.quadraticCurveTo(0.30, 0.65, 0.28, 0.58)
  s.lineTo(0.28, 0.0)
  s.quadraticCurveTo(0.28, -0.05, 0.30, -0.10)
  s.lineTo(0.32, -0.18)
  s.quadraticCurveTo(0.30, -0.28, 0.22, -0.32)
  s.lineTo(0.12, -0.35)
  s.quadraticCurveTo(0.06, -0.37, 0, -0.37)
  s.quadraticCurveTo(-0.06, -0.37, -0.12, -0.35)
  s.lineTo(-0.22, -0.32)
  s.quadraticCurveTo(-0.30, -0.28, -0.32, -0.18)
  s.lineTo(-0.30, -0.10)
  s.quadraticCurveTo(-0.28, -0.05, -0.28, 0.0)
  s.lineTo(-0.28, 0.58)
  s.quadraticCurveTo(-0.30, 0.65, -0.36, 0.68)
  s.lineTo(-0.48, 0.75)
  s.lineTo(-0.35, 0.88)
  s.lineTo(-0.10, 0.95)
  return s
}

function Onesie({ shirtColor, frontDesign, backDesign, frontLayout, backLayout, activeSide, controlsRef, frontTextSettings, backTextSettings }) {
  const meshRef = useRef()
  const frontTex = useDesignTexture(frontDesign)
  const backTex = useDesignTexture(backDesign)
  const frontTextTex = useTextTexture(frontTextSettings)
  const backTextTex = useTextTexture(backTextSettings)
  const targetAzimuth = useRef(0)

  const geometry = useMemo(() => {
    const shape = createOnesieShape()
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

  const fds = frontLayout.scale * 0.40
  const bds = backLayout.scale * 0.40

  return (
    <group position={[0, 0.45, 0]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial color={shirtColor} roughness={0.3} metalness={0.0} side={THREE.DoubleSide} />
      </mesh>

      {frontTex && (
        <mesh position={[frontLayout.x, frontLayout.y, 0.03]}>
          <planeGeometry args={[fds, fds]} />
          <meshStandardMaterial map={frontTex} transparent depthWrite={false} polygonOffset polygonOffsetFactor={-1} />
        </mesh>
      )}
      {frontTextTex && (
        <mesh position={[frontLayout.x, frontLayout.y, 0.035]}>
          <planeGeometry args={[fds, fds]} />
          <meshBasicMaterial map={frontTextTex} transparent depthWrite={false} polygonOffset polygonOffsetFactor={-2} />
        </mesh>
      )}
      {backTex && (
        <mesh position={[backLayout.x, backLayout.y, -0.03]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[bds, bds]} />
          <meshStandardMaterial map={backTex} transparent depthWrite={false} polygonOffset polygonOffsetFactor={-1} />
        </mesh>
      )}
      {backTextTex && (
        <mesh position={[backLayout.x, backLayout.y, -0.035]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[bds, bds]} />
          <meshBasicMaterial map={backTextTex} transparent depthWrite={false} polygonOffset polygonOffsetFactor={-2} />
        </mesh>
      )}
    </group>
  )
}

function Scene({ frontDesign, backDesign, shirtColor, activeSide, frontLayout, backLayout, frontTextSettings, backTextSettings }) {
  const controlsRef = useRef()
  return (
    <>
      <ambientLight intensity={2.5} />
      <directionalLight position={[3, 5, 5]} intensity={2.0} />
      <directionalLight position={[-3, 3, -4]} intensity={1.0} />
      <pointLight position={[0, 2, 3]} intensity={0.8} />
      <pointLight position={[-2, 1, -1]} intensity={0.6} color="#4488ff" />
      <pointLight position={[2, 1, -1]} intensity={0.6} color="#4488ff" />
      <pointLight position={[0, -1, 2]} intensity={0.4} color="#6644cc" />
      <Onesie
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

export default function BabyOnesie3D({
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
    <div id="tshirt-canvas-container" className="w-full max-w-md aspect-[4/5] relative flex-1 min-h-0">
      <Canvas
        camera={{ position: [0, 0.5, 2.5], fov: 35 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
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

      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/85 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-cyan-500/40">
        <button onClick={() => update({ scale: Math.max(0.2, layout.scale - 0.1) })} className="font-game text-sm text-white hover:text-cyan-400 cursor-pointer px-1">−</button>
        <span className="font-game text-[10px] text-cyan-400 min-w-[3rem] text-center">{Math.round(layout.scale * 100)}%</span>
        <button onClick={() => update({ scale: Math.min(2, layout.scale + 0.1) })} className="font-game text-sm text-white hover:text-cyan-400 cursor-pointer px-1">+</button>
        <div className="w-px h-6 bg-cyan-500/30" />
        <button onClick={() => nudge('x', -1)} className="font-game text-xs text-white hover:text-yellow-400 cursor-pointer px-0.5">◀</button>
        <div className="flex flex-col gap-1">
          <button onClick={() => nudge('y', 1)} className="font-game text-[10px] text-white hover:text-yellow-400 cursor-pointer leading-none">▲</button>
          <button onClick={() => nudge('y', -1)} className="font-game text-[10px] text-white hover:text-yellow-400 cursor-pointer leading-none">▼</button>
        </div>
        <button onClick={() => nudge('x', 1)} className="font-game text-xs text-white hover:text-yellow-400 cursor-pointer px-0.5">▶</button>
        <div className="w-px h-6 bg-cyan-500/30" />
        {Object.entries(PRESETS).map(([key, p]) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            className={`font-game text-[8px] md:text-[9px] px-2.5 py-1 rounded border cursor-pointer transition-all ${
              matchesPreset(p)
                ? 'border-cyan-400 text-cyan-400 bg-cyan-400/15'
                : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
