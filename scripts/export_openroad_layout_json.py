#!/usr/bin/env python3
"""
CYBERCORE 3D - Export OpenROAD Physical Layouts to JSON for Interactive UI
Extracts micrometer-accurate vector coordinates for:
- sky130hs_cska (53.975 x 53.975 um, 233 components)
- sky130hd_cska (49.880 x 51.680 um, 196 components)
- sky130hs_rca  (48.480 x 48.480 um, 178 components)
- sky130hd_rca  (45.120 x 46.240 um, 154 components)
"""

import os
import re
import json

def parse_lef_macros(lef_path):
    macro_sizes = {}
    if not os.path.exists(lef_path):
        return macro_sizes
    with open(lef_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    for m in re.finditer(r'MACRO\s+(\S+).*?SIZE\s+([\d.]+)\s+BY\s+([\d.]+)\s*;.*?END\s+\1', content, re.DOTALL):
        macro_sizes[m.group(1)] = {
            'width': float(m.group(2)),
            'height': float(m.group(3))
        }
    return macro_sizes

def parse_def(def_path, macro_sizes, units=1000):
    if not os.path.exists(def_path):
        return None
    with open(def_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Die area
    die_match = re.search(r'DIEAREA\s*\(\s*(\d+)\s+(\d+)\s*\)\s*\(\s*(\d+)\s+(\d+)\s*\)', content)
    die = {
        'x1': int(die_match.group(1)),
        'y1': int(die_match.group(2)),
        'x2': int(die_match.group(3)),
        'y2': int(die_match.group(4))
    } if die_match else {'x1': 0, 'y1': 0, 'x2': 50000, 'y2': 50000}

    # Rows
    rows = []
    for m in re.finditer(r'ROW\s+(\S+)\s+\S+\s+(\d+)\s+(\d+)\s+(\S+)\s+DO\s+(\d+)\s+BY\s+(\d+)\s+STEP\s+(\d+)\s+(\d+)', content):
        rows.append({
            'name': m.group(1),
            'x': int(m.group(2)),
            'y': int(m.group(3)),
            'orient': m.group(4),
            'numX': int(m.group(5)),
            'stepX': int(m.group(7))
        })

    # Components
    components = []
    comp_sec = re.search(r'COMPONENTS\s+(\d+)\s*;(.*?)END COMPONENTS', content, re.DOTALL)
    if comp_sec:
        for m in re.finditer(r'-\s+(\S+)\s+(\S+)\s+.*?\(\s*(\d+)\s+(\d+)\s*\)\s*(\S+)', comp_sec.group(2)):
            cid = m.group(1)
            macro = m.group(2)
            cx = int(m.group(3))
            cy = int(m.group(4))
            orient = m.group(5)

            # Get size in dbu (units=1000)
            msize = macro_sizes.get(macro, {'width': 2.0, 'height': 3.33})
            cw = int(msize['width'] * units)
            ch = int(msize['height'] * units)

            # Categorize cell type
            is_fill = 'fill' in macro
            is_tap = 'tap' in macro
            is_fa = '__fa_' in macro
            is_ha = '__ha_' in macro
            is_mux = '__mux' in macro
            is_buf = '__buf' in macro or '__clkbuf' in macro
            is_inv = '__inv' in macro
            is_and = '__and' in macro
            is_xor = '__xor' in macro or '__xnor' in macro

            cell_group = 'OTHER'
            if is_fa: cell_group = 'FULL_ADDER'
            elif is_ha: cell_group = 'HALF_ADDER'
            elif is_mux: cell_group = 'SKIP_MUX'
            elif is_and: cell_group = 'AND_GATE'
            elif is_xor: cell_group = 'XOR_GATE'
            elif is_buf: cell_group = 'BUFFER'
            elif is_inv: cell_group = 'INVERTER'
            elif is_tap: cell_group = 'WELL_TAP'
            elif is_fill: cell_group = 'DECAP_FILL'

            components.append({
                'id': cid,
                'macro': macro,
                'x': cx,
                'y': cy,
                'w': cw,
                'h': ch,
                'orient': orient,
                'group': cell_group
            })

    # Pins
    pins = []
    pin_sec = re.search(r'PINS\s+(\d+)\s*;(.*?)END PINS', content, re.DOTALL)
    if pin_sec:
        for m in re.finditer(r'-\s+(\S+)\s+\+\s+NET\s+\S+\s+\+\s+DIRECTION\s+(\S+).*?LAYER\s+(\S+)\s+\(\s*([-\d]+)\s+([-\d]+)\s*\)\s*\(\s*([-\d]+)\s+([-\d]+)\s*\).*?PLACED\s+\(\s*(\d+)\s+(\d+)\s*\)\s*(\S+)', pin_sec.group(2), re.DOTALL):
            pins.append({
                'name': m.group(1),
                'dir': m.group(2),
                'layer': m.group(3),
                'x': int(m.group(8)),
                'y': int(m.group(9)),
                'dx1': int(m.group(4)),
                'dy1': int(m.group(5)),
                'dx2': int(m.group(6)),
                'dy2': int(m.group(7)),
                'orient': m.group(10)
            })

    # Specialnets (power stripes)
    stripes = []
    snet_sec = re.search(r'SPECIALNETS\s+(\d+)\s*;(.*?)END SPECIALNETS', content, re.DOTALL)
    if snet_sec:
        for m in re.finditer(r'(VDD|VSS).*?(?=;\s*(?:-|\Z))', snet_sec.group(2), re.DOTALL):
            net_name = m.group(1)
            body = m.group(0)
            for seg in re.finditer(r'(met\d+)\s+(\d+)\s+\+\s+SHAPE\s+(\S+)\s+\(\s*(\d+)\s+(\d+)\s*\)\s+\(\s*(\d+)\s+(\d+)\s*\)', body):
                stripes.append({
                    'net': net_name,
                    'layer': seg.group(1),
                    'width': int(seg.group(2)),
                    'shape': seg.group(3),
                    'x1': int(seg.group(4)),
                    'y1': int(seg.group(5)),
                    'x2': int(seg.group(6)),
                    'y2': int(seg.group(7))
                })

    # Routed Wire Segments (from NETS)
    wire_segments = []
    nets_sec = re.search(r'NETS\s+(\d+)\s*;(.*?)END NETS', content, re.DOTALL)
    if nets_sec:
        for m in re.finditer(r'-\s+(\S+)\s+(.*?);', nets_sec.group(2), re.DOTALL):
            net_name = m.group(1)
            net_body = m.group(2)
            branches = re.split(r'ROUTED|NEW', net_body)[1:]
            for br in branches:
                tokens = br.strip().split()
                if not tokens:
                    continue
                layer = tokens[0]
                coords = []
                curr_x, curr_y = 0, 0
                for pt in re.finditer(r'\(\s*([-\d*]+)\s+([-\d*]+)(?:\s+[-\d*]+)?\s*\)', br):
                    xs, ys = pt.group(1), pt.group(2)
                    if xs != '*':
                        curr_x = int(xs)
                    if ys != '*':
                        curr_y = int(ys)
                    coords.append((curr_x, curr_y))
                if len(coords) >= 2:
                    for i in range(len(coords) - 1):
                        wire_segments.append({
                            'net': net_name,
                            'layer': layer,
                            'x1': coords[i][0],
                            'y1': coords[i][1],
                            'x2': coords[i+1][0],
                            'y2': coords[i+1][1]
                        })

    return {
        'die': die,
        'rows': rows,
        'components': components,
        'pins': pins,
        'stripes': stripes,
        'wires': wire_segments
    }

def main():
    print("Loading LEF macro geometries...")
    hs_macros = parse_lef_macros("synthesis/sky130_pdk/sky130_fd_sc_hs_merged.lef")
    hd_macros = parse_lef_macros("synthesis/sky130_pdk/sky130_fd_sc_hd_merged.lef")
    print(f"Loaded {len(hs_macros)} HS macros, {len(hd_macros)} HD macros.")

    targets = [
        {
            'key': 'sky130hs_cska',
            'title': 'SKY130HS CSKA (High-Speed Carry Skip Adder)',
            'def_path': 'CYBERCORE_3D_FINAL/physical_design/sky130hs_cska/6_final.def',
            'macros': hs_macros,
            'pdk': 'sky130_fd_sc_hs',
            'gds': 'CYBERCORE_3D_FINAL/physical_design/sky130hs_cska/6_final.gds'
        },
        {
            'key': 'sky130hd_cska',
            'title': 'SKY130HD CSKA (High-Density Carry Skip Adder)',
            'def_path': 'CYBERCORE_3D_FINAL/physical_design/sky130hd_cska/6_final.def',
            'macros': hd_macros,
            'pdk': 'sky130_fd_sc_hd',
            'gds': 'CYBERCORE_3D_FINAL/physical_design/sky130hd_cska/6_final.gds'
        },
        {
            'key': 'sky130hs_rca',
            'title': 'SKY130HS RCA (High-Speed Ripple Carry Baseline)',
            'def_path': 'CYBERCORE_3D_FINAL/physical_design/sky130hs_rca/6_final.def',
            'macros': hs_macros,
            'pdk': 'sky130_fd_sc_hs',
            'gds': 'CYBERCORE_3D_FINAL/physical_design/sky130hs_rca/6_final.gds'
        },
        {
            'key': 'sky130hd_rca',
            'title': 'SKY130HD RCA (High-Density Ripple Carry Baseline)',
            'def_path': 'CYBERCORE_3D_FINAL/physical_design/sky130hd_rca/6_final.def',
            'macros': hd_macros,
            'pdk': 'sky130_fd_sc_hd',
            'gds': 'CYBERCORE_3D_FINAL/physical_design/sky130hd_rca/6_final.gds'
        }
    ]

    out_data = {}
    for tgt in targets:
        print(f"Parsing DEF: {tgt['key']} ({tgt['def_path']})...")
        res = parse_def(tgt['def_path'], tgt['macros'])
        if res:
            res['meta'] = {
                'title': tgt['title'],
                'pdk': tgt['pdk'],
                'gds': tgt['gds'],
                'component_count': len(res['components']),
                'wire_count': len(res['wires']),
                'pin_count': len(res['pins']),
                'stripe_count': len(res['stripes'])
            }
            out_data[tgt['key']] = res
            print(f"  -> {tgt['key']}: {len(res['components'])} components, {len(res['wires'])} wires, {len(res['pins'])} pins, {len(res['stripes'])} stripes.")

    os.makedirs("frontend/src/data", exist_ok=True)
    out_file = "frontend/src/data/openroad_physical_layouts.json"
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(out_data, f)
    print(f"SUCCESS: Exported {len(out_data)} physical layouts to {out_file} (Size: {os.path.getsize(out_file)} bytes)")

if __name__ == '__main__':
    main()

