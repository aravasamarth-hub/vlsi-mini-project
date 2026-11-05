#!/usr/bin/env python3
"""
Scalability Study for Carry Skip Adder vs. Ripple Carry Adder
Evaluates delay, cell area, and scaling growth across 8, 16, 32, and 64 bits.
"""

import os
import csv
import matplotlib.pyplot as plt

PROJECT_ROOT = r"X:" if os.path.exists(r"X:\rtl") else r"D:\mini project"

WIDTHS = [8, 16, 32, 64]
T_FA_CARRY = 0.245
T_FA_SUM   = 0.282
T_MUX_SKIP = 0.218

def main():
    print("==========================================================================")
    print(">>> RUNNING ADDER SCALABILITY ANALYSIS (8, 16, 32, 64 BITS) <<<")
    print("==========================================================================")
    
    rows = []
    
    for w in WIDTHS:
        # 1. Ripple Carry Adder: O(N)
        rca_delay = (w - 1) * T_FA_CARRY + T_FA_SUM
        rca_area = w * 27.5 # um^2
        
        # 2. Carry Skip Adder with 4-bit blocks:
        num_blocks = w // 4
        # (4 - 1)*T_carry + (num_blocks - 2)*T_mux + 4*T_carry + T_sum
        cska_delay = (3 * T_FA_CARRY) + ((num_blocks - 2) * T_MUX_SKIP) + (4 * T_FA_CARRY) + T_FA_SUM
        cska_area = (w * 27.5) + (num_blocks * 6.25) + (num_blocks * 7.5)
        
        speedup = ((rca_delay - cska_delay) / rca_delay) * 100
        
        rows.append({
            "width": w,
            "rca_delay_ns": round(rca_delay, 3),
            "cska_delay_ns": round(cska_delay, 3),
            "rca_area_um2": round(rca_area, 1),
            "cska_area_um2": round(cska_area, 1),
            "speedup_pct": round(speedup, 1)
        })
        
    print(f"{'Width':<8} | {'RCA Delay (ns)':<16} | {'CSKA Delay (ns)':<16} | {'Speedup (%)':<14} | {'CSKA Area (um2)'}")
    print("-" * 75)
    for r in rows:
        print(f"{r['width']:<8} | {r['rca_delay_ns']:<16.3f} | {r['cska_delay_ns']:<16.3f} | {r['speedup_pct']:<13.1f}% | {r['cska_area_um2']}")
    print("=" * 75)
    
    # Save CSV
    csv_file = os.path.join(PROJECT_ROOT, "analysis", "scalability_results.csv")
    with open(csv_file, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)
    print(f"[+] Scalability data saved to: {csv_file}")
    
    # Plot Scaling Curves
    plt.style.use("dark_background")
    fig, ax = plt.subplots(figsize=(8, 5))
    
    w_labels = [f"{w}-bit" for w in WIDTHS]
    rca_d = [r["rca_delay_ns"] for r in rows]
    cska_d = [r["cska_delay_ns"] for r in rows]
    
    ax.plot(w_labels, rca_d, color="#FF0080", marker='s', linewidth=2.5, markersize=8, label="Ripple Carry (O(N) Linear)")
    ax.plot(w_labels, cska_d, color="#00F0FF", marker='o', linewidth=2.5, markersize=8, label="Carry Skip (4-bit Blocks)")
    
    for i, w in enumerate(WIDTHS):
        ax.annotate(f"{rca_d[i]:.2f} ns", (w_labels[i], rca_d[i] + 0.4), color="#FF0080", fontsize=9, ha='center')
        ax.annotate(f"{cska_d[i]:.2f} ns", (w_labels[i], cska_d[i] - 0.7), color="#00F0FF", fontsize=9, ha='center')
        
    ax.set_ylabel("Critical Path Delay (ns)", fontsize=11)
    ax.set_xlabel("Adder Word Width", fontsize=11)
    ax.set_title("Adder Delay Scaling: RCA vs. Carry Skip Adder (Sky130)", fontsize=12, pad=15, color="#00F0FF", fontweight="bold")
    ax.grid(True, linestyle="--", alpha=0.3)
    ax.legend(loc="upper left", facecolor="#0F172A", edgecolor="#334155")
    
    plt.tight_layout()
    chart_path = os.path.join(PROJECT_ROOT, "analysis", "graphs", "scalability_delay_curve.png")
    plt.savefig(chart_path, dpi=200)
    plt.close()
    print(f"[+] Scaling chart saved to: {chart_path}")

if __name__ == "__main__":
    main()
