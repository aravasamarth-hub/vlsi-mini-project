import React, { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Line, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import {
  Layers,
  Camera,
  RotateCcw,
  Sliders,
  ChevronDown
} from 'lucide-react'

// Props & Types
export interface Chip3DProps {
  exploded: boolean
  activeBlock: number | null
  onSelectBlock: (id: number) => void
  telemetry: any
  simulating: boolean
  explosionDistance?: number
  setExplosionDistance?: (val: number) => void
  onTabChange?: (tab: string) => void
}

export interface LayerVisibility {
  lid: boolean
  m3: boolean
  m2: boolean
  m1: boolean
  poly: boolean
  sti: boolean
  substrate: boolean
}

// ----------------------------------------------------------------------
// Realistic Metallic QFP Gull-Wing Pins (Perimeter Leads)
// ----------------------------------------------------------------------
function RealisticGullWingPins() {
  const pinSegments = useMemo(() => {
    const list: JSX.Element[] = []
    const pinColor = '#FFD700' // Gold plated copper
    const metalness = 0.98
    const roughness = 0.12

    // North side pins (12 pins along top edge)
    const nSideCount = 12
    for (let i = 0; i < nSideCount; i++) {
      const x = -4.6 + (i * 9.2) / (nSideCount - 1)
      const zRoot = 3.4
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

    // South side pins (12 pins along bottom edge)
    for (let i = 0; i < nSideCount; i++) {
      const x = -4.6 + (i * 9.2) / (nSideCount - 1)
      const zRoot = -3.4
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

    // East side pins (8 pins along right edge)
    const eSideCount = 8
    for (let i = 0; i < eSideCount; i++) {
      const z = -2.5 + (i * 5.0) / (eSideCount - 1)
      const xRoot = 5.2
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

    // West side pins (8 pins along left edge)
    for (let i = 0; i < eSideCount; i++) {
      const z = -2.5 + (i * 5.0) / (eSideCount - 1)
      const xRoot = -5.2
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
// Circular PCB Platform & Concentric Glowing Circuit Tracks (Reference 1 & 3)
// ----------------------------------------------------------------------
function CircularCircuitPlatform() {
  const rings = useMemo(() => {
    return [
      { rIn: 6.8, rOut: 6.9, color: '#00F0FF', opacity: 0.8 },
      { rIn: 8.2, rOut: 8.35, color: '#0077FF', opacity: 0.6 },
      { rIn: 9.6, rOut: 9.75, color: '#00F0FF', opacity: 0.9 },
      { rIn: 10.8, rOut: 11.0, color: '#FF7A00', opacity: 0.75 }
    ]
  }, [])

  const radialLines = useMemo(() => {
    const lines: JSX.Element[] = []
    const count = 24
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count
      const r1 = 6.2
      const r2 = 11.2
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
        <cylinderGeometry args={[11.5, 11.8, 0.22, 64]} />
        <meshStandardMaterial color="#040813" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Outer Polished Metallic Bevel Ring */}
      <mesh position={[0, -0.34, 0]}>
        <ringGeometry args={[11.45, 11.75, 64]} />
        <meshStandardMaterial
          color="#00F0FF"
          emissive="#00F0FF"
          emissiveIntensity={0.3}
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

      {/* Radial Circuit Traces */}
      {radialLines}

      {/* Soft Blue Floor Uplight */}
      <pointLight position={[0, -0.2, 0]} intensity={1.5} color="#0077FF" distance={12} />
    </group>
  )
}

// ----------------------------------------------------------------------
// 4-Bit CSKA Block in 3D (Full Adders, AND4, 2:1 MUX)
// ----------------------------------------------------------------------
function DetailedCSKABlock({
  id,
  position,
  isSelected,
  onSelect,
  isSkipActive,
  blockData,
  simulating,
  renderMode
}: {
  id: number
  position: [number, number, number]
  isSelected: boolean
  onSelect: () => void
  isSkipActive: boolean
  blockData?: any
  simulating: boolean
  renderMode: 'solid' | 'transparent' | 'wireframe'
}) {
  const pulseRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (pulseRef.current && (simulating || isSkipActive)) {
      const t = (state.clock.getElapsedTime() * 3.5 + id * 0.9) % 2.5
      if (isSkipActive) {
        pulseRef.current.position.set(0, 0.22, -0.6 + t * 0.5)
      } else {
        pulseRef.current.position.set(-0.65 + t * 0.5, 0.18, 0.18)
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
        <boxGeometry args={[1.82, 0.06, 4.4]} />
        <meshStandardMaterial
          color={isSelected ? '#122544' : hovered ? '#0D1A30' : '#080F1E'}
          metalness={0.9}
          roughness={0.25}
          wireframe={renderMode === 'wireframe'}
        />
      </mesh>

      {/* Block Outer Boundary Ring */}
      <lineSegments position={[0, 0.065, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.84, 0.02, 4.42)]} />
        <lineBasicMaterial color={blockBorderColor} linewidth={isSelected ? 2 : 1} />
      </lineSegments>

      {/* 4 Cascaded Full-Adder Standard Cells */}
      {[-1.4, -0.45, 0.45, 1.4].map((fz, fIdx) => (
        <group key={fIdx} position={[-0.25, 0.09, fz]}>
          <mesh>
            <boxGeometry args={[0.9, 0.08, 0.7]} />
            <meshStandardMaterial
              color="#047857"
              emissive="#10B981"
              emissiveIntensity={0.5}
              metalness={0.88}
              roughness={0.18}
            />
          </mesh>
          <lineSegments position={[0, 0.042, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(0.92, 0.02, 0.72)]} />
            <lineBasicMaterial color="#34D399" />
          </lineSegments>
        </group>
      ))}

      {/* AND4 Group Propagate Gate */}
      <group position={[0.55, 0.09, -0.6]}>
        <mesh>
          <boxGeometry args={[0.45, 0.08, 0.9]} />
          <meshStandardMaterial
            color="#D97706"
            emissive="#F59E0B"
            emissiveIntensity={blockData?.p_group ? 1.0 : 0.3}
            metalness={0.9}
            roughness={0.18}
          />
        </mesh>
      </group>

      {/* 2:1 Multiplexer Bypass Gate */}
      <group position={[0.55, 0.09, 0.8]}>
        <mesh>
          <boxGeometry args={[0.5, 0.09, 0.95]} />
          <meshStandardMaterial
            color={isSkipActive ? '#EA580C' : '#475569'}
            emissive={isSkipActive ? '#FF7A00' : '#1E293B'}
            emissiveIntensity={isSkipActive ? 1.2 : 0.2}
            metalness={0.92}
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* Dynamic Carry Signal Photon Pulse */}
      {(simulating || isSkipActive) && (
        <mesh ref={pulseRef} position={[0, 0.22, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color={isSkipActive ? '#FF7A00' : '#00F0FF'} />
        </mesh>
      )}
    </group>
  )
}

// ----------------------------------------------------------------------
// Inter-Layer Metallic Conductive Vias
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
    [-3.0, -1.3], [-1.0, -1.3], [1.0, -1.3], [3.0, -1.3],
    [-3.0, 1.3], [-1.0, 1.3], [1.0, 1.3], [3.0, 1.3],
    [-2.0, 0], [0, 0], [2.0, 0]
  ]

  return (
    <group>
      {viaCoords.map(([vx, vz], idx) => (
        <group key={idx} position={[vx, yMid, vz]}>
          <mesh>
            <cylinderGeometry args={[0.035, 0.035, height, 10]} />
            <meshStandardMaterial
              color={color}
              metalness={0.94}
              roughness={0.15}
              emissive={color}
              emissiveIntensity={0.25}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ----------------------------------------------------------------------
// Semiconductor 7-Layer Exploded Stack
// ----------------------------------------------------------------------
function SemiconductorStack({
  explosionDistance,
  visibility,
  activeBlock,
  onSelectBlock,
  telemetry,
  simulating,
  renderMode
}: {
  explosionDistance: number
  visibility: LayerVisibility
  activeBlock: number | null
  onSelectBlock: (id: number) => void
  telemetry: any
  simulating: boolean
  renderMode: 'solid' | 'transparent' | 'wireframe'
}) {
  const s = explosionDistance / 100

  // Vertical positions of each layer
  const ySubstrate = 0.08
  const ySTI = ySubstrate + 0.12 + s * 1.05
  const yPoly = ySTI + 0.12 + s * 1.15
  const yM1 = yPoly + 0.14 + s * 1.2
  const yM2 = yM1 + 0.14 + s * 1.25
  const yM3 = yM2 + 0.14 + s * 1.3
  const yLid = yM3 + 0.16 + s * 1.4

  return (
    <group position={[0, 0, 0]}>
      {/* L7: SILICON SUBSTRATE (P-TYPE BULK) */}
      {visibility.substrate && (
        <group position={[0, ySubstrate, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[9.4, 0.18, 5.8]} />
            <meshStandardMaterial
              color="#0B132B"
              metalness={0.92}
              roughness={0.2}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>
          <mesh position={[0, 0.092, 0]}>
            <boxGeometry args={[9.0, 0.005, 5.4]} />
            <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={0.2} />
          </mesh>
        </group>
      )}

      {s > 0.15 && visibility.substrate && visibility.sti && (
        <InterLayerVias yBottom={ySubstrate + 0.09} yTop={ySTI - 0.05} color="#475569" />
      )}

      {/* L6: STI / WELL ISOLATION */}
      {visibility.sti && (
        <group position={[0, ySTI, 0]}>
          <mesh>
            <boxGeometry args={[9.0, 0.1, 5.4]} />
            <meshStandardMaterial
              color="#1E234A"
              metalness={0.7}
              roughness={0.35}
              transparent
              opacity={renderMode === 'transparent' ? 0.35 : 0.82}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>
        </group>
      )}

      {s > 0.15 && visibility.sti && visibility.poly && (
        <InterLayerVias yBottom={ySTI + 0.05} yTop={yPoly - 0.06} color="#818CF8" />
      )}

      {/* L5: ACTIVE & POLYSILICON LAYER (4 CSKA BLOCKS) */}
      {visibility.poly && (
        <group position={[0, yPoly, 0]}>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[8.8, 0.08, 5.2]} />
            <meshStandardMaterial
              color="#080E1B"
              metalness={0.92}
              roughness={0.15}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>

          {/* Gold Perimeter Bond Pads Ring */}
          {[-3.8, -2.6, -1.4, -0.2, 1.0, 2.2, 3.4].map((px, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[px, 0.052, 2.38]}>
                <boxGeometry args={[0.2, 0.015, 0.2]} />
                <meshStandardMaterial color="#FFD700" metalness={0.96} roughness={0.12} />
              </mesh>
              <mesh position={[px, 0.052, -2.38]}>
                <boxGeometry args={[0.2, 0.015, 0.2]} />
                <meshStandardMaterial color="#FFD700" metalness={0.96} roughness={0.12} />
              </mesh>
            </React.Fragment>
          ))}

          {/* 4 Distinct 4-Bit CSKA Functional Blocks */}
          <DetailedCSKABlock
            id={0}
            position={[-2.85, 0.06, 0]}
            isSelected={activeBlock === 0}
            onSelect={() => onSelectBlock(0)}
            isSkipActive={Boolean(telemetry?.blocks?.[0]?.skip_active)}
            blockData={telemetry?.blocks?.[0]}
            simulating={simulating}
            renderMode={renderMode}
          />
          <DetailedCSKABlock
            id={1}
            position={[-0.95, 0.06, 0]}
            isSelected={activeBlock === 1}
            onSelect={() => onSelectBlock(1)}
            isSkipActive={Boolean(telemetry?.blocks?.[1]?.skip_active)}
            blockData={telemetry?.blocks?.[1]}
            simulating={simulating}
            renderMode={renderMode}
          />
          <DetailedCSKABlock
            id={2}
            position={[0.95, 0.06, 0]}
            isSelected={activeBlock === 2}
            onSelect={() => onSelectBlock(2)}
            isSkipActive={Boolean(telemetry?.blocks?.[2]?.skip_active)}
            blockData={telemetry?.blocks?.[2]}
            simulating={simulating}
            renderMode={renderMode}
          />
          <DetailedCSKABlock
            id={3}
            position={[2.85, 0.06, 0]}
            isSelected={activeBlock === 3}
            onSelect={() => onSelectBlock(3)}
            isSkipActive={Boolean(telemetry?.blocks?.[3]?.skip_active)}
            blockData={telemetry?.blocks?.[3]}
            simulating={simulating}
            renderMode={renderMode}
          />
        </group>
      )}

      {s > 0.15 && visibility.poly && visibility.m1 && (
        <InterLayerVias yBottom={yPoly + 0.08} yTop={yM1 - 0.04} color="#38BDF8" />
      )}

      {/* L4: METAL-1 LOCAL ROUTING */}
      {visibility.m1 && (
        <group position={[0, yM1, 0]}>
          <mesh>
            <boxGeometry args={[8.6, 0.06, 5.0]} />
            <meshStandardMaterial
              color="#13213B"
              metalness={0.9}
              roughness={0.22}
              transparent
              opacity={renderMode === 'transparent' ? 0.2 : 0.72}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>
          {[-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map((mx, idx) => (
            <mesh key={idx} position={[mx, 0.035, 0]}>
              <boxGeometry args={[0.08, 0.015, 4.6]} />
              <meshStandardMaterial
                color="#818CF8"
                metalness={0.95}
                roughness={0.1}
                emissive="#6366F1"
                emissiveIntensity={0.6}
              />
            </mesh>
          ))}
        </group>
      )}

      {s > 0.15 && visibility.m1 && visibility.m2 && (
        <InterLayerVias yBottom={yM1 + 0.04} yTop={yM2 - 0.04} color="#00F0FF" />
      )}

      {/* L3: METAL-2 INTERCONNECT & CARRY SKIP HIGHWAY */}
      {visibility.m2 && (
        <group position={[0, yM2, 0]}>
          <mesh>
            <boxGeometry args={[8.6, 0.06, 5.0]} />
            <meshStandardMaterial
              color="#0A182F"
              metalness={0.92}
              roughness={0.18}
              transparent
              opacity={renderMode === 'transparent' ? 0.25 : 0.75}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>
          {[-1.6, -0.8, 0, 0.8, 1.6].map((mz, idx) => {
            const isSkipRoute = idx === 1 || idx === 3
            const traceColor = isSkipRoute ? '#FF7A00' : '#00F0FF'
            return (
              <mesh key={idx} position={[0, 0.035, mz]}>
                <boxGeometry args={[8.0, 0.02, 0.12]} />
                <meshStandardMaterial
                  color={traceColor}
                  metalness={0.96}
                  roughness={0.1}
                  emissive={traceColor}
                  emissiveIntensity={isSkipRoute ? 1.0 : 0.5}
                />
              </mesh>
            )
          })}
        </group>
      )}

      {s > 0.15 && visibility.m2 && visibility.m3 && (
        <InterLayerVias yBottom={yM2 + 0.04} yTop={yM3 - 0.04} color="#C87D55" />
      )}

      {/* L2: METAL-3 POWER GRID & GLOBAL ROUTING */}
      {visibility.m3 && (
        <group position={[0, yM3, 0]}>
          <mesh>
            <boxGeometry args={[8.6, 0.08, 5.0]} />
            <meshStandardMaterial
              color="#1B1716"
              metalness={0.92}
              roughness={0.2}
              transparent
              opacity={renderMode === 'transparent' ? 0.28 : 0.78}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>
          {[-3.0, -1.0, 1.0, 3.0].map((px, idx) => (
            <mesh key={idx} position={[px, 0.045, 0]}>
              <boxGeometry args={[0.38, 0.025, 4.8]} />
              <meshStandardMaterial
                color="#C87D55"
                metalness={0.96}
                roughness={0.12}
                emissive="#9A3412"
                emissiveIntensity={0.6}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* L1: PASSIVATION LID / HEAT SPREADER (TITANIUM / ALUMINUM) */}
      {visibility.lid && (
        <group position={[0, yLid, 0]}>
          {/* Main Package Lid */}
          <mesh>
            <boxGeometry args={[9.6, 0.28, 6.0]} />
            <meshStandardMaterial
              color="#0B132B"
              metalness={0.94}
              roughness={0.2}
              depthWrite
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>

          {/* Polished Gold Chamfered Rim */}
          <mesh position={[0, 0.145, 0]}>
            <boxGeometry args={[9.3, 0.02, 5.7]} />
            <meshStandardMaterial color="#FFD700" metalness={0.98} roughness={0.12} />
          </mesh>

          {/* Laser-Engraved Identification Markings */}
          <Text
            position={[0, 0.16, -0.7]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.42}
            color="#00F0FF"
            anchorX="center"
            anchorY="middle"
          >
            CYBERCORE • CSKA-16
          </Text>

          <Text
            position={[0, 0.16, 0.1]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.26}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            CARRY SKIP ADDER
          </Text>

          <Text
            position={[0, 0.16, 0.8]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.17}
            color="#FF7A00"
            anchorX="center"
            anchorY="middle"
          >
            SKY130HD | 16-BIT | ASIC DESIGN
          </Text>
        </group>
      )}
    </group>
  )
}

// ----------------------------------------------------------------------
// 3D Scene Leader Lines & Callout Badges (Left Side, Reference 1)
// ----------------------------------------------------------------------
function LayerCalloutLeaders({ explosionDistance }: { explosionDistance: number }) {
  const s = explosionDistance / 100
  const ySubstrate = 0.08
  const ySTI = ySubstrate + 0.12 + s * 1.05
  const yPoly = ySTI + 0.12 + s * 1.15
  const yM1 = yPoly + 0.14 + s * 1.2
  const yM2 = yM1 + 0.14 + s * 1.25
  const yM3 = yM2 + 0.14 + s * 1.3
  const yLid = yM3 + 0.16 + s * 1.4

  const layers = [
    { label: 'Passivation (SiN) ~0.5 µm', y: yLid, color: '#00F0FF' },
    { label: 'Metal-3 (M3) Routing Layer', y: yM3, color: '#C87D55' },
    { label: 'Metal-2 (M2) Interconnect', y: yM2, color: '#00F0FF' },
    { label: 'Metal-1 (M1) Local Routing', y: yM1, color: '#818CF8' },
    { label: 'Active / Poly Transistors & Gates', y: yPoly, color: '#00DF72' },
    { label: 'STI / Well Isolation', y: ySTI, color: '#6366F1' },
    { label: 'Silicon Substrate p-type (Bulk)', y: ySubstrate, color: '#94A3B8' }
  ]

  return (
    <group position={[-4.5, 0, 0]}>
      {layers.map((ly, idx) => {
        const xAnchor = -0.2
        const xStem = -3.4
        return (
          <group key={idx}>
            {/* Connecting Cyan Leader Line */}
            <Line
              points={[new THREE.Vector3(xAnchor, ly.y, 0), new THREE.Vector3(xStem, ly.y, 0)]}
              color="#00F0FF"
              lineWidth={1.4}
              transparent
              opacity={0.8}
            />
            {/* Anchor Sphere Dot at Layer Edge */}
            <mesh position={[xAnchor, ly.y, 0]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshBasicMaterial color="#00F0FF" />
            </mesh>
            {/* 3D Billboard Text Label */}
            <Billboard position={[xStem - 0.2, ly.y, 0]}>
              <Text
                fontSize={0.24}
                color={ly.color}
                anchorX="right"
                anchorY="middle"
              >
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
// Smooth Camera Controller
// ----------------------------------------------------------------------
function CameraRig({
  viewPreset,
  controlsRef
}: {
  viewPreset: '3d' | 'top' | 'side' | 'iso'
  controlsRef: React.RefObject<any>
}) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(11.5, 9.5, 11.5))
  const targetLook = useRef(new THREE.Vector3(0, 1.2, 0))
  const isTransitioning = useRef<boolean>(false)

  useEffect(() => {
    if (!controlsRef.current) return

    if (viewPreset === 'iso' || viewPreset === '3d') {
      targetPos.current.set(11.5, 9.5, 11.5)
      targetLook.current.set(0, 1.0, 0)
    } else if (viewPreset === 'top') {
      targetPos.current.set(0.01, 15, 0)
      targetLook.current.set(0, 0, 0)
    } else if (viewPreset === 'side') {
      targetPos.current.set(14, 2.5, 0)
      targetLook.current.set(0, 1.2, 0)
    }
    isTransitioning.current = true
  }, [viewPreset, controlsRef])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const handleStart = () => {
      isTransitioning.current = false
    }
    controls.addEventListener('start', handleStart)
    return () => controls.removeEventListener('start', handleStart)
  }, [controlsRef])

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
// Main 3D Chip Studio Component
// ----------------------------------------------------------------------
export default function Chip3D(props: Chip3DProps) {
  const [activeCanvasTab, setActiveCanvasTab] = useState<string>('3D Chip Visualization')
  const [explosionDistance, setExplosionDistance] = useState<number>(props.exploded ? 60 : 45)
  const [renderMode, setRenderMode] = useState<'solid' | 'transparent' | 'wireframe'>('solid')
  const [viewPreset, setViewPreset] = useState<'3d' | 'top' | 'side' | 'iso'>('iso')
  const [showLayerDrawer, setShowLayerDrawer] = useState<boolean>(false)
  const [showLabels, setShowLabels] = useState<boolean>(true)
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (props.exploded) setExplosionDistance(65)
  }, [props.exploded])

  const [visibility, setVisibility] = useState<LayerVisibility>({
    lid: true,
    m3: true,
    m2: true,
    m1: true,
    poly: true,
    sti: true,
    substrate: true
  })

  const toggleLayer = (key: keyof LayerVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleExportSnapshot = () => {
    const canvas = document.querySelector('#cybercore-3d-canvas canvas') as HTMLCanvasElement
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `CYBERCORE_CSKA16_3D_${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleResetCamera = () => {
    setViewPreset('iso')
    props.onSelectBlock(-1)
    if (controlsRef.current) controlsRef.current.reset()
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden glass-panel relative flex flex-col border border-[#00F0FF]/30 shadow-2xl">
      {/* Canvas Top Tab Bar (Reference 1) */}
      <div className="px-3.5 py-2 border-b border-[#1E293B] bg-[#070D1A]/95 flex items-center justify-between gap-1 z-10 overflow-hidden">
        <div className="flex items-center space-x-1 text-xs font-mono">
          {[
            { id: '3D Chip Visualization', label: '3D Chip Visualization' },
            { id: 'Exploded View', label: 'Exploded View' },
            { id: 'Internal Architecture', label: 'Internal Architecture' },
            { id: 'Layout (GDS)', label: 'Layout (GDS)' },
            { id: 'Schematic', label: 'Schematic' },
            { id: 'Netlist', label: 'Netlist' }
          ].map((t) => {
            const isActive = activeCanvasTab === t.id
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveCanvasTab(t.id)
                  if (t.id === 'Exploded View') setExplosionDistance(75)
                  if (t.id === '3D Chip Visualization') setExplosionDistance(45)
                  if (props.onTabChange) props.onTabChange(t.id)
                }}
                className={`px-2 py-1 rounded-lg transition whitespace-nowrap text-[10px] font-bold ${
                  isActive
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 shadow-sm'
                    : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-white'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Right Target Selector */}
        <div className="flex items-center space-x-1.5 text-xs font-mono shrink-0 pl-2">
          <span className="text-[#64748B] text-[10px]">Target:</span>
          <div className="px-2 py-0.5 rounded-lg bg-[#0A1224] border border-[#1E293B] text-white flex items-center space-x-1.5 cursor-pointer">
            <span className="font-bold text-[#00F0FF] text-[10px]">16-Bit CSKA</span>
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </div>
        </div>
      </div>

      {/* Main 3D Viewport Area */}
      <div id="cybercore-3d-canvas" className="w-full h-[520px] relative bg-[#040812] overflow-hidden">
        <Canvas
          shadows
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
          camera={{ position: [11.5, 9.5, 11.5], fov: 38 }}
        >
          <CameraRig viewPreset={viewPreset} controlsRef={controlsRef} />

          {/* Cinematic Studio Lighting */}
          <ambientLight intensity={0.65} />
          <directionalLight position={[12, 18, 12]} intensity={2.2} castShadow />
          <directionalLight position={[-12, 14, -10]} intensity={1.5} color="#00F0FF" />
          <pointLight position={[0, 6, 0]} intensity={1.2} color="#FFFFFF" />
          <pointLight position={[-8, -2, 6]} intensity={1.2} color="#FF7A00" />
          <pointLight position={[8, -2, -6]} intensity={1.0} color="#00DF72" />

          {/* Circular PCB Platform with Concentric Rings */}
          <CircularCircuitPlatform />

          {/* Ceramic IC Package Substrate */}
          <mesh position={[0, -0.22, 0]}>
            <boxGeometry args={[10.6, 0.42, 6.8]} />
            <meshStandardMaterial color="#0A101D" metalness={0.9} roughness={0.25} />
          </mesh>

          {/* Polished Gold Cavity Ring */}
          <mesh position={[0, 0.0, 0]}>
            <boxGeometry args={[9.6, 0.03, 6.0]} />
            <meshStandardMaterial color="#FFD700" metalness={0.98} roughness={0.12} />
          </mesh>

          {/* Realistic Metallic QFP Gull-Wing Pins */}
          <RealisticGullWingPins />

          {/* Exploded 7-Layer Semiconductor Stack */}
          <SemiconductorStack
            explosionDistance={explosionDistance}
            visibility={visibility}
            activeBlock={props.activeBlock}
            onSelectBlock={props.onSelectBlock}
            telemetry={props.telemetry}
            simulating={props.simulating}
            renderMode={renderMode}
          />

          {/* Callout Leader Lines on the Left */}
          {showLabels && <LayerCalloutLeaders explosionDistance={explosionDistance} />}

          {/* Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.06}
            minDistance={4}
            maxDistance={28}
            maxPolarAngle={Math.PI / 2 + 0.12}
          />
        </Canvas>

        {/* 4-BIT CSKA BLOCK (DETAIL) Inset Callout Card on the Right (Reference 1) */}
        <div className="absolute top-4 right-4 w-56 glass-panel p-3 rounded-xl border border-[#00F0FF]/35 shadow-2xl font-mono text-xs pointer-events-none">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#1E293B]">
            <span className="font-bold text-[#00F0FF] text-[10px]">4-BIT CSKA BLOCK (DETAIL)</span>
          </div>
          <div className="py-1.5 text-center text-[10px] text-[#FF7A00] font-bold">
            P_group = P3 · P2 · P1 · P0
          </div>
          {/* Micro Layout Graphic */}
          <div className="h-16 bg-[#060B16] rounded-lg border border-[#1E293B] p-1 flex items-center justify-center space-x-1">
            <div className="h-full w-8 rounded bg-[#10B981]/25 border border-[#10B981] flex flex-col items-center justify-center text-[8px] text-[#34D399]">
              <span>FA</span>
              <span>0-3</span>
            </div>
            <div className="h-full w-6 rounded bg-[#F59E0B]/25 border border-[#F59E0B] flex items-center justify-center text-[8px] text-[#FBBF24]">
              <span>AND</span>
            </div>
            <div className="h-full w-8 rounded bg-[#FF7A00]/25 border border-[#FF7A00] flex items-center justify-center text-[8px] text-[#FF7A00] font-bold">
              <span>MUX</span>
            </div>
          </div>
        </div>

        {/* Floating Layer Visibility Drawer */}
        {showLayerDrawer && (
          <div className="absolute top-4 left-4 w-72 glass-panel p-4 rounded-xl border border-[#00F0FF]/35 shadow-2xl z-20 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-[#00F0FF]" />
                <span>SEMICONDUCTOR STACK</span>
              </span>
              <button
                onClick={() => setShowLayerDrawer(false)}
                className="text-[#64748B] hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              {[
                { key: 'lid', name: 'L1: Passivation (SiN) ~0.5 µm', color: '#00F0FF' },
                { key: 'm3', name: 'L2: Metal-3 (M3) Routing Layer', color: '#C87D55' },
                { key: 'm2', name: 'L3: Metal-2 (M2) Interconnect', color: '#00F0FF' },
                { key: 'm1', name: 'L4: Metal-1 (M1) Local Routing', color: '#818CF8' },
                { key: 'poly', name: 'L5: Active & Poly Transistors', color: '#00DF72' },
                { key: 'sti', name: 'L6: STI / Well Isolation', color: '#6366F1' },
                { key: 'substrate', name: 'L7: Silicon Substrate (Bulk)', color: '#94A3B8' }
              ].map((layer) => {
                const isVisible = visibility[layer.key as keyof LayerVisibility]
                return (
                  <div
                    key={layer.key}
                    onClick={() => toggleLayer(layer.key as keyof LayerVisibility)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#070D1A]/80 hover:bg-[#0F172A] cursor-pointer border border-transparent hover:border-[#1E293B] transition"
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2.5 h-2.5 rounded-sm"
                        style={{ backgroundColor: layer.color }}
                      ></span>
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

      {/* Bottom Viewport Control Bar (Reference 1) */}
      <div className="px-4 py-2.5 border-t border-[#1E293B] bg-[#070D1A]/95 flex flex-wrap items-center justify-between gap-3 font-mono text-xs z-10">
        {/* Interaction Hints Pill */}
        <div className="flex items-center space-x-3 text-[#94A3B8] text-[11px] overflow-x-auto">
          <span>Rotate (Drag)</span>
          <span className="text-[#1E293B]">•</span>
          <span>Pan (Right-Drag)</span>
          <span className="text-[#1E293B]">•</span>
          <span>Zoom (Scroll)</span>
          <span className="text-[#1E293B]">•</span>
          <button
            onClick={() => setShowLayerDrawer(!showLayerDrawer)}
            className="hover:text-[#00F0FF] transition text-[#00F0FF]"
          >
            Toggle Layers (L)
          </button>
          <span className="text-[#1E293B]">•</span>
          <button
            onClick={handleExportSnapshot}
            className="hover:text-[#00F0FF] transition flex items-center space-x-1"
          >
            <Camera className="w-3 h-3 text-[#00F0FF]" />
            <span>Snapshot</span>
          </button>
        </div>

        {/* Explosion Slider & View Mode Buttons */}
        <div className="flex items-center space-x-3">
          {/* Explosion Slider */}
          <div className="flex items-center space-x-2">
            <Sliders className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span className="text-[10px] text-[#64748B] uppercase font-bold">Explosion:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={explosionDistance}
              onChange={(e) => setExplosionDistance(Number(e.target.value))}
              className="w-20 h-1 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
            />
            <span className="text-[11px] text-[#00F0FF] font-bold w-7">{explosionDistance}%</span>
            <button
              onClick={() => setExplosionDistance(explosionDistance > 0 ? 0 : 65)}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1E293B] hover:bg-[#334155] text-white transition"
            >
              {explosionDistance > 0 ? 'REASSEMBLE' : 'EXPLODE'}
            </button>
          </div>

          {/* View Mode Buttons (3D, Top, Side, Iso) */}
          <div className="flex items-center bg-[#090F1E] rounded-lg p-0.5 border border-[#1E293B]">
            {[
              { id: '3d', label: '3D' },
              { id: 'top', label: 'Top' },
              { id: 'side', label: 'Side' },
              { id: 'iso', label: 'Iso' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setViewPreset(p.id as any)}
                className={`px-2 py-0.5 rounded transition text-[11px] font-bold ${
                  viewPreset === p.id
                    ? 'bg-[#00F0FF] text-black shadow-md shadow-[#00F0FF]/25'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            title="Reset Camera View"
            className="p-1.5 rounded-lg bg-[#0A101D] border border-[#1E293B] text-[#94A3B8] hover:text-[#00F0FF] transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
