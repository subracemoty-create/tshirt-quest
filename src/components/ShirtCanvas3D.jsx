import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'

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

  // Start at left neckline
  s.moveTo(-0.12, 0.95)

  // Left collar curve
  s.quadraticCurveTo(-0.05, 1.0, 0, 1.0)
  // Right collar curve
  s.quadraticCurveTo(0.05, 1.0, 0.12, 0.95)

  // Right shoulder
  s.lineTo(0.45, 0.88)
  // Right sleeve outer
  s.lineTo(0.62, 0.72)
  // Right sleeve bottom
  s.lineTo(0.48, 0.64)
  // Right armpit
  s.quadraticCurveTo(0.38, 0.6, 0.35, 0.55)

  // Right side body
  s.lineTo(0.32, -0.05)
  // Bottom right curve
  s.quadraticCurveTo(0.32, -0.1, 0.28, -0.1)

  // Bottom hem
  s.lineTo(-0.28, -0.1)
  // Bottom left curve
  s.quadraticCurveTo(-0.32, -0.1, -0.32, -0.05)

  // Left side body
  s.lineTo(-0.35, 0.55)
  // Left armpit
  s.quadraticCurveTo(-0.38, 0.6, -0.48, 0.64)
  // Left sleeve bottom
  s.lineTo(-0.62, 0.72)
  // Left sleeve outer
  s.lineTo(-0.45, 0.88)

  // Back to start
  s.lineTo(-0.12, 0.95)

  return s
}

function TShirt({ shirtColor, frontDesign, backDesign, designScale = 1, activeSide, controlsRef }) {
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

  const ds = designScale * 0.45

  return (
    <group position={[0, 0.45, 0]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial color={shirtColor} roughness={0.8} metalness={0.0} side={THREE.DoubleSide} />
      </mesh>

      {frontTex && (
        <mesh position={[0, 0.1, 0.03]}>
          <planeGeometry args={[ds, ds]} />
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
        <mesh position={[0, 0.1, -0.03]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[ds, ds]} />
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

function Scene({ frontDesign, backDesign, designScale, shirtColor, activeSide }) {
  const controlsRef = useRef()

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 5]} intensity={1.0} />
      <directionalLight position={[-3, 3, -4]} intensity={0.3} />
      <pointLight position={[0, 2, 3]} intensity={0.3} />

      <TShirt
        shirtColor={shirtColor}
        frontDesign={frontDesign}
        backDesign={backDesign}
        designScale={designScale}
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
  frontDesign, backDesign, designScale, onScaleChange, shirtColor, activeSide,
}) {
  return (
    <div className="w-full max-w-md aspect-[4/5] relative">
      <Canvas
        camera={{ position: [0, 0.5, 2.5], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Scene
          frontDesign={frontDesign}
          backDesign={backDesign}
          designScale={designScale}
          shirtColor={shirtColor}
          activeSide={activeSide}
        />
      </Canvas>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 backdrop-blur rounded-full px-4 py-2 border border-cyan-500/30">
        <button
          onClick={() => onScaleChange(Math.max(0.3, designScale - 0.1))}
          className="font-game text-xs text-white hover:text-cyan-400 cursor-pointer"
        >−</button>
        <span className="font-game text-[10px] text-cyan-400 min-w-[3rem] text-center">
          {Math.round(designScale * 100)}%
        </span>
        <button
          onClick={() => onScaleChange(Math.min(2, designScale + 0.1))}
          className="font-game text-xs text-white hover:text-cyan-400 cursor-pointer"
        >+</button>
      </div>

      <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
        <span
          className="font-game text-[6px] text-gray-500/60 tracking-widest"
          style={{ writingMode: 'vertical-rl' }}
        >ZOOM / ROTATE</span>
      </div>
    </div>
  )
}
