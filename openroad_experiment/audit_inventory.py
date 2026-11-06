import os
import hashlib
import datetime

base_art = r"D:\mini project\openroad_experiment\artifacts"
base_logs = r"D:\mini project\openroad_experiment\logs"

configs = {
    "SKY130HD_CSKA": ("sky130hd_cska", "logs_sky130hd_cska/sky130hd/carry_skip_adder/base"),
    "SKY130HS_CSKA": ("sky130hs_cska", "logs_sky130hs_cska/sky130hs/carry_skip_adder/base"),
    "SKY130HD_RCA":  ("sky130hd_rca",  "logs_sky130hd_rca/sky130hd/ripple_carry_adder/base"),
    "SKY130HS_RCA":  ("sky130hs_rca",  "logs_sky130hs_rca/sky130hs/ripple_carry_adder/base"),
}

def get_info(path):
    if not os.path.exists(path):
        return None
    size = os.path.getsize(path)
    mtime = datetime.datetime.fromtimestamp(os.path.getmtime(path)).strftime("%Y-%m-%d %H:%M:%S")
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return {"path": path, "size": size, "mtime": mtime, "sha256": h.hexdigest()}

for cfg_name, (art_subdir, log_subdir) in configs.items():
    print(f"=== {cfg_name} ===")
    art_dir = os.path.join(base_art, art_subdir)
    log_dir = os.path.join(base_logs, log_subdir)
    
    files_to_check = [
        ("Final GDS", os.path.join(art_dir, "6_final.gds")),
        ("Final DEF", os.path.join(art_dir, "6_final.def")),
        ("Final Netlist", os.path.join(art_dir, "6_final.v")),
        ("SPEF", os.path.join(art_dir, "6_final.spef")),
        ("SDC", os.path.join(art_dir, "6_final.sdc")),
        ("Synthesized Verilog", os.path.join(log_dir, "1_2_yosys.v")),
        ("Synthesis Log", os.path.join(log_dir, "1_2_yosys.log")),
        ("Floorplan Log", os.path.join(log_dir, "2_1_floorplan.log")),
        ("Placement Log", os.path.join(log_dir, "3_5_place_dp.log")),
        ("Global Route Log", os.path.join(log_dir, "5_1_grt.log")),
        ("Detailed Route Log", os.path.join(log_dir, "5_2_route.log")),
        ("Final Report Log", os.path.join(log_dir, "6_report.log")),
        ("DRC Report", os.path.join(log_dir, "5_route_drc.rpt")),
        ("Antenna Report", os.path.join(log_dir, "5_route_antenna.rpt")),
    ]
    for label, fpath in files_to_check:
        info = get_info(fpath)
        if info:
            s = info["size"]
            m = info["mtime"]
            sh = info["sha256"]
            fn = os.path.basename(fpath)
            print(f"  {label:25} | {fn:18} | {s:8} B | {m} | {sh}")
        else:
            print(f"  {label:25} | MISSING at {fpath}")
    print()

