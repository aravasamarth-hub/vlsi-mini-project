set hs_lib "/OpenROAD-flow-scripts/flow/platforms/sky130hs/lib/sky130_fd_sc_hs__tt_025C_1v80.lib"
read_liberty $hs_lib
read_db /cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.odb
read_sdc /cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.sdc
read_spef /cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.spef

puts "=========================================================="
puts "=== PATH TO Cout SKIPPING BLOCKS 1, 2, AND 3 ==="
puts "=========================================================="
report_checks -from [get_ports B[0]] -to [get_ports Cout] \
    -through [get_pins block1/_5_/A1] -through [get_pins block2/_5_/A1] -through [get_pins block3/_5_/A1] \
    -fields {capacitance slew input_pins} -digits 4

puts "=========================================================="
puts "=== PATH TO Cout FROM WITHIN BLOCK 3 (GENERATE IN BIT 12) ==="
puts "=========================================================="
report_checks -from [get_ports B[12]] -to [get_ports Cout] \
    -through [get_pins block3/_5_/A0] \
    -fields {capacitance slew input_pins} -digits 4

exit

