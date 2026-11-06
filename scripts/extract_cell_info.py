with open('synthesis/sky130_pdk/sky130_fd_sc_hd__tt_025C_1v80.lib') as f:
    in_cell = False
    for i, line in enumerate(f):
        if 'cell ("sky130_fd_sc_hd__mux2_4")' in line:
            in_cell = True
        if in_cell:
            if 'pin ("X")' in line or 'function :' in line:
                print(f'{i+1}: {line.strip()}')
            if line.strip().startswith('cell (') and 'mux2_4' not in line:
                break

