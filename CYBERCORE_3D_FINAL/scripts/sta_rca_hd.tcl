read_liberty /OpenROAD-flow-scripts/flow/platforms/sky130hd/lib/sky130_fd_sc_hd__tt_025C_1v80.lib
read_db /cybercore3d/results_sky130hd_rca/sky130hd/ripple_carry_adder/base/6_final.odb
read_sdc /cybercore3d/results_sky130hd_rca/sky130hd/ripple_carry_adder/base/6_final.sdc
read_spef /cybercore3d/results_sky130hd_rca/sky130hd/ripple_carry_adder/base/6_final.spef
puts "=== TIMING REPORT ==="
report_checks -fields {slew cap input_pins} -digits 4
puts "=== POWER REPORT ==="
report_power
exit

