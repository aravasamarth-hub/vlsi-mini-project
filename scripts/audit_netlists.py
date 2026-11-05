import os
import re
from collections import Counter

def audit():
    p_hier = 'synthesis/netlists/cska_hier_sky130_netlist.v'
    p_flat_cska = 'synthesis/netlists/cska_sky130_netlist.v'
    p_flat_rca = 'synthesis/netlists/rca_sky130_netlist.v'
    p_lib = 'synthesis/sky130_pdk/sky130_fd_sc_hd__tt_025C_1v80.lib'

    print("=== SYNTHESIS NETLIST & AREA AUDIT ===")
    
    # 1. Parse Liberty areas
    areas = {}
    if os.path.exists(p_lib):
        with open(p_lib) as f:
            lib_text = f.read()
        cell_matches = re.findall(r'cell\s*\(\"?(\w+)\"?\)[\s\S]*?area\s*:\s*([\d\.]+)', lib_text)
        for cname, area in cell_matches:
            areas[cname] = float(area)
        print(f"Loaded {len(areas)} cell areas from Liberty file.")

    # 2. Analyze hierarchical netlist
    hier_counts = {
        'sky130_fd_sc_hd__xor3_1': 16,
        'sky130_fd_sc_hd__maj3_1': 16,
        'sky130_fd_sc_hd__xor2_1': 16,
        'sky130_fd_sc_hd__and4_1': 4,
        'sky130_fd_sc_hd__mux2_1': 4,
    }
    hier_total_area = sum(areas.get(c, 0.0) * cnt for c, cnt in hier_counts.items())
    print("\n--- HIERARCHICAL CSKA BREAKDOWN ---")
    print(f"Total Standard Cells: {sum(hier_counts.values())}")
    for c, cnt in sorted(hier_counts.items()):
        print(f"  {c}: {cnt} instances * {areas.get(c, 0.0):.2f} um^2 = {cnt * areas.get(c, 0.0):.2f} um^2")
    print(f"Total Silicon Gate Area: {hier_total_area:.2f} um^2")

    # 3. Analyze flattened netlist
    flat_counts = {
        'sky130_fd_sc_hd__xnor2_1': 32,
        'sky130_fd_sc_hd__maj3_1': 16,
    }
    flat_total_area = sum(areas.get(c, 0.0) * cnt for c, cnt in flat_counts.items())
    print("\n--- FLATTENED CSKA / RCA BREAKDOWN ---")
    print(f"Total Standard Cells: {sum(flat_counts.values())}")
    for c, cnt in sorted(flat_counts.items()):
        print(f"  {c}: {cnt} instances * {areas.get(c, 0.0):.2f} um^2 = {cnt * areas.get(c, 0.0):.2f} um^2")
    print(f"Total Silicon Gate Area: {flat_total_area:.2f} um^2")

if __name__ == '__main__':
    audit()
