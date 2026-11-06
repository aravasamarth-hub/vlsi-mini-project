# TCL script to report all paths and specific sensitized path in OpenSTA
set hd_lib "/OpenROAD-flow-scripts/flow/platforms/sky130hd/lib/sky130_fd_sc_hd__tt_025C_1v80.lib"
set hs_lib "/OpenROAD-flow-scripts/flow/platforms/sky130hs/lib/sky130_fd_sc_hs__tt_025C_1v80.lib"

puts "=========================================================="
puts "=== 1. SKY130HS CSKA: SENSITIZED PATH TIMING ==="
puts "=========================================================="
read_liberty $hs_lib
read_db /cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.odb
read_sdc /cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.sdc
read_spef /cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.spef

puts "--- Report top 20 paths (unconstrained) ---"
report_checks -path_delay max -fields {capacitance slew input_pins nets} -group_count 20 -digits 4

puts "--- Report paths through MUX skip inputs (A1 on block1 and block2) ---"
report_checks -through [get_pins block1/_5_/A1] -through [get_pins block2/_5_/A1] -fields {capacitance slew input_pins nets} -digits 4

puts "--- Report path from B[0] through skip inputs to SUM[15] ---"
report_checks -from [get_ports B[0]] -to [get_ports SUM[15]] -through [get_pins block1/_5_/A1] -through [get_pins block2/_5_/A1] -fields {capacitance slew input_pins nets} -digits 4

puts "--- Report path from B[0] through skip inputs to Cout ---"
report_checks -from [get_ports B[0]] -to [get_ports Cout] -through [get_pins block1/_5_/A1] -through [get_pins block2/_5_/A1] -fields {capacitance slew input_pins nets} -digits 4

puts "=========================================================="
exit

