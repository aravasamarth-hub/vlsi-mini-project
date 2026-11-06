set hs_lib "/OpenROAD-flow-scripts/flow/platforms/sky130hs/lib/sky130_fd_sc_hs__tt_025C_1v80.lib"
read_liberty $hs_lib
read_db /cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.odb
read_sdc /cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.sdc
read_spef /cybercore3d/results_sky130hs_cska/sky130hs/carry_skip_adder/base/6_final.spef

puts "=== LONGEST SENSITIZABLE PATH PER OUTPUT (SKY130HS) ==="
# Block 0 outputs: SUM[0..3], c4
# Block 1 outputs: SUM[4..7], c8
# Block 2 outputs: SUM[8..11], c12
# Block 3 outputs: SUM[12..15], Cout

puts "--- SUM[3] ---"
report_checks -to [get_ports SUM[3]] -digits 4

puts "--- SUM[7] (Block 0 ripple -> MUX 0 -> Block 1 ripple to SUM[7]) ---"
# Note: From Block 0 to SUM[7], carry ripples in block 0, goes through MUX0 A0, then ripples in block 1 to SUM[7].
# Can a carry ripple in block 1 to SUM[7]? Yes, if bits 4, 5, 6 propagate, and bit 7 generates sum!
report_checks -to [get_ports SUM[7]] -digits 4

puts "--- SUM[11] (Block 0 ripple -> MUX 0 -> MUX 1 skip -> Block 2 ripple to SUM[11]) ---"
report_checks -to [get_ports SUM[11]] -through [get_pins block1/_5_/A1] -digits 4

puts "--- SUM[15] (Block 0 ripple -> MUX 0 -> MUX 1 skip -> MUX 2 skip -> Block 3 ripple to SUM[15]) ---"
report_checks -to [get_ports SUM[15]] -through [get_pins block1/_5_/A1] -through [get_pins block2/_5_/A1] -digits 4

puts "--- Cout (Block 0 ripple -> MUX 0 -> MUX 1 skip -> MUX 2 skip -> Block 3 ripple to Cout) ---"
report_checks -to [get_ports Cout] -through [get_pins block1/_5_/A1] -through [get_pins block2/_5_/A1] -digits 4

exit

