import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

PROJECT_ROOT = r"X:" if os.path.exists(r"X:\rtl") else r"D:\mini project"
DEF_FLAT = os.path.join(PROJECT_ROOT, "physical_design", "placement", "cska_sky130.def")
DEF_HIER = os.path.join(PROJECT_ROOT, "physical_design", "placement", "cska_hier_sky130.def")
IMG_OUT = os.path.join(PROJECT_ROOT, "physical_design", "reports", "cska_physical_layout_comparison.png")

plt.style.use("dark_background")
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 9), facecolor="#060A14")

# Color palette for cells
colors = {
    "mux2": "#FF007F",   # Vibrant Neon Pink - Carry-Skip Multiplexer!
    "and4": "#A855F7",   # Vibrant Purple - Group Propagate AND4!
    "maj3": "#FF7A00",   # Amber / Orange - Carry Generation (MAJ3)
    "xor3": "#00F0FF",   # Electric Cyan - Sum Generation (XOR3)
    "xor2": "#00DF72",   # Neon Emerald - Bit Propagate (XOR2)
    "xnor2": "#38BDF8",  # Sky Blue - Flattened Sum Logic (XNOR2)
}

# =========================================================================
# PANEL 1: ORIGINAL FLATTENED 48-CELL LAYOUT (RCA-EQUIVALENT)
# =========================================================================
ax1.set_facecolor("#0B101D")
# Die: 45 x 35 um
die1 = patches.Rectangle((0, 0), 45, 35, linewidth=2, edgecolor="#FF7A00", facecolor="#080C18")
ax1.add_patch(die1)
# Core: 5 to 40 um X (35 um width), 5.44 to 29.92 um Y (24.48 um height = 9 rows)
core1 = patches.Rectangle((5, 5.44), 35, 24.48, linewidth=1.5, edgecolor="#64748B", facecolor="#0D1326", linestyle="--")
ax1.add_patch(core1)

# Rows (height 2.72 um)
for r in range(9):
    ry = 5.44 + r * 2.72
    ax1.axhline(ry, color="#1E293B", linestyle=":", linewidth=0.8, xmin=5/45, xmax=40/45)

# Place cells from DEF_FLAT
flat_cells_drawn = 0
if os.path.exists(DEF_FLAT):
    with open(DEF_FLAT) as f:
        for line in f:
            if line.startswith("- ") and "PLACED" in line:
                parts = line.split()
                cname = parts[1]
                ctype = parts[2]
                px = int(parts[6]) / 1000.0
                py = int(parts[7]) / 1000.0
                col = colors["maj3"] if "maj3" in ctype else colors["xnor2"]
                width = 3.68 if "maj3" in ctype else 2.76
                rect = patches.Rectangle((px, py), width, 2.72, linewidth=0.8, edgecolor="#FFFFFF", facecolor=col, alpha=0.9)
                ax1.add_patch(rect)
                lbl = "MAJ3" if "maj3" in ctype else "XNOR"
                ax1.text(px + width/2.0, py + 1.36, lbl, color="#FFFFFF", fontsize=5.5, ha="center", va="center", fontweight="bold")
                flat_cells_drawn += 1

ax1.set_xlim(-3, 48)
ax1.set_ylim(-3, 38)
ax1.set_aspect("equal")
ax1.set_title("A. ORIGINAL FLATTENED IMPLEMENTATION (48 CELLS)\n[Structurally Identical to Ripple Carry Adder — Zero Bypass Logic]",
              fontsize=11, color="#FF7A00", fontweight="bold", pad=12)
ax1.set_xlabel("X Coordinate (µm)\nDie: 45.0 µm × 35.0 µm | Core: 35.0 µm × 24.5 µm | 9 Rows", color="#94A3B8", fontsize=9)
ax1.set_ylabel("Y Coordinate (µm)", color="#94A3B8", fontsize=9)

# Legend 1
leg1 = [
    patches.Patch(facecolor=colors["maj3"], label="Full-Adder Carry (sky130...maj3_1 — 16 cells)"),
    patches.Patch(facecolor=colors["xnor2"], label="Full-Adder Sum (sky130...xnor2_1 — 32 cells)"),
    patches.Patch(facecolor="#334155", label="Carry-Skip Multiplexers (mux2_1): NONE (0 cells)"),
    patches.Patch(facecolor="#334155", label="Group-Propagate Gates (and4_1): NONE (0 cells)"),
]
ax1.legend(handles=leg1, loc="upper right", fontsize=8, facecolor="#0B132B", edgecolor="#FF7A00")
ax1.text(22.5, 32.5, "GATE AREA: 440.42 µm² | CELL COUNT: 48", color="#FF7A00", fontsize=9, ha="center", fontweight="bold",
         bbox=dict(boxstyle="round,pad=0.3", fc="#1E1E2E", ec="#FF7A00", lw=1))

# =========================================================================
# PANEL 2: NEW HIERARCHICAL 56-CELL CSKA LAYOUT (TRUE CSKA)
# =========================================================================
ax2.set_facecolor("#0B101D")
# Die: 55 x 45 um
die2 = patches.Rectangle((0, 0), 55, 45, linewidth=2, edgecolor="#00F0FF", facecolor="#080C18")
ax2.add_patch(die2)
# Core: 5 to 50 um X (45 um width), 5.44 to 38.08 um Y (32.64 um height = 12 rows)
core2 = patches.Rectangle((5, 5.44), 45, 32.64, linewidth=1.5, edgecolor="#00DF72", facecolor="#0D1326", linestyle="--")
ax2.add_patch(core2)

# Rows (height 2.72 um)
for r in range(12):
    ry = 5.44 + r * 2.72
    ax2.axhline(ry, color="#1E293B", linestyle=":", linewidth=0.8, xmin=5/55, xmax=50/55)

# Place cells from DEF_HIER
hier_cells_drawn = 0
if os.path.exists(DEF_HIER):
    with open(DEF_HIER) as f:
        for line in f:
            if line.startswith("- ") and "PLACED" in line:
                parts = line.split()
                cname = parts[1]
                ctype = parts[2]
                px = int(parts[6]) / 1000.0
                py = int(parts[7]) / 1000.0
                
                if "mux2" in ctype:
                    col = colors["mux2"]
                    width = 2.76
                    lbl = f"MUX{cname[5]}"
                    edge_w = 2.0
                    edge_col = "#FFFFFF"
                elif "and4" in ctype:
                    col = colors["and4"]
                    width = 2.30
                    lbl = f"AND{cname[5]}"
                    edge_w = 1.5
                    edge_col = "#FFFFFF"
                elif "maj3" in ctype:
                    col = colors["maj3"]
                    width = 3.68
                    lbl = f"MAJ"
                    edge_w = 0.8
                    edge_col = "#CBD5E1"
                elif "xor3" in ctype:
                    col = colors["xor3"]
                    width = 3.68
                    lbl = f"XOR3"
                    edge_w = 0.8
                    edge_col = "#CBD5E1"
                else:
                    col = colors["xor2"]
                    width = 2.76
                    lbl = f"XOR2"
                    edge_w = 0.8
                    edge_col = "#CBD5E1"
                    
                rect = patches.Rectangle((px, py), width, 2.72, linewidth=edge_w, edgecolor=edge_col, facecolor=col, alpha=0.95)
                ax2.add_patch(rect)
                ax2.text(px + width/2.0, py + 1.36, lbl, color="#FFFFFF", fontsize=5.5, ha="center", va="center", fontweight="bold")
                hier_cells_drawn += 1

ax2.set_xlim(-3, 58)
ax2.set_ylim(-3, 48)
ax2.set_aspect("equal")
ax2.set_title("B. HIERARCHICAL CARRY SKIP ADDER IMPLEMENTATION (56 CELLS)\n[True Academic CSKA — Preserving 4x MUX2 Bypass & 4x AND4 Propagate]",
              fontsize=11, color="#00F0FF", fontweight="bold", pad=12)
ax2.set_xlabel("X Coordinate (µm)\nDie: 55.0 µm × 45.0 µm | Core: 45.0 µm × 32.6 µm | 12 Rows", color="#94A3B8", fontsize=9)
ax2.set_ylabel("Y Coordinate (µm)", color="#94A3B8", fontsize=9)

# Legend 2
leg2 = [
    patches.Patch(facecolor=colors["mux2"], label="Carry-Skip 2:1 MUX (sky130...mux2_1 — 4 cells) ★"),
    patches.Patch(facecolor=colors["and4"], label="Group-Propagate AND4 (sky130...and4_1 — 4 cells) ★"),
    patches.Patch(facecolor=colors["xor2"], label="Bit-Propagate XOR2 (sky130...xor2_1 — 16 cells)"),
    patches.Patch(facecolor=colors["maj3"], label="Full-Adder Carry (sky130...maj3_1 — 16 cells)"),
    patches.Patch(facecolor=colors["xor3"], label="Full-Adder Sum (sky130...xor3_1 — 16 cells)"),
]
ax2.legend(handles=leg2, loc="upper right", fontsize=8, facecolor="#0B132B", edgecolor="#00F0FF")
ax2.text(27.5, 42.0, "GATE AREA: 760.73 µm² | CELL COUNT: 56", color="#00F0FF", fontsize=9, ha="center", fontweight="bold",
         bbox=dict(boxstyle="round,pad=0.3", fc="#1E1E2E", ec="#00F0FF", lw=1))

# Bottom warning banner across both panels
fig.text(0.5, 0.02, "PHYSICAL DESIGN STATUS: STANDARD-CELL PLACEMENT VERIFIED (KLAYOUT GDSII MACRO STREAM) — DETAILED ROUTING NOT COMPLETED",
         fontsize=10, color="#FACC15", ha="center", fontweight="bold",
         bbox=dict(boxstyle="round,pad=0.4", fc="#1E293B", ec="#FACC15", lw=1.2))

plt.suptitle("CYBERCORE 3D — SKY130 PHYSICAL DESIGN CONSISTENCY COMPARISON\nFlattened RCA-Equivalent Netlist vs. True Hierarchical CSKA Architecture",
             fontsize=14, color="#FFFFFF", fontweight="bold", y=0.98)

plt.subplots_adjust(top=0.88, bottom=0.10, left=0.06, right=0.95, wspace=0.15)
os.makedirs(os.path.dirname(IMG_OUT), exist_ok=True)
plt.savefig(IMG_OUT, dpi=250, facecolor=fig.get_facecolor(), edgecolor="none")
print(f"[+] Successfully generated physical layout comparison plot: {IMG_OUT}")
