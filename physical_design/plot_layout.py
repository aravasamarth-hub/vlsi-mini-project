import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

PROJECT_ROOT = r"X:" if os.path.exists(r"X:\rtl") else r"D:\mini project"
DEF_FILE = os.path.join(PROJECT_ROOT, "physical_design", "placement", "cska_sky130.def")
IMG_OUT = os.path.join(PROJECT_ROOT, "physical_design", "reports", "cska_placement_layout.png")

plt.style.use("dark_background")
fig, ax = plt.subplots(figsize=(10, 7.5))

# Die boundary (0,0) to (45, 35) um
die = patches.Rectangle((0, 0), 45, 35, linewidth=2, edgecolor="#00F0FF", facecolor="#060A14")
ax.add_patch(die)

# Core boundary (5, 5.44) to (40, 29.92) um
core = patches.Rectangle((5, 5.44), 35, 24.48, linewidth=1.5, edgecolor="#FF7A00", facecolor="#0D1322", linestyle="--")
ax.add_patch(core)

# Rows (height 2.72 um)
for r in range(9):
    ry = 5.44 + r * 2.72
    ax.axhline(ry, color="#1E293B", linestyle=":", linewidth=0.8, xmin=5/45, xmax=40/45)

cell_colors = {
    "maj3": "#FF7A00",
    "xnor": "#00F0FF",
    "xor": "#00DF72",
    "mux": "#FF0080",
    "nand": "#7928CA",
}

with open(DEF_FILE, "r") as f:
    text = f.read()

count = 0
for line in text.split("\n"):
    if line.startswith("- ") and "PLACED" in line:
        parts = line.split()
        cname = parts[1]
        ctype = parts[2]
        px = int(parts[6]) / 1000.0
        py = int(parts[7]) / 1000.0
        
        color = "#3B82F6"
        for k, col in cell_colors.items():
            if k in ctype:
                color = col
                break
                
        cell_rect = patches.Rectangle((px, py), 2.2, 2.72, linewidth=0.8, edgecolor="#ffffff", facecolor=color, alpha=0.85)
        ax.add_patch(cell_rect)
        ax.text(px + 1.1, py + 1.36, cname.replace("gen_fa[", "").replace("].fa_inst", "").replace("block", "B"),
                color="#ffffff", fontsize=6, ha="center", va="center", fontweight="bold")
        count += 1

ax.set_xlim(-2, 47)
ax.set_ylim(-2, 37)
ax.set_aspect("equal")
ax.set_title("16-Bit Carry Skip Adder: Sky130 HD Standard Cell Placement Layout", fontsize=12, pad=15, color="#00F0FF", fontweight="bold")
ax.set_xlabel("X Dimension (um)", fontsize=10)
ax.set_ylabel("Y Dimension (um)", fontsize=10)

legend_elements = [
    patches.Patch(facecolor="#FF7A00", edgecolor="#ffffff", label="sky130_fd_sc_hd__maj3_1 (Carry Logic)"),
    patches.Patch(facecolor="#00F0FF", edgecolor="#ffffff", label="sky130_fd_sc_hd__xnor2_1 (Sum Logic)"),
    patches.Patch(facecolor="none", edgecolor="#FF7A00", linestyle="--", label="Core Boundary (35 x 24.5 um)"),
    patches.Patch(facecolor="none", edgecolor="#00F0FF", label="Die Boundary (45 x 35 um)")
]
ax.legend(handles=legend_elements, loc="upper right", facecolor="#0D1322", edgecolor="#1E293B", fontsize=9)

plt.tight_layout()
plt.savefig(IMG_OUT, dpi=250)
print(f"[+] Layout plot saved with {count} placed cells to {IMG_OUT}")

