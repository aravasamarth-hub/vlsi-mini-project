###############################################################################
# Created by write_sdc
###############################################################################
current_design carry_skip_adder
###############################################################################
# Timing Constraints
###############################################################################
create_clock -name vclk -period 10.0000 
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {A[0]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {A[10]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {A[11]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {A[12]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {A[13]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {A[14]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {A[15]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {A[1]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {A[2]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {A[3]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {A[4]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {A[5]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {A[6]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {A[7]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {A[8]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {A[9]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {B[0]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {B[10]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {B[11]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {B[12]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {B[13]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {B[14]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {B[15]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {B[1]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {B[2]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {B[3]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {B[4]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {B[5]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {B[6]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {B[7]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {B[8]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {B[9]}]
set_input_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {Cin}]
set_output_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {Cout}]
set_output_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {SUM[0]}]
set_output_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {SUM[10]}]
set_output_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {SUM[11]}]
set_output_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {SUM[12]}]
set_output_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {SUM[13]}]
set_output_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {SUM[14]}]
set_output_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {SUM[15]}]
set_output_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {SUM[1]}]
set_output_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {SUM[2]}]
set_output_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {SUM[3]}]
set_output_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {SUM[4]}]
set_output_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {SUM[5]}]
set_output_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {SUM[6]}]
set_output_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {SUM[7]}]
set_output_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {SUM[8]}]
set_output_delay 0.0000 -clock [get_clocks {vclk}] -add_delay [get_ports {SUM[9]}]
set_max_delay\
    -from [list [get_ports {A[0]}]\
           [get_ports {A[10]}]\
           [get_ports {A[11]}]\
           [get_ports {A[12]}]\
           [get_ports {A[13]}]\
           [get_ports {A[14]}]\
           [get_ports {A[15]}]\
           [get_ports {A[1]}]\
           [get_ports {A[2]}]\
           [get_ports {A[3]}]\
           [get_ports {A[4]}]\
           [get_ports {A[5]}]\
           [get_ports {A[6]}]\
           [get_ports {A[7]}]\
           [get_ports {A[8]}]\
           [get_ports {A[9]}]\
           [get_ports {B[0]}]\
           [get_ports {B[10]}]\
           [get_ports {B[11]}]\
           [get_ports {B[12]}]\
           [get_ports {B[13]}]\
           [get_ports {B[14]}]\
           [get_ports {B[15]}]\
           [get_ports {B[1]}]\
           [get_ports {B[2]}]\
           [get_ports {B[3]}]\
           [get_ports {B[4]}]\
           [get_ports {B[5]}]\
           [get_ports {B[6]}]\
           [get_ports {B[7]}]\
           [get_ports {B[8]}]\
           [get_ports {B[9]}]\
           [get_ports {Cin}]]\
    -to [list [get_ports {Cout}]\
           [get_ports {SUM[0]}]\
           [get_ports {SUM[10]}]\
           [get_ports {SUM[11]}]\
           [get_ports {SUM[12]}]\
           [get_ports {SUM[13]}]\
           [get_ports {SUM[14]}]\
           [get_ports {SUM[15]}]\
           [get_ports {SUM[1]}]\
           [get_ports {SUM[2]}]\
           [get_ports {SUM[3]}]\
           [get_ports {SUM[4]}]\
           [get_ports {SUM[5]}]\
           [get_ports {SUM[6]}]\
           [get_ports {SUM[7]}]\
           [get_ports {SUM[8]}]\
           [get_ports {SUM[9]}]] 10.0000
###############################################################################
# Environment
###############################################################################
set_load -pin_load 0.0177 [get_ports {Cout}]
set_load -pin_load 0.0177 [get_ports {SUM[15]}]
set_load -pin_load 0.0177 [get_ports {SUM[14]}]
set_load -pin_load 0.0177 [get_ports {SUM[13]}]
set_load -pin_load 0.0177 [get_ports {SUM[12]}]
set_load -pin_load 0.0177 [get_ports {SUM[11]}]
set_load -pin_load 0.0177 [get_ports {SUM[10]}]
set_load -pin_load 0.0177 [get_ports {SUM[9]}]
set_load -pin_load 0.0177 [get_ports {SUM[8]}]
set_load -pin_load 0.0177 [get_ports {SUM[7]}]
set_load -pin_load 0.0177 [get_ports {SUM[6]}]
set_load -pin_load 0.0177 [get_ports {SUM[5]}]
set_load -pin_load 0.0177 [get_ports {SUM[4]}]
set_load -pin_load 0.0177 [get_ports {SUM[3]}]
set_load -pin_load 0.0177 [get_ports {SUM[2]}]
set_load -pin_load 0.0177 [get_ports {SUM[1]}]
set_load -pin_load 0.0177 [get_ports {SUM[0]}]
set_input_transition 0.0400 [get_ports {Cin}]
set_input_transition 0.0400 [get_ports {A[15]}]
set_input_transition 0.0400 [get_ports {A[14]}]
set_input_transition 0.0400 [get_ports {A[13]}]
set_input_transition 0.0400 [get_ports {A[12]}]
set_input_transition 0.0400 [get_ports {A[11]}]
set_input_transition 0.0400 [get_ports {A[10]}]
set_input_transition 0.0400 [get_ports {A[9]}]
set_input_transition 0.0400 [get_ports {A[8]}]
set_input_transition 0.0400 [get_ports {A[7]}]
set_input_transition 0.0400 [get_ports {A[6]}]
set_input_transition 0.0400 [get_ports {A[5]}]
set_input_transition 0.0400 [get_ports {A[4]}]
set_input_transition 0.0400 [get_ports {A[3]}]
set_input_transition 0.0400 [get_ports {A[2]}]
set_input_transition 0.0400 [get_ports {A[1]}]
set_input_transition 0.0400 [get_ports {A[0]}]
set_input_transition 0.0400 [get_ports {B[15]}]
set_input_transition 0.0400 [get_ports {B[14]}]
set_input_transition 0.0400 [get_ports {B[13]}]
set_input_transition 0.0400 [get_ports {B[12]}]
set_input_transition 0.0400 [get_ports {B[11]}]
set_input_transition 0.0400 [get_ports {B[10]}]
set_input_transition 0.0400 [get_ports {B[9]}]
set_input_transition 0.0400 [get_ports {B[8]}]
set_input_transition 0.0400 [get_ports {B[7]}]
set_input_transition 0.0400 [get_ports {B[6]}]
set_input_transition 0.0400 [get_ports {B[5]}]
set_input_transition 0.0400 [get_ports {B[4]}]
set_input_transition 0.0400 [get_ports {B[3]}]
set_input_transition 0.0400 [get_ports {B[2]}]
set_input_transition 0.0400 [get_ports {B[1]}]
set_input_transition 0.0400 [get_ports {B[0]}]
###############################################################################
# Design Rules
###############################################################################
