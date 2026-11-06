read_liberty /OpenROAD-flow-scripts/flow/platforms/sky130hs/lib/sky130_fd_sc_hs__tt_025C_1v80.lib
read_db /cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.odb
read_sdc /cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.sdc
read_spef /cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.spef
puts "=== TIMING REPORT ==="
report_checks -fields {slew cap input_pins} -digits 4
puts "=== POWER REPORT ==="
report_power
exit

