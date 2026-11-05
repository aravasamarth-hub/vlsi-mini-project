# Python script to compute exact timing arc breakdowns
import json

arcs = {
    "maj3_1": {
        "A->X": {"rise": 0.1529, "fall": 0.3484, "avg": 0.2507},
        "B->X": {"rise": 0.1480, "fall": 0.3303, "avg": 0.2392},
        "C->X": {"rise": 0.1588, "fall": 0.3532, "avg": 0.2560}
    },
    "mux2_1": {
        "A0->X": {"rise": 0.1229, "fall": 0.2856, "avg": 0.2043},
        "A1->X": {"rise": 0.1256, "fall": 0.2963, "avg": 0.2110},
        "S->X":  {"rise": 0.1308, "fall": 0.3132, "avg": 0.2220}
    },
    "xor3_1": {
        "A->X": {"rise": 0.2218, "fall": 0.3594, "avg": 0.2906},
        "B->X": {"rise": 0.1958, "fall": 0.3455, "avg": 0.2707},
        "C->X": {"rise": 0.1410, "fall": 0.1819, "avg": 0.1615}
    },
    "and4_1": {
        "D->X": {"rise": 0.1898, "fall": 0.1997, "avg": 0.1948}
    },
    "xor2_1": {
        "A->X": {"rise": 0.1270, "fall": 0.1561, "avg": 0.1416}
    }
}

print("=== PATH 1: Worst-Case CSKA Critical Path (Bypass Active) ===")
# Block 0: Bit 0 (A0->X maj3), Bit 1 (C->X maj3), Bit 2 (C->X maj3), Bit 3 (C->X maj3)
# Block 0 MUX: A0->X mux2_1
# Block 1 MUX: A1->X mux2_1 (bypass)
# Block 2 MUX: A1->X mux2_1 (bypass)
# Block 3: Bit 12 (C->X maj3), Bit 13 (C->X maj3), Bit 14 (C->X maj3), Bit 15 (C->X xor3)

t_rise = (arcs["maj3_1"]["A->X"]["rise"] + 
          3 * arcs["maj3_1"]["C->X"]["rise"] + 
          arcs["mux2_1"]["A0->X"]["rise"] + 
          2 * arcs["mux2_1"]["A1->X"]["rise"] + 
          3 * arcs["maj3_1"]["C->X"]["rise"] + 
          arcs["xor3_1"]["C->X"]["rise"])

t_fall = (arcs["maj3_1"]["A->X"]["fall"] + 
          3 * arcs["maj3_1"]["C->X"]["fall"] + 
          arcs["mux2_1"]["A0->X"]["fall"] + 
          2 * arcs["mux2_1"]["A1->X"]["fall"] + 
          3 * arcs["maj3_1"]["C->X"]["fall"] + 
          arcs["xor3_1"]["C->X"]["fall"])

t_avg = (arcs["maj3_1"]["A->X"]["avg"] + 
         3 * arcs["maj3_1"]["C->X"]["avg"] + 
         arcs["mux2_1"]["A0->X"]["avg"] + 
         2 * arcs["mux2_1"]["A1->X"]["avg"] + 
         3 * arcs["maj3_1"]["C->X"]["avg"] + 
         arcs["xor3_1"]["C->X"]["avg"])

print(f"Cell Rise Delay : {t_rise:.4f} ns")
print(f"Cell Fall Delay : {t_fall:.4f} ns")
print(f"Average Delay   : {t_avg:.4f} ns")
print(f"Analytical Model: 2.471 ns (Delta vs Avg: {abs(2.471 - t_avg):.4f} ns, {abs(2.471 - t_avg)/2.471*100:.1f}%)")

print("\n=== PATH 2: Group Propagate Generation Path ===")
t_gp_avg = arcs["xor2_1"]["A->X"]["avg"] + arcs["and4_1"]["D->X"]["avg"] + arcs["mux2_1"]["S->X"]["avg"]
print(f"Group Propagate Path Delay: {t_gp_avg:.4f} ns (Resolves well before Block 0 ripple reaches MUX)")

print("\n=== PATH 3: Pure Ripple Carry Path (Un-skipped RCA Baseline) ===")
# 16 stages maj3 + 1 stage xor3
t_rca_avg = arcs["maj3_1"]["A->X"]["avg"] + 15 * arcs["maj3_1"]["C->X"]["avg"] + arcs["xor3_1"]["C->X"]["avg"]
print(f"Pure RCA 16-Stage Delay: {t_rca_avg:.4f} ns")
print(f"CSKA Speedup over Pure RCA: {(t_rca_avg - t_avg) / t_rca_avg * 100:.1f}%")
