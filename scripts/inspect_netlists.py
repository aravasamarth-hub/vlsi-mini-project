import os
import re
from collections import Counter

files = {
    'CSKA_HD_synth': r'D:\mini project\openroad_experiment\artifacts\sky130hd_cska\6_final.v',
    'CSKA_HS_synth': r'D:\mini project\openroad_experiment\artifacts\sky130hs_cska\6_final.v',
    'RCA_HD_synth':  r'D:\mini project\openroad_experiment\artifacts\sky130hd_rca\6_final.v',
    'RCA_HS_synth':  r'D:\mini project\openroad_experiment\artifacts\sky130hs_rca\6_final.v',
}

for name, path in files.items():
    print(f'=== {name} ({os.path.basename(path)}) ===')
    with open(path) as f:
        text = f.read()
    
    # modules
    modules = re.findall(r'module\s+(\w+)', text)
    print('  Defined Modules:', modules)
    
    # Find all sky130 cells: match pattern: sky130_fd_sc_...
    insts = re.findall(r'(sky130_fd_sc_\w+)\s+(\S+)', text)
    c = Counter([i[0] for i in insts])
    print(f'  Total Standard Cell Instances: {len(insts)}')
    for cell, count in sorted(c.items()):
        print(f'    {cell}: {count}')
    
    # Look for mux2, and4, fa, etc.
    mux2 = [i for i in insts if 'mux2' in i[0]]
    and4 = [i for i in insts if 'and4' in i[0]]
    fa = [i for i in insts if 'fa' in i[0]]
    ha = [i for i in insts if 'ha' in i[0]]
    xor2 = [i for i in insts if 'xor2' in i[0]]
    buf = [i for i in insts if 'buf' in i[0]]
    print(f'  Mux2 instances ({len(mux2)}): {[m[1] for m in mux2]}')
    print(f'  AND4 instances ({len(and4)}): {[m[1] for m in and4]}')
    print(f'  Full Adder instances ({len(fa)}): {[m[1] for m in fa][:4]}...')
    print(f'  XOR2 instances ({len(xor2)}): {[m[1] for m in xor2][:4]}...')
    print(f'  Buffer instances: {len(buf)}')
    print()
