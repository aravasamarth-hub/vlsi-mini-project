#!/usr/bin/env python3
"""
Master Synthesis Automation Engine for SkyWater 130nm (SKY130HD)
Synthesizes all five 16-bit adder architectures using Yosys & ABC,
maps them to sky130_fd_sc_hd__tt_025C_1v80.lib, generates gate netlists,
and extracts area, cell count, and gate composition statistics.
"""

import os
import sys
import subprocess
import json
import csv
import re
import time

PROJECT_ROOT = r"X:" if os.path.exists(r"X:\rtl") else r"D:\mini project"
TOOLS_DIR = os.path.join(PROJECT_ROOT, "tools", "oss-cad-suite")
BIN_DIR = os.path.join(TOOLS_DIR, "bin")
LIB_DIR = os.path.join(TOOLS_DIR, "lib")
YOSYS = os.path.join(BIN_DIR, "yosys.exe")

PDK_LIB = "synthesis/sky130_pdk/sky130_fd_sc_hd__tt_025C_1v80.lib"

ARCHITECTURES = {
    "RCA": {
        "top": "ripple_carry_adder",
        "sources": ["rtl/half_adder.v", "rtl/full_adder.v", "rtl/ripple_carry_adder.v"]
    },
    "CSKA": {
        "top": "carry_skip_adder",
        "sources": ["rtl/half_adder.v", "rtl/full_adder.v", "rtl/carry_skip_block_4bit.v", "rtl/carry_skip_adder.v"]
    },
    "CLA": {
        "top": "carry_lookahead_adder",
        "sources": ["rtl/cla_block_4bit.v", "rtl/carry_lookahead_adder.v"]
    },
    "CSLA": {
        "top": "carry_select_adder",
        "sources": ["rtl/half_adder.v", "rtl/full_adder.v", "rtl/csla_block_4bit.v", "rtl/carry_select_adder.v"]
    },
    "BK": {
        "top": "brent_kung_adder",
        "sources": ["rtl/brent_kung_adder.v"]
    }
}

def get_env():
    env = dict(os.environ)
    env["PATH"] = f"{BIN_DIR};{LIB_DIR};" + env.get("PATH", "")
    return env

def synthesize_architecture(name, config):
    top = config["top"]
    sources = config["sources"]
    
    print(f"\n======================================================================")
    print(f"[*] Synthesizing Architecture: {name} (Top: {top}) to SKY130 HD")
    print(f"======================================================================")
    
    os.makedirs(os.path.join(PROJECT_ROOT, "synthesis", "yosys_scripts"), exist_ok=True)
    os.makedirs(os.path.join(PROJECT_ROOT, "synthesis", "netlists"), exist_ok=True)
    os.makedirs(os.path.join(PROJECT_ROOT, "synthesis", "reports"), exist_ok=True)
    
    ys_filename = f"synthesis/yosys_scripts/synth_{name.lower()}.ys"
    netlist_filename = f"synthesis/netlists/{name.lower()}_sky130_netlist.v"
    log_filename = f"synthesis/reports/{name.lower()}_synth.log"
    
    read_cmds = "\n".join([f"read_verilog {src}" for src in sources])
    
    script_content = f"""# Yosys Synthesis Script for {name} targeting SkyWater 130nm
{read_cmds}
hierarchy -check -top {top}
proc
opt
flatten
opt
synth -top {top}
dfflibmap -liberty {PDK_LIB}
abc -liberty {PDK_LIB}
clean
write_verilog -noattr {netlist_filename}
stat -liberty {PDK_LIB}
"""

    ys_path = os.path.join(PROJECT_ROOT, ys_filename)
    with open(ys_path, "w") as f:
        f.write(script_content)
        
    t0 = time.time()
    res = subprocess.run([YOSYS, "-s", ys_filename], cwd=PROJECT_ROOT, capture_output=True, text=True, env=get_env())
    t_synth = time.time() - t0
    
    log_path = os.path.join(PROJECT_ROOT, log_filename)
    with open(log_path, "w") as f:
        f.write(res.stdout)
        if res.stderr:
            f.write("\nSTDERR:\n" + res.stderr)
            
    if res.returncode != 0:
        print(f"[-] Synthesis failed for {name}!")
        return {"architecture": name, "status": "FAILED", "error": res.stderr}
        
    # Parse statistics from log
    area_match = re.search(r"Chip area for module '.*':\s+([0-9.]+)", res.stdout)
    area = float(area_match.group(1)) if area_match else 0.0

    # Parse cell details and statistics
    cell_details = {}
    std_cells_count = 0
    gate_categories = {
        "XOR_XNOR": 0,
        "MAJ": 0,
        "AND_NAND": 0,
        "OR_NOR": 0,
        "AOI_OAI": 0,
        "MUX": 0,
        "INV_BUF": 0,
        "OTHER": 0
    }

    for line in res.stdout.split("\n"):
        m = re.search(r"^\s*(\d+)\s+([0-9.]+)?\s*(sky130_fd_sc_hd__\S+)", line)
        if m:
            count = int(m.group(1))
            cname = m.group(3)
            cell_details[cname] = count
            std_cells_count += count
            
            if "xor" in cname or "xnor" in cname:
                gate_categories["XOR_XNOR"] += count
            elif "maj" in cname:
                gate_categories["MAJ"] += count
            elif "nand" in cname or "and" in cname:
                gate_categories["AND_NAND"] += count
            elif "nor" in cname or "or" in cname:
                gate_categories["OR_NOR"] += count
            elif "aoi" in cname or "oai" in cname or "a21" in cname or "o21" in cname or "a31" in cname or "o31" in cname:
                gate_categories["AOI_OAI"] += count
            elif "mux" in cname:
                gate_categories["MUX"] += count
            elif "inv" in cname or "buf" in cname:
                gate_categories["INV_BUF"] += count
            else:
                gate_categories["OTHER"] += count

    print(f"[+] Synthesis Complete in {t_synth:.2f}s")
    print(f"    Standard Cells : {std_cells_count}")
    print(f"    Cell Area      : {area:.2f} um^2")
    print(f"    Netlist        : {netlist_filename}")
    
    return {
        "architecture": name,
        "top_module": top,
        "status": "COMPLETED",
        "synth_time_sec": round(t_synth, 2),
        "total_cells": std_cells_count,
        "cell_area_um2": area,
        "gate_categories": gate_categories,
        "cell_details": cell_details,
        "netlist_path": netlist_filename,
        "log_path": log_filename
    }

def main():
    print(f">>> STARTING FULL SKY130 LOGIC SYNTHESIS FLOW <<<")
    results = []
    
    for name, config in ARCHITECTURES.items():
        res = synthesize_architecture(name, config)
        results.append(res)
        
    # Save JSON summary
    json_path = os.path.join(PROJECT_ROOT, "synthesis", "reports", "synthesis_summary.json")
    with open(json_path, "w") as f:
        json.dump(results, f, indent=2)
        
    # Save CSV summary
    csv_path = os.path.join(PROJECT_ROOT, "synthesis", "reports", "synthesis_summary.csv")
    with open(csv_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Architecture", "Top Module", "Status", "Total Cells", "Cell Area (um^2)", "Synth Time (s)"])
        for r in results:
            writer.writerow([r["architecture"], r["top_module"], r["status"], r.get("total_cells", 0), r.get("cell_area_um2", 0), r.get("synth_time_sec", 0)])
            
    print(f"\n======================================================================")
    print(f">>> SYNTHESIS RESULTS TABLE (SKYWATER 130nm - SKY130HD)")
    print(f"======================================================================")
    print(f"{'Architecture':<15} | {'Status':<10} | {'Cells':<8} | {'Area (um^2)':<12} | {'Time (s)':<8}")
    print("-" * 65)
    for r in results:
        print(f"{r['architecture']:<15} | {r['status']:<10} | {r.get('total_cells', 0):<8} | {r.get('cell_area_um2', 0):<12.2f} | {r.get('synth_time_sec', 0):<8}")
    print("=" * 65)
    print(f"Reports saved to {json_path} and {csv_path}")

if __name__ == "__main__":
    main()
