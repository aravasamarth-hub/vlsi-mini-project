import pya, os

def_path = r"X:physical_design\placement\cska_sky130.def"
lef_path = r"X:synthesis\sky130_pdk\sky130_fd_sc_hd_merged.lef"
gds_lib_path = r"X:synthesis\sky130_pdk\sky130_fd_sc_hd.gds"
gds_out_path = r"X:physical_design\gds\cska_sky130.gds"

print("[KLayout] Initializing Layout Engine...")
layout = pya.Layout()

# Read the standard cell library GDS into layout
layout.read(gds_lib_path)
print(f"[KLayout] Loaded {len(layout.top_cells())} standard cell layouts from Sky130 HD library")

# Create top-level carry_skip_adder cell
top_cell = layout.create_cell("carry_skip_adder")

# Parse placed instances from DEF
placed_cells = []
with open(def_path, "r") as f:
    for line in f:
        if line.startswith("- ") and "PLACED" in line:
            parts = line.split()
            inst_name = parts[1]
            cell_type = parts[2]
            px = int(parts[6])
            py = int(parts[7])
            placed_cells.append((inst_name, cell_type, px, py))

print(f"[KLayout] Placing {len(placed_cells)} standard-cell macros...")
placed_count = 0
for inst_name, cell_type, px, py in placed_cells:
    master_cell = layout.cell(cell_type)
    if master_cell:
        trans = pya.Trans(px, py)
        top_cell.insert(pya.CellInstArray(master_cell.cell_index(), trans))
        placed_count += 1

# Add Die Boundary on PRBOUNDARY layer (Layer 235/4 in Sky130)
box = pya.Box(0, 0, 45000, 35000)
layer_pr = layout.layer(235, 4)
top_cell.shapes(layer_pr).insert(box)

# Add Core Boundary
core_box = pya.Box(5000, 5440, 40000, 29920)
top_cell.shapes(layer_pr).insert(core_box)

# Export complete GDSII
layout.write(gds_out_path)
print(f"[KLayout] GDSII successfully generated: {gds_out_path} ({os.path.getsize(gds_out_path)} bytes)")
