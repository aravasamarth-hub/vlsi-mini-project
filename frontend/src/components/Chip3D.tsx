import React, { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Line, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import {
  Layers,
  Camera,
  RotateCcw,
  Sliders,
  ChevronDown,
  Sparkles,
  Cpu,
  Search,
  Maximize2,
  Info,
  Activity,
  Play,
  Pause,
  Eye,
  EyeOff,
  Flame,
  CheckCircle,
  HelpCircle,
  ZoomIn,
  ZoomOut
} from 'lucide-react'

// Props & Types
export interface Chip3DProps {
  readonly exploded: boolean
  readonly activeBlock: number | null
  readonly onSelectBlock: (id: number) => void
  readonly telemetry: any
  readonly simulating: boolean
  readonly onTabChange?: (tab: string) => void
}

export interface LayerVisibility {
  lid: boolean
  m5: boolean
  m4: boolean
  m3: boolean
  m2: boolean
  m1: boolean
  stdcells: boolean
  transistors: boolean
  wells: boolean
  substrate: boolean
}

// ----------------------------------------------------------------------
// 1. Realistic Metallic QFP Gull-Wing Pins (Perimeter Package Leads)
// ----------------------------------------------------------------------
function RealisticGullWingPins() {
  const pinSegments = useMemo(() => {
    const list: JSX.Element[] = []
    const pinColor = '#FFD700' // Gold plated copper
    const metalness = 0.98
    const roughness = 0.12

    // North side pins (14 pins along top edge)
    const nSideCount = 14
    for (let i = 0; i < nSideCount; i++) {
      const x = -4.9 + (i * 9.8) / (nSideCount - 1)
      const zRoot = 3.6
      list.push(
        <group key={`pin-n-${i}`}>
          <mesh position={[x, -0.16, zRoot + 0.22]}>
            <boxGeometry args={[0.22, 0.05, 0.44]} />
            <meshStandardMaterial color={pinColor} metalness={metalness} roughness={roughness} />
          </mesh>
          <mesh position={[x, -0.28, zRoot + 0.52]} rotation={[0.65, 0, 0]}>
            <boxGeometry args={[0.22, 0.05, 0.28]} />
            <meshStandardMaterial color={pinColor} metalness={metalness} roughness={roughness} />
          </mesh>
          <mesh position={[x, -0.38, zRoot + 0.72]}>
            <boxGeometry args={[0.22, 0.04, 0.32]} />
            <meshStandardMaterial color={pinColor} metalness={metalness} roughness={roughness} />
          </mesh>
        </group>
      )
    }

    // South side pins (14 pins along bottom edge)
    for (let i = 0; i < nSideCount; i++) {
      const x = -4.9 + (i * 9.8) / (nSideCount - 1)
      const zRoot = -3.6
      list.push(
        <group key={`pin-s-${i}`}>
          <mesh position={[x, -0.16, zRoot - 0.22]}>
            <boxGeometry args={[0.22, 0.05, 0.44]} />
            <meshStandardMaterial color={pinColor} metalness={metalness} roughness={roughness} />
          </mesh>
          <mesh position={[x, -0.28, zRoot - 0.52]} rotation={[-0.65, 0, 0]}>
            <boxGeometry args={[0.22, 0.05, 0.28]} />
            <meshStandardMaterial color={pinColor} metalness={metalness} roughness={roughness} />
          </mesh>
          <mesh position={[x, -0.38, zRoot - 0.72]}>
            <boxGeometry args={[0.22, 0.04, 0.32]} />
            <meshStandardMaterial color={pinColor} metalness={metalness} roughness={roughness} />
          </mesh>
        </group>
      )
    }

    // East side pins (10 pins along right edge)
    const eSideCount = 10
    for (let i = 0; i < eSideCount; i++) {
      const z = -2.8 + (i * 5.6) / (eSideCount - 1)
      const xRoot = 5.4
      list.push(
        <group key={`pin-e-${i}`}>
          <mesh position={[xRoot + 0.22, -0.16, z]}>
            <boxGeometry args={[0.44, 0.05, 0.22]} />
            <meshStandardMaterial color={pinColor} metalness={metalness} roughness={roughness} />
          </mesh>
          <mesh position={[xRoot + 0.52, -0.28, z]} rotation={[0, 0, -0.65]}>
            <boxGeometry args={[0.28, 0.05, 0.22]} />
            <meshStandardMaterial color={pinColor} metalness={metalness} roughness={roughness} />
          </mesh>
          <mesh position={[xRoot + 0.72, -0.38, z]}>
            <boxGeometry args={[0.32, 0.04, 0.22]} />
            <meshStandardMaterial color={pinColor} metalness={metalness} roughness={roughness} />
          </mesh>
        </group>
      )
    }

    // West side pins (10 pins along left edge)
    for (let i = 0; i < eSideCount; i++) {
      const z = -2.8 + (i * 5.6) / (eSideCount - 1)
      const xRoot = -5.4
      list.push(
        <group key={`pin-w-${i}`}>
          <mesh position={[xRoot - 0.22, -0.16, z]}>
            <boxGeometry args={[0.44, 0.05, 0.22]} />
            <meshStandardMaterial color={pinColor} metalness={metalness} roughness={roughness} />
          </mesh>
          <mesh position={[xRoot - 0.52, -0.28, z]} rotation={[0, 0, 0.65]}>
            <boxGeometry args={[0.28, 0.05, 0.22]} />
            <meshStandardMaterial color={pinColor} metalness={metalness} roughness={roughness} />
          </mesh>
          <mesh position={[xRoot - 0.72, -0.38, z]}>
            <boxGeometry args={[0.32, 0.04, 0.22]} />
            <meshStandardMaterial color={pinColor} metalness={metalness} roughness={roughness} />
          </mesh>
        </group>
      )
    }

    return list
  }, [])

  return <group>{pinSegments}</group>
}

// ----------------------------------------------------------------------
// 2. Circular PCB Platform & Glowing Circuit Tracks
// ----------------------------------------------------------------------
function CircularCircuitPlatform() {
  const rings = useMemo(() => {
    return [
      { rIn: 7.2, rOut: 7.32, color: '#00F0FF', opacity: 0.8 },
      { rIn: 8.6, rOut: 8.75, color: '#0077FF', opacity: 0.6 },
      { rIn: 10.0, rOut: 10.15, color: '#00F0FF', opacity: 0.85 },
      { rIn: 11.2, rOut: 11.4, color: '#FF7A00', opacity: 0.75 }
    ]
  }, [])

  const radialLines = useMemo(() => {
    const lines: JSX.Element[] = []
    const count = 28
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count
      const r1 = 6.6
      const r2 = 11.6
      const x1 = Math.cos(angle) * r1
      const z1 = Math.sin(angle) * r1
      const x2 = Math.cos(angle) * r2
      const z2 = Math.sin(angle) * r2
      const isOrange = i % 4 === 0
      lines.push(
        <Line
          key={i}
          points={[new THREE.Vector3(x1, -0.41, z1), new THREE.Vector3(x2, -0.41, z2)]}
          color={isOrange ? '#FF7A00' : '#00F0FF'}
          lineWidth={isOrange ? 1.6 : 0.8}
          transparent
          opacity={isOrange ? 0.6 : 0.25}
        />
      )
    }
    return lines
  }, [])

  return (
    <group position={[0, -0.05, 0]}>
      {/* Dark Obsidian Circular Pedestal */}
      <mesh position={[0, -0.45, 0]} receiveShadow>
        <cylinderGeometry args={[12.2, 12.6, 0.22, 64]} />
        <meshStandardMaterial color="#040813" metalness={0.92} roughness={0.25} />
      </mesh>

      {/* Outer Metallic Bevel Ring */}
      <mesh position={[0, -0.34, 0]}>
        <ringGeometry args={[12.1, 12.5, 64]} />
        <meshStandardMaterial
          color="#00F0FF"
          emissive="#00F0FF"
          emissiveIntensity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Concentric Glowing Circuit Tracks */}
      {rings.map((rng, idx) => (
        <mesh key={idx} position={[0, -0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[rng.rIn, rng.rOut, 64]} />
          <meshStandardMaterial
            color={rng.color}
            emissive={rng.color}
            emissiveIntensity={0.8}
            side={THREE.DoubleSide}
            transparent
            opacity={rng.opacity}
          />
        </mesh>
      ))}

      {radialLines}
      <pointLight position={[0, -0.2, 0]} intensity={1.5} color="#0077FF" distance={14} />
    </group>
  )
}

// ----------------------------------------------------------------------
// 3. Inter-Layer Conductive Vias
// ----------------------------------------------------------------------
function InterLayerVias({
  yBottom,
  yTop,
  color = '#B87333'
}: {
  yBottom: number
  yTop: number
  color?: string
}) {
  const height = Math.max(0.01, yTop - yBottom)
  const yMid = yBottom + height / 2

  const viaCoords = [
    [-3.2, -1.5], [-1.6, -1.5], [0, -1.5], [1.6, -1.5], [3.2, -1.5],
    [-3.2, 1.5], [-1.6, 1.5], [0, 1.5], [1.6, 1.5], [3.2, 1.5],
    [-2.4, 0], [-0.8, 0], [0.8, 0], [2.4, 0]
  ]

  return (
    <group>
      {viaCoords.map(([vx, vz], idx) => (
        <group key={idx} position={[vx, yMid, vz]}>
          <mesh>
            <cylinderGeometry args={[0.035, 0.035, height, 10]} />
            <meshStandardMaterial
              color={color}
              metalness={0.96}
              roughness={0.15}
              emissive={color}
              emissiveIntensity={0.35}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ----------------------------------------------------------------------
// 4. Detailed 4-Bit CSKA Block in 3D (FA, AND4, 2:1 MUX)
// ----------------------------------------------------------------------
function DetailedCSKABlock({
  id,
  position,
  isSelected,
  onSelect,
  isSkipActive,
  blockData,
  simulating,
  onSelectCell,
  selectedCellId
}: {
  id: number
  position: [number, number, number]
  isSelected: boolean
  onSelect: () => void
  isSkipActive: boolean
  blockData?: any
  simulating: boolean
  onSelectCell?: (cell: any) => void
  selectedCellId?: string
}) {
  const pulseRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Animated carry photon pulse
  useFrame((state) => {
    if (pulseRef.current && (simulating || isSkipActive)) {
      const t = (state.clock.getElapsedTime() * 3.5 + id * 1.1) % 2.5
      if (isSkipActive) {
        // Fast bypass photon along the orange MUX skip track
        pulseRef.current.position.set(0.55, 0.24, -1.5 + t * 1.2)
      } else {
        // Ripple carry photon stepping through the 4 full adders
        pulseRef.current.position.set(-0.35, 0.22, -1.6 + t * 1.1)
      }
    }
  })

  const blockBorderColor = isSkipActive ? '#FF7A00' : isSelected ? '#00F0FF' : '#1E293B'

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Block Well Floor */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[1.9, 0.06, 4.6]} />
        <meshStandardMaterial
          color={isSelected ? '#122544' : hovered ? '#0D1A30' : '#080F1E'}
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      {/* Block Outer Boundary Ring */}
      <lineSegments position={[0, 0.065, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.92, 0.02, 4.62)]} />
        <lineBasicMaterial color={blockBorderColor} linewidth={isSelected ? 2 : 1} />
      </lineSegments>

      {/* Block Name Label */}
      <Text
        position={[0, 0.09, -2.15]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.16}
        color={isSelected ? '#00F0FF' : '#94A3B8'}
        anchorX="center"
        anchorY="middle"
      >
        {`BLOCK ${id} (Bits ${id * 4 + 3}:${id * 4})`}
      </Text>

      {/* 4 Cascaded Full-Adder Standard Cells */}
      {[-1.4, -0.45, 0.5, 1.45].map((fz, fIdx) => {
        const bitIdx = id * 4 + fIdx
        const cellId = `block${id}/fa_${fIdx}`
        const isCellSelected = selectedCellId === cellId
        return (
          <group
            key={fIdx}
            position={[-0.38, 0.1, fz]}
            onClick={(e) => {
              e.stopPropagation()
              if (onSelectCell) {
                onSelectCell({
                  id: cellId,
                  macro: 'sky130_fd_sc_hs__fa_1',
                  name: `Full Adder (Bit ${bitIdx})`,
                  func: `1-Bit Full Adder Stage: S = A ^ B ^ Cin, Cout = G | (P & Cin)`,
                  blockId: id,
                  bitIdx,
                  x: 7000 + id * 10000 + fIdx * 2500,
                  y: 10000,
                  w: 8640,
                  h: 3330
                })
              }
            }}
          >
            <mesh>
              <boxGeometry args={[0.82, 0.1, 0.7]} />
              <meshStandardMaterial
                color={isCellSelected ? '#34D399' : '#059669'}
                emissive="#10B981"
                emissiveIntensity={isCellSelected ? 1.0 : 0.45}
                metalness={0.88}
                roughness={0.18}
              />
            </mesh>
            <lineSegments position={[0, 0.052, 0]}>
              <edgesGeometry args={[new THREE.BoxGeometry(0.84, 0.02, 0.72)]} />
              <lineBasicMaterial color={isCellSelected ? '#00F0FF' : '#34D399'} />
            </lineSegments>
            <Text
              position={[0, 0.065, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.14}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              FA
            </Text>
          </group>
        )
      })}

      {/* AND4 Group Propagate Gate */}
      <group
        position={[0.55, 0.1, -0.6]}
        onClick={(e) => {
          e.stopPropagation()
          if (onSelectCell) {
            onSelectCell({
              id: `block${id}/and4`,
              macro: 'sky130_fd_sc_hs__and4_2',
              name: `Group Propagate AND4 (Block ${id})`,
              func: `4-Input AND: P_group = P3 & P2 & P1 & P0`,
              blockId: id,
              x: 15000 + id * 10000,
              y: 20000,
              w: 3840,
              h: 3330
            })
          }
        }}
      >
        <mesh>
          <boxGeometry args={[0.5, 0.1, 0.85]} />
          <meshStandardMaterial
            color="#D97706"
            emissive="#F59E0B"
            emissiveIntensity={blockData?.p_group ? 1.0 : 0.3}
            metalness={0.9}
            roughness={0.18}
          />
        </mesh>
        <Text
          position={[0, 0.065, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.11}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          AND4
        </Text>
      </group>

      {/* 2:1 Multiplexer Bypass Gate */}
      <group
        position={[0.55, 0.1, 0.85]}
        onClick={(e) => {
          e.stopPropagation()
          if (onSelectCell) {
            onSelectCell({
              id: `block${id}/mux2`,
              macro: 'sky130_fd_sc_hs__mux2_1',
              name: `Carry Skip 2:1 MUX (Block ${id})`,
              func: `Bypass MUX: Cout = P_group ? Cin_block : Cripple_block`,
              blockId: id,
              x: 20000 + id * 10000,
              y: 20000,
              w: 4320,
              h: 3330
            })
          }
        }}
      >
        <mesh>
          <boxGeometry args={[0.54, 0.11, 0.95]} />
          <meshStandardMaterial
            color={isSkipActive ? '#EA580C' : '#475569'}
            emissive={isSkipActive ? '#FF7A00' : '#1E293B'}
            emissiveIntensity={isSkipActive ? 1.2 : 0.25}
            metalness={0.92}
            roughness={0.15}
          />
        </mesh>
        <Text
          position={[0, 0.07, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.12}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          MUX2
        </Text>
      </group>

      {/* Dynamic Carry Signal Photon Pulse */}
      {(simulating || isSkipActive) && (
        <mesh ref={pulseRef} position={[0, 0.24, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshBasicMaterial color={isSkipActive ? '#FF7A00' : '#00F0FF'} />
        </mesh>
      )}
    </group>
  )
}

// ----------------------------------------------------------------------
// 5. 9-Layer Exploded Semiconductor Stack
// ----------------------------------------------------------------------
function AdvancedSemiconductorStack({
  explosionDistance,
  visibility,
  activeBlock,
  onSelectBlock,
  telemetry,
  simulating,
  onSelectCell,
  selectedCellId
}: {
  explosionDistance: number
  visibility: LayerVisibility
  activeBlock: number | null
  onSelectBlock: (id: number) => void
  telemetry: any
  simulating: boolean
  onSelectCell?: (cell: any) => void
  selectedCellId?: string
}) {
  const s = explosionDistance / 100

  // Heights for 9 distinct layers matching the reference render
  const ySubstrate = 0.08
  const yWells = ySubstrate + 0.14 + s * 0.95
  const yTransistors = yWells + 0.14 + s * 1.05
  const yStdCells = yTransistors + 0.16 + s * 1.15
  const yM1 = yStdCells + 0.16 + s * 1.25
  const yM2 = yM1 + 0.16 + s * 1.35
  const yM3 = yM2 + 0.16 + s * 1.45
  const yM4 = yM3 + 0.16 + s * 1.55
  const yM5 = yM4 + 0.16 + s * 1.65
  const yLid = yM5 + 0.22 + s * 1.8

  return (
    <group position={[0, 0, 0]}>
      {/* 1. SILICON SUBSTRATE (BULK Si) */}
      {visibility.substrate && (
        <group position={[0, ySubstrate, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[9.8, 0.18, 6.2]} />
            <meshStandardMaterial color="#0B132B" metalness={0.94} roughness={0.18} />
          </mesh>
          <mesh position={[0, 0.092, 0]}>
            <boxGeometry args={[9.4, 0.005, 5.8]} />
            <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={0.2} />
          </mesh>
        </group>
      )}

      {s > 0.15 && visibility.substrate && visibility.wells && (
        <InterLayerVias yBottom={ySubstrate + 0.09} yTop={yWells - 0.06} color="#475569" />
      )}

      {/* 2. WELL & ISOLATION (N-WELL / P-WELL / STI) */}
      {visibility.wells && (
        <group position={[0, yWells, 0]}>
          <mesh>
            <boxGeometry args={[9.4, 0.1, 5.8]} />
            <meshStandardMaterial
              color="#0F2838"
              metalness={0.7}
              roughness={0.35}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* N-Well Stripe */}
          <mesh position={[0, 0.052, 1.2]}>
            <boxGeometry args={[9.2, 0.01, 1.8]} />
            <meshStandardMaterial color="#00F0FF" transparent opacity={0.3} />
          </mesh>
          {/* P-Well Stripe */}
          <mesh position={[0, 0.052, -1.2]}>
            <boxGeometry args={[9.2, 0.01, 1.8]} />
            <meshStandardMaterial color="#FF7A00" transparent opacity={0.3} />
          </mesh>
        </group>
      )}

      {s > 0.15 && visibility.wells && visibility.transistors && (
        <InterLayerVias yBottom={yWells + 0.05} yTop={yTransistors - 0.06} color="#64748B" />
      )}

      {/* 3. TRANSISTORS (NMOS / PMOS DIFFUSION & FIN STRUCTURES) */}
      {visibility.transistors && (
        <group position={[0, yTransistors, 0]}>
          <mesh>
            <boxGeometry args={[9.2, 0.08, 5.6]} />
            <meshStandardMaterial color="#060C18" metalness={0.88} roughness={0.25} />
          </mesh>

          {/* PMOS Transistor Arrays (Ruby Red) */}
          {[-3.6, -2.4, -1.2, 0, 1.2, 2.4, 3.6].map((tx, idx) => (
            <mesh key={`pmos-${idx}`} position={[tx, 0.05, 1.3]}>
              <boxGeometry args={[0.4, 0.06, 0.9]} />
              <meshStandardMaterial
                color="#DC2626"
                emissive="#EF4444"
                emissiveIntensity={0.6}
                metalness={0.92}
                roughness={0.15}
              />
            </mesh>
          ))}

          {/* NMOS Transistor Arrays (Cobalt Blue) */}
          {[-3.6, -2.4, -1.2, 0, 1.2, 2.4, 3.6].map((tx, idx) => (
            <mesh key={`nmos-${idx}`} position={[tx, 0.05, -1.3]}>
              <boxGeometry args={[0.4, 0.06, 0.9]} />
              <meshStandardMaterial
                color="#1D4ED8"
                emissive="#3B82F6"
                emissiveIntensity={0.6}
                metalness={0.92}
                roughness={0.15}
              />
            </mesh>
          ))}
        </group>
      )}

      {s > 0.15 && visibility.transistors && visibility.stdcells && (
        <InterLayerVias yBottom={yTransistors + 0.04} yTop={yStdCells - 0.06} color="#10B981" />
      )}

      {/* 4. STANDARD CELLS (FA, XOR, AND, MUX - 4 CSKA BLOCKS) */}
      {visibility.stdcells && (
        <group position={[0, yStdCells, 0]}>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[9.0, 0.08, 5.4]} />
            <meshStandardMaterial color="#070E1C" metalness={0.94} roughness={0.15} />
          </mesh>

          {/* 4 CSKA 4-Bit Blocks */}
          <DetailedCSKABlock
            id={0}
            position={[-2.95, 0.06, 0]}
            isSelected={activeBlock === 0}
            onSelect={() => onSelectBlock(0)}
            isSkipActive={Boolean(telemetry?.blocks?.[0]?.skip_active)}
            blockData={telemetry?.blocks?.[0]}
            simulating={simulating}
            onSelectCell={onSelectCell}
            selectedCellId={selectedCellId}
          />
          <DetailedCSKABlock
            id={1}
            position={[-1.0, 0.06, 0]}
            isSelected={activeBlock === 1}
            onSelect={() => onSelectBlock(1)}
            isSkipActive={Boolean(telemetry?.blocks?.[1]?.skip_active)}
            blockData={telemetry?.blocks?.[1]}
            simulating={simulating}
            onSelectCell={onSelectCell}
            selectedCellId={selectedCellId}
          />
          <DetailedCSKABlock
            id={2}
            position={[1.0, 0.06, 0]}
            isSelected={activeBlock === 2}
            onSelect={() => onSelectBlock(2)}
            isSkipActive={Boolean(telemetry?.blocks?.[2]?.skip_active)}
            blockData={telemetry?.blocks?.[2]}
            simulating={simulating}
            onSelectCell={onSelectCell}
            selectedCellId={selectedCellId}
          />
          <DetailedCSKABlock
            id={3}
            position={[2.95, 0.06, 0]}
            isSelected={activeBlock === 3}
            onSelect={() => onSelectBlock(3)}
            isSkipActive={Boolean(telemetry?.blocks?.[3]?.skip_active)}
            blockData={telemetry?.blocks?.[3]}
            simulating={simulating}
            onSelectCell={onSelectCell}
            selectedCellId={selectedCellId}
          />
        </group>
      )}

      {s > 0.15 && visibility.stdcells && visibility.m1 && (
        <InterLayerVias yBottom={yStdCells + 0.08} yTop={yM1 - 0.04} color="#D946EF" />
      )}

      {/* 5. METAL 1 (CONTACT & LOCAL ROUTING) */}
      {visibility.m1 && (
        <group position={[0, yM1, 0]}>
          <mesh>
            <boxGeometry args={[8.8, 0.06, 5.2]} />
            <meshStandardMaterial color="#120A20" metalness={0.92} roughness={0.2} transparent opacity={0.7} />
          </mesh>
          {/* Dense Purple Metal 1 Followpin Rails */}
          {[-2.2, -1.4, -0.6, 0.2, 1.0, 1.8].map((mz, idx) => (
            <mesh key={`m1-${idx}`} position={[0, 0.035, mz]}>
              <boxGeometry args={[8.4, 0.015, 0.1]} />
              <meshStandardMaterial
                color="#C026D3"
                emissive="#D946EF"
                emissiveIntensity={0.65}
                metalness={0.96}
                roughness={0.12}
              />
            </mesh>
          ))}
        </group>
      )}

      {s > 0.15 && visibility.m1 && visibility.m2 && (
        <InterLayerVias yBottom={yM1 + 0.04} yTop={yM2 - 0.04} color="#10B981" />
      )}

      {/* 6. METAL 2 (CELL ROUTING) */}
      {visibility.m2 && (
        <group position={[0, yM2, 0]}>
          <mesh>
            <boxGeometry args={[8.8, 0.06, 5.2]} />
            <meshStandardMaterial color="#0A1E18" metalness={0.92} roughness={0.2} transparent opacity={0.7} />
          </mesh>
          {/* Emerald Green Vertical Cell Routing */}
          {[-3.6, -2.7, -1.8, -0.9, 0, 0.9, 1.8, 2.7, 3.6].map((mx, idx) => (
            <mesh key={`m2-${idx}`} position={[mx, 0.035, 0]}>
              <boxGeometry args={[0.1, 0.015, 4.8]} />
              <meshStandardMaterial
                color="#059669"
                emissive="#10B981"
                emissiveIntensity={0.65}
                metalness={0.96}
                roughness={0.12}
              />
            </mesh>
          ))}
        </group>
      )}

      {s > 0.15 && visibility.m2 && visibility.m3 && (
        <InterLayerVias yBottom={yM2 + 0.04} yTop={yM3 - 0.04} color="#00F0FF" />
      )}

      {/* 7. METAL 3 (LOCAL INTERCONNECT & CARRY SKIP HIGHWAY) */}
      {visibility.m3 && (
        <group position={[0, yM3, 0]}>
          <mesh>
            <boxGeometry args={[8.8, 0.06, 5.2]} />
            <meshStandardMaterial color="#0A182F" metalness={0.92} roughness={0.2} transparent opacity={0.75} />
          </mesh>
          {/* Cyan Horizontal Interconnect Traces */}
          {[-1.8, -0.9, 0, 0.9, 1.8].map((mz, idx) => (
            <mesh key={`m3-${idx}`} position={[0, 0.035, mz]}>
              <boxGeometry args={[8.2, 0.018, 0.14]} />
              <meshStandardMaterial
                color="#0284C7"
                emissive="#00F0FF"
                emissiveIntensity={0.75}
                metalness={0.96}
                roughness={0.1}
              />
            </mesh>
          ))}
        </group>
      )}

      {s > 0.15 && visibility.m3 && visibility.m4 && (
        <InterLayerVias yBottom={yM3 + 0.04} yTop={yM4 - 0.04} color="#F59E0B" />
      )}

      {/* 8. METAL 4 (INTERCONNECT & POWER STRAPS) */}
      {visibility.m4 && (
        <group position={[0, yM4, 0]}>
          <mesh>
            <boxGeometry args={[8.8, 0.06, 5.2]} />
            <meshStandardMaterial color="#20150A" metalness={0.92} roughness={0.2} transparent opacity={0.75} />
          </mesh>
          {/* Amber / Orange Vertical Power Straps */}
          {[-3.0, -1.0, 1.0, 3.0].map((mx, idx) => (
            <mesh key={`m4-${idx}`} position={[mx, 0.04, 0]}>
              <boxGeometry args={[0.3, 0.02, 4.8]} />
              <meshStandardMaterial
                color="#D97706"
                emissive="#F59E0B"
                emissiveIntensity={0.75}
                metalness={0.96}
                roughness={0.12}
              />
            </mesh>
          ))}
        </group>
      )}

      {s > 0.15 && visibility.m4 && visibility.m5 && (
        <InterLayerVias yBottom={yM4 + 0.04} yTop={yM5 - 0.04} color="#FFD700" />
      )}

      {/* 9. METAL 5 (GLOBAL ROUTING & TOP POWER GRID) */}
      {visibility.m5 && (
        <group position={[0, yM5, 0]}>
          <mesh>
            <boxGeometry args={[8.8, 0.06, 5.2]} />
            <meshStandardMaterial color="#201B0A" metalness={0.92} roughness={0.2} transparent opacity={0.75} />
          </mesh>
          {/* Polished Gold Top Grid */}
          {[-1.2, 1.2].map((mz, idx) => (
            <mesh key={`m5-${idx}`} position={[0, 0.045, mz]}>
              <boxGeometry args={[8.4, 0.025, 0.4]} />
              <meshStandardMaterial
                color="#FFD700"
                emissive="#B45309"
                emissiveIntensity={0.5}
                metalness={0.98}
                roughness={0.1}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* 10. CHIP PACKAGE (QFN / DIE HEAT SPREADER LID) */}
      {visibility.lid && (
        <group position={[0, yLid, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[9.8, 0.28, 6.2]} />
            <meshStandardMaterial color="#0B132B" metalness={0.94} roughness={0.2} />
          </mesh>

          {/* Polished Gold Chamfered Rim */}
          <mesh position={[0, 0.145, 0]}>
            <boxGeometry args={[9.5, 0.02, 5.9]} />
            <meshStandardMaterial color="#FFD700" metalness={0.98} roughness={0.12} />
          </mesh>

          {/* Laser-Engraved Identification Markings */}
          <Text
            position={[0, 0.16, -0.8]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.46}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            CSKA-16
          </Text>

          <Text
            position={[0, 0.16, 0.0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.28}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            Carry Skip Adder
          </Text>

          <Text
            position={[0, 0.16, 0.8]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.19}
            color="#00F0FF"
            anchorX="center"
            anchorY="middle"
          >
            SkyWater 130nm CMOS | 4 × 4-Bit Blocks
          </Text>
        </group>
      )}
    </group>
  )
}

// ----------------------------------------------------------------------
// 6. 3D Scene Leader Lines & Callout Badges (Left Side, Poster Match)
// ----------------------------------------------------------------------
function LayerCalloutLeaders({ explosionDistance }: { explosionDistance: number }) {
  const s = explosionDistance / 100

  const ySubstrate = 0.08
  const yWells = ySubstrate + 0.14 + s * 0.95
  const yTransistors = yWells + 0.14 + s * 1.05
  const yStdCells = yTransistors + 0.16 + s * 1.15
  const yM1 = yStdCells + 0.16 + s * 1.25
  const yM2 = yM1 + 0.16 + s * 1.35
  const yM3 = yM2 + 0.16 + s * 1.45
  const yM4 = yM3 + 0.16 + s * 1.55
  const yM5 = yM4 + 0.16 + s * 1.65
  const yLid = yM5 + 0.22 + s * 1.8

  const layers = [
    { label: 'Chip Package (QFN/DIE)', y: yLid, color: '#FFD700' },
    { label: 'Metal 5 (Global Routing)', y: yM5, color: '#FFD700' },
    { label: 'Metal 4 (Interconnect)', y: yM4, color: '#F59E0B' },
    { label: 'Metal 3 (Local Routing)', y: yM3, color: '#00F0FF' },
    { label: 'Metal 2 (Cell Routing)', y: yM2, color: '#10B981' },
    { label: 'Metal 1 (Contact & Local)', y: yM1, color: '#D946EF' },
    { label: 'Standard Cells (FA, XOR, AND, MUX)', y: yStdCells, color: '#34D399' },
    { label: 'Transistors (NMOS / PMOS)', y: yTransistors, color: '#EF4444' },
    { label: 'Well & Isolation (N-well / P-well / STI)', y: yWells, color: '#38BDF8' },
    { label: 'Silicon Substrate (Bulk Si)', y: ySubstrate, color: '#94A3B8' }
  ]

  return (
    <group position={[-4.7, 0, 0]}>
      {layers.map((ly, idx) => {
        const xAnchor = -0.2
        const xStem = -3.2
        return (
          <group key={idx}>
            <Line
              points={[new THREE.Vector3(xAnchor, ly.y, 0), new THREE.Vector3(xStem, ly.y, 0)]}
              color={ly.color}
              lineWidth={1.4}
              transparent
              opacity={0.8}
            />
            <mesh position={[xAnchor, ly.y, 0]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshBasicMaterial color={ly.color} />
            </mesh>
            <Billboard position={[xStem - 0.2, ly.y, 0]}>
              <Text fontSize={0.21} color={ly.color} anchorX="right" anchorY="middle" fontWeight="bold">
                {ly.label}
              </Text>
            </Billboard>
          </group>
        )
      })}
    </group>
  )
}

// ----------------------------------------------------------------------
// 7. Smooth Camera Controller with 8 Preset Views
// ----------------------------------------------------------------------
function CameraRig({
  viewPreset,
  controlsRef
}: {
  viewPreset: 'iso' | 'top' | 'side' | '3d' | 'arch' | 'transistor' | 'metal' | 'block'
  controlsRef: React.RefObject<any>
}) {
  const { camera, gl } = useThree()
  const targetPos = useRef(new THREE.Vector3(12.5, 10.5, 12.5))
  const targetLook = useRef(new THREE.Vector3(0, 1.2, 0))
  const isTransitioning = useRef<boolean>(false)
  const prevPreset = useRef<string>(viewPreset)

  useEffect(() => {
    if (viewPreset === prevPreset.current) return
    prevPreset.current = viewPreset

    if (viewPreset === 'iso' || viewPreset === '3d') {
      targetPos.current.set(12.5, 10.5, 12.5)
      targetLook.current.set(0, 1.2, 0)
    } else if (viewPreset === 'top') {
      targetPos.current.set(0.01, 16.5, 0)
      targetLook.current.set(0, 0, 0)
    } else if (viewPreset === 'side') {
      targetPos.current.set(15.5, 2.8, 0)
      targetLook.current.set(0, 1.2, 0)
    } else if (viewPreset === 'arch') {
      targetPos.current.set(0.01, 8.5, 8.5)
      targetLook.current.set(0, 1.0, 0)
    } else if (viewPreset === 'transistor') {
      targetPos.current.set(4.5, 3.2, 4.5)
      targetLook.current.set(0, 0.8, 0)
    } else if (viewPreset === 'metal') {
      targetPos.current.set(6.0, 7.5, 6.0)
      targetLook.current.set(0, 2.2, 0)
    } else if (viewPreset === 'block') {
      targetPos.current.set(-2.8, 4.2, 4.2)
      targetLook.current.set(-2.8, 1.0, 0)
    }
    isTransitioning.current = true
  }, [viewPreset])

  useEffect(() => {
    const dom = gl.domElement
    const stopTransition = () => {
      isTransitioning.current = false
    }
    dom.addEventListener('pointerdown', stopTransition)
    dom.addEventListener('wheel', stopTransition, { passive: true })
    return () => {
      dom.removeEventListener('pointerdown', stopTransition)
      dom.removeEventListener('wheel', stopTransition)
    }
  }, [gl])

  useFrame(() => {
    if (controlsRef.current && isTransitioning.current) {
      camera.position.lerp(targetPos.current, 0.08)
      controlsRef.current.target.lerp(targetLook.current, 0.08)
      controlsRef.current.update()
      if (camera.position.distanceTo(targetPos.current) < 0.05) {
        isTransitioning.current = false
      }
    }
  })

  return null
}

// ----------------------------------------------------------------------
// 8. Main Upgraded Chip3D Studio Component
// ----------------------------------------------------------------------
export default function Chip3D(props: Readonly<Chip3DProps>) {
  const [studioMode, setStudioMode] = useState<'REALISTIC' | 'ENGINEERING'>('REALISTIC')
  const [explosionDistance, setExplosionDistance] = useState<number>(props.exploded ? 65 : 50)
  const [isExploding, setIsExploding] = useState<boolean>(false)
  const [viewPreset, setViewPreset] = useState<
    'iso' | 'top' | 'side' | '3d' | 'arch' | 'transistor' | 'metal' | 'block'
  >('iso')
  const [showLayerDrawer, setShowLayerDrawer] = useState<boolean>(false)
  const [showLabels, setShowLabels] = useState<boolean>(true)
  const [showOverheadMini, setShowOverheadMini] = useState<boolean>(true)
  const [explanationLevel, setExplanationLevel] = useState<'BEGINNER' | 'ENGINEERING'>('BEGINNER')
  const [selectedCell, setSelectedCell] = useState<any>(null)
  const [searchFilter, setSearchFilter] = useState<string>('')
  const controlsRef = useRef<any>(null)

  // 10 Layer Visibility Toggles
  const [visibility, setVisibility] = useState<LayerVisibility>({
    lid: true,
    m5: true,
    m4: true,
    m3: true,
    m2: true,
    m1: true,
    stdcells: true,
    transistors: true,
    wells: true,
    substrate: true
  })

  const toggleLayer = (key: keyof LayerVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Smooth explosion animator
  useEffect(() => {
    let animId: number
    if (isExploding) {
      const step = () => {
        setExplosionDistance((prev) => {
          if (prev >= 90) {
            setIsExploding(false)
            return 90
          }
          return prev + 1.5
        })
        animId = requestAnimationFrame(step)
      }
      animId = requestAnimationFrame(step)
    }
    return () => cancelAnimationFrame(animId)
  }, [isExploding])

  return (
    <div className="w-full rounded-2xl overflow-hidden glass-panel relative flex flex-col border border-[#00F0FF]/30 shadow-2xl font-mono text-xs select-none">
      {/* Top Header Banner & Studio Controls */}
      <div className="px-4 py-2.5 border-b border-[#1E293B] bg-[#070D1A]/95 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF]">
            <Layers className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-sm glow-cyan tracking-wide">
                CYBERCORE 3D SILICON STUDIO
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/40">
                SKYWATER 130NM
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              16-Bit Carry Skip Adder • 9 Semiconductor Layers • 4 × 4-Bit Functional Blocks
            </p>
          </div>
        </div>

        {/* Master Studio Mode Selector */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-[#040812] rounded-xl p-1 border border-[#1E293B]">
            <button
              onClick={() => setStudioMode('REALISTIC')}
              className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition ${
                studioMode === 'REALISTIC'
                  ? 'bg-gradient-to-r from-[#00F0FF] to-[#0088FF] text-black shadow-md shadow-[#00F0FF]/30'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>REALISTIC 3D</span>
            </button>
            <button
              onClick={() => setStudioMode('ENGINEERING')}
              className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition ${
                studioMode === 'ENGINEERING'
                  ? 'bg-gradient-to-r from-[#FF7A00] to-[#EA580C] text-black shadow-md shadow-[#FF7A00]/30'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>ENGINEERING INSPECTION</span>
            </button>
          </div>

          {/* Educational Level Pill */}
          <button
            onClick={() =>
              setExplanationLevel((prev) => (prev === 'BEGINNER' ? 'ENGINEERING' : 'BEGINNER'))
            }
            className="px-2.5 py-1 rounded-xl bg-[#0A1224] border border-[#1E293B] text-[#94A3B8] hover:text-white flex items-center space-x-1 text-[11px]"
            title="Toggle Beginner / Engineering explanation level"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>{explanationLevel === 'BEGINNER' ? 'SIMPLE' : 'EXPERT'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div id="cybercore-3d-canvas" className="w-full h-[620px] relative bg-[#02050E] overflow-hidden">
        <Canvas
          shadows
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
          camera={{ position: [12.5, 10.5, 12.5], fov: 38 }}
        >
          <CameraRig viewPreset={viewPreset} controlsRef={controlsRef} />

          {/* Cinematic Studio Lighting */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[14, 20, 14]} intensity={2.5} castShadow />
          <directionalLight position={[-14, 15, -12]} intensity={1.8} color="#00F0FF" />
          <pointLight position={[0, 8, 0]} intensity={1.5} color="#FFFFFF" />
          <pointLight position={[-10, -2, 8]} intensity={1.5} color="#FF7A00" />
          <pointLight position={[10, -2, -8]} intensity={1.2} color="#10B981" />

          {/* Circular PCB Pedestal */}
          <CircularCircuitPlatform />

          {/* Packaged Chip Substrate Base (Floor) */}
          <mesh position={[0, -0.24, 0]}>
            <boxGeometry args={[11.2, 0.44, 7.4]} />
            <meshStandardMaterial color="#0A101D" metalness={0.92} roughness={0.22} />
          </mesh>

          {/* Polished Gold Die Cavity Rim */}
          <mesh position={[0, 0.0, 0]}>
            <boxGeometry args={[10.0, 0.04, 6.4]} />
            <meshStandardMaterial color="#FFD700" metalness={0.98} roughness={0.12} />
          </mesh>

          {/* Gull-Wing Perimeter Package Leads */}
          <RealisticGullWingPins />

          {/* 9-Layer Semiconductor Stack */}
          <AdvancedSemiconductorStack
            explosionDistance={explosionDistance}
            visibility={visibility}
            activeBlock={props.activeBlock}
            onSelectBlock={props.onSelectBlock}
            telemetry={props.telemetry}
            simulating={props.simulating}
            onSelectCell={(cell) => setSelectedCell(cell)}
            selectedCellId={selectedCell?.id}
          />

          {/* 3D Callout Leader Lines (Poster Match) */}
          {showLabels && <LayerCalloutLeaders explosionDistance={explosionDistance} />}

          {/* Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping
            dampingFactor={0.06}
            minDistance={4}
            maxDistance={32}
            maxPolarAngle={Math.PI / 2 + 0.12}
          />
        </Canvas>

        {/* Top-Right Overlays Matching the Poster Image */}
        <div className="absolute top-3 right-3 space-y-2 pointer-events-none max-w-xs z-10 hidden sm:block">
          {/* 1. Design Summary Card */}
          <div className="glass-panel p-3 rounded-xl border border-[#00F0FF]/30 bg-[#070D1A]/90 shadow-xl space-y-1 text-[10px]">
            <div className="flex items-center justify-between pb-1 border-b border-[#1E293B] text-[#00F0FF] font-bold">
              <span>DESIGN SUMMARY</span>
              <span>SKY130 CMOS</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[#94A3B8] pt-1">
              <div>Technology:</div><div className="text-white font-bold">SkyWater 130nm</div>
              <div>Architecture:</div><div className="text-white font-bold">16-Bit CSKA</div>
              <div>Blocks:</div><div className="text-white font-bold">4 × 4-Bit</div>
              <div>Cells:</div><div className="text-[#10B981] font-bold">56 cells (hier)</div>
              <div>Cell Area:</div><div className="text-white font-bold">760.73 µm²</div>
              <div>Die Size:</div><div className="text-[#00F0FF] font-bold">45.0 × 35.0 µm</div>
            </div>
          </div>

          {/* 2. CSKA 4-Block Carry Flow Card */}
          <div className="glass-panel p-3 rounded-xl border border-[#FF7A00]/30 bg-[#070D1A]/90 shadow-xl space-y-1.5 text-[10px]">
            <div className="flex items-center justify-between pb-1 border-b border-[#1E293B] text-[#FF7A00] font-bold">
              <span>CSKA ARCHITECTURE (4 × 4-BIT)</span>
              <span>P_group = &P[3:0]</span>
            </div>
            <div className="flex items-center justify-between space-x-1 pt-1">
              {[0, 1, 2, 3].map((b) => {
                const isSkip = props.telemetry?.blocks?.[b]?.skip_active
                const isSelected = props.activeBlock === b
                return (
                  <div
                    key={b}
                    className={`flex-1 p-1 rounded-lg border text-center transition ${
                      isSkip
                        ? 'bg-[#FF7A00]/20 border-[#FF7A00] text-[#FF7A00] font-bold'
                        : isSelected
                        ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF]'
                        : 'bg-[#0A1224] border-[#1E293B] text-[#94A3B8]'
                    }`}
                  >
                    <div className="text-[9px]">Block {b}</div>
                    <div className="text-[8px] font-bold">{isSkip ? 'SKIP' : 'RIPPLE'}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 3. Standard Cell Legend */}
          <div className="glass-panel p-2.5 rounded-xl border border-[#1E293B] bg-[#070D1A]/90 shadow-xl space-y-1 text-[9px]">
            <div className="text-[#64748B] font-bold pb-0.5">LEGEND (STANDARD CELLS)</div>
            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#10B981] inline-block" />
                <span className="text-white">FA: Full Adder</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#FF7A00] inline-block" />
                <span className="text-white">MUX: 2:1 Skip</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#F59E0B] inline-block" />
                <span className="text-white">AND4: Propagate</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#00F0FF] inline-block" />
                <span className="text-white">XOR: Bit Prop</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Cell Inspector Overlay (Engineering Mode) */}
        {selectedCell && (
          <div className="absolute bottom-16 left-4 w-80 glass-panel p-3.5 rounded-xl border border-[#00F0FF]/40 bg-[#070D1A]/95 shadow-2xl z-20 space-y-2 text-[11px]">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#1E293B]">
              <span className="font-bold text-[#00F0FF]">{selectedCell.name}</span>
              <button onClick={() => setSelectedCell(null)} className="text-[#64748B] hover:text-white">
                ✕
              </button>
            </div>
            <div className="text-white font-mono text-[10px]">{selectedCell.macro}</div>
            <div className="p-2 rounded bg-[#0A1224] text-[#94A3B8] text-[10px] border border-[#1E293B]">
              {explanationLevel === 'BEGINNER' ? (
                <span>
                  <strong>Simple Role:</strong>{' '}
                  {selectedCell.name.includes('Full Adder')
                    ? 'Adds 2 bits and a carry from the previous column, generating sum and carry.'
                    : selectedCell.name.includes('MUX')
                    ? 'The express bypass switch! If all bits propagate, it routes the incoming carry directly past the block.'
                    : 'The block detector! Checks if all 4 bits in this block are ready to pass the carry forward.'}
                </span>
              ) : (
                <span>
                  <strong>Engineering Spec:</strong> {selectedCell.func}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] text-[#64748B]">
              <div>Coords: <span className="text-white">{(selectedCell.x / 1000).toFixed(2)}, {(selectedCell.y / 1000).toFixed(2)} µm</span></div>
              <div>Block: <span className="text-[#FF7A00] font-bold">Block {selectedCell.blockId}</span></div>
            </div>
          </div>
        )}

        {/* Floating Layer Visibility Drawer */}
        {showLayerDrawer && (
          <div className="absolute top-4 left-4 w-72 glass-panel p-3.5 rounded-xl border border-[#00F0FF]/35 bg-[#070D1A]/95 shadow-2xl z-20 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#1E293B]">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-[#00F0FF]" />
                <span>SEMICONDUCTOR STACK</span>
              </span>
              <button onClick={() => setShowLayerDrawer(false)} className="text-[#64748B] hover:text-white">
                ✕
              </button>
            </div>
            <div className="space-y-1 text-[11px]">
              {[
                { key: 'lid', name: 'L1: Package Lid (QFN)', color: '#FFD700' },
                { key: 'm5', name: 'L2: Metal 5 (Global Routing)', color: '#FFD700' },
                { key: 'm4', name: 'L3: Metal 4 (Power Straps)', color: '#F59E0B' },
                { key: 'm3', name: 'L4: Metal 3 (Skip Highway)', color: '#00F0FF' },
                { key: 'm2', name: 'L5: Metal 2 (Cell Routing)', color: '#10B981' },
                { key: 'm1', name: 'L6: Metal 1 (Local Rails)', color: '#D946EF' },
                { key: 'stdcells', name: 'L7: Standard Cells (CSKA)', color: '#34D399' },
                { key: 'transistors', name: 'L8: Transistors (NMOS/PMOS)', color: '#EF4444' },
                { key: 'wells', name: 'L9: Wells & STI Isolation', color: '#38BDF8' },
                { key: 'substrate', name: 'L10: Silicon Bulk (p-type)', color: '#94A3B8' }
              ].map((layer) => {
                const isVisible = visibility[layer.key as keyof LayerVisibility]
                return (
                  <div
                    key={layer.key}
                    onClick={() => toggleLayer(layer.key as keyof LayerVisibility)}
                    className="flex items-center justify-between px-2 py-1 rounded-lg bg-[#070D1A] hover:bg-[#0E1A30] cursor-pointer border border-[#1E293B] transition"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: layer.color }} />
                      <span className={isVisible ? 'text-white' : 'text-[#64748B] line-through'}>
                        {layer.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#00F0FF]">{isVisible ? 'ON' : 'OFF'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Viewport Control Toolbar */}
      <div className="px-4 py-2.5 border-t border-[#1E293B] bg-[#070D1A]/95 flex flex-wrap items-center justify-between gap-3 z-10 text-[11px]">
        {/* Left: Explosion Distance Slider & Auto-Animate */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsExploding(!isExploding)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 border transition ${
              isExploding
                ? 'bg-[#FF7A00] text-black border-[#FF7A00]'
                : 'bg-[#0A1224] text-[#94A3B8] border-[#1E293B] hover:text-white'
            }`}
          >
            {isExploding ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isExploding ? 'PAUSE EXPLOSION' : 'ANIMATE EXPLOSION'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-[#94A3B8]">EXPLOSION:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={explosionDistance}
              onChange={(e) => setExplosionDistance(Number(e.target.value))}
              className="w-28 sm:w-36 accent-[#00F0FF] cursor-pointer"
            />
            <span className="text-white font-bold w-9 text-right">{explosionDistance}%</span>
          </div>
        </div>

        {/* Center: 8 Camera Preset Views */}
        <div className="flex items-center space-x-1">
          <span className="text-[#64748B] pr-1 hidden md:inline">VIEWS:</span>
          {[
            { id: 'iso', label: 'ISO' },
            { id: 'top', label: 'TOP' },
            { id: 'side', label: 'SIDE' },
            { id: 'arch', label: 'ARCH' },
            { id: 'transistor', label: 'TRANS' },
            { id: 'metal', label: 'METAL' },
            { id: 'block', label: 'BLOCK' }
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setViewPreset(v.id as any)}
              className={`px-2 py-1 rounded-lg transition font-bold text-[10px] ${
                viewPreset === v.id
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40'
                  : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-white border border-transparent'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Right: Layer Toggles & Reset */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowLayerDrawer(!showLayerDrawer)}
            className={`px-2.5 py-1 rounded-xl border flex items-center space-x-1.5 transition ${
              showLayerDrawer
                ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]/40'
                : 'bg-[#0A1224] text-[#94A3B8] border-[#1E293B] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>LAYERS</span>
          </button>

          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-2.5 py-1 rounded-xl border flex items-center space-x-1.5 transition ${
              showLabels
                ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                : 'bg-[#0A1224] text-[#94A3B8] border-[#1E293B] hover:text-white'
            }`}
          >
            {showLabels ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>CALLOUTS</span>
          </button>

          <button
            onClick={() => {
              setViewPreset('iso')
              setExplosionDistance(50)
              props.onSelectBlock(-1)
              setSelectedCell(null)
              if (controlsRef.current) controlsRef.current.reset()
            }}
            className="p-1.5 rounded-xl bg-[#0A1224] border border-[#1E293B] text-[#94A3B8] hover:text-white"
            title="Reset Scene Camera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
