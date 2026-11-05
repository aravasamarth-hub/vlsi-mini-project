import React, { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Line, Float } from '@react-three/drei'
import * as THREE from 'three'
import {
  Layers,
  Eye,
  EyeOff,
  Camera,
  Maximize2,
  RotateCcw,
  Sparkles,
  Zap,
  Sliders,
  CheckCircle,
  Download,
  Box,
  Compass
} from 'lucide-react'

// Types
export interface Chip3DProps {
  exploded: boolean
  activeBlock: number | null
  onSelectBlock: (id: number) => void
  telemetry: any
  simulating: boolean
  explosionDistance?: number
  setExplosionDistance?: (val: number) => void
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

// -------------------------------------------------------------
// Realistic Wire-Bond Component
// Connects die perimeter pads to package substrate lead fingers
// -------------------------------------------------------------
function WireBonds({ explodedOffset }: { explodedOffset: number }) {
  const bondCurves = useMemo(() => {
    const curves: THREE.Vector3[][] = []
    const countX = 10
    const countZ = 6

    // North side bonds
    for (let i = 0; i < countX; i++) {
      const x = -4.2 + (i * 8.4) / (countX - 1)
      const diePoint = new THREE.Vector3(x * 0.85, 0.28 + explodedOffset * 0.1, 2.1)
      const pkgPoint = new THREE.Vector3(x * 1.1, 0.05, 3.2)
      const midPoint = new THREE.Vector3(x * 0.98, 0.75 + explodedOffset * 0.05, 2.65)
      const curve = new THREE.QuadraticBezierCurve3(diePoint, midPoint, pkgPoint)
      curves.push(curve.getPoints(12))
    }

    // South side bonds
    for (let i = 0; i < countX; i++) {
      const x = -4.2 + (i * 8.4) / (countX - 1)
      const diePoint = new THREE.Vector3(x * 0.85, 0.28 + explodedOffset * 0.1, -2.1)
      const pkgPoint = new THREE.Vector3(x * 1.1, 0.05, -3.2)
      const midPoint = new THREE.Vector3(x * 0.98, 0.75 + explodedOffset * 0.05, -2.65)
      const curve = new THREE.QuadraticBezierCurve3(diePoint, midPoint, pkgPoint)
      curves.push(curve.getPoints(12))
    }

    // East side bonds
    for (let i = 0; i < countZ; i++) {
      const z = -1.8 + (i * 3.6) / (countZ - 1)
      const diePoint = new THREE.Vector3(4.0, 0.28 + explodedOffset * 0.1, z * 0.85)
      const pkgPoint = new THREE.Vector3(4.9, 0.05, z * 1.1)
      const midPoint = new THREE.Vector3(4.45, 0.75 + explodedOffset * 0.05, z * 0.98)
      const curve = new THREE.QuadraticBezierCurve3(diePoint, midPoint, pkgPoint)
      curves.push(curve.getPoints(12))
    }

    // West side bonds
    for (let i = 0; i < countZ; i++) {
      const z = -1.8 + (i * 3.6) / (countZ - 1)
      const diePoint = new THREE.Vector3(-4.0, 0.28 + explodedOffset * 0.1, z * 0.85)
      const pkgPoint = new THREE.Vector3(-4.9, 0.05, z * 1.1)
      const midPoint = new THREE.Vector3(-4.45, 0.75 + explodedOffset * 0.05, z * 0.98)
      const curve = new THREE.QuadraticBezierCurve3(diePoint, midPoint, pkgPoint)
      curves.push(curve.getPoints(12))
    }

    return curves
  }, [explodedOffset])

  return (
    <group>
      {bondCurves.map((pts, idx) => (
        <Line
          key={idx}
          points={pts}
          color="#FFD700"
          lineWidth={1.5}
          transparent
          opacity={0.85}
        />
      ))}
    </group>
  )
}

// -------------------------------------------------------------
// BGA Solder Ball Grid & Peripheral Lead Pins
// -------------------------------------------------------------
function PackageInterconnects() {
  const pinCount = 14
  const pins: JSX.Element[] = []

  // North/South Lead Pins
  for (let i = 0; i < pinCount; i++) {
    const x = -5.0 + (i * 10.0) / (pinCount - 1)
    pins.push(
      <mesh key={`pin-n-${i}`} position={[x, -0.15, 3.75]}>
        <boxGeometry args={[0.26, 0.09, 0.75]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.96} roughness={0.12} />
      </mesh>,
      <mesh key={`pin-s-${i}`} position={[x, -0.15, -3.75]}>
        <boxGeometry args={[0.26, 0.09, 0.75]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.96} roughness={0.12} />
      </mesh>
    )
  }

  // East/West Lead Pins
  for (let i = 0; i < 9; i++) {
    const z = -2.8 + (i * 5.6) / 8
    pins.push(
      <mesh key={`pin-e-${i}`} position={[5.55, -0.15, z]}>
        <boxGeometry args={[0.75, 0.09, 0.26]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.96} roughness={0.12} />
      </mesh>,
      <mesh key={`pin-w-${i}`} position={[-5.55, -0.15, z]}>
        <boxGeometry args={[0.75, 0.09, 0.26]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.96} roughness={0.12} />
      </mesh>
    )
  }

  // Bottom BGA Solder Ball Matrix
  const bgaBalls: JSX.Element[] = []
  for (let bx = -4.0; bx <= 4.0; bx += 0.8) {
    for (let bz = -2.4; bz <= 2.4; bz += 0.8) {
      // Cavity center empty
      if (Math.abs(bx) < 2.0 && Math.abs(bz) < 1.2) continue
      bgaBalls.push(
        <mesh key={`bga-${bx}-${bz}`} position={[bx, -0.42, bz]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.92} roughness={0.15} />
        </mesh>
      )
    }
  }

  return (
    <group>
      {pins}
      {bgaBalls}
    </group>
  )
}

// -------------------------------------------------------------
// Detailed 4-Bit CSKA Block in 3D
// Includes 4 Full Adders, 4-input AND propagate, and 2:1 Skip MUX
// -------------------------------------------------------------
function DetailedCSKABlock({
  id,
  position,
  explodedY,
  isSelected,
  onSelect,
  isSkipActive,
  blockData,
  simulating,
  renderMode
}: {
  id: number
  position: [number, number, number]
  explodedY: number
  isSelected: boolean
  onSelect: () => void
  isSkipActive: boolean
  blockData?: any
  simulating: boolean
  renderMode: 'solid' | 'transparent' | 'wireframe'
}) {
  const meshRef = useRef<THREE.Group>(null)
  const pulseRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Pulsing animation along active path
  useFrame((state) => {
    if (pulseRef.current && (simulating || isSkipActive)) {
      const t = (state.clock.getElapsedTime() * 3 + id * 0.8) % 2.5
      if (isSkipActive) {
        // Skip highway pulse: jumps from Cin to Cout
        pulseRef.current.position.set(0, 0.32, -0.7 + t * 0.55)
      } else {
        // Ripple path pulse: travels across the 4 full adders
        pulseRef.current.position.set(-0.7 + t * 0.6, 0.28, 0)
      }
    }
  })

  const blockBaseColor = isSkipActive
    ? '#FF8800'
    : isSelected
    ? '#00F0FF'
    : hovered
    ? '#38BDF8'
    : '#121C30'

  const blockEmissive = isSkipActive
    ? '#FF5500'
    : isSelected
    ? '#00B4D8'
    : '#040914'

  return (
    <group
      ref={meshRef}
      position={[position[0], position[1] + explodedY, position[2]]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Block Silicon Well / Substrate Boundary */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.92, 0.2, 1.48]} />
        <meshStandardMaterial
          color={blockBaseColor}
          metalness={0.82}
          roughness={0.22}
          emissive={blockEmissive}
          emissiveIntensity={isSkipActive ? 0.75 : isSelected ? 0.45 : 0.08}
          transparent={renderMode === 'transparent'}
          opacity={renderMode === 'transparent' ? 0.45 : 0.95}
          wireframe={renderMode === 'wireframe'}
        />
      </mesh>

      {/* 4 Individual Full Adder Cells (FA0, FA1, FA2, FA3) */}
      {[-0.66, -0.22, 0.22, 0.66].map((xOff, faIdx) => {
        const bitIdx = id * 4 + faIdx
        const pBit = blockData?.p_bits?.[faIdx]
        const faColor = isSkipActive ? '#FFAA33' : '#00F0FF'
        return (
          <group key={faIdx} position={[xOff, 0.12, 0.12]}>
            {/* Standard Cell Body */}
            <mesh>
              <boxGeometry args={[0.36, 0.12, 0.72]} />
              <meshStandardMaterial
                color={faColor}
                metalness={0.88}
                roughness={0.25}
                emissive={isSkipActive ? '#FF6600' : '#0077B6'}
                emissiveIntensity={pBit ? 0.6 : 0.2}
                transparent={renderMode === 'transparent'}
                opacity={renderMode === 'transparent' ? 0.55 : 1}
                wireframe={renderMode === 'wireframe'}
              />
            </mesh>

            {/* Ripple Carry Segment Interconnecting FAs */}
            {faIdx < 3 && (
              <mesh position={[0.22, 0.02, 0]}>
                <boxGeometry args={[0.12, 0.04, 0.06]} />
                <meshStandardMaterial
                  color="#00F0FF"
                  emissive="#00F0FF"
                  emissiveIntensity={0.8}
                />
              </mesh>
            )}

            {/* FA Cell Identification */}
            <Text
              position={[0, 0.12, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.09}
              color="#030712"
              anchorX="center"
              anchorY="middle"
            >
              {`FA${faIdx}`}
            </Text>
          </group>
        )
      })}

      {/* 4-Input AND Group Propagate Gate (Pgroup = P0·P1·P2·P3) */}
      <group position={[-0.42, 0.12, -0.48]}>
        <mesh>
          <boxGeometry args={[0.55, 0.1, 0.32]} />
          <meshStandardMaterial
            color={blockData?.p_group ? '#00DF72' : '#334155'}
            metalness={0.9}
            roughness={0.2}
            emissive={blockData?.p_group ? '#00DF72' : '#0F172A'}
            emissiveIntensity={blockData?.p_group ? 0.9 : 0.1}
            wireframe={renderMode === 'wireframe'}
          />
        </mesh>
        <Text
          position={[0, 0.08, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.075}
          color="#030712"
          anchorX="center"
          anchorY="middle"
        >
          AND4:Pgrp
        </Text>
      </group>

      {/* 2:1 Carry Skip Multiplexer (MUX2_1) */}
      <group position={[0.55, 0.14, -0.48]}>
        <mesh>
          <boxGeometry args={[0.48, 0.14, 0.36]} />
          <meshStandardMaterial
            color={isSkipActive ? '#FF7A00' : '#00F0FF'}
            metalness={0.9}
            roughness={0.18}
            emissive={isSkipActive ? '#FF5500' : '#0077B6'}
            emissiveIntensity={0.85}
            wireframe={renderMode === 'wireframe'}
          />
        </mesh>
        <Text
          position={[0, 0.1, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.08}
          color="#030712"
          anchorX="center"
          anchorY="middle"
        >
          MUX2:1
        </Text>
      </group>

      {/* Dedicated Carry Skip Bypass Highway (Runs over the block) */}
      <mesh position={[0, 0.18, -0.48]}>
        <boxGeometry args={[1.5, 0.04, 0.06]} />
        <meshStandardMaterial
          color={isSkipActive ? '#FF8800' : '#475569'}
          emissive={isSkipActive ? '#FF8800' : '#1E293B'}
          emissiveIntensity={isSkipActive ? 1.0 : 0.1}
        />
      </mesh>

      {/* Animated Signal Photon Pulse */}
      <mesh ref={pulseRef} position={[0, 0.28, -0.48]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial
          color={isSkipActive ? '#FF7A00' : '#00F0FF'}
          emissive={isSkipActive ? '#FF7A00' : '#00F0FF'}
          emissiveIntensity={2.0}
        />
      </mesh>

      {/* Block Title & Range */}
      <Text
        position={[0, 0.18, 0.62]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.13}
        color={isSelected ? '#00F0FF' : '#E2E8F0'}
        anchorX="center"
        anchorY="middle"
      >
        {`BLOCK ${id} [${id * 4 + 3}:${id * 4}]`}
      </Text>

      {/* Dynamic Telemetry Status Badge */}
      <Text
        position={[0, 0.32, 0]}
        fontSize={0.11}
        color={isSkipActive ? '#FF7A00' : '#00DF72'}
        anchorX="center"
        anchorY="middle"
      >
        {isSkipActive ? '⚡ BYPASS (SKIP)' : '🔗 RIPPLE CARRY'}
      </Text>
    </group>
  )
}

// -------------------------------------------------------------
// The 7 Semiconductor Layers (Physical Cross-Section Stack)
// -------------------------------------------------------------
function SemiconductorLayerStack({
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
  // Height multiplier for 7 distinct semiconductor levels
  // scale is 0.0 to 1.0 based on explosionDistance (0 to 100)
  const s = explosionDistance / 100

  // Vertical offsets for each layer
  const ySubstrate = 0.05
  const ySTI = ySubstrate + 0.25 + s * 0.65
  const yPoly = ySTI + 0.25 + s * 0.75
  const yM1 = yPoly + 0.28 + s * 0.85
  const yM2 = yM1 + 0.28 + s * 0.95
  const yM3 = yM2 + 0.28 + s * 1.05
  const yLid = yM3 + 0.35 + s * 1.25

  return (
    <group>
      {/* -------------------------------------------------------
          LAYER 7: BULK SILICON SUBSTRATE
          Monocrystalline Silicon Wafer Base with Gold Backing
      -------------------------------------------------------- */}
      {visibility.substrate && (
        <group position={[0, ySubstrate, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[9.4, 0.3, 5.8]} />
            <meshStandardMaterial
              color="#0A101D"
              metalness={0.94}
              roughness={0.18}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>
          {/* Gold Wafer Backing Contact */}
          <mesh position={[0, -0.16, 0]}>
            <boxGeometry args={[9.42, 0.02, 5.82]} />
            <meshStandardMaterial color="#FFD700" metalness={0.98} roughness={0.1} />
          </mesh>
          {/* Wafer Grid Lines */}
          <gridHelper args={[9.4, 18, '#00F0FF', '#1E293B']} position={[0, 0.16, 0]} />

          {/* 3D Layer Tag Label */}
          {s > 0.15 && (
            <Text
              position={[-5.2, 0.1, 0]}
              rotation={[0, 0, 0]}
              fontSize={0.18}
              color="#64748B"
              anchorX="right"
              anchorY="middle"
            >
              L7: BULK SILICON SUBSTRATE (Wafer Base)
            </Text>
          )}
        </group>
      )}

      {/* -------------------------------------------------------
          LAYER 6: STI / WELL ISOLATION LAYER
          Shallow Trench Isolation & N-Well / P-Substrate Barriers
      -------------------------------------------------------- */}
      {visibility.sti && (
        <group position={[0, ySTI, 0]}>
          <mesh>
            <boxGeometry args={[8.8, 0.12, 5.2]} />
            <meshStandardMaterial
              color="#1E1B4B"
              metalness={0.7}
              roughness={0.3}
              transparent
              opacity={renderMode === 'transparent' ? 0.35 : 0.8}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>
          {/* N-Well Stripe Visualizers */}
          {[-2.8, -0.9, 1.0, 2.9].map((wx, idx) => (
            <mesh key={idx} position={[wx, 0.07, 0]}>
              <boxGeometry args={[1.5, 0.03, 4.8]} />
              <meshStandardMaterial
                color="#4338CA"
                emissive="#312E81"
                emissiveIntensity={0.4}
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
          {s > 0.15 && (
            <Text
              position={[-5.2, 0.05, 0]}
              fontSize={0.18}
              color="#818CF8"
              anchorX="right"
              anchorY="middle"
            >
              L6: STI / N-WELL ISOLATION (CMOS Boundaries)
            </Text>
          )}
        </group>
      )}

      {/* -------------------------------------------------------
          LAYER 5: ACTIVE / POLYSILICON LAYER
          Contains the 4 CSKA Blocks, 16 FAs, AND4, & MUX Standard Cells
      -------------------------------------------------------- */}
      {visibility.poly && (
        <group position={[0, yPoly, 0]}>
          {/* Active Die Bounding Outline */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[8.6, 0.08, 5.0]} />
            <meshStandardMaterial
              color="#050B14"
              metalness={0.92}
              roughness={0.15}
              transparent={renderMode === 'transparent'}
              opacity={renderMode === 'transparent' ? 0.35 : 0.9}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>

          {/* Four 4-Bit CSKA Functional Blocks */}
          <DetailedCSKABlock
            id={0}
            position={[-3.3, 0.05, 0]}
            explodedY={0}
            isSelected={activeBlock === 0}
            onSelect={() => onSelectBlock(0)}
            isSkipActive={Boolean(telemetry?.blocks?.[0]?.skip_active)}
            blockData={telemetry?.blocks?.[0]}
            simulating={simulating}
            renderMode={renderMode}
          />
          <DetailedCSKABlock
            id={1}
            position={[-1.1, 0.05, 0]}
            explodedY={0}
            isSelected={activeBlock === 1}
            onSelect={() => onSelectBlock(1)}
            isSkipActive={Boolean(telemetry?.blocks?.[1]?.skip_active)}
            blockData={telemetry?.blocks?.[1]}
            simulating={simulating}
            renderMode={renderMode}
          />
          <DetailedCSKABlock
            id={2}
            position={[1.1, 0.05, 0]}
            explodedY={0}
            isSelected={activeBlock === 2}
            onSelect={() => onSelectBlock(2)}
            isSkipActive={Boolean(telemetry?.blocks?.[2]?.skip_active)}
            blockData={telemetry?.blocks?.[2]}
            simulating={simulating}
            renderMode={renderMode}
          />
          <DetailedCSKABlock
            id={3}
            position={[3.3, 0.05, 0]}
            explodedY={0}
            isSelected={activeBlock === 3}
            onSelect={() => onSelectBlock(3)}
            isSkipActive={Boolean(telemetry?.blocks?.[3]?.skip_active)}
            blockData={telemetry?.blocks?.[3]}
            simulating={simulating}
            renderMode={renderMode}
          />

          {s > 0.15 && (
            <Text
              position={[-5.2, 0.1, 0]}
              fontSize={0.18}
              color="#00DF72"
              anchorX="right"
              anchorY="middle"
            >
              L5: ACTIVE & POLYSILICON (56 Standard Cells)
            </Text>
          )}
        </group>
      )}

      {/* -------------------------------------------------------
          LAYER 4: METAL-1 LOCAL INTERCONNECT
          Standard Cell Pin Access & Fine Local Interconnect
      -------------------------------------------------------- */}
      {visibility.m1 && (
        <group position={[0, yM1, 0]}>
          <mesh>
            <boxGeometry args={[8.4, 0.06, 4.8]} />
            <meshStandardMaterial
              color="#0F172A"
              metalness={0.9}
              roughness={0.2}
              transparent
              opacity={renderMode === 'transparent' ? 0.2 : 0.65}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>
          {/* Dense Local M1 Wiring Strips */}
          {[-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map((mx, idx) => (
            <mesh key={idx} position={[mx, 0.04, 0]}>
              <boxGeometry args={[0.08, 0.02, 4.4]} />
              <meshStandardMaterial
                color="#38BDF8"
                metalness={0.95}
                roughness={0.1}
                emissive="#0284C7"
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}
          {s > 0.15 && (
            <Text
              position={[-5.2, 0.05, 0]}
              fontSize={0.18}
              color="#38BDF8"
              anchorX="right"
              anchorY="middle"
            >
              L4: METAL-1 (Local Cell Pin Routing)
            </Text>
          )}
        </group>
      )}

      {/* -------------------------------------------------------
          LAYER 3: METAL-2 INTERMEDIATE SIGNAL ROUTING
          Inter-Block Ripple Lines & 4 Carry-Skip Highway Tracks
      -------------------------------------------------------- */}
      {visibility.m2 && (
        <group position={[0, yM2, 0]}>
          <mesh>
            <boxGeometry args={[8.4, 0.06, 4.8]} />
            <meshStandardMaterial
              color="#0B132B"
              metalness={0.9}
              roughness={0.2}
              transparent
              opacity={renderMode === 'transparent' ? 0.25 : 0.65}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>
          {/* Orthogonal M2 Traces */}
          {[-1.6, -0.8, 0, 0.8, 1.6].map((mz, idx) => {
            const isSkipRoute = idx === 1 || idx === 3
            const color = isSkipRoute ? '#FF7A00' : '#00F0FF'
            return (
              <mesh key={idx} position={[0, 0.04, mz]}>
                <boxGeometry args={[7.8, 0.04, 0.12]} />
                <meshStandardMaterial
                  color={color}
                  metalness={0.95}
                  roughness={0.1}
                  emissive={color}
                  emissiveIntensity={isSkipRoute ? 0.85 : 0.5}
                />
              </mesh>
            )
          })}
          {s > 0.15 && (
            <Text
              position={[-5.2, 0.05, 0]}
              fontSize={0.18}
              color="#00F0FF"
              anchorX="right"
              anchorY="middle"
            >
              L3: METAL-2 (Skip Bypass & Signal Routing)
            </Text>
          )}
        </group>
      )}

      {/* -------------------------------------------------------
          LAYER 2: METAL-3 POWER & GLOBAL HIGHWAY GRID
          Thick Copper VDD/VSS Power Rails & Global Inter-Block Busses
      -------------------------------------------------------- */}
      {visibility.m3 && (
        <group position={[0, yM3, 0]}>
          <mesh>
            <boxGeometry args={[8.4, 0.08, 4.8]} />
            <meshStandardMaterial
              color="#1C1917"
              metalness={0.85}
              roughness={0.3}
              transparent
              opacity={renderMode === 'transparent' ? 0.3 : 0.7}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>
          {/* Thick Copper Power Stripes */}
          {[-3.0, -1.0, 1.0, 3.0].map((px, idx) => (
            <mesh key={idx} position={[px, 0.05, 0]}>
              <boxGeometry args={[0.35, 0.04, 4.6]} />
              <meshStandardMaterial
                color="#FB923C"
                metalness={0.96}
                roughness={0.1}
                emissive="#C2410C"
                emissiveIntensity={0.6}
              />
            </mesh>
          ))}
          {s > 0.15 && (
            <Text
              position={[-5.2, 0.06, 0]}
              fontSize={0.18}
              color="#FB923C"
              anchorX="right"
              anchorY="middle"
            >
              L2: METAL-3 (VDD/VSS Power Grid & Highway)
            </Text>
          )}
        </group>
      )}

      {/* -------------------------------------------------------
          LAYER 1: PACKAGE LID / PASSIVATION
          Brushed Aluminum/Nickel Heat Spreader with Laser Markings
      -------------------------------------------------------- */}
      {visibility.lid && (
        <group position={[0, yLid, 0]}>
          {/* Main Metallic Heat-Spreader Plate */}
          <mesh>
            <boxGeometry args={[9.2, 0.14, 5.6]} />
            <meshStandardMaterial
              color="#1E293B"
              metalness={0.96}
              roughness={0.12}
              transparent={s > 0.05 || renderMode === 'transparent'}
              opacity={s > 0.05 ? 0.45 : renderMode === 'transparent' ? 0.35 : 0.98}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>

          {/* Chamfered Outer Bevel Border */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[9.0, 0.04, 5.4]} />
            <meshStandardMaterial
              color="#0F172A"
              metalness={0.9}
              roughness={0.2}
              transparent={s > 0.05}
              opacity={s > 0.05 ? 0.4 : 1}
            />
          </mesh>

          {/* Pin 1 Index Dot Indentation */}
          <mesh position={[-4.0, 0.11, -2.2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} />
            <meshStandardMaterial color="#FFD700" metalness={0.98} roughness={0.1} />
          </mesh>

          {/* Laser-Etched Package Typography */}
          <Text
            position={[0, 0.12, -0.4]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.36}
            color="#00F0FF"
            anchorX="center"
            anchorY="middle"
          >
            CYBERCORE • CSKA-16
          </Text>

          <Text
            position={[0, 0.12, 0.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.18}
            color="#94A3B8"
            anchorX="center"
            anchorY="middle"
          >
            SKYWATER 130nm HIGH-DENSITY ASIC
          </Text>

          <Text
            position={[0, 0.12, 0.9]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.14}
            color="#FF7A00"
            anchorX="center"
            anchorY="middle"
          >
            DIE: 45.0 × 35.0 µm • 56 CELLS (HIERARCHICAL)
          </Text>

          {s > 0.15 && (
            <Text
              position={[-5.2, 0.1, 0]}
              fontSize={0.18}
              color="#E2E8F0"
              anchorX="right"
              anchorY="middle"
            >
              L1: PACKAGE LID / PASSIVATION (Heat Spreader)
            </Text>
          )}
        </group>
      )}
    </group>
  )
}

// -------------------------------------------------------------
// Camera Angle Controller Helper
// -------------------------------------------------------------
function CameraPresetController({
  viewPreset,
  controlsRef
}: {
  viewPreset: 'iso' | 'top' | 'front' | 'side'
  controlsRef: React.RefObject<any>
}) {
  const { camera } = useThree()

  useEffect(() => {
    if (!controlsRef.current) return

    if (viewPreset === 'iso') {
      camera.position.set(0, 9, 12)
      controlsRef.current.target.set(0, 1, 0)
    } else if (viewPreset === 'top') {
      camera.position.set(0, 16, 0.01)
      controlsRef.current.target.set(0, 0, 0)
    } else if (viewPreset === 'front') {
      camera.position.set(0, 2, 14)
      controlsRef.current.target.set(0, 1, 0)
    } else if (viewPreset === 'side') {
      camera.position.set(15, 2, 0)
      controlsRef.current.target.set(0, 1, 0)
    }
    controlsRef.current.update()
  }, [viewPreset, camera, controlsRef])

  return null
}

// -------------------------------------------------------------
// Complete 3D Scene Root
// -------------------------------------------------------------
function StudioScene({
  exploded,
  activeBlock,
  onSelectBlock,
  telemetry,
  simulating,
  explosionDistance,
  visibility,
  renderMode,
  viewPreset,
  controlsRef
}: Chip3DProps & {
  visibility: LayerVisibility
  renderMode: 'solid' | 'transparent' | 'wireframe'
  viewPreset: 'iso' | 'top' | 'front' | 'side'
  controlsRef: React.RefObject<any>
}) {
  return (
    <>
      <CameraPresetController viewPreset={viewPreset} controlsRef={controlsRef} />

      {/* Realistic Multi-Point Studio Lighting */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[12, 18, 12]} intensity={1.8} castShadow />
      <directionalLight position={[-12, 14, -10]} intensity={0.9} color="#00F0FF" />
      <pointLight position={[0, 6, 0]} intensity={1.2} color="#FFFFFF" />
      <pointLight position={[-8, -2, 6]} intensity={0.8} color="#FF7A00" />
      <pointLight position={[8, -2, -6]} intensity={0.8} color="#00DF72" />

      {/* Futuristic PCB Motherboard Base */}
      <mesh position={[0, -0.65, 0]} receiveShadow>
        <boxGeometry args={[16, 0.2, 11]} />
        <meshStandardMaterial color="#060A14" roughness={0.65} metalness={0.4} />
      </mesh>

      {/* PCB Circuit Traces Ground Plane */}
      <gridHelper args={[16, 32, '#00F0FF', '#0F1E36']} position={[0, -0.54, 0]} />

      {/* IC Package Ceramic Substrate */}
      <mesh position={[0, -0.22, 0]}>
        <boxGeometry args={[11.2, 0.38, 7.6]} />
        <meshStandardMaterial color="#0B101D" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Gold Cavity Bond Ring */}
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[9.8, 0.04, 6.2]} />
        <meshStandardMaterial color="#FFD700" metalness={0.98} roughness={0.12} />
      </mesh>

      {/* Package Lead Pins & BGA Matrix */}
      <PackageInterconnects />

      {/* Gold Wire-Bonds Linking Die to Package */}
      <WireBonds explodedOffset={explosionDistance} />

      {/* The 7 Semiconductor Layers */}
      <SemiconductorLayerStack
        explosionDistance={explosionDistance}
        visibility={visibility}
        activeBlock={activeBlock}
        onSelectBlock={onSelectBlock}
        telemetry={telemetry}
        simulating={simulating}
        renderMode={renderMode}
      />

      {/* Interactive Orbit Controls with Smooth Damping */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.06}
        minDistance={4}
        maxDistance={28}
        maxPolarAngle={Math.PI / 2 + 0.08}
      />
    </>
  )
}

// -------------------------------------------------------------
// Main Exported Chip3D Component with Full Studio HUD Controls
// -------------------------------------------------------------
export default function Chip3D(props: Chip3DProps) {
  const [explosionDistance, setExplosionDistance] = useState<number>(
    props.exploded ? 70 : 0
  )
  const [renderMode, setRenderMode] = useState<'solid' | 'transparent' | 'wireframe'>('solid')
  const [viewPreset, setViewPreset] = useState<'iso' | 'top' | 'front' | 'side'>('iso')
  const [visibility, setVisibility] = useState<LayerVisibility>({
    lid: true,
    m3: true,
    m2: true,
    m1: true,
    poly: true,
    sti: true,
    substrate: true
  })
  const [showLayerDrawer, setShowLayerDrawer] = useState<boolean>(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controlsRef = useRef<any>(null)

  // Sync external exploded prop
  useEffect(() => {
    setExplosionDistance(props.exploded ? 75 : 0)
  }, [props.exploded])

  const toggleLayer = (key: keyof LayerVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Snapshot PNG Exporter
  const handleExportSnapshot = () => {
    const canvas = document.querySelector('#cybercore-3d-canvas canvas') as HTMLCanvasElement
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `CYBERCORE_CSKA16_3D_${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden glass-panel relative flex flex-col border border-[#00F0FF]/25 shadow-2xl">
      {/* Top 3D Studio Control Bar */}
      <div className="px-5 py-3 border-b border-[#1E293B] bg-[#070D1A]/95 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-widest text-white glow-cyan">
              3D SEMICONDUCTOR STUDIO
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
            SKY130HD 130nm ASIC
          </span>
        </div>

        {/* View Controls & Action Buttons */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          {/* Camera Angles */}
          <div className="flex items-center bg-[#090F1E] rounded-lg p-0.5 border border-[#1E293B]">
            {[
              { id: 'iso', label: 'ISO' },
              { id: 'top', label: 'TOP' },
              { id: 'front', label: 'FRONT' },
              { id: 'side', label: 'SIDE' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setViewPreset(p.id as any)}
                className={`px-2.5 py-1 rounded transition text-[11px] font-bold ${
                  viewPreset === p.id
                    ? 'bg-[#00F0FF] text-black shadow-md shadow-[#00F0FF]/20'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Render Mode Toggle */}
          <div className="flex items-center bg-[#090F1E] rounded-lg p-0.5 border border-[#1E293B]">
            {[
              { id: 'solid', label: 'SOLID' },
              { id: 'transparent', label: 'X-RAY' },
              { id: 'wireframe', label: 'WIRE' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setRenderMode(m.id as any)}
                className={`px-2 py-1 rounded transition text-[11px] font-bold ${
                  renderMode === m.id
                    ? 'bg-[#FF7A00] text-black shadow-md shadow-[#FF7A00]/20'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Layer Visibility Drawer Button */}
          <button
            onClick={() => setShowLayerDrawer(!showLayerDrawer)}
            className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition ${
              showLayerDrawer
                ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]'
                : 'bg-[#0A101D] text-[#94A3B8] border-[#1E293B] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>LAYERS ({Object.values(visibility).filter(Boolean).length}/7)</span>
          </button>

          {/* Snapshot Exporter */}
          <button
            onClick={handleExportSnapshot}
            title="Export High-Res 3D Snapshot (PNG)"
            className="p-1.5 rounded-lg bg-[#0A101D] border border-[#1E293B] text-[#94A3B8] hover:text-[#00F0FF] hover:border-[#00F0FF]/40 transition"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 3D Viewport Area */}
      <div id="cybercore-3d-canvas" className="w-full h-[580px] relative bg-[#050811] overflow-hidden">
        <Canvas
          shadows
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
          camera={{ position: [0, 9, 12], fov: 42 }}
        >
          <StudioScene
            {...props}
            explosionDistance={explosionDistance}
            visibility={visibility}
            renderMode={renderMode}
            viewPreset={viewPreset}
            controlsRef={controlsRef}
          />
        </Canvas>

        {/* Floating Layer Visibility Drawer */}
        {showLayerDrawer && (
          <div className="absolute top-4 right-4 w-72 glass-panel p-4 rounded-xl border border-[#00F0FF]/30 shadow-2xl z-20 space-y-3 font-mono text-xs animate-in fade-in slide-in-from-right-4 duration-200">
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
                { key: 'lid', name: 'L1: Package Lid / Heat Spreader', color: '#E2E8F0' },
                { key: 'm3', name: 'L2: Metal-3 (Power & Highway)', color: '#FB923C' },
                { key: 'm2', name: 'L3: Metal-2 (Signal & Bypass)', color: '#00F0FF' },
                { key: 'm1', name: 'L4: Metal-1 (Cell Local Pins)', color: '#38BDF8' },
                { key: 'poly', name: 'L5: Active & Polysilicon (56 Cells)', color: '#00DF72' },
                { key: 'sti', name: 'L6: STI / N-Well Isolation', color: '#818CF8' },
                { key: 'substrate', name: 'L7: Bulk Silicon Substrate', color: '#94A3B8' }
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
                    {isVisible ? (
                      <Eye className="w-3.5 h-3.5 text-[#00F0FF]" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-[#64748B]" />
                    )}
                  </div>
                )
              })}
            </div>

            <div className="pt-2 border-t border-[#1E293B] flex space-x-2">
              <button
                onClick={() =>
                  setVisibility({
                    lid: true,
                    m3: true,
                    m2: true,
                    m1: true,
                    poly: true,
                    sti: true,
                    substrate: true
                  })
                }
                className="flex-1 py-1 rounded bg-[#0F172A] border border-[#1E293B] text-[10px] text-[#00F0FF] hover:bg-[#00F0FF]/10 transition"
              >
                SHOW ALL
              </button>
              <button
                onClick={() =>
                  setVisibility({
                    lid: false,
                    m3: false,
                    m2: true,
                    m1: true,
                    poly: true,
                    sti: false,
                    substrate: true
                  })
                }
                className="flex-1 py-1 rounded bg-[#0F172A] border border-[#1E293B] text-[10px] text-[#FF7A00] hover:bg-[#FF7A00]/10 transition"
              >
                CORE LOGIC
              </button>
            </div>
          </div>
        )}

        {/* Bottom HUD Overlay: Continuous Explosion Slider */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Explosion Distance Slider */}
          <div className="glass-card px-4 py-2 pointer-events-auto flex items-center space-x-3 border border-[#00F0FF]/30">
            <span className="text-[11px] font-mono font-bold text-[#00F0FF] flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>EXPLOSION:</span>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={explosionDistance}
              onChange={(e) => setExplosionDistance(parseInt(e.target.value))}
              className="w-32 sm:w-48 accent-[#00F0FF] cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-white w-10 text-right">
              {explosionDistance}%
            </span>
            <button
              onClick={() => setExplosionDistance(explosionDistance > 0 ? 0 : 75)}
              className="px-2 py-0.5 rounded bg-[#1E293B] hover:bg-[#334155] text-[10px] font-mono text-[#E2E8F0] transition"
            >
              {explosionDistance > 0 ? 'REASSEMBLE' : 'EXPLODE'}
            </button>
          </div>

          {/* Interactive Legend Pills */}
          <div className="glass-card px-4 py-2 pointer-events-auto flex items-center space-x-3 text-xs font-mono border border-[#1E293B]">
            <span className="flex items-center space-x-1.5 text-[#00F0FF]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF]"></span>
              <span>Ripple Carry</span>
            </span>
            <span className="flex items-center space-x-1.5 text-[#FF7A00]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A00] animate-pulse"></span>
              <span>Skip Bypass Highway</span>
            </span>
            <span className="flex items-center space-x-1.5 text-[#00DF72]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00DF72]"></span>
              <span>Active Gate</span>
            </span>
          </div>
        </div>

        {/* Viewport Nav Hint */}
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] font-mono text-[#64748B] flex items-center space-x-1.5">
          <Compass className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>Rotate: Left Drag • Zoom: Scroll • Pan: Right Drag</span>
        </div>
      </div>
    </div>
  )
}
