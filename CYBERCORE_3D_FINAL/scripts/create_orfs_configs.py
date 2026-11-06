import os

configs = {
    'sky130hd/carry_skip_adder': (
        'carry_skip_adder',
        'sky130hd',
        ['carry_skip_adder.v', 'carry_skip_block_4bit.v', 'full_adder.v', 'half_adder.v']
    ),
    'sky130hs/carry_skip_adder': (
        'carry_skip_adder',
        'sky130hs',
        ['carry_skip_adder.v', 'carry_skip_block_4bit.v', 'full_adder.v', 'half_adder.v']
    ),
    'sky130hd/ripple_carry_adder': (
        'ripple_carry_adder',
        'sky130hd',
        ['ripple_carry_adder.v', 'full_adder.v', 'half_adder.v']
    ),
    'sky130hs/ripple_carry_adder': (
        'ripple_carry_adder',
        'sky130hs',
        ['ripple_carry_adder.v', 'full_adder.v', 'half_adder.v']
    ),
}

base = os.path.expanduser('~/cybercore3d/flow_designs')
for path, (name, plat, vfiles) in configs.items():
    out_dir = os.path.join(base, path)
    os.makedirs(out_dir, exist_ok=True)
    v_lines = [f'$(DESIGN_HOME)/src/$(DESIGN_NICKNAME)/{f}' for f in vfiles]
    v_str = ' \\\n                       '.join(v_lines)
    margin = 15 if 'ripple' in name else 5
    util = 25 if 'ripple' in name else 40
    content = f'''export DESIGN_NAME = {name}
export PLATFORM    = {plat}

export VERILOG_FILES = {v_str}

export SDC_FILE      = $(DESIGN_HOME)/$(PLATFORM)/$(DESIGN_NICKNAME)/constraint.sdc

export CORE_UTILIZATION = {util}
export CORE_ASPECT_RATIO = 1.0
export CORE_MARGIN = {margin}
export PLACE_DENSITY = 0.50
export SYNTH_HIERARCHICAL = 1
'''
    cfg_file = os.path.join(out_dir, 'config.mk')
    with open(cfg_file, 'w') as f:
        f.write(content)
    print('Wrote:', cfg_file)
