import os

def update_file(path, target, repl):
    if not os.path.exists(path):
        print(f"Skipping {path}: not found")
        return
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    if target in content:
        content = content.replace(target, repl, 1)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"[+] Updated consistency in {path}")
    else:
        print(f"[-] Target not found in {path}")

# 1. FINAL_SKY130_PHYSICAL_DESIGN_AUDIT.md
target_1 = "## 1. Physical Design Deliverables Inventory"
repl_1 = """## 1. Physical Design Deliverables Inventory & Dual Stream Declaration

> [!NOTE]
> **Dual Physical Layout Streams Available:**
> 1. **Hierarchical CSKA Stream (True Architecture):** [`physical_design/gds/cska_hier_sky130.gds`](file:///D:/mini%20project/physical_design/gds/cska_hier_sky130.gds) and [`physical_design/placement/cska_hier_sky130.def`](file:///D:/mini%20project/physical_design/placement/cska_hier_sky130.def) — **56 cells**, **760.73 µm²**, preserving all 4 `mux2_1` and 4 `and4_1` bypass gates.
> 2. **Original Flattened Stream (RCA-Equivalent):** [`physical_design/gds/cska_sky130.gds`](file:///D:/mini%20project/physical_design/gds/cska_sky130.gds) and [`physical_design/placement/cska_sky130.def`](file:///D:/mini%20project/physical_design/placement/cska_sky130.def) — **48 cells**, **440.42 µm²**, where ABC Boolean synthesis collapsed bypass gates into RCA majority carry gates.
>
> **Physical Design Status:** Standard-cell placement verified with KLayout macros; detailed routing (M1–M5) and signoff DRC/LVS were not completed in this academic flow.

## 1. Physical Design Deliverables Inventory"""

update_file("FINAL_SKY130_PHYSICAL_DESIGN_AUDIT.md", target_1, repl_1)

# 2. FINAL_TIMING_POWER_ANALYSIS.md
target_2 = "## 1. Timing Methodology & Seven-Level Rigor Classification"
repl_2 = """## 1. Timing Methodology & Dual RCA Baseline

| Architecture | Netlist Type | Cells | Area (µm²) | Critical Path Topology | Analytical Delay | Speedup vs Baseline |
| :--- | :--- | :---: | :---: | :--- | :---: | :---: |
| **Hierarchical RCA** | Hierarchical | 48 | 540.52 | 16 maj3 + 1 xor3 | **4.240 ns** | Reference |
| **Flattened RCA** | Flattened | 48 | 440.42 | 15 maj3 + 1 xnor2 | **3.957 ns** | +6.67% (via ABC) |
| **Hierarchical CSKA** | **Hierarchical** | **56** | **760.73** | 7 maj3 + 2 mux2 + 1 xor3 | **2.471 ns** | **+41.72% (vs Hier. RCA)**<br>**+37.55% (vs Flat. RCA)** |

> [!IMPORTANT]
> **Resolution of 4.240 ns vs 3.957 ns:**
> - **4.240 ns** is the Hierarchical RCA critical path (16 `maj3_1` + 1 `xor3_1`).
> - **3.957 ns** is the ABC-flattened RCA critical path (15 `maj3_1` + 1 `xnor2_1`).
> - The 41.72% speedup is the apples-to-apples comparison between Hierarchical CSKA (2.471 ns) and Hierarchical RCA (4.240 ns).

## 1. Timing Methodology & Seven-Level Rigor Classification"""

update_file("FINAL_TIMING_POWER_ANALYSIS.md", target_2, repl_2)
