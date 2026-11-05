import sys, os
import pytest
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.app import (
    read_root,
    health_check,
    simulate,
    simulate_all,
    get_ppa_metrics,
    get_physical_design_info,
    get_project_status,
    get_recommendation,
    SimRequest,
    RecommendRequest
)

def test_read_root():
    res = read_root()
    assert res["status"] == "ONLINE"
    assert "CYBERCORE 3D" in res["lab"]

def test_health_check():
    res = health_check()
    assert res["status"] == "HEALTHY"
    assert res["verilog_engine"] == "ACTIVE"

def test_cska_simulation_full_skip():
    # A=0xAAAA (43690), B=0x5555 (21845), Cin=1 -> All 4 blocks skip
    req = SimRequest(a=0xAAAA, b=0x5555, cin=1, architecture="CSKA")
    data = simulate(req)
    assert data["SUM"] == 0
    assert data["Cout"] == 1
    assert data["group_propagate"] == [1, 1, 1, 1]
    assert data["skip_decisions"] == [True, True, True, True]
    assert data["blocks"][0]["path_used"] == "SKIP_PATH (Bypass)"

def test_ppa_metrics():
    metrics = get_ppa_metrics()
    assert len(metrics) >= 5

def test_physical_design_info():
    info = get_physical_design_info()
    assert info["status"] == "COMPLETED"
    assert info["die_width_um"] == 45.0
    assert info["die_height_um"] == 35.0
    assert info["gds_file_exists"] is True

def test_project_status():
    status = get_project_status()
    assert status["functional_verification"]["random_vectors_tested"] == 60038
    assert status["functional_verification"]["pass_rate"] == "100.0%"

def test_recommendation_engine():
    rec = get_recommendation(RecommendRequest(profile="balanced"))
    assert "recommended_architecture" in rec

if __name__ == "__main__":
    print("Running backend tests directly...")
    test_read_root()
    test_health_check()
    test_cska_simulation_full_skip()
    test_ppa_metrics()
    test_physical_design_info()
    test_project_status()
    test_recommendation_engine()
    print(">>> ALL 7 BACKEND TESTS PASSED (100% OK) <<<")
