#!/usr/bin/env python3
"""
Deep timing arc extractor for SkyWater 130nm Liberty file:
sky130_fd_sc_hd__tt_025C_1v80.lib
Extracts full NLDM 2D tables for:
- maj3_1: pins A, B, C -> X
- mux2_1: pins A0, A1, S -> X
- xor3_1: pins A, B, C -> X
- and4_1: pins A, B, C, D -> X
- xor2_1: pins A, B -> X
"""

import os
import re
import json

LIB_PATH = r"X:\synthesis\sky130_pdk\sky130_fd_sc_hd__tt_025C_1v80.lib"

with open(LIB_PATH, "r", errors="ignore") as f:
    lib_text = f.read()

def parse_cell(cell_name):
    # Find cell start
    cell_pattern = rf'cell\s*\(\s*"{cell_name}"\s*\)\s*\{{'
    m = re.search(cell_pattern, lib_text)
    if not m:
        return None
    start_pos = m.start()

    # Find matching closing brace
    brace_count = 0
    end_pos = start_pos
    for i in range(start_pos, len(lib_text)):
        if lib_text[i] == '{':
            brace_count += 1
        elif lib_text[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                end_pos = i + 1
                break

    cell_body = lib_text[start_pos:end_pos]
    return cell_body

def extract_pin_timing(cell_body, pin_name):
    # Find pin
    pin_pattern = rf'pin\s*\(\s*"{pin_name}"\s*\)\s*\{{'
    m = re.search(pin_pattern, cell_body)
    if not m:
        return []
    start_pos = m.start()
    brace_count = 0
    end_pos = start_pos
    for i in range(start_pos, len(cell_body)):
        if cell_body[i] == '{':
            brace_count += 1
        elif cell_body[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                end_pos = i + 1
                break
    pin_body = cell_body[start_pos:end_pos]

    # Find timing blocks inside pin
    timings = []
    timing_matches = list(re.finditer(r'timing\s*\(\s*\)\s*\{', pin_body))
    for tm in timing_matches:
        t_start = tm.start()
        bc = 0
        t_end = t_start
        for j in range(t_start, len(pin_body)):
            if pin_body[j] == '{':
                bc += 1
            elif pin_body[j] == '}':
                bc -= 1
                if bc == 0:
                    t_end = j + 1
                    break
        t_body = pin_body[t_start:t_end]

        # Extract related_pin, timing_sense, cell_rise, cell_fall
        rp = re.search(r'related_pin\s*:\s*"([^"]+)"', t_body)
        ts = re.search(r'timing_sense\s*:\s*([^;]+);', t_body)
        when = re.search(r'when\s*:\s*"([^"]+)"', t_body)

        rise_table = re.search(r'cell_rise\s*\([^)]*\)\s*\{([^}]+)\}', t_body)
        fall_table = re.search(r'cell_fall\s*\([^)]*\)\s*\{([^}]+)\}', t_body)

        def parse_table_values(tbl_str):
            if not tbl_str:
                return []
            vals = []
            for line in tbl_str.splitlines():
                line = line.strip().strip('"').strip(';,')
                if line and not line.startswith('values'):
                    parts = [float(x.strip().strip('"').strip(',')) for x in line.split(',') if x.strip().strip('"').strip(',')]
                    if parts:
                        vals.append(parts)
                elif 'values' in line:
                    sub = line[line.find('(')+1:]
                    sub = sub.strip().strip('"').strip(';,')
                    parts = [float(x.strip().strip('"').strip(',')) for x in sub.split(',') if x.strip().strip('"').strip(',')]
                    if parts:
                        vals.append(parts)
            return vals

        timings.append({
            "related_pin": rp.group(1) if rp else None,
            "timing_sense": ts.group(1).strip() if ts else None,
            "when": when.group(1).strip() if when else None,
            "cell_rise_table": parse_table_values(rise_table.group(1)) if rise_table else None,
            "cell_fall_table": parse_table_values(fall_table.group(1)) if fall_table else None
        })
    return timings

cells_to_extract = [
    ("sky130_fd_sc_hd__maj3_1", "X"),
    ("sky130_fd_sc_hd__mux2_1", "X"),
    ("sky130_fd_sc_hd__xor3_1", "X"),
    ("sky130_fd_sc_hd__and4_1", "X"),
    ("sky130_fd_sc_hd__xor2_1", "X")
]

results = {}
for cname, outpin in cells_to_extract:
    body = parse_cell(cname)
    if body:
        t_arcs = extract_pin_timing(body, outpin)
        results[cname] = t_arcs
        print(f"Extracted {len(t_arcs)} timing arcs for {cname} pin {outpin}")
    else:
        print(f"Cell {cname} not found!")

# Save to json
out_file = r"X:\scripts\liberty_timing_arcs.json"
with open(out_file, "w") as f:
    json.dump(results, f, indent=2)
print("Saved to", out_file)
