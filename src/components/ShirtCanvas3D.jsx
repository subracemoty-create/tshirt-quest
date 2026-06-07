import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Edges } from '@react-three/drei'
import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import * as THREE from 'three'

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

function TShirt({ shirtColor, frontDesign, backDesign, frontLayout, backLayout, activeSide, controlsRef }) {
  const meshRef = useRef()
  const frontTex = useDesignTexture(frontDesign)
  const backTex = useDesignTexture(backDesign)
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
        <meshStandardMaterial color={shirtColor} roughness={0.7} metalness={0.05} side={THREE.DoubleSide} />
        <Edges threshold={15} color="#4488ff" lineWidth={0.6} />
      </mesh>

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
    </group>
  )
}

function Scene({ frontDesign, backDesign, shirtColor, activeSide, frontLayout, backLayout }) {
  const controlsRef = useRef()

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 5]} intensity={1.0} />
      <directionalLight position={[-3, 3, -4]} intensity={0.4} />
      <pointLight position={[0, 2, 3]} intensity={0.3} />
      {/* Rim lights — edge highlights so dark shirts pop against dark backgrounds */}
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

export default function ShirtCanvas3D({
  frontDesign, backDesign, shirtColor, activeSide,
  frontLayout, backLayout, onLayoutChange,
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
        />
      </Canvas>

      {/* Controls bar */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 backdrop-blur rounded-xl px-2.5 py-1.5 border border-cyan-500/30">
        {/* Zoom */}
        <button
          onClick={() => update({ scale: Math.max(0.2, layout.scale - 0.1) })}
          className="font-game text-[10px] text-white hover:text-cyan-400 cursor-pointer px-1"
        >−</button>
        <span className="font-game text-[7px] text-cyan-400 min-w-[2rem] text-center">
          {Math.round(layout.scale * 100)}%
        </span>
        <button
          onClick={() => update({ scale: Math.min(2, layout.scale + 0.1) })}
          className="font-game text-[10px] text-white hover:text-cyan-400 cursor-pointer px-1"
        >+</button>

        <div className="w-px h-4 bg-cyan-500/30 mx-0.5" />

        {/* Direction pad */}
        <button
          onClick={() => nudge('x', -1)}
          className="font-game text-[8px] text-white hover:text-yellow-400 cursor-pointer px-0.5"
        >◀</button>
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => nudge('y', 1)}
            className="font-game text-[7px] text-white hover:text-yellow-400 cursor-pointer leading-none"
          >▲</button>
          <button
            onClick={() => nudge('y', -1)}
            className="font-game text-[7px] text-white hover:text-yellow-400 cursor-pointer leading-none"
          >▼</button>
        </div>
        <button
          onClick={() => nudge('x', 1)}
          className="font-game text-[8px] text-white hover:text-yellow-400 cursor-pointer px-0.5"
        >▶</button>

        <div className="w-px h-4 bg-cyan-500/30 mx-0.5" />

        {/* Presets */}
        {Object.entries(PRESETS).map(([key, p]) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            className={`
              font-game text-[5px] md:text-[6px] px-1.5 py-0.5 rounded border cursor-pointer transition-all
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
