proc run_sta {lib odb sdc spef title} {
    puts "=========================================================="
    puts "=== STA REPORT FOR: $title ==="
    puts "=========================================================="
    read_liberty $lib
    read_db $odb
    read_sdc $sdc
    read_spef $spef
    puts "--- TIMING CHECK ---"
    report_checks -fields {slew cap input_pins nets} -digits 4
    puts "--- POWER REPORT ---"
    report_power
    puts "=========================================================="
}

set hd_lib "/OpenROAD-flow-scripts/flow/platforms/sky130hd/lib/sky130_fd_sc_hd__tt_025C_1v80.lib"
set hs_lib "/OpenROAD-flow-scripts/flow/platforms/sky130hs/lib/sky130_fd_sc_hs__tt_025C_1v80.lib"

run_sta $hd_lib "/cybercore3d/results_sky130hd_cska/sky130hd/carry_skip_adder/base/6_final.odb" "/cybercore3d/results_sky130hd_cska/sky130hd/carry_skip_adder/base/6_final.sdc" "/cybercore3d/results_sky130hd_cska/sky130hd/carry_skip_adder/base/6_final.spef" "SKY130HD CSKA"
run_sta $hs_lib "/cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.odb" "/cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.sdc" "/cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.spef" "SKY130HS CSKA"
run_sta $hd_lib "/cybercore3d/results_sky130hd_rca/sky130hd/ripple_carry_adder/base/6_final.odb" "/cybercore3d/results_sky130hd_rca/sky130hd/ripple_carry_adder/base/6_final.sdc" "/cybercore3d/results_sky130hd_rca/sky130hd/ripple_carry_adder/base/6_final.spef" "SKY130HD RCA"
run_sta $hs_lib "/cybercore3d/results_sky130hs_rca/sky130hs/ripple_carry_adder/base/6_final.odb" "/cybercore3d/results_sky130hs_rca/sky130hs/ripple_carry_adder/base/6_final.sdc" "/cybercore3d/results_sky130hs_rca/sky130hs/ripple_carry_adder/base/6_final.spef" "SKY130HS RCA"
exit

