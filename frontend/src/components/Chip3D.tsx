import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Float } from '@react-three/drei'
import * as THREE from 'three'

interface Chip3DProps {
  exploded: boolean
  activeBlock: number | null
  onSelectBlock: (id: number) => void
  telemetry: any
  simulating: boolean
}

// 3D Block Sub-Component
function AdderBlock3D({
  id,
  position,
  explodedY,
  isSelected,
  onSelect,
  isSkipActive,
  blockData
}: {
  id: number
  position: [number, number, number]
  explodedY: number
  isSelected: boolean
  onSelect: () => void
  isSkipActive: boolean
  blockData?: any
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Pulsing animation when block is selected or active
  useFrame((state) => {
    if (meshRef.current) {
      if (isSkipActive) {
        const t = state.clock.getElapsedTime()
        const scale = 1.0 + Math.sin(t * 4 + id) * 0.02
        meshRef.current.scale.set(scale, 1, scale)
      } else {
        meshRef.current.scale.set(1, 1, 1)
      }
    }
  })

  const baseColor = isSkipActive
    ? '#FF7A00'
    : isSelected
    ? '#00F0FF'
    : hovered
    ? '#38BDF8'
    : '#1E293B'

  const emissiveColor = isSkipActive
    ? '#FF5500'
    : isSelected
    ? '#0099FF'
    : '#051020'

  return (
    <group position={[position[0], position[1] + explodedY, position[2]]}>
      {/* 4-Bit Core Silicon Block */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.8, 0.35, 1.4]} />
        <meshStandardMaterial
          color={baseColor}
          metalness={0.7}
          roughness={0.25}
          emissive={emissiveColor}
          emissiveIntensity={isSkipActive ? 0.8 : isSelected ? 0.5 : 0.15}
        />
      </mesh>

      {/* Internal 4-Stage Sub-units (representing 4 full adders) */}
      {[-0.6, -0.2, 0.2, 0.6].map((offset, i) => (
        <mesh key={i} position={[offset, 0.2, 0]}>
          <boxGeometry args={[0.25, 0.1, 0.8]} />
          <meshStandardMaterial
            color={isSkipActive ? '#FFAA33' : '#00F0FF'}
            metalness={0.9}
            roughness={0.2}
            emissive={isSkipActive ? '#FF7A00' : '#00A3FF'}
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}

      {/* Block Identification Label */}
      <Text
        position={[0, 0.3, 0.9]}
        fontSize={0.22}
        color={isSelected ? '#00F0FF' : '#E2E8F0'}
        anchorX="center"
        anchorY="middle"
      >
        {`BLOCK ${id} [${id * 4 + 3}:${id * 4}]`}
      </Text>

      {/* Group Propagate Status Floating Indicator */}
      {blockData && (
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.16}
          color={blockData.p_group ? '#FF7A00' : '#64748B'}
          anchorX="center"
          anchorY="middle"
        >
          {blockData.p_group ? '⚡ P_grp=1 (SKIP)' : 'P_grp=0 (RIPPLE)'}
        </Text>
      )}
    </group>
  )
}

// Metallic IC Pins on Chip Package Periphery
function ChipPins() {
  const pinCount = 12
  const pins = []
  
  // North and South rows
  for (let i = 0; i < pinCount; i++) {
    const x = -4.5 + (i * 9) / (pinCount - 1)
    pins.push(
      <mesh key={`n-${i}`} position={[x, -0.2, 3.2]}>
        <boxGeometry args={[0.3, 0.08, 0.8]} />
        <meshStandardMaterial color="#D1D5DB" metalness={0.95} roughness={0.1} />
      </mesh>
    )
    pins.push(
      <mesh key={`s-${i}`} position={[x, -0.2, -3.2]}>
        <boxGeometry args={[0.3, 0.08, 0.8]} />
        <meshStandardMaterial color="#D1D5DB" metalness={0.95} roughness={0.1} />
      </mesh>
    )
  }

  // East and West rows
  for (let i = 0; i < 8; i++) {
    const z = -2.5 + (i * 5) / 7
    pins.push(
      <mesh key={`e-${i}`} position={[5.2, -0.2, z]}>
        <boxGeometry args={[0.8, 0.08, 0.3]} />
        <meshStandardMaterial color="#D1D5DB" metalness={0.95} roughness={0.1} />
      </mesh>
    )
    pins.push(
      <mesh key={`w-${i}`} position={[-5.2, -0.2, z]}>
        <boxGeometry args={[0.8, 0.08, 0.3]} />
        <meshStandardMaterial color="#D1D5DB" metalness={0.95} roughness={0.1} />
      </mesh>
    )
  }

  return <group>{pins}</group>
}

// Animated Carry Skip Highways
function CarryBus3D({
  explodedY,
  blocksData,
  simulating
}: {
  explodedY: number
  blocksData?: any[]
  simulating: boolean
}) {
  const pulseRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (pulseRef.current && simulating) {
      const t = (state.clock.getElapsedTime() * 2) % 4
      pulseRef.current.position.x = -3.2 + t * 2.1
    }
  })

  return (
    <group position={[0, -0.05 + explodedY * 0.5, 0]}>
      {/* 4 Block Interconnect Segments */}
      {[-3.3, -1.1, 1.1, 3.3].map((x, idx) => {
        const isSkip = blocksData && blocksData[idx]?.skip_active
        const color = isSkip ? '#FF7A00' : '#00F0FF'
        return (
          <mesh key={idx} position={[x, 0, -1.4]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 2.0, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isSkip ? 0.9 : 0.4}
            />
          </mesh>
        )
      })}

      {/* Animated Signal Pulse indicator */}
      {simulating && (
        <group ref={pulseRef}>
          <mesh position={[0, 0.1, -1.4]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial
              color="#FF7A00"
              emissive="#FF7A00"
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      )}
    </group>
  )
}

// Scene Root
function SemiconductorScene({
  exploded,
  activeBlock,
  onSelectBlock,
  telemetry,
  simulating
}: Chip3DProps) {
  // Layer vertical offsets for Exploded View
  const lidY = exploded ? 2.8 : 0.55
  const blocksY = exploded ? 1.2 : 0.15
  const interconnectY = exploded ? 0.4 : 0.05

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow />
      <pointLight position={[-10, 8, -5]} intensity={0.8} color="#00F0FF" />
      <pointLight position={[10, -5, 5]} intensity={0.6} color="#FF7A00" />

      {/* PCB Baseboard */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <boxGeometry args={[13, 0.2, 9]} />
        <meshStandardMaterial
          color="#06101E"
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* PCB Glowing Micro-traces */}
      <gridHelper args={[13, 26, '#00F0FF', '#0F2644']} position={[0, -0.49, 0]} />

      {/* Silicon Package Base Substrate */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[9.8, 0.4, 6.2]} />
        <meshStandardMaterial
          color="#090D16"
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>

      {/* Metallic Pins */}
      <ChipPins />

      {/* Silicon Die Central Substrate */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[8.8, 0.15, 5.2]} />
        <meshStandardMaterial
          color="#050B14"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Layer 3: Four 4-Bit Carry Skip Adder Blocks */}
      <AdderBlock3D
        id={0}
        position={[-3.3, 0.15, 0]}
        explodedY={blocksY}
        isSelected={activeBlock === 0}
        onSelect={() => onSelectBlock(0)}
        isSkipActive={Boolean(telemetry?.blocks?.[0]?.skip_active)}
        blockData={telemetry?.blocks?.[0]}
      />
      <AdderBlock3D
        id={1}
        position={[-1.1, 0.15, 0]}
        explodedY={blocksY}
        isSelected={activeBlock === 1}
        onSelect={() => onSelectBlock(1)}
        isSkipActive={Boolean(telemetry?.blocks?.[1]?.skip_active)}
        blockData={telemetry?.blocks?.[1]}
      />
      <AdderBlock3D
        id={2}
        position={[1.1, 0.15, 0]}
        explodedY={blocksY}
        isSelected={activeBlock === 2}
        onSelect={() => onSelectBlock(2)}
        isSkipActive={Boolean(telemetry?.blocks?.[2]?.skip_active)}
        blockData={telemetry?.blocks?.[2]}
      />
      <AdderBlock3D
        id={3}
        position={[3.3, 0.15, 0]}
        explodedY={blocksY}
        isSelected={activeBlock === 3}
        onSelect={() => onSelectBlock(3)}
        isSkipActive={Boolean(telemetry?.blocks?.[3]?.skip_active)}
        blockData={telemetry?.blocks?.[3]}
      />

      {/* Layer 4: Carry Interconnect Bus and Skip Highways */}
      <CarryBus3D
        explodedY={interconnectY}
        blocksData={telemetry?.blocks}
        simulating={simulating}
      />

      {/* Layer 1: Protective Packaging Ceramic/Metallic Heat-spreader Lid */}
      <mesh position={[0, lidY, 0]}>
        <boxGeometry args={[9.4, 0.12, 5.8]} />
        <meshStandardMaterial
          color="#0A1120"
          metalness={0.95}
          roughness={0.12}
          transparent={exploded}
          opacity={exploded ? 0.35 : 0.95}
        />
      </mesh>

      {/* Package Laser Engraving / Typography */}
      <Text
        position={[0, lidY + 0.07, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.34}
        color="#00F0FF"
        anchorX="center"
        anchorY="middle"
      >
        CYBERCORE • CSKA-16 • SKY130
      </Text>

      <Text
        position={[0, lidY + 0.07, 0.6]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.18}
        color="#94A3B8"
        anchorX="center"
        anchorY="middle"
      >
        130nm HIGH-DENSITY ASIC PROCESSOR
      </Text>

      {/* Camera and Interaction Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={22}
        maxPolarAngle={Math.PI / 2 + 0.05}
      />
    </>
  )
}

export default function Chip3D(props: Chip3DProps) {
  return (
    <div className="w-full h-[520px] rounded-xl overflow-hidden glass-panel relative">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 8, 11], fov: 42 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <SemiconductorScene {...props} />
      </Canvas>

      {/* 3D Viewport HUD Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none flex items-center space-x-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse"></span>
        <span className="text-xs font-mono tracking-widest text-[#00F0FF] font-bold">
          3D SILICON DIE VIEWER • SKY130HD
        </span>
      </div>

      <div className="absolute bottom-4 left-4 pointer-events-none text-xs text-[#94A3B8] font-mono">
        Rotate: Left-Click Drag • Zoom: Scroll • Pan: Right-Click Drag
      </div>

      <div className="absolute bottom-4 right-4 flex space-x-3 text-xs font-mono">
        <span className="flex items-center space-x-1.5 bg-[#0F172A]/80 px-2.5 py-1 rounded border border-[#00F0FF]/30 text-[#00F0FF]">
          <span className="w-2 h-2 rounded-full bg-[#00F0FF]"></span>
          <span>Ripple Chain</span>
        </span>
        <span className="flex items-center space-x-1.5 bg-[#0F172A]/80 px-2.5 py-1 rounded border border-[#FF7A00]/40 text-[#FF7A00]">
          <span className="w-2 h-2 rounded-full bg-[#FF7A00]"></span>
          <span>Skip Bypass</span>
        </span>
      </div>
    </div>
  )
}
