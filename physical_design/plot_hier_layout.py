import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

PROJECT_ROOT = r"X:" if os.path.exists(r"X:\rtl") else r"D:\mini project"
DEF_FILE = os.path.join(PROJECT_ROOT, "physical_design", "placement", "cska_hier_sky130.def")
IMG_OUT = os.path.join(PROJECT_ROOT, "physical_design", "reports", "cska_hier_placement_layout.png")

plt.style.use("dark_background")
fig, ax = plt.subplots(figsize=(11, 8.5))

# Die boundary (0,0) to (55, 45) um
die = patches.Rectangle((0, 0), 55, 45, linewidth=2, edgecolor="#00F0FF", facecolor="#060A14")
ax.add_patch(die)

# Core boundary (5, 5.44) to (50, 38.08) um
core = patches.Rectangle((5, 5.44), 45, 32.64, linewidth=1.5, edgecolor="#00DF72", facecolor="#0D1322", linestyle="--")
ax.add_patch(core)

# Rows (height 2.72 um)
for r in range(12):
    ry = 5.44 + r * 2.72
    ax.axhline(ry, color="#1E293B", linestyle=":", linewidth=0.8, xmin=5/55, xmax=50/55)

cell_colors = {
    "maj3": "#FF7A00",  # Orange (Carry generation)
    "xor3": "#00F0FF",  # Cyan (Full adder sum)
    "xor2": "#00DF72",  # Green (Bit propagate)
    "and4": "#A855F7",  # Purple (Group propagate)
    "mux2": "#FF0080",  # Pink/Magenta (Carry-Skip Multiplexer!)
}

with open(DEF_FILE, "r") as f:
    text = f.read()

count = 0
legend_added = set()
for line in text.split("\n"):
    if line.startswith("- ") and "PLACED" in line:
        parts = line.split()
        cname = parts[1]
        ctype = parts[2]
        px = int(parts[6]) / 1000.0
        py = int(parts[7]) / 1000.0
        
        color = "#3B82F6"
        c_label = "other"
        for k, col in cell_colors.items():
            if k in ctype:
                color = col
                c_label = k
                break
                
        width = 3.68 if "3" in ctype else (2.30 if "and4" in ctype else 2.76)
        cell_rect = patches.Rectangle((px, py), width, 2.72, linewidth=0.8, edgecolor="#ffffff", facecolor=color, alpha=0.9)
        ax.add_patch(cell_rect)
        
        # Display short label
        lbl = cname.split('/')[-1]
        if 'mux2' in ctype:
            lbl = f"MUX{cname[5]}"
        elif 'and4' in ctype:
            lbl = f"AND{cname[5]}"
        elif 'cout_maj3' in cname:
            lbl = f"M{cname[5]}.{cname[11]}"
        elif 'sum_xor3' in cname:
            lbl = f"S{cname[5]}.{cname[11]}"
        elif 'prop_xor' in cname:
            lbl = f"P{cname[5]}.{cname[-1]}"
            
        ax.text(px + width/2.0, py + 1.36, lbl,
                color="#ffffff", fontsize=5.5, ha="center", va="center", fontweight="bold")
        count += 1

ax.set_xlim(-2, 57)
ax.set_ylim(-2, 47)
ax.set_aspect("equal")
ax.set_title("16-Bit CSKA Hierarchical Placement: 56 Standard Cells (Including 4x MUX2 & 4x AND4)", 
             fontsize=11, pad=15, color="#00F0FF", fontweight="bold")
ax.set_xlabel("X Coordinate (µm)", color="#94A3B8")
ax.set_ylabel("Y Coordinate (µm)", color="#94A3B8")

# Legend
custom_lines = [
    patches.Patch(facecolor="#FF0080", label="Carry-Skip 2:1 MUX (sky130_fd_sc_hd__mux2_1 - 4 cells)"),
    patches.Patch(facecolor="#A855F7", label="Group Propagate AND4 (sky130_fd_sc_hd__and4_1 - 4 cells)"),
    patches.Patch(facecolor="#00DF72", label="Bit Propagate XOR2 (sky130_fd_sc_hd__xor2_1 - 16 cells)"),
    patches.Patch(facecolor="#FF7A00", label="FA Carry MAJ3 (sky130_fd_sc_hd__maj3_1 - 16 cells)"),
    patches.Patch(facecolor="#00F0FF", label="FA Sum XOR3 (sky130_fd_sc_hd__xor3_1 - 16 cells)"),
]
ax.legend(handles=custom_lines, loc="upper right", fontsize=8, facecolor="#0B132B", edgecolor="#00F0FF")

plt.tight_layout()
os.makedirs(os.path.dirname(IMG_OUT), exist_ok=True)
plt.savefig(IMG_OUT, dpi=250, bbox_inches="tight")
print(f"[+] Successfully generated hierarchical placement plot: {IMG_OUT}")
