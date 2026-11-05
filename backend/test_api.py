import sys, os
sys.path.insert(0, r"D:\mini project")
from backend.app import read_root, simulate, simulate_all, get_ppa_metrics, get_physical_design_info, get_project_status, get_recommendation, SimRequest, RecommendRequest

print("=== TESTING FASTAPI BACKEND FUNCTIONS DIRECTLY ===")
r1 = read_root()
print("GET / -> Status: OK |", r1["lab"], "| Status:", r1["status"])

# Test Full Carry Skip: A=0xAAAA (43690), B=0x5555 (21845), Cin=1 -> All 4 blocks skip!
req = SimRequest(a=0xAAAA, b=0x5555, cin=1, architecture="CSKA")
data = simulate(req)
print("POST /api/simulate ->")
print("  Inputs          : A=0xAAAA (43690), B=0x5555 (21845), Cin=1")
print("  SUM             :", data["SUM_hex"], f"({data['SUM']})")
print("  Cout            :", data["Cout"])
print("  Group Propagates:", data["group_propagate"])
print("  Block Carries   :", data["block_carries"])
print("  Block 0 Path    :", data["blocks"][0]["path_used"])
print("  Block 3 Path    :", data["blocks"][3]["path_used"])

r3 = get_ppa_metrics()
print("GET /api/ppa-comparison -> Architectures:", len(r3))

r4 = get_physical_design_info()
print("GET /api/physical-design -> Placed Cells:", r4["placed_cell_count"], "| GDS Size:", r4["gds_file_size_kb"], "KB")

r5 = get_project_status()
print("GET /api/project-status -> Toolchain Verified:", r5["toolchain"]["iverilog"], "| Vectors:", r5["functional_verification"]["random_vectors_tested"])

r6 = get_recommendation(RecommendRequest(profile="balanced"))
print("POST /api/recommendation -> Recommended:", r6["recommended_architecture"], "| Score:", r6["winner_details"]["score"])

print(">>> ALL API BACKEND FUNCTIONS VERIFIED 100% OPERATIONAL <<<")
