#!/usr/bin/env python3
"""
Master Simulation and Functional Verification Engine
Executes Icarus Verilog simulations, generates VCD waveforms,
and verifies 10,000 randomized vectors across all 5 adder architectures.
"""

import os
import sys
import subprocess
import json
import time

PROJECT_ROOT = r"X:" if os.path.exists(r"X:\rtl") else r"D:\mini project"
TOOLS_DIR = os.path.join(PROJECT_ROOT, "tools", "oss-cad-suite")
BIN_DIR = os.path.join(TOOLS_DIR, "bin")
LIB_DIR = os.path.join(TOOLS_DIR, "lib")

IVERILOG = os.path.join(BIN_DIR, "iverilog.exe")
VVP = os.path.join(BIN_DIR, "vvp.exe")

RTL_FILES = [
    "rtl/half_adder.v",
    "rtl/full_adder.v",
    "rtl/ripple_carry_adder.v",
    "rtl/carry_skip_block_4bit.v",
    "rtl/carry_skip_adder.v",
    "rtl/cla_block_4bit.v",
    "rtl/carry_lookahead_adder.v",
    "rtl/csla_block_4bit.v",
    "rtl/carry_select_adder.v",
    "rtl/brent_kung_adder.v",
    "verification/common_reference_model.v"
]

TESTBENCHES = {
    "CSKA": {
        "tb": "verification/testbench_cska.v",
        "vvp": "simulation/tb_cska.vvp",
        "log": "simulation/simulation_logs/cska_verification.log",
        "vcd": "simulation/waveforms/carry_skip_adder.vcd"
    },
    "RCA": {
        "tb": "verification/testbench_rca.v",
        "vvp": "simulation/tb_rca.vvp",
        "log": "simulation/simulation_logs/rca_verification.log",
        "vcd": "simulation/waveforms/ripple_carry_adder.vcd"
    },
    "CLA": {
        "tb": "verification/testbench_cla.v",
        "vvp": "simulation/tb_cla.vvp",
        "log": "simulation/simulation_logs/cla_verification.log",
        "vcd": "simulation/waveforms/carry_lookahead_adder.vcd"
    },
    "CSLA": {
        "tb": "verification/testbench_csla.v",
        "vvp": "simulation/tb_csla.vvp",
        "log": "simulation/simulation_logs/csla_verification.log",
        "vcd": "simulation/waveforms/carry_select_adder.vcd"
    },
    "BK": {
        "tb": "verification/testbench_bk.v",
        "vvp": "simulation/tb_bk.vvp",
        "log": "simulation/simulation_logs/bk_verification.log",
        "vcd": "simulation/waveforms/brent_kung_adder.vcd"
    },
    "ALL_5_ADDERS": {
        "tb": "verification/testbench_all.v",
        "vvp": "simulation/tb_all.vvp",
        "log": "simulation/simulation_logs/master_5adders_verification.log",
        "vcd": "simulation/waveforms/all_adders_comparison.vcd"
    }
}

def get_env():
    env = dict(os.environ)
    env["PATH"] = f"{BIN_DIR};{LIB_DIR};" + env.get("PATH", "")
    return env

def run_simulation(name, info):
    print(f"\n======================================================================")
    print(f"[*] Running Verification for: {name}")
    print(f"======================================================================")
    
    os.makedirs(os.path.join(PROJECT_ROOT, "simulation", "waveforms"), exist_ok=True)
    os.makedirs(os.path.join(PROJECT_ROOT, "simulation", "simulation_logs"), exist_ok=True)
    os.makedirs(os.path.join(PROJECT_ROOT, "verification", "verification_results"), exist_ok=True)
    
    vvp_path = os.path.join(PROJECT_ROOT, info["vvp"])
    log_path = os.path.join(PROJECT_ROOT, info["log"])
    vcd_path = os.path.join(PROJECT_ROOT, info["vcd"])
    
    # 1. Compile with iverilog
    compile_cmd = [IVERILOG, "-o", vvp_path] + [os.path.join(PROJECT_ROOT, f) for f in RTL_FILES] + [os.path.join(PROJECT_ROOT, info["tb"])]
    t0 = time.time()
    comp_res = subprocess.run(compile_cmd, cwd=PROJECT_ROOT, capture_output=True, text=True, env=get_env())
    if comp_res.returncode != 0:
        print(f"[-] Compilation FAILED for {name}:")
        print(comp_res.stderr)
        return {"status": "FAILED", "stage": "compile", "error": comp_res.stderr}
    
    t_comp = time.time() - t0
    print(f"[+] Compilation SUCCESS in {t_comp:.2f}s")
    
    # 2. Execute with vvp
    t0 = time.time()
    sim_res = subprocess.run([VVP, vvp_path], cwd=PROJECT_ROOT, capture_output=True, text=True, env=get_env())
    t_sim = time.time() - t0
    
    with open(log_path, "w") as f:
        f.write(sim_res.stdout)
        if sim_res.stderr:
            f.write("\nSTDERR:\n" + sim_res.stderr)
            
    # Check VCD generation
    vcd_exists = os.path.exists(vcd_path)
    vcd_size = os.path.getsize(vcd_path) if vcd_exists else 0
    
    print(f"[+] Simulation Execution Completed in {t_sim:.2f}s")
    print(f"[+] VCD Waveform: {vcd_path} ({vcd_size // 1024} KB)")
    
    # Print summary lines from simulation stdout
    stdout_lines = sim_res.stdout.strip().split("\n")
    for line in stdout_lines[-10:]:
        print("    " + line)
        
    passed = (
        ("100% PASSED" in sim_res.stdout) or
        ("FORMALLY EQUIVALENT" in sim_res.stdout) or
        ("0 Failed" in sim_res.stdout) or
        ("Failed=0" in sim_res.stdout)
    ) and ("DISCREPANCIES DETECTED" not in sim_res.stdout) and ("ERROR Vector" not in sim_res.stdout)
    
    return {
        "status": "PASSED" if (sim_res.returncode == 0 and passed) else "FAILED",
        "compile_time_sec": round(t_comp, 3),
        "sim_time_sec": round(t_sim, 3),
        "vcd_generated": vcd_exists,
        "vcd_size_kb": vcd_size // 1024,
        "log_path": log_path
    }

def main():
    print(f">>> PROJECT ROOT: {PROJECT_ROOT}")
    results = {}
    
    # Run Primary Carry Skip Adder first
    results["CSKA"] = run_simulation("CSKA", TESTBENCHES["CSKA"])
    
    # Run Master 5-architecture harness (10,000 vectors)
    results["ALL_5_ADDERS"] = run_simulation("ALL_5_ADDERS", TESTBENCHES["ALL_5_ADDERS"])
    
    # Run individual testbenches
    for arch in ["RCA", "CLA", "CSLA", "BK"]:
        results[arch] = run_simulation(arch, TESTBENCHES[arch])
        
    summary_path = os.path.join(PROJECT_ROOT, "verification", "verification_results", "summary.json")
    with open(summary_path, "w") as f:
        json.dump(results, f, indent=2)
        
    print(f"\n======================================================================")
    print(f">>> ALL SIMULATIONS FINISHED! SUMMARY SAVED TO: {summary_path}")
    print(f"======================================================================")
    for k, v in results.items():
        print(f"  Architecture: {k:<15} Status: {v['status']:<8} SimTime: {v.get('sim_time_sec', 0)}s VCD: {v.get('vcd_size_kb', 0)} KB")

if __name__ == "__main__":
    main()
