import os, sys

def_path = r"D:\mini project\physical_design\placement\cska_sky130.def"
gds_path = r"D:\mini project\physical_design\gds\cska_sky130.gds"

print("=== 1. DEF ARTIFACT INSPECTION ===")
print("File exists:", os.path.exists(def_path), "Size:", os.path.getsize(def_path), "bytes")
components = []
die_area = None
rows = []
with open(def_path, "r") as f:
    for line in f:
        line_s = line.strip()
        if line_s.startswith("DIEAREA"):
            die_area = line_s
        elif line_s.startswith("ROW"):
            rows.append(line_s.split()[1])
        elif line_s.startswith("- ") and "PLACED" in line_s:
            parts = line_s.split()
            components.append((parts[1], parts[2], parts[6], parts[7], parts[8]))

print("Die Area Definition:", die_area)
print("Standard Cell Rows Count:", len(rows), "Rows:", rows[:3], "...")
print("Placed Components Count:", len(components))
print("Sample Components:")
for c in components[:4]:
    print(" ", c)

print("\n=== 2. GDSII ARTIFACT INSPECTION ===")
print("File exists:", os.path.exists(gds_path), "Size:", os.path.getsize(gds_path), "bytes")

try:
    import pya
    layout = pya.Layout()
    layout.read(gds_path)
    top_cells = [c.name for c in layout.top_cells()]
    print("KLayout Pya Engine: SUCCESS")
    print("Top-level Cell(s):", top_cells)
    top_cell = layout.top_cell()
    print("Top Cell Bounding Box (nm):", top_cell.bbox())
    print("Top Cell Bounding Box (um):", top_cell.bbox().left()/1000, top_cell.bbox().bottom()/1000, "to", top_cell.bbox().right()/1000, top_cell.bbox().top()/1000)
    print("Total Cells in GDS Hierarchy:", layout.cells())
    layers = layout.layer_indexes()
    print("Layer Count in GDS:", len(layers))
except Exception as e:
    print("Pya inspection note:", e)
