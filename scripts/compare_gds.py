import struct, os
from collections import Counter

def inspect_gds(gds_path, label):
    print(f"\n{'='*20} {label} {'='*20}")
    print(f"Path: {gds_path}")
    if not os.path.exists(gds_path):
        print("FILE DOES NOT EXIST!")
        return

    file_size = os.path.getsize(gds_path)
    print(f"File Size: {file_size:,} bytes ({file_size / (1024*1024):.2f} MB)")

    structures = []
    current_str = None
    srefs = []
    layers = set()

    with open(gds_path, "rb") as f:
        while True:
            header = f.read(4)
            if len(header) < 4:
                break
            rec_len, rec_type = struct.unpack(">HH", header)
            data_len = rec_len - 4
            data = f.read(data_len) if data_len > 0 else b""

            if rec_type == 0x0606: # STRNAME
                current_str = data.decode("ascii", errors="ignore").rstrip("\x00")
                structures.append(current_str)
            elif rec_type == 0x1206 and current_str == "carry_skip_adder": # SNAME
                sname = data.decode("ascii", errors="ignore").rstrip("\x00")
                srefs.append(sname)
            elif rec_type == 0x0D02 and len(data) >= 2: # LAYER
                layer_num = struct.unpack(">H", data[:2])[0]
                layers.add(layer_num)

    print(f"Top / Primary Cell: carry_skip_adder")
    print(f"Direct Sub-Cell SREFs in carry_skip_adder: {len(srefs)} instances")
    counts = Counter(srefs)
    print("Instance Counts by Cell Type:")
    for k, v in sorted(counts.items()):
        print(f"  {k}: {v}")
    print(f"Contains mux2_1 (Carry-Skip MUX)? {'sky130_fd_sc_hd__mux2_1' in counts}")
    print(f"Contains and4_1 (Group Propagate)? {'sky130_fd_sc_hd__and4_1' in counts}")
    print(f"Physical Mask Layers Present ({len(layers)} layers): {sorted(list(layers))}")

if __name__ == '__main__':
    inspect_gds("physical_design/gds/cska_sky130.gds", "ORIGINAL GDSII (FLATTENED)")
    inspect_gds("physical_design/gds/cska_hier_sky130.gds", "NEW HIERARCHICAL GDSII (TRUE CSKA)")

