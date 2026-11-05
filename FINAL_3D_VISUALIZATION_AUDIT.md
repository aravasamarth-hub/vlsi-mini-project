# CYBERCORE 3D — FINAL 3D VISUALIZATION & INTERACTION AUDIT
## Photorealistic Three.js Semiconductor Lab and Controls Audit
**Component:** `frontend/src/components/Chip3D.tsx`  
**Engine:** Three.js + React Three Fiber + Drei OrbitControls  
**Live Viewport:** `http://localhost:3000` (Tab: 3D Chip Studio)  
**Audit Timestamp:** November 6, 2026  

---

## 1. 3D Architectural Design System

The 3D visualization is engineered to resemble an advanced semiconductor visualization laboratory:
- **Package Leadframe:** 40 realistic metallic gull-wing QFP pins (12 North, 12 South, 8 East, 8 West) with authentic horizontal leads, 45° bends, and solder feet fabricated from reflective gold material (`metalness: 0.98`, `roughness: 0.12`).
- **Substrate Pedestal:** Obsidian carbon pedestal with concentric glowing PCB routing tracks (cyan and electric blue) and 24 radial signal traces.
- **Seven-Layer Exploded Semiconductor Stack:**
  - **L1 (Passivation Lid):** Heavy titanium heat spreader with gold chamfered rim and laser-etched typography: `CYBERCORE • CSKA-16`.
  - **L2 (Metal-3 Power Grid):** Copper VDD/VSS power grid stripes (`#C87D55`).
  - **L3 (Metal-2 Interconnect):** Horizontal interconnect tracks featuring the dedicated glowing orange **Carry Skip Bypass Highway** (`#FF7A00`).
  - **L4 (Metal-1 Local Routing):** Local cell pin routing tracks in indigo/cyan (`#818CF8`).
  - **L5 (Active & Poly Standard Cells):** Standard-cell logic region with 4 distinct CSKA blocks featuring 3D Full Adders (`#047857`), AND4 Group Propagate gates (`#D97706`), and 2:1 Multiplexer Bypass gates (`#EA580C`). Dynamic photon pulses animate along active carry paths.
  - **L6 (STI / Well Isolation):** Translucent dielectric isolation trenches (`#1E234A`).
  - **L7 (Silicon Substrate):** Bulk p-type silicon wafer base with gold bond pad perimeter.

---

## 2. Camera Controls & Interaction Bug Resolution

### 2.1 The "Snapping Back" Issue
- **Symptom:** When a user attempted to rotate, pan, or zoom the 3D model, the camera continually jerked back to its original isometric position `(11.5, 9.5, 11.5)`.
- **Root Cause Identified:** In `CameraRig`, the `start` event listener was attached to `controlsRef.current` inside a `useEffect` watching `[controlsRef]`. Because `controlsRef.current` was `null` on mount, the event listener was never registered. Consequently, `isTransitioning.current` remained `true` indefinitely, and `useFrame` ran `camera.position.lerp(targetPos.current, 0.08)` on every frame, fighting the user's mouse drag.
- **Resolution Applied:**
  ```typescript
  // Listen directly on Three.js's gl.domElement:
  useEffect(() => {
    const dom = gl.domElement
    const stopTransition = () => { isTransitioning.current = false }
    dom.addEventListener('pointerdown', stopTransition)
    dom.addEventListener('wheel', stopTransition, { passive: true })
    dom.addEventListener('touchstart', stopTransition, { passive: true })
    return () => {
      dom.removeEventListener('pointerdown', stopTransition)
      dom.removeEventListener('wheel', stopTransition)
      dom.removeEventListener('touchstart', stopTransition)
    }
  }, [gl])
  ```
- **Verification:** User pointer down, scroll wheel, and touch gestures immediately cancel any automated camera transition. Drei's OrbitControls damping (`dampingFactor: 0.06`) operates with complete fluidity and zero snapback.

---

## 3. Educational 3D Model vs. Real GDSII Physical Layout

An essential academic boundary is enforced in the user interface:
- **3D Semiconductor Model (`Chip3D.tsx`):** An educational, exploded 3D representation designed to visualize layer stacks, pin leadframes, and conceptual carry-skip bypass pulses.
- **Physical Layout Viewer (`PhysicalDesignViewer.tsx`):** An accurate 2D CAD floorplan derived directly from `layout/cska_sky130.def` and `layout/cska_sky130.gds`, displaying the real 45 µm × 35 µm die, 9 cell rows, and legal standard-cell sites.
