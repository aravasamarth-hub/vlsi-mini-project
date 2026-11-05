import json

# Generate HIER_COMPONENTS array
hier_comps = []
with open('physical_design/placement/cska_hier_sky130.def') as f:
    for line in f:
        if line.startswith('- ') and 'PLACED' in line:
            parts = line.split()
            inst = parts[1]
            ctype = parts[2]
            px = int(parts[6])
            py = int(parts[7])
            orient = parts[9]
            if 'mux2' in ctype:
                func = f'Carry-Skip 2:1 MUX (Bypass stage)'
            elif 'and4' in ctype:
                func = f'Group-Propagate 4-bit AND gate'
            elif 'xor2' in ctype:
                func = f'Bit-Propagate XOR2 gate'
            elif 'xor3' in ctype:
                func = f'Full-Adder Sum XOR3 gate'
            elif 'maj3' in ctype:
                func = f'Full-Adder Carry Majority-3 gate'
            else:
                func = ctype
            hier_comps.append({'id': inst, 'type': ctype, 'x': px, 'y': py, 'orient': orient, 'func': func})

print(f"Generated {len(hier_comps)} hier components")

with open('physical_design/placement/cska_hier_sky130.def') as f:
    hier_def_text = f.read()

with open('physical_design/placement/cska_sky130.def') as f:
    flat_def_text = f.read()

print("Hier DEF len:", len(hier_def_text), "Flat DEF len:", len(flat_def_text))
