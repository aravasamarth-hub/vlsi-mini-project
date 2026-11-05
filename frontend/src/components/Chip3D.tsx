import React, { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Billboard, Line } from '@react-three/drei'
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
  Compass,
  Focus
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

// ----------------------------------------------------------------------
// Package Cavity Gold Wire-Bond Loops
// Fixed to die & substrate perimeter - never stretched into the sky
// ----------------------------------------------------------------------
function CavityWireBonds({ visible }: { visible: boolean }) {
  const bondCurves = useMemo(() => {
    if (!visible) return []
    const curves: THREE.Vector3[][] = []
    const countX = 8
    const countZ = 5

    // North side bonds (die edge to package cavity finger)
    for (let i = 0; i < countX; i++) {
      const x = -3.4 + (i * 6.8) / (countX - 1)
      const diePt = new THREE.Vector3(x, 0.16, 1.85)
      const pkgPt = new THREE.Vector3(x * 1.15, 0.04, 2.5)
      const archPt = new THREE.Vector3(x * 1.05, 0.32, 2.15)
      const curve = new THREE.QuadraticBezierCurve3(diePt, archPt, pkgPt)
      curves.push(curve.getPoints(10))
    }

    // South side bonds
    for (let i = 0; i < countX; i++) {
      const x = -3.4 + (i * 6.8) / (countX - 1)
      const diePt = new THREE.Vector3(x, 0.16, -1.85)
      const pkgPt = new THREE.Vector3(x * 1.15, 0.04, -2.5)
      const archPt = new THREE.Vector3(x * 1.05, 0.32, -2.15)
      const curve = new THREE.QuadraticBezierCurve3(diePt, archPt, pkgPt)
      curves.push(curve.getPoints(10))
    }

    // East side bonds
    for (let i = 0; i < countZ; i++) {
      const z = -1.4 + (i * 2.8) / (countZ - 1)
      const diePt = new THREE.Vector3(3.65, 0.16, z)
      const pkgPt = new THREE.Vector3(4.35, 0.04, z * 1.12)
      const archPt = new THREE.Vector3(3.98, 0.32, z * 1.05)
      const curve = new THREE.QuadraticBezierCurve3(diePt, archPt, pkgPt)
      curves.push(curve.getPoints(10))
    }

    // West side bonds
    for (let i = 0; i < countZ; i++) {
      const z = -1.4 + (i * 2.8) / (countZ - 1)
      const diePt = new THREE.Vector3(-3.65, 0.16, z)
      const pkgPt = new THREE.Vector3(-4.35, 0.04, z * 1.12)
      const archPt = new THREE.Vector3(-3.98, 0.32, z * 1.05)
      const curve = new THREE.QuadraticBezierCurve3(diePt, archPt, pkgPt)
      curves.push(curve.getPoints(10))
    }

    return curves
  }, [visible])

  if (!visible) return null

  return (
    <group>
      {bondCurves.map((pts, idx) => (
        <Line
          key={idx}
          points={pts}
          color="#FFD700"
          lineWidth={1.6}
          transparent
          opacity={0.9}
        />
      ))}
    </group>
  )
}

// ----------------------------------------------------------------------
// Inter-Layer Vertical Conductive Vias / Contact Plugs
// Realistic cylindrical metal pillars connecting layer planes
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

  // Defined via coordinates along block boundaries
  const viaCoords = [
    [-3.0, -1.2], [-1.0, -1.2], [1.0, -1.2], [3.0, -1.2],
    [-3.0, 1.2], [-1.0, 1.2], [1.0, 1.2], [3.0, 1.2],
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
              metalness={0.92}
              roughness={0.2}
              emissive={color}
              emissiveIntensity={0.2}
            />
          </mesh>
          <mesh position={[0, -height / 2, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.015, 10]} />
            <meshStandardMaterial color={color} metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0, height / 2, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.015, 10]} />
            <meshStandardMaterial color={color} metalness={0.95} roughness={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ----------------------------------------------------------------------
// Corner Alignment Fiducial Guide Lasers
// Keeps exploded layers visually anchored to common vertical axis
// ----------------------------------------------------------------------
function CentralAxisFiducials({
  yBottom,
  yTop,
  active
}: {
  yBottom: number
  yTop: number
  active: boolean
}) {
  if (!active || yTop - yBottom < 0.2) return null

  const corners = [
    [-4.3, -2.7],
    [4.3, -2.7],
    [4.3, 2.7],
    [-4.3, 2.7]
  ]

  return (
    <group>
      {corners.map(([cx, cz], idx) => {
        const pts = [
          new THREE.Vector3(cx, yBottom, cz),
          new THREE.Vector3(cx, yTop, cz)
        ]
        return (
          <Line
            key={idx}
            points={pts}
            color="#00F0FF"
            lineWidth={0.8}
            dashed
            dashScale={12}
            dashSize={0.1}
            gapSize={0.06}
            transparent
            opacity={0.35}
          />
        )
      })}
    </group>
  )
}

// ----------------------------------------------------------------------
// Detailed 4-Bit CSKA Block in 3D
// Realistic standard-cell layout with Full Adders, AND4, and 2:1 MUX
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

  // Dynamic signal photon pulse along the active route
  useFrame((state) => {
    if (pulseRef.current && (simulating || isSkipActive)) {
      const t = (state.clock.getElapsedTime() * 3 + id * 0.8) % 2.4
      if (isSkipActive) {
        pulseRef.current.position.set(0, 0.22, -0.55 + t * 0.45)
      } else {
        pulseRef.current.position.set(-0.6 + t * 0.5, 0.18, 0.15)
      }
    }
  })

  // Material colors
  const blockWellColor = isSelected
    ? '#1E3A5F'
    : hovered
    ? '#182C48'
    : '#121F35'

  const blockBorderColor = isSkipActive
    ? '#FF7A00'
    : isSelected
    ? '#00F0FF'
    : hovered
    ? '#38BDF8'
    : '#25354F'

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 4-Bit Core Silicon Well Block */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.82, 0.12, 1.42]} />
        <meshStandardMaterial
          color={blockWellColor}
          metalness={0.8}
          roughness={0.25}
          wireframe={renderMode === 'wireframe'}
        />
      </mesh>

      {/* Block Perimeter Scribe Frame / Boundary */}
      <mesh position={[0, 0.115, 0]}>
        <boxGeometry args={[1.84, 0.015, 1.44]} />
        <meshStandardMaterial
          color={blockBorderColor}
          metalness={0.9}
          roughness={0.2}
          emissive={isSkipActive ? '#FF6600' : isSelected ? '#00A3FF' : '#051020'}
          emissiveIntensity={isSkipActive ? 0.8 : isSelected ? 0.5 : 0.1}
        />
      </mesh>

      {/* Four Individual Full Adder Cells (FA0, FA1, FA2, FA3) */}
      {[-0.58, -0.19, 0.19, 0.58].map((xOff, faIdx) => {
        const pBit = blockData?.p_bits?.[faIdx]
        const bitIndex = id * 4 + faIdx
        const faColor = isSkipActive ? '#E68A00' : '#00D4E6'

        return (
          <group key={faIdx} position={[xOff, 0.12, 0.15]}>
            <mesh>
              <boxGeometry args={[0.34, 0.09, 0.68]} />
              <meshStandardMaterial
                color={faColor}
                metalness={0.88}
                roughness={0.2}
                emissive={isSkipActive ? '#FF6600' : '#0088AA'}
                emissiveIntensity={pBit ? 0.65 : 0.2}
                wireframe={renderMode === 'wireframe'}
              />
            </mesh>

            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[0.26, 0.015, 0.54]} />
              <meshStandardMaterial
                color="#061224"
                metalness={0.95}
                roughness={0.1}
              />
            </mesh>

            {faIdx < 3 && (
              <mesh position={[0.19, 0.02, 0]}>
                <boxGeometry args={[0.1, 0.03, 0.05]} />
                <meshStandardMaterial
                  color="#00F0FF"
                  emissive="#00F0FF"
                  emissiveIntensity={0.85}
                />
              </mesh>
            )}

            <Billboard follow={true} position={[0, 0.16, 0]}>
              <Text
                fontSize={0.075}
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
              >
                {`FA${faIdx}`}
              </Text>
            </Billboard>
          </group>
        )
      })}

      {/* 4-Input AND Group Propagate Gate */}
      <group position={[-0.42, 0.12, -0.42]}>
        <mesh>
          <boxGeometry args={[0.54, 0.08, 0.32]} />
          <meshStandardMaterial
            color={blockData?.p_group ? '#00DF72' : '#2A374A'}
            metalness={0.9}
            roughness={0.2}
            emissive={blockData?.p_group ? '#00DF72' : '#0B1320'}
            emissiveIntensity={blockData?.p_group ? 0.9 : 0.1}
            wireframe={renderMode === 'wireframe'}
          />
        </mesh>
        <Billboard follow={true} position={[0, 0.12, 0]}>
          <Text
            fontSize={0.065}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            AND4:Pgrp
          </Text>
        </Billboard>
      </group>

      {/* 2:1 Carry Skip Multiplexer */}
      <group position={[0.52, 0.13, -0.42]}>
        <mesh>
          <boxGeometry args={[0.46, 0.1, 0.34]} />
          <meshStandardMaterial
            color={isSkipActive ? '#FF7A00' : '#00F0FF'}
            metalness={0.92}
            roughness={0.16}
            emissive={isSkipActive ? '#FF5500' : '#0088CC'}
            emissiveIntensity={0.85}
            wireframe={renderMode === 'wireframe'}
          />
        </mesh>
        <Billboard follow={true} position={[0, 0.13, 0]}>
          <Text
            fontSize={0.07}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            MUX2:1
          </Text>
        </Billboard>
      </group>

      {/* Dedicated Carry Skip Bypass Highway Trace */}
      <mesh position={[0, 0.16, -0.42]}>
        <boxGeometry args={[1.5, 0.035, 0.05]} />
        <meshStandardMaterial
          color={isSkipActive ? '#FF8800' : '#475569'}
          emissive={isSkipActive ? '#FF8800' : '#1E293B'}
          emissiveIntensity={isSkipActive ? 1.0 : 0.15}
        />
      </mesh>

      {/* Dynamic Animated Photon Pulse */}
      <mesh ref={pulseRef} position={[0, 0.22, -0.42]}>
        <sphereGeometry args={[0.065, 12, 12]} />
        <meshStandardMaterial
          color={isSkipActive ? '#FF7A00' : '#00F0FF'}
          emissive={isSkipActive ? '#FF7A00' : '#00F0FF'}
          emissiveIntensity={2.2}
        />
      </mesh>

      {/* Billboarded Block Title */}
      <Billboard follow={true} position={[0, 0.26, 0.6]}>
        <Text
          fontSize={0.11}
          color={isSelected ? '#00F0FF' : '#E2E8F0'}
          anchorX="center"
          anchorY="middle"
        >
          {`BLOCK ${id} [${id * 4 + 3}:${id * 4}]`}
        </Text>
      </Billboard>
    </group>
  )
}

// ----------------------------------------------------------------------
// Rebuilt Semiconductor Package & 7 Stacked Layers
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

  const ySubstrate = 0.08
  const ySTI = ySubstrate + 0.18 + s * 0.35
  const yPoly = ySTI + 0.18 + s * 0.45
  const yM1 = yPoly + 0.18 + s * 0.45
  const yM2 = yM1 + 0.18 + s * 0.45
  const yM3 = yM2 + 0.18 + s * 0.45
  const yLid = yM3 + 0.22 + s * 0.55

  return (
    <group>
      {/* Central Axis Alignment Fiducials */}
      <CentralAxisFiducials
        yBottom={ySubstrate}
        yTop={yLid}
        active={s > 0.1}
      />

      {/* L7: BULK SILICON SUBSTRATE */}
      {visibility.substrate && (
        <group position={[0, ySubstrate, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[9.2, 0.16, 5.8]} />
            <meshStandardMaterial
              color="#172235"
              metalness={0.82}
              roughness={0.3}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>

          <mesh position={[0, -0.085, 0]}>
            <boxGeometry args={[9.22, 0.012, 5.82]} />
            <meshStandardMaterial
              color="#FFD700"
              metalness={0.96}
              roughness={0.12}
            />
          </mesh>

          <gridHelper args={[9.2, 18, '#00F0FF', '#1E293B']} position={[0, 0.082, 0]} />
        </group>
      )}

      {s > 0.25 && visibility.substrate && visibility.sti && (
        <InterLayerVias yBottom={ySubstrate + 0.08} yTop={ySTI - 0.05} color="#475569" />
      )}

      {/* L6: STI / WELL ISOLATION LAYER */}
      {visibility.sti && (
        <group position={[0, ySTI, 0]}>
          <mesh>
            <boxGeometry args={[8.8, 0.1, 5.4]} />
            <meshStandardMaterial
              color="#1E234A"
              metalness={0.7}
              roughness={0.35}
              transparent
              opacity={renderMode === 'transparent' ? 0.35 : 0.82}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>

          {[-2.8, -0.9, 1.0, 2.9].map((wx, idx) => (
            <mesh key={idx} position={[wx, 0.052, 0]}>
              <boxGeometry args={[1.5, 0.02, 5.1]} />
              <meshStandardMaterial
                color="#3730A3"
                emissive="#1E1B4B"
                emissiveIntensity={0.5}
                transparent
                opacity={0.65}
              />
            </mesh>
          ))}
        </group>
      )}

      {s > 0.25 && visibility.sti && visibility.poly && (
        <InterLayerVias yBottom={ySTI + 0.05} yTop={yPoly - 0.05} color="#818CF8" />
      )}

      {/* L5: ACTIVE & POLYSILICON LAYER */}
      {visibility.poly && (
        <group position={[0, yPoly, 0]}>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[8.6, 0.08, 5.2]} />
            <meshStandardMaterial
              color="#0E192B"
              metalness={0.88}
              roughness={0.2}
              transparent={renderMode === 'transparent'}
              opacity={renderMode === 'transparent' ? 0.35 : 0.95}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>

          {/* Perimeter Gold Bond Pads Ring on Die Edge */}
          {[-3.8, -2.6, -1.4, -0.2, 1.0, 2.2, 3.4].map((px, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[px, 0.055, 2.35]}>
                <boxGeometry args={[0.18, 0.015, 0.18]} />
                <meshStandardMaterial color="#FFD700" metalness={0.96} roughness={0.12} />
              </mesh>
              <mesh position={[px, 0.055, -2.35]}>
                <boxGeometry args={[0.18, 0.015, 0.18]} />
                <meshStandardMaterial color="#FFD700" metalness={0.96} roughness={0.12} />
              </mesh>
            </React.Fragment>
          ))}

          {/* Four Distinct 4-Bit CSKA Functional Blocks */}
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

      {s > 0.25 && visibility.poly && visibility.m1 && (
        <InterLayerVias yBottom={yPoly + 0.08} yTop={yM1 - 0.04} color="#38BDF8" />
      )}

      {/* L4: METAL-1 LOCAL INTERCONNECT */}
      {visibility.m1 && (
        <group position={[0, yM1, 0]}>
          <mesh>
            <boxGeometry args={[8.4, 0.06, 5.0]} />
            <meshStandardMaterial
              color="#13213B"
              metalness={0.9}
              roughness={0.22}
              transparent
              opacity={renderMode === 'transparent' ? 0.2 : 0.65}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>

          {[-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map((mx, idx) => (
            <mesh key={idx} position={[mx, 0.035, 0]}>
              <boxGeometry args={[0.07, 0.015, 4.6]} />
              <meshStandardMaterial
                color="#38BDF8"
                metalness={0.95}
                roughness={0.1}
                emissive="#0284C7"
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}
        </group>
      )}

      {s > 0.25 && visibility.m1 && visibility.m2 && (
        <InterLayerVias yBottom={yM1 + 0.04} yTop={yM2 - 0.04} color="#00F0FF" />
      )}

      {/* L3: METAL-2 INTERMEDIATE SIGNAL ROUTING */}
      {visibility.m2 && (
        <group position={[0, yM2, 0]}>
          <mesh>
            <boxGeometry args={[8.4, 0.06, 5.0]} />
            <meshStandardMaterial
              color="#0F1C36"
              metalness={0.9}
              roughness={0.2}
              transparent
              opacity={renderMode === 'transparent' ? 0.25 : 0.65}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>

          {[-1.6, -0.8, 0, 0.8, 1.6].map((mz, idx) => {
            const isSkipRoute = idx === 1 || idx === 3
            const traceColor = isSkipRoute ? '#FF7A00' : '#00F0FF'
            return (
              <mesh key={idx} position={[0, 0.035, mz]}>
                <boxGeometry args={[7.8, 0.02, 0.1]} />
                <meshStandardMaterial
                  color={traceColor}
                  metalness={0.96}
                  roughness={0.1}
                  emissive={traceColor}
                  emissiveIntensity={isSkipRoute ? 0.9 : 0.5}
                />
              </mesh>
            )
          })}
        </group>
      )}

      {s > 0.25 && visibility.m2 && visibility.m3 && (
        <InterLayerVias yBottom={yM2 + 0.04} yTop={yM3 - 0.04} color="#B87333" />
      )}

      {/* L2: METAL-3 POWER & GLOBAL HIGHWAY GRID */}
      {visibility.m3 && (
        <group position={[0, yM3, 0]}>
          <mesh>
            <boxGeometry args={[8.4, 0.08, 5.0]} />
            <meshStandardMaterial
              color="#1B1716"
              metalness={0.88}
              roughness={0.25}
              transparent
              opacity={renderMode === 'transparent' ? 0.28 : 0.7}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>

          {[-3.0, -1.0, 1.0, 3.0].map((px, idx) => (
            <mesh key={idx} position={[px, 0.045, 0]}>
              <boxGeometry args={[0.36, 0.025, 4.8]} />
              <meshStandardMaterial
                color="#C87D55"
                metalness={0.96}
                roughness={0.12}
                emissive="#9A3412"
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* L1: PACKAGE LID / PASSIVATION */}
      {visibility.lid && (
        <group position={[0, yLid, 0]}>
          {/* Main Heat Spreader Body: Solid when closed, translucent crystal when exploded */}
          <mesh>
            <boxGeometry args={[9.4, 0.14, 5.8]} />
            <meshStandardMaterial
              color={s > 0.05 ? '#38BDF8' : '#2A3B54'}
              metalness={0.9}
              roughness={0.15}
              transparent={s > 0.05 || renderMode === 'transparent'}
              opacity={s > 0.05 ? 0.22 : renderMode === 'transparent' ? 0.25 : 0.98}
              depthWrite={s <= 0.05}
              wireframe={renderMode === 'wireframe'}
            />
          </mesh>

          {/* Chamfered Beveled Rim */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[9.1, 0.03, 5.5]} />
            <meshStandardMaterial
              color={s > 0.05 ? '#00F0FF' : '#1C293C'}
              metalness={0.88}
              roughness={0.2}
              transparent={s > 0.05}
              opacity={s > 0.05 ? 0.45 : 1}
            />
          </mesh>

          {/* Gold Pin 1 Index Dot Indentation */}
          <mesh position={[-4.1, 0.1, -2.3]}>
            <cylinderGeometry args={[0.16, 0.16, 0.03, 16]} />
            <meshStandardMaterial color="#FFD700" metalness={0.98} roughness={0.1} />
          </mesh>

          {/* Laser-Engraved Identification Markings */}
          <Text
            position={[0, 0.105, -0.45]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.34}
            color="#00F0FF"
            anchorX="center"
            anchorY="middle"
          >
            CYBERCORE • CSKA-16
          </Text>

          <Text
            position={[0, 0.105, 0.25]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.18}
            color="#94A3B8"
            anchorX="center"
            anchorY="middle"
          >
            SKYWATER 130nm HIGH-DENSITY ASIC
          </Text>

          <Text
            position={[0, 0.105, 0.85]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.13}
            color="#FF7A00"
            anchorX="center"
            anchorY="middle"
          >
            DIE: 45.0 × 35.0 µm • 56 CELLS (HIERARCHICAL)
          </Text>
        </group>
      )}
    </group>
  )
}

// ----------------------------------------------------------------------
// Package Lead Pins & BGA Solder Balls
// ----------------------------------------------------------------------
function PackageSubstrateContacts() {
  const pinCount = 14
  const pins: JSX.Element[] = []

  for (let i = 0; i < pinCount; i++) {
    const x = -5.1 + (i * 10.2) / (pinCount - 1)
    pins.push(
      <mesh key={`p-n-${i}`} position={[x, -0.15, 3.8]}>
        <boxGeometry args={[0.26, 0.08, 0.7]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.96} roughness={0.12} />
      </mesh>,
      <mesh key={`p-s-${i}`} position={[x, -0.15, -3.8]}>
        <boxGeometry args={[0.26, 0.08, 0.7]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.96} roughness={0.12} />
      </mesh>
    )
  }

  for (let i = 0; i < 9; i++) {
    const z = -2.7 + (i * 5.4) / 8
    pins.push(
      <mesh key={`p-e-${i}`} position={[5.65, -0.15, z]}>
        <boxGeometry args={[0.7, 0.08, 0.26]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.96} roughness={0.12} />
      </mesh>,
      <mesh key={`p-w-${i}`} position={[-5.65, -0.15, z]}>
        <boxGeometry args={[0.7, 0.08, 0.26]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.96} roughness={0.12} />
      </mesh>
    )
  }

  const bgaBalls: JSX.Element[] = []
  for (let bx = -4.2; bx <= 4.2; bx += 0.84) {
    for (let bz = -2.5; bz <= 2.5; bz += 0.84) {
      if (Math.abs(bx) < 2.2 && Math.abs(bz) < 1.3) continue
      bgaBalls.push(
        <mesh key={`bga-${bx}-${bz}`} position={[bx, -0.38, bz]}>
          <sphereGeometry args={[0.09, 10, 10]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.94} roughness={0.14} />
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

// ----------------------------------------------------------------------
// Smooth Camera Controller with Lerp & User Drag Interruption Safety
// ----------------------------------------------------------------------
function CameraRig({
  viewPreset,
  activeBlock,
  controlsRef
}: {
  viewPreset: 'iso' | 'top' | 'front' | 'side'
  activeBlock: number | null
  controlsRef: React.RefObject<any>
}) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 8.5, 11.5))
  const targetLook = useRef(new THREE.Vector3(0, 0.6, 0))
  const isTransitioning = useRef<boolean>(false)

  // Trigger transition ONLY when preset or block selection changes
  useEffect(() => {
    if (!controlsRef.current) return

    const blockX = activeBlock === 0 ? -2.85 : activeBlock === 1 ? -0.95 : activeBlock === 2 ? 0.95 : activeBlock === 3 ? 2.85 : 0

    if (activeBlock !== null && activeBlock >= 0 && viewPreset === 'iso') {
      targetPos.current.set(blockX, 6.2, 8.2)
      targetLook.current.set(blockX, 0.7, 0)
    } else if (viewPreset === 'iso') {
      targetPos.current.set(0, 8.5, 11.5)
      targetLook.current.set(0, 0.6, 0)
    } else if (viewPreset === 'top') {
      targetPos.current.set(0, 14, 0.01)
      targetLook.current.set(0, 0, 0)
    } else if (viewPreset === 'front') {
      targetPos.current.set(0, 2.5, 12)
      targetLook.current.set(0, 1.0, 0)
    } else if (viewPreset === 'side') {
      targetPos.current.set(13, 2.5, 0)
      targetLook.current.set(0, 1.0, 0)
    }
    isTransitioning.current = true
  }, [viewPreset, activeBlock, controlsRef])

  // CRITICAL FIX: As soon as user touches/drags OrbitControls, cancel transition immediately!
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const handleUserInteraction = () => {
      isTransitioning.current = false
    }

    controls.addEventListener('start', handleUserInteraction)
    return () => {
      controls.removeEventListener('start', handleUserInteraction)
    }
  }, [controlsRef])

  useFrame(() => {
    if (controlsRef.current && isTransitioning.current) {
      camera.position.lerp(targetPos.current, 0.08)
      controlsRef.current.target.lerp(targetLook.current, 0.08)
      controlsRef.current.update()

      // When close enough to target, finish transition so user can orbit freely!
      if (camera.position.distanceTo(targetPos.current) < 0.05) {
        isTransitioning.current = false
      }
    }
  })

  return null
}

// ----------------------------------------------------------------------
// Complete Studio Scene
// ----------------------------------------------------------------------
function CompleteStudioScene({
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
      <CameraRig
        viewPreset={viewPreset}
        activeBlock={activeBlock}
        controlsRef={controlsRef}
      />

      {/* Realistic Multi-Point Studio Lighting */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[12, 18, 12]} intensity={1.9} castShadow />
      <directionalLight position={[-12, 14, -10]} intensity={0.9} color="#00F0FF" />
      <pointLight position={[0, 6, 0]} intensity={1.2} color="#FFFFFF" />
      <pointLight position={[-8, -2, 6]} intensity={0.9} color="#FF7A00" />
      <pointLight position={[8, -2, -6]} intensity={0.9} color="#00DF72" />

      {/* PCB Base Motherboard with Ground Plane */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <boxGeometry args={[16.5, 0.2, 11.5]} />
        <meshStandardMaterial color="#060A14" roughness={0.65} metalness={0.4} />
      </mesh>
      <gridHelper args={[16.5, 33, '#00F0FF', '#0F1E36']} position={[0, -0.49, 0]} />

      {/* IC Package Ceramic Substrate */}
      <mesh position={[0, -0.22, 0]}>
        <boxGeometry args={[11.2, 0.36, 7.6]} />
        <meshStandardMaterial color="#0E1626" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* Cavity Gold Ring */}
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[9.6, 0.03, 6.2]} />
        <meshStandardMaterial color="#FFD700" metalness={0.98} roughness={0.12} />
      </mesh>

      {/* Lead Pins & BGA Contacts */}
      <PackageSubstrateContacts />

      {/* Perimeter Gold Wire-Bonds (Attached to cavity rim, low explosion only) */}
      <CavityWireBonds visible={explosionDistance < 30} />

      {/* The 7 Physically Stacked & Exploded Semiconductor Layers */}
      <SemiconductorStack
        explosionDistance={explosionDistance}
        visibility={visibility}
        activeBlock={activeBlock}
        onSelectBlock={onSelectBlock}
        telemetry={telemetry}
        simulating={simulating}
        renderMode={renderMode}
      />

      {/* Orbit Controls with Damping & Smooth Freedom */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.06}
        minDistance={3.5}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2 + 0.15}
      />
    </>
  )
}

// ----------------------------------------------------------------------
// Main Exported Component
// ----------------------------------------------------------------------
export default function Chip3D(props: Chip3DProps) {
  const [explosionDistance, setExplosionDistance] = useState<number>(
    props.exploded ? 60 : 0
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
  const controlsRef = useRef<any>(null)

  // Sync external exploded prop
  useEffect(() => {
    setExplosionDistance(props.exploded ? 60 : 0)
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

  const handleResetCamera = () => {
    setViewPreset('iso')
    props.onSelectBlock(-1)
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
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

          {/* Reset Camera Button */}
          <button
            onClick={handleResetCamera}
            title="Reset View Angle & Focus"
            className="p-1.5 rounded-lg bg-[#0A101D] border border-[#1E293B] text-[#94A3B8] hover:text-[#00F0FF] transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Snapshot Exporter */}
          <button
            onClick={handleExportSnapshot}
            title="Export High-Res 3D Snapshot (PNG)"
            className="p-1.5 rounded-lg bg-[#0A101D] border border-[#1E293B] text-[#94A3B8] hover:text-[#00F0FF] transition"
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
          camera={{ position: [0, 8.5, 11.5], fov: 40 }}
        >
          <CompleteStudioScene
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
                { key: 'lid', name: 'L1: Package Lid / Passivation', color: '#E2E8F0' },
                { key: 'm3', name: 'L2: Metal-3 (Power & Highway)', color: '#C87D55' },
                { key: 'm2', name: 'L3: Metal-2 (Signal & Bypass)', color: '#00F0FF' },
                { key: 'm1', name: 'L4: Metal-1 (Cell Local Pins)', color: '#38BDF8' },
                { key: 'poly', name: 'L5: Active & Polysilicon (56 Cells)', color: '#00DF72' },
                { key: 'sti', name: 'L6: STI / Well Isolation', color: '#818CF8' },
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
              onClick={() => setExplosionDistance(explosionDistance > 0 ? 0 : 60)}
              className="px-2 py-0.5 rounded bg-[#1E293B] hover:bg-[#334155] text-[10px] font-mono text-[#E2E8F0] transition"
            >
              {explosionDistance > 0 ? 'REASSEMBLE' : 'EXPLODE'}
            </button>
          </div>

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
              <span>Active Logic</span>
            </span>
          </div>
        </div>

        {/* Viewport Nav Hint */}
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] font-mono text-[#64748B] flex items-center space-x-1.5">
          <Compass className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>Rotate: Left Drag • Zoom: Scroll • Pan: Right Drag • Click Block to Inspect</span>
        </div>
      </div>
    </div>
  )
}
