import json

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
                func = 'Carry-Skip 2:1 MUX (Bypass stage)'
            elif 'and4' in ctype:
                func = 'Group-Propagate 4-bit AND gate'
            elif 'xor2' in ctype:
                func = 'Bit-Propagate XOR2 gate'
            elif 'xor3' in ctype:
                func = 'Full-Adder Sum XOR3 gate'
            elif 'maj3' in ctype:
                func = 'Full-Adder Carry Majority-3 gate'
            else:
                func = ctype
            hier_comps.append({'id': inst, 'type': ctype, 'x': px, 'y': py, 'orient': orient, 'func': func})

with open('frontend/src/components/PhysicalDesignViewer.tsx') as f:
    original_code = f.read()

# Let's write a clean generator that doesn't use nested f-strings with JSX comments
with open('scripts/hier_comps.json', 'w') as f:
    json.dump(hier_comps, f, indent=2)

print("Exported scripts/hier_comps.json")
