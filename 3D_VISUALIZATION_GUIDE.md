# CYBERCORE 3D — VISUALIZATION & ARCHITECTURE GUIDE

**Application Name:** CYBERCORE 3D  
**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Technology Stack:** React 18, Three.js, React Three Fiber, Drei, Tailwind CSS, FastAPI, Icarus Verilog  

---

## 1. 3D SYSTEM ARCHITECTURE

```
                      +---------------------------------------+
                      |         CYBERCORE 3D Web UI           |
                      |   (Three.js / React Three Fiber)      |
                      +---------------------------------------+
                                          |
                      +---------------------------------------+
                      |       FastAPI Hardware Backend        |
                      |          (localhost:8000)             |
                      +---------------------------------------+
                                          |
                +-------------------------+-------------------------+
                |                                                   |
    +-----------------------+                           +-----------------------+
    |  Icarus Verilog 14.0  |                           |     Yosys 0.70 &      |
    |  (Simulation Engine)  |                           |   SkyWater 130nm PDK  |
    +-----------------------+                           +-----------------------+
```

---

## 2. HOW 3D ANIMATIONS & HARDWARE SIGNALS WORK

1. **Semiconductor Package & Silicon Die Representation:**
   - Top ceramic package lid with laser engraving.
   - Central silicon die hosting four 4-bit logic blocks.
   - Dual-in-line peripheral metallic pins with realistic metalness and roughness.
   - Dark PCB baseboard with glowing cyan micro-traces and orange vias.

2. **Exploded View Animation:**
   - When **EXPLODE 3D LAYERS** is triggered, the packaging layers separate vertically:
     - Layer 1 (Heat-spreader lid): $Y = +2.8$
     - Layer 2 (Silicon core blocks): $Y = +1.2$
     - Layer 3 (Carry interconnect bus): $Y = +0.4$
     - Layer 4 (PCB & pins): $Y = 0.0$
   - Allows students and examiners to inspect the internal architecture beneath the silicon package.

3. **Dynamic Carry Propagation & Skip Path Glow:**
   - **Ripple Carry:** Rendered as electric cyan pulses propagating through internal full-adder sub-units.
   - **Skip Bypass Route:** Rendered in **vibrant neon orange** with elevated emissive intensity ($1.5\times$).
   - The animation directly reflects the hardware telemetry returned by the simulation engine:
     - If $P_{group} = 1$ and $C_{in} = 1$, the orange bypass highway illuminates.
     - If $P_{group} = 0$, the cyan ripple chain illuminates.

4. **Interactive Component Selection:**
   - Clicking on any of the 4 blocks (Block 0, 1, 2, 3) in the 3D canvas selects the block and highlights its live input bits, propagate signals, and carry status.

---

## 3. HOW TO LAUNCH THE APPLICATION

### Option A: Complete Pipeline (One-Click)
```cmd
run_complete_project.bat
```

### Option B: Launch Frontend and Backend Independently
```powershell
# Terminal 1: Backend
.\.venv\Scripts\python -m uvicorn backend.app:app --port 8000 --host 127.0.0.1

# Terminal 2: Frontend
cd frontend
npm run preview -- --port 3000
```
Open **`http://localhost:3000`** in Google Chrome or Microsoft Edge.

### Option C: Launch Streamlit Dashboard
```powershell
.\.venv\Scripts\streamlit run dashboard\app.py
```

---

## 4. HARDWARE OPTIMIZATION (RTX 4050 GPU)

- **Anti-aliasing:** Enabled via WebGL antialias buffer.
- **Power Preference:** Configured for `high-performance` discrete GPU.
- **Damping & Interpolation:** OrbitControls configured with damping factor `0.05` for smooth cinematic motion.
- **Geometry Instancing:** Repeated metallic pins and full-adder sub-units use shared box/cylinder buffers to minimize draw calls.

