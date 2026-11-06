# TCL script to report sensitized paths in OpenSTA for SKY130HD
set hd_lib "/OpenROAD-flow-scripts/flow/platforms/sky130hd/lib/sky130_fd_sc_hd__tt_025C_1v80.lib"

puts "=========================================================="
puts "=== 2. SKY130HD CSKA: SENSITIZED PATH TIMING ==="
puts "=========================================================="
read_liberty $hd_lib
read_db /cybercore3d/results_sky130hd_cska/sky130hd/carry_skip_adder/base/6_final.odb
read_sdc /cybercore3d/results_sky130hd_cska/sky130hd/carry_skip_adder/base/6_final.sdc
read_spef /cybercore3d/results_sky130hd_cska/sky130hd/carry_skip_adder/base/6_final.spef

puts "--- Report path from A[0] through skip inputs to SUM[15] ---"
report_checks -from [get_ports A[0]] -to [get_ports SUM[15]] -through [get_pins block1/_5_/A1] -through [get_pins block2/_5_/A1] -fields {capacitance slew input_pins} -digits 4

puts "--- Report path from A[0] through skip inputs to Cout ---"
report_checks -from [get_ports A[0]] -to [get_ports Cout] -through [get_pins block1/_5_/A1] -through [get_pins block2/_5_/A1] -fields {capacitance slew input_pins} -digits 4

puts "=========================================================="
exit

