import os
import re

lib_path = r"X:\synthesis\sky130_pdk\sky130_fd_sc_hd__tt_025C_1v80.lib"
with open(lib_path, "r", errors="ignore") as f:
    text = f.read()

def get_pin_x_timings(cell_name):
    c_idx = text.find(f'cell ("{cell_name}")')
    if c_idx == -1:
        return []
    c_text = text[c_idx:c_idx+50000] # large enough for cell
    px_idx = c_text.find('pin ("X")')
    if px_idx == -1:
        return []
    px_text = c_text[px_idx:]
    
    # find all timing blocks inside pin X
    timings = []
    t_matches = list(re.finditer(r'timing\s*\(\s*\)\s*\{', px_text))
    for i, tm in enumerate(t_matches):
        start = tm.start()
        # end is next timing block or end of pin
        end = t_matches[i+1].start() if i+1 < len(t_matches) else len(px_text)
        block = px_text[start:end]
        
        rp = re.search(r'related_pin\s*:\s*"([^"]+)"', block)
        when = re.search(r'when\s*:\s*"([^"]+)"', block)
        ts = re.search(r'timing_sense\s*:\s*([^;]+);', block)
        
        # cell_rise
        cr_m = re.search(r'cell_rise\s*\([^)]*\)\s*\{([^}]+)\}', block)
        cf_m = re.search(r'cell_fall\s*\([^)]*\)\s*\{([^}]+)\}', block)
        
        def get_grid_val(t_str, r_idx=2, c_idx=2): # 3rd row, 3rd col -> 0.053ns, 3.35fF
            if not t_str: return None
            # extract string inside values(...)
            val_m = re.search(r'values\s*\((.*?)\);', t_str, re.DOTALL)
            if not val_m: return None
            raw_rows = val_m.group(1).split('\\')
            rows = []
            for r in raw_rows:
                cleaned = r.strip().strip('"').strip(';').strip(',')
                nums = [float(x.strip().strip('"')) for x in cleaned.split(',') if x.strip().strip('"')]
                if nums:
                    rows.append(nums)
            if len(rows) > r_idx and len(rows[r_idx]) > c_idx:
                return rows[r_idx][c_idx]
            return None

        cr_val = get_grid_val(cr_m.group(1)) if cr_m else None
        cf_val = get_grid_val(cf_m.group(1)) if cf_m else None
        
        timings.append({
            "related_pin": rp.group(1) if rp else None,
            "when": when.group(1) if when else None,
            "sense": ts.group(1).strip() if ts else None,
            "cell_rise_nom": cr_val,
            "cell_fall_nom": cf_val
        })
    return timings

for cell in ["sky130_fd_sc_hd__maj3_1", "sky130_fd_sc_hd__mux2_1", "sky130_fd_sc_hd__xor3_1", "sky130_fd_sc_hd__and4_1", "sky130_fd_sc_hd__xor2_1"]:
    print(f"\n==================== {cell} ====================")
    t_list = get_pin_x_timings(cell)
    for t in t_list:
        cr = f"{t['cell_rise_nom']:.4f} ns" if t['cell_rise_nom'] is not None else "None"
        cf = f"{t['cell_fall_nom']:.4f} ns" if t['cell_fall_nom'] is not None else "None"
        when_str = f" [when: {t['when']}]" if t['when'] else ""
        print(f"  {t['related_pin']} -> X ({t['sense']}){when_str}: rise={cr}, fall={cf}")
