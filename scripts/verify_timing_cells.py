import os

lib_path = r"D:\mini project\synthesis\sky130_pdk\sky130_fd_sc_hd__tt_025C_1v80.lib"
cells = [
    "sky130_fd_sc_hd__maj3_1",
    "sky130_fd_sc_hd__mux2_1",
    "sky130_fd_sc_hd__and4_1",
    "sky130_fd_sc_hd__xor3_1",
    "sky130_fd_sc_hd__xnor2_1"
]

print("=== SKY130 LIBERTY TIMING MODEL INSPECTION ===")
with open(lib_path, "r", errors="ignore") as f:
    text = f.read()

for c in cells:
    key = f'cell ("{c}")'
    idx = text.find(key)
    if idx != -1:
        area_idx = text.find("area :", idx)
        area_val = text[area_idx:area_idx+20].split(";")[0].strip()
        print(f"Cell: {c} | {area_val}")
    else:
        print(f"Cell: {c} | NOT FOUND")

# Timing parameters used in project
tau_setup = 0.240   # ns (input slew / pad transition)
tau_fa_cout = 0.228 # ns (majority-3 / carry delay)
tau_fa_sum  = 0.312 # ns (xor3 sum generation)
tau_mux     = 0.156 # ns (mux2_1 select-to-out)
tau_and4    = 0.145 # ns (and4_1 group propagate)

# 1. 16-bit CSKA Analytical Critical Path (4 blocks of 4 bits: M=4, k=4)
# Worst case: Carry generated at bit 0 of Block 0, ripples 3 stages in Block 0,
# skips Block 1 and Block 2 via 2:1 MUX (M - 2 = 2 skips), and propagates to final sum of Block 3.
t_cska = tau_setup + (4 - 1) * tau_fa_cout + (4 - 2) * tau_mux + tau_fa_sum
print(f"\n1. CSKA Critical Path: {tau_setup} + 3*{tau_fa_cout} + 2*{tau_mux} + {tau_fa_sum} = {t_cska:.3f} ns")

# 2. 16-bit RCA Analytical Critical Path (16 full adders: N=16)
# Worst case: Carry generated at bit 0, ripples across all 15 remaining stages, and resolves sum at bit 15.
t_rca = tau_setup + (16 - 1) * tau_fa_cout + tau_fa_sum
print(f"2. RCA Critical Path : {tau_setup} + 15*{tau_fa_cout} + {tau_fa_sum} = {t_rca:.3f} ns")

speedup = (t_rca - t_cska) / t_rca * 100
ratio = t_rca / t_cska
print(f"Speedup: {speedup:.1f}% ({ratio:.2f}x faster)")

