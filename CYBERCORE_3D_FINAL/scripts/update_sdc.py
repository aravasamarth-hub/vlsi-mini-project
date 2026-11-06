import os

sdc_content = '''# SDC timing constraints for 16-bit Adders
# Pure combinational design using virtual reference clock
create_clock -name vclk -period 10.0

set_input_delay 0.0 -clock vclk [all_inputs]
set_output_delay 0.0 -clock vclk [all_outputs]

# 40 ps input slew, 17.65 fF output load
set_input_transition 0.040 [all_inputs]
set_load 0.01765 [all_outputs]

set_max_delay 10.0 -from [all_inputs] -to [all_outputs]
'''

base = os.path.expanduser('~/cybercore3d/flow_designs')
for d in ['sky130hd/carry_skip_adder', 'sky130hs/carry_skip_adder', 'sky130hd/ripple_carry_adder', 'sky130hs/ripple_carry_adder']:
    target = os.path.join(base, d, 'constraint.sdc')
    with open(target, 'w') as f:
        f.write(sdc_content)
    print('Updated SDC:', target)
