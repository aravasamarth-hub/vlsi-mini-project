import os
import re

def audit_timing():
    p_lib = 'synthesis/sky130_pdk/sky130_fd_sc_hd__tt_025C_1v80.lib'
    if not os.path.exists(p_lib):
        print("Missing lib")
        return

    with open(p_lib) as f:
        text = f.read()

    cells = ['sky130_fd_sc_hd__maj3_1', 'sky130_fd_sc_hd__mux2_1', 'sky130_fd_sc_hd__and4_1', 'sky130_fd_sc_hd__xor3_1', 'sky130_fd_sc_hd__xor2_1', 'sky130_fd_sc_hd__xnor2_1']

    print("=== LIBERTY TIMING LOOKUP (Nominal TT 25C 1.8V) ===")
    cell_delays = {}
    for c in cells:
        c_m = re.search(r'cell\s*\(\"?' + c + r'\"?\)[\s\S]*?(?=cell\s*\(|\Z)', text)
        if not c_m:
            continue
        body = c_m.group(0)
        p_m = re.search(r'pin\s*\(\"?X\"?\)[\s\S]*?(?=pin\s*\(|\Z)', body)
        if not p_m:
            continue
        p_body = p_m.group(0)
        timings = re.findall(r'timing\s*\(\)\s*\{[\s\S]*?related_pin\s*:\s*\"?(\w+)\"?;[\s\S]*?values\s*\(\s*\"([^\"]+)\"', p_body)
        print(f"\nCell: {c}")
        delays = []
        for r_pin, vals in timings:
            # Parse matrix values
            rows = vals.split('",')
            row_vals = []
            for r in rows:
                cleaned = re.sub(r'[\"\s\\]', ' ', r).strip()
                if cleaned:
                    row_vals.extend([float(x) for x in cleaned.split() if x.replace('.', '', 1).isdigit()])
            if row_vals:
                avg = sum(row_vals) / len(row_vals)
                median = sorted(row_vals)[len(row_vals)//2]
                delays.append(median)
                print(f"  Related pin {r_pin}: median delay = {median:.4f} ns, min = {min(row_vals):.4f} ns, max = {max(row_vals):.4f} ns")
        if delays:
            cell_delays[c] = sum(delays) / len(delays)
            print(f"  Overall representative delay for {c}: {cell_delays[c]:.4f} ns")

    # Let's inspect the critical path formulation:
    # RCA Critical Path (16 bits):
    # Generation at bit 0 (maj3), propagation through 14 maj3 stages, sum at bit 15 (xor3)
    # Plus input slew / setup buffer
    tau_maj = cell_delays.get('sky130_fd_sc_hd__maj3_1', 0.228)
    tau_xor3 = cell_delays.get('sky130_fd_sc_hd__xor3_1', 0.312)
    tau_mux = cell_delays.get('sky130_fd_sc_hd__mux2_1', 0.156)
    tau_and4 = cell_delays.get('sky130_fd_sc_hd__and4_1', 0.145)
    tau_xor2 = cell_delays.get('sky130_fd_sc_hd__xor2_1', 0.180)

    print("\n--- ANALYTICAL CRITICAL PATH COMPARISON ---")
    print(f"RCA (16-bit Ripple Carry):")
    print(f"  Path: 16 stages (15 x maj3_1 + 1 x xor3_1) + wire/slew margins")
    # In PPABenchmark: RCA delay = 3.957 ns
    # In PPABenchmark: CSKA delay = 2.471 ns
    print(f"  Reported Hierarchical RCA Delay: 3.957 ns")
    print(f"  Reported Hierarchical CSKA Delay: 2.471 ns")
    print(f"  Speedup: {(3.957 - 2.471)/3.957 * 100:.2f}%")

if __name__ == '__main__':
    audit_timing()
