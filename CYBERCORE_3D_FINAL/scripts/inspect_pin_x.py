import os
import re

lib_path = r"X:\synthesis\sky130_pdk\sky130_fd_sc_hd__tt_025C_1v80.lib"
with open(lib_path, "r", errors="ignore") as f:
    text = f.read()

for cell in ["sky130_fd_sc_hd__maj3_1", "sky130_fd_sc_hd__mux2_1", "sky130_fd_sc_hd__xor3_1"]:
    idx = text.find(f'cell ("{cell}")')
    print(f"=== {cell} (idx: {idx}) ===")
    if idx != -1:
        # print first 2500 chars
        snippet = text[idx:idx+3500]
        # find pin ("X")
        px = snippet.find('pin ("X")')
        if px != -1:
            print(snippet[px:px+2500])
        else:
            print(snippet[:1500])

