set hd_lib "/OpenROAD-flow-scripts/flow/platforms/sky130hd/lib/sky130_fd_sc_hd__tt_025C_1v80.lib"

puts "=========================================================="
puts "=== RCA SKY130HD TIMING TO BOTH Cout AND SUM[15] ==="
puts "=========================================================="

read_liberty $hd_lib
read_db /cybercore3d/results_sky130hd_rca/sky130hd/ripple_carry_adder/base/6_final.odb
read_sdc /cybercore3d/results_sky130hd_rca/sky130hd/ripple_carry_adder/base/6_final.sdc
read_spef /cybercore3d/results_sky130hd_rca/sky130hd/ripple_carry_adder/base/6_final.spef

report_checks -to [get_ports Cout] -digits 4
report_checks -to [get_ports SUM[15]] -digits 4

exit

