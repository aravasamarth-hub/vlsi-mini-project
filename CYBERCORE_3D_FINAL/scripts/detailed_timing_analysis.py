#!/usr/bin/env python3
"""
Comprehensive Timing Arc & Transition Propagation Analysis
Target: 16-bit Hierarchical CSKA Critical Path
Library: SkyWater 130nm HD (sky130_fd_sc_hd__tt_025C_1v80.lib)
"""

import os
import re
import json

LIB_PATH = r"X:\synthesis\sky130_pdk\sky130_fd_sc_hd__tt_025C_1v80.lib"

with open(LIB_PATH, "r", errors="ignore") as f:
    text = f.read()

def get_cell_block(cell_name):
    m = re.search(rf'cell\s*\(\s*"{cell_name}"\s*\)\s*\{{', text)
    if not m: return None
    start = m.start()
    bc = 0
    for i in range(start, len(text)):
        if text[i] == '{': bc += 1
        elif text[i] == '}':
            bc -= 1
            if bc == 0: return text[start:i+1]
    return None

def get_pin_capacitance(cell_body, pin_name):
    m = re.search(rf'pin\s*\(\s*"{pin_name}"\s*\)\s*\{{', cell_body)
    if not m: return 0.0
    start = m.start()
    bc = 0
    p_body = ""
    for i in range(start, len(cell_body)):
        if cell_body[i] == '{': bc += 1
        elif cell_body[i] == '}':
            bc -= 1
            if bc == 0:
                p_body = cell_body[start:i+1]
                break
    cap_m = re.search(r'capacitance\s*:\s*([^;]+);', p_body)
    return float(cap_m.group(1).strip()) if cap_m else 0.0

def get_timing_table(cell_body, out_pin, in_pin, table_type, when_cond=None):
    px_idx = cell_body.find(f'pin ("{out_pin}")')
    if px_idx == -1: return None, None, None
    px_text = cell_body[px_idx:]
    
    t_matches = list(re.finditer(r'timing\s*\(\s*\)\s*\{', px_text))
    for i, tm in enumerate(t_matches):
        start = tm.start()
        end = t_matches[i+1].start() if i+1 < len(t_matches) else len(px_text)
        block = px_text[start:end]
        
        rp = re.search(r'related_pin\s*:\s*"([^"]+)"', block)
        when = re.search(r'when\s*:\s*"([^"]+)"', block)
        
        if rp and rp.group(1) == in_pin:
            # If when_cond is specified, try to match; otherwise take the first valid table
            if when_cond is not None and when:
                if when_cond not in when.group(1):
                    continue
            tbl_m = re.search(rf'{table_type}\s*\([^)]*\)\s*\{{([^}}]+)\}}', block)
            if tbl_m:
                tbl_str = tbl_m.group(1)
                i1_m = re.search(r'index_1\s*\("([^"]+)"\);', tbl_str)
                i2_m = re.search(r'index_2\s*\("([^"]+)"\);', tbl_str)
                val_m = re.search(r'values\s*\((.*?)\);', tbl_str, re.DOTALL)
                
                i1 = [float(x.strip()) for x in i1_m.group(1).split(',')] if i1_m else []
                i2 = [float(x.strip()) for x in i2_m.group(1).split(',')] if i2_m else []
                
                raw_rows = val_m.group(1).split('\\')
                matrix = []
                for r in raw_rows:
                    cleaned = r.strip().strip('"').strip(';').strip(',')
                    nums = [float(x.strip().strip('"')) for x in cleaned.split(',') if x.strip().strip('"')]
                    if nums: matrix.append(nums)
                if matrix:
                    return i1, i2, matrix
    return None, None, None

def bilinear_interp(i1, i2, matrix, slew, load):
    # Clamp to index range
    s = max(i1[0], min(i1[-1], slew))
    l = max(i2[0], min(i2[-1], load))
    
    # Find bounding indices
    r = 0
    while r < len(i1)-2 and i1[r+1] <= s: r += 1
    c = 0
    while c < len(i2)-2 and i2[c+1] <= l: c += 1
    
    s0, s1 = i1[r], i1[r+1]
    l0, l1 = i2[c], i2[c+1]
    
    f00 = matrix[r][c]
    f01 = matrix[r][c+1]
    f10 = matrix[r+1][c]
    f11 = matrix[r+1][c+1]
    
    # Normalized coords
    ds = (s - s0) / (s1 - s0) if s1 != s0 else 0
    dl = (l - l0) / (l1 - l0) if l1 != l0 else 0
    
    val = (1-ds)*(1-dl)*f00 + (1-ds)*dl*f01 + ds*(1-dl)*f10 + ds*dl*f11
    return val

print("================================================================================")
print("1. EXTRACTING ACCURATE STANDARD CELL PIN CAPACITANCES")
print("================================================================================")

maj3_body = get_cell_block("sky130_fd_sc_hd__maj3_1")
mux2_body = get_cell_block("sky130_fd_sc_hd__mux2_1")
xor3_body = get_cell_block("sky130_fd_sc_hd__xor3_1")
and4_body = get_cell_block("sky130_fd_sc_hd__and4_1")
xor2_body = get_cell_block("sky130_fd_sc_hd__xor2_1")

caps = {
    "maj3_1": {p: get_pin_capacitance(maj3_body, p) for p in ["A", "B", "C"]},
    "mux2_1": {p: get_pin_capacitance(mux2_body, p) for p in ["A0", "A1", "S"]},
    "xor3_1": {p: get_pin_capacitance(xor3_body, p) for p in ["A", "B", "C"]},
    "and4_1": {p: get_pin_capacitance(and4_body, p) for p in ["A", "B", "C", "D"]},
    "xor2_1": {p: get_pin_capacitance(xor2_body, p) for p in ["A", "B"]}
}

for cell, p_caps in caps.items():
    print(f"Cell {cell:25s}: " + ", ".join([f"Pin {p}={c*1000:.3f} fF" for p, c in p_caps.items()]))

print("\n================================================================================")
print("2. STAGE-BY-STAGE FANOUT LOAD CALCULATION ON CRITICAL PATH")
print("================================================================================")

# Stage 1-3: maj3_1 out c_int drives maj3_1:C and xor3_1:C
c_load_internal_ripple = caps["maj3_1"]["C"] + caps["xor3_1"]["C"]
# Stage 4: maj3_1 out C_ripple drives mux2_1:A0
c_load_c_ripple = caps["mux2_1"]["A0"]
# Stage 5-7: mux2_1 out c4/c8/c12 drives next block Cin:
# In next block, Cin connects to maj3_1:C, xor3_1:C, AND mux2_1:A1 (bypass)!
c_load_block_carry = caps["maj3_1"]["C"] + caps["xor3_1"]["C"] + caps["mux2_1"]["A1"]
# Stage 8-10: Block 3 internal ripple (same as internal ripple)
# Stage 11: Top-level output SUM[15] (standard 5.0 fF academic output pad load)
c_load_top_output = 0.0050 # 5.0 fF

stage_loads = [
    c_load_internal_ripple, # Stage 1 (Bit 0 maj3 out)
    c_load_internal_ripple, # Stage 2 (Bit 1 maj3 out)
    c_load_internal_ripple, # Stage 3 (Bit 2 maj3 out)
    c_load_c_ripple,        # Stage 4 (Bit 3 maj3 out -> C_ripple)
    c_load_block_carry,     # Stage 5 (Block 0 MUX out -> c4)
    c_load_block_carry,     # Stage 6 (Block 1 MUX out -> c8)
    c_load_block_carry,     # Stage 7 (Block 2 MUX out -> c12)
    c_load_internal_ripple, # Stage 8 (Bit 12 maj3 out)
    c_load_internal_ripple, # Stage 9 (Bit 13 maj3 out)
    c_load_internal_ripple, # Stage 10 (Bit 14 maj3 out)
    c_load_top_output       # Stage 11 (Bit 15 xor3 out -> SUM[15])
]

for idx, ld in enumerate(stage_loads, 1):
    print(f"Stage {idx:2d} Output Load Capacitance: {ld*1000:6.3f} fF")

print("\n================================================================================")
print("3. ACCURATE TRANSITION PROPAGATION & UNATE POLARITY ANALYSIS")
print("================================================================================")

# Let's define the path stages:
stages = [
    # cell, in_pin, out_pin, when, unate
    ("sky130_fd_sc_hd__maj3_1", "A", "X", None, "positive_unate"),
    ("sky130_fd_sc_hd__maj3_1", "C", "X", "!A&!B&C", "positive_unate"),
    ("sky130_fd_sc_hd__maj3_1", "C", "X", "!A&!B&C", "positive_unate"),
    ("sky130_fd_sc_hd__maj3_1", "C", "X", "!A&!B&C", "positive_unate"),
    ("sky130_fd_sc_hd__mux2_1", "A0", "X", None, "positive_unate"),
    ("sky130_fd_sc_hd__mux2_1", "A1", "X", None, "positive_unate"),
    ("sky130_fd_sc_hd__mux2_1", "A1", "X", None, "positive_unate"),
    ("sky130_fd_sc_hd__maj3_1", "C", "X", "!A&!B&C", "positive_unate"),
    ("sky130_fd_sc_hd__maj3_1", "C", "X", "!A&!B&C", "positive_unate"),
    ("sky130_fd_sc_hd__maj3_1", "C", "X", "!A&!B&C", "positive_unate"),
    ("sky130_fd_sc_hd__xor3_1", "C", "X", None, "positive_unate") # for A=0, B=0 condition
]

# Fetch table data for all stages
stage_data = []
for idx, (cname, in_p, out_p, when_c, unate) in enumerate(stages):
    cbody = get_cell_block(cname)
    i1_r, i2_r, m_cr = get_timing_table(cbody, out_p, in_p, "cell_rise", when_c)
    i1_f, i2_f, m_cf = get_timing_table(cbody, out_p, in_p, "cell_fall", when_c)
    i1_tr, i2_tr, m_tr = get_timing_table(cbody, out_p, in_p, "rise_transition", when_c)
    i1_tf, i2_tf, m_tf = get_timing_table(cbody, out_p, in_p, "fall_transition", when_c)
    
    stage_data.append({
        "cell": cname, "in_pin": in_p, "out_pin": out_p,
        "cr": (i1_r, i2_r, m_cr),
        "cf": (i1_f, i2_f, m_cf),
        "tr": (i1_tr, i2_tr, m_tr),
        "tf": (i1_tf, i2_tf, m_tf)
    })

print("All gate stages 1-10 are POSITIVE UNATE. Every rising input creates a rising output;")
print("every falling input creates a falling output.")

# Case A: Slew Propagated Rising Path
current_slew_rise = 0.0531 # Input A[0] slew = 53.1 ps
path_delay_rise_prop = 0.0
delays_rise_prop = []

for idx, sd in enumerate(stage_data):
    ld = stage_loads[idx]
    # Gate output is rising, so cell_rise is used
    d = bilinear_interp(*sd["cr"], current_slew_rise, ld)
    # Output slew is rise_transition
    if sd["tr"][0] is not None:
        out_slew = bilinear_interp(*sd["tr"], current_slew_rise, ld)
    else:
        out_slew = current_slew_rise
    delays_rise_prop.append(d)
    path_delay_rise_prop += d
    current_slew_rise = out_slew

# Case B: Slew Propagated Falling Path
current_slew_fall = 0.0531 # Input A[0] slew = 53.1 ps
path_delay_fall_prop = 0.0
delays_fall_prop = []

for idx, sd in enumerate(stage_data):
    ld = stage_loads[idx]
    # Gate output is falling, so cell_fall is used
    d = bilinear_interp(*sd["cf"], current_slew_fall, ld)
    # Output slew is fall_transition
    if sd["tf"][0] is not None:
        out_slew = bilinear_interp(*sd["tf"], current_slew_fall, ld)
    else:
        out_slew = current_slew_fall
    delays_fall_prop.append(d)
    path_delay_fall_prop += d
    current_slew_fall = out_slew

# Case C: Fixed Nominal Slew (0.0531 ns) with stage-specific loads
path_delay_rise_fixed = sum(bilinear_interp(*sd["cr"], 0.0531, stage_loads[i]) for i, sd in enumerate(stage_data))
path_delay_fall_fixed = sum(bilinear_interp(*sd["cf"], 0.0531, stage_loads[i]) for i, sd in enumerate(stage_data))
path_delay_mean_fixed = (path_delay_rise_fixed + path_delay_fall_fixed) / 2.0

print(f"\n1. Rising Path (Propagated Slew & Stage Loads)  : {path_delay_rise_prop:.4f} ns")
print(f"2. Falling Path (Propagated Slew & Stage Loads) : {path_delay_fall_prop:.4f} ns")
print(f"3. Mean of Propagated Polarities                : {(path_delay_rise_prop + path_delay_fall_prop)/2:.4f} ns")
print(f"4. Fixed-Slew Nominal Rising Path               : {path_delay_rise_fixed:.4f} ns")
print(f"5. Fixed-Slew Nominal Falling Path              : {path_delay_fall_fixed:.4f} ns")
print(f"6. Fixed-Slew Analytical Mean Arc Delay         : {path_delay_mean_fixed:.4f} ns")

out_summary = {
    "path_delay_rise_prop": path_delay_rise_prop,
    "path_delay_fall_prop": path_delay_fall_prop,
    "mean_prop": (path_delay_rise_prop + path_delay_fall_prop)/2,
    "path_delay_rise_fixed": path_delay_rise_fixed,
    "path_delay_fall_fixed": path_delay_fall_fixed,
    "path_delay_mean_fixed": path_delay_mean_fixed,
    "delays_rise_prop": delays_rise_prop,
    "delays_fall_prop": delays_fall_prop
}

with open(r"X:\scripts\timing_propagation_results.json", "w") as f:
    json.dump(out_summary, f, indent=2)
print("\nSaved detailed propagation results to X:\\scripts\\timing_propagation_results.json")
