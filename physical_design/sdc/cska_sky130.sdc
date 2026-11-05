# Synopsys Design Constraints (SDC) for 16-Bit Carry Skip Adder
# Platform: SkyWater 130nm HD (sky130_fd_sc_hd)
# Target Operating Frequency: 100 MHz (10.0 ns Period)

# 1. Virtual Clock Definition
create_clock -name clk -period 10.0 [get_ports -quiet clk]

# 2. Operating Conditions & Derating
set_driving_cell -lib_cell sky130_fd_sc_hd__inv_2 [get_ports {A[*] B[*] Cin}]
set_input_transition 0.100 [get_ports {A[*] B[*] Cin}]

# 3. I/O Delays
set_input_delay -clock clk 1.000 [get_ports {A[*] B[*] Cin}]
set_output_delay -clock clk 1.000 [get_ports {SUM[*] Cout}]

# 4. Output Load Capacitance (15 fF standard load)
set_load 0.015 [get_ports {SUM[*] Cout}]

# 5. Timing Uncertainty & Margin
set_clock_uncertainty 0.200 [get_clocks -quiet clk]

