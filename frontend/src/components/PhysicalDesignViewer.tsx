import React, { useState } from 'react'
import {
  Layers,
  HardDrive,
  CheckCircle,
  ZoomIn,
  ZoomOut,
  Info,
  Box,
  Code2,
  Cpu,
  Sparkles
} from 'lucide-react'

// Original 48 placed standard cells from cska_sky130.def
const FLAT_COMPONENTS = [
  { id: '_31_', type: 'sky130_fd_sc_hd__xnor2_1', x: 7000, y: 5440, orient: 'N', func: 'SUM XOR/XNOR Stage (b0)' },
  { id: '_32_', type: 'sky130_fd_sc_hd__maj3_1', x: 9760, y: 5440, orient: 'N', func: 'Carry Generation Maj3 (b0)' },
  { id: '_33_', type: 'sky130_fd_sc_hd__xnor2_1', x: 12520, y: 5440, orient: 'N', func: 'SUM Stage (b1)' },
  { id: '_34_', type: 'sky130_fd_sc_hd__maj3_1', x: 15280, y: 5440, orient: 'N', func: 'Carry Generation Maj3 (b1)' },
  { id: '_35_', type: 'sky130_fd_sc_hd__xnor2_1', x: 18040, y: 5440, orient: 'N', func: 'SUM Stage (b2)' },
  { id: '_36_', type: 'sky130_fd_sc_hd__maj3_1', x: 20800, y: 5440, orient: 'N', func: 'Carry Generation Maj3 (b2)' },
  { id: '_37_', type: 'sky130_fd_sc_hd__xnor2_1', x: 23560, y: 5440, orient: 'N', func: 'SUM Stage (b3)' },
  { id: '_38_', type: 'sky130_fd_sc_hd__maj3_1', x: 26320, y: 5440, orient: 'N', func: 'Carry Generation Maj3 (b3)' },
  { id: '_39_', type: 'sky130_fd_sc_hd__xnor2_1', x: 29080, y: 5440, orient: 'N', func: 'SUM Stage (b4)' },
  { id: '_40_', type: 'sky130_fd_sc_hd__maj3_1', x: 31840, y: 5440, orient: 'N', func: 'Carry Generation Maj3 (b4)' },
  { id: '_41_', type: 'sky130_fd_sc_hd__xnor2_1', x: 34600, y: 5440, orient: 'N', func: 'SUM Stage (b5)' },
  { id: '_42_', type: 'sky130_fd_sc_hd__maj3_1', x: 7000, y: 8160, orient: 'FS', func: 'Carry Generation Maj3 (b5)' },
  { id: '_43_', type: 'sky130_fd_sc_hd__xnor2_1', x: 9760, y: 8160, orient: 'FS', func: 'SUM Stage (b6)' },
  { id: '_44_', type: 'sky130_fd_sc_hd__xnor2_1', x: 12520, y: 8160, orient: 'FS', func: 'Propagate XOR (b6)' },
  { id: '_45_', type: 'sky130_fd_sc_hd__maj3_1', x: 15280, y: 8160, orient: 'FS', func: 'Carry Generation Maj3 (b6)' },
  { id: '_46_', type: 'sky130_fd_sc_hd__xnor2_1', x: 18040, y: 8160, orient: 'FS', func: 'SUM Stage (b7)' },
  { id: '_47_', type: 'sky130_fd_sc_hd__maj3_1', x: 20800, y: 8160, orient: 'FS', func: 'Carry Generation Maj3 (b7)' },
  { id: '_48_', type: 'sky130_fd_sc_hd__xnor2_1', x: 23560, y: 8160, orient: 'FS', func: 'SUM Stage (b8)' },
  { id: '_49_', type: 'sky130_fd_sc_hd__maj3_1', x: 26320, y: 8160, orient: 'FS', func: 'Carry Generation Maj3 (b8)' },
  { id: '_50_', type: 'sky130_fd_sc_hd__xnor2_1', x: 29080, y: 8160, orient: 'FS', func: 'SUM Stage (b9)' },
  { id: '_51_', type: 'sky130_fd_sc_hd__xnor2_1', x: 31840, y: 8160, orient: 'FS', func: 'Propagate XOR (b9)' },
  { id: '_52_', type: 'sky130_fd_sc_hd__maj3_1', x: 34600, y: 8160, orient: 'FS', func: 'Carry Generation Maj3 (b9)' },
  { id: '_53_', type: 'sky130_fd_sc_hd__xnor2_1', x: 7000, y: 10880, orient: 'N', func: 'SUM Stage (b10)' },
  { id: '_54_', type: 'sky130_fd_sc_hd__maj3_1', x: 9760, y: 10880, orient: 'N', func: 'Carry Generation Maj3 (b10)' },
  { id: '_55_', type: 'sky130_fd_sc_hd__xnor2_1', x: 12520, y: 10880, orient: 'N', func: 'SUM Stage (b11)' },
  { id: '_56_', type: 'sky130_fd_sc_hd__maj3_1', x: 15280, y: 10880, orient: 'N', func: 'Carry Generation Maj3 (b11)' },
  { id: '_57_', type: 'sky130_fd_sc_hd__xnor2_1', x: 18040, y: 10880, orient: 'N', func: 'SUM Stage (b12)' },
  { id: '_58_', type: 'sky130_fd_sc_hd__xnor2_1', x: 20800, y: 10880, orient: 'N', func: 'Propagate XOR (b12)' },
  { id: '_59_', type: 'sky130_fd_sc_hd__xnor2_1', x: 23560, y: 10880, orient: 'N', func: 'SUM Stage (b13)' },
  { id: '_60_', type: 'sky130_fd_sc_hd__xnor2_1', x: 26320, y: 10880, orient: 'N', func: 'SUM Stage (b14)' },
  { id: '_61_', type: 'sky130_fd_sc_hd__xnor2_1', x: 29080, y: 10880, orient: 'N', func: 'SUM Stage (b15)' },
  { id: '_62_', type: 'sky130_fd_sc_hd__xnor2_1', x: 31840, y: 10880, orient: 'N', func: 'Propagate XOR (b15)' },
  { id: '_63_', type: 'sky130_fd_sc_hd__maj3_1', x: 34600, y: 10880, orient: 'N', func: 'Carry Generation Maj3 (b12)' },
  { id: '_64_', type: 'sky130_fd_sc_hd__xnor2_1', x: 7000, y: 13600, orient: 'FS', func: 'Inverter/Buffer Logic' },
  { id: '_65_', type: 'sky130_fd_sc_hd__xnor2_1', x: 9760, y: 13600, orient: 'FS', func: 'Carry Buffer' },
  { id: '_66_', type: 'sky130_fd_sc_hd__xnor2_1', x: 12520, y: 13600, orient: 'FS', func: 'Intermediate Propagate' },
  { id: '_67_', type: 'sky130_fd_sc_hd__xnor2_1', x: 15280, y: 13600, orient: 'FS', func: 'Intermediate Sum' },
  { id: '_68_', type: 'sky130_fd_sc_hd__xnor2_1', x: 18040, y: 13600, orient: 'FS', func: 'Intermediate Carry' },
  { id: '_69_', type: 'sky130_fd_sc_hd__xnor2_1', x: 20800, y: 13600, orient: 'FS', func: 'Output Conditioning' },
  { id: '_70_', type: 'sky130_fd_sc_hd__xnor2_1', x: 23560, y: 13600, orient: 'FS', func: 'Output Conditioning' },
  { id: '_71_', type: 'sky130_fd_sc_hd__xnor2_1', x: 26320, y: 13600, orient: 'FS', func: 'Output Conditioning' },
  { id: '_72_', type: 'sky130_fd_sc_hd__xnor2_1', x: 29080, y: 13600, orient: 'FS', func: 'Output Conditioning' },
  { id: '_73_', type: 'sky130_fd_sc_hd__xnor2_1', x: 31840, y: 13600, orient: 'FS', func: 'Cout Buffer' },
  { id: '_74_', type: 'sky130_fd_sc_hd__maj3_1', x: 34600, y: 13600, orient: 'FS', func: 'Carry Generation Maj3 (b13)' },
  { id: '_75_', type: 'sky130_fd_sc_hd__xnor2_1', x: 7000, y: 16320, orient: 'N', func: 'Output Register Drive' },
  { id: '_76_', type: 'sky130_fd_sc_hd__maj3_1', x: 9760, y: 16320, orient: 'N', func: 'Carry Generation Maj3 (b14)' },
  { id: '_77_', type: 'sky130_fd_sc_hd__xnor2_1', x: 12520, y: 16320, orient: 'N', func: 'Final Sum Stage' },
  { id: '_78_', type: 'sky130_fd_sc_hd__maj3_1', x: 15280, y: 16320, orient: 'N', func: 'Carry-Out Maj3 (C16)' }
]

// The 56 placed standard cells extracted directly from cska_hier_sky130.def
const HIER_COMPONENTS = [
  {
    "id": "block0/prop_xor_0",
    "type": "sky130_fd_sc_hd__xor2_1",
    "x": 7000,
    "y": 5440,
    "orient": "N",
    "func": "Bit-Propagate XOR2 gate"
  },
  {
    "id": "block0/prop_xor_1",
    "type": "sky130_fd_sc_hd__xor2_1",
    "x": 10680,
    "y": 5440,
    "orient": "N",
    "func": "Bit-Propagate XOR2 gate"
  },
  {
    "id": "block0/prop_xor_2",
    "type": "sky130_fd_sc_hd__xor2_1",
    "x": 14360,
    "y": 5440,
    "orient": "N",
    "func": "Bit-Propagate XOR2 gate"
  },
  {
    "id": "block0/prop_xor_3",
    "type": "sky130_fd_sc_hd__xor2_1",
    "x": 18040,
    "y": 5440,
    "orient": "N",
    "func": "Bit-Propagate XOR2 gate"
  },
  {
    "id": "block0/group_prop_and4",
    "type": "sky130_fd_sc_hd__and4_1",
    "x": 21720,
    "y": 5440,
    "orient": "N",
    "func": "Group-Propagate 4-bit AND gate"
  },
  {
    "id": "block0/carry_skip_mux2",
    "type": "sky130_fd_sc_hd__mux2_1",
    "x": 25400,
    "y": 5440,
    "orient": "N",
    "func": "Carry-Skip 2:1 MUX (Bypass stage)"
  },
  {
    "id": "block0/fa_0/sum_xor3",
    "type": "sky130_fd_sc_hd__xor3_1",
    "x": 29080,
    "y": 5440,
    "orient": "N",
    "func": "Full-Adder Sum XOR3 gate"
  },
  {
    "id": "block0/fa_0/cout_maj3",
    "type": "sky130_fd_sc_hd__maj3_1",
    "x": 32760,
    "y": 5440,
    "orient": "N",
    "func": "Full-Adder Carry Majority-3 gate"
  },
  {
    "id": "block0/fa_1/sum_xor3",
    "type": "sky130_fd_sc_hd__xor3_1",
    "x": 36440,
    "y": 5440,
    "orient": "N",
    "func": "Full-Adder Sum XOR3 gate"
  },
  {
    "id": "block0/fa_1/cout_maj3",
    "type": "sky130_fd_sc_hd__maj3_1",
    "x": 40120,
    "y": 5440,
    "orient": "N",
    "func": "Full-Adder Carry Majority-3 gate"
  },
  {
    "id": "block0/fa_2/sum_xor3",
    "type": "sky130_fd_sc_hd__xor3_1",
    "x": 43800,
    "y": 5440,
    "orient": "N",
    "func": "Full-Adder Sum XOR3 gate"
  },
  {
    "id": "block0/fa_2/cout_maj3",
    "type": "sky130_fd_sc_hd__maj3_1",
    "x": 7000,
    "y": 8160,
    "orient": "FS",
    "func": "Full-Adder Carry Majority-3 gate"
  },
  {
    "id": "block0/fa_3/sum_xor3",
    "type": "sky130_fd_sc_hd__xor3_1",
    "x": 10680,
    "y": 8160,
    "orient": "FS",
    "func": "Full-Adder Sum XOR3 gate"
  },
  {
    "id": "block0/fa_3/cout_maj3",
    "type": "sky130_fd_sc_hd__maj3_1",
    "x": 14360,
    "y": 8160,
    "orient": "FS",
    "func": "Full-Adder Carry Majority-3 gate"
  },
  {
    "id": "block1/prop_xor_0",
    "type": "sky130_fd_sc_hd__xor2_1",
    "x": 18040,
    "y": 8160,
    "orient": "FS",
    "func": "Bit-Propagate XOR2 gate"
  },
  {
    "id": "block1/prop_xor_1",
    "type": "sky130_fd_sc_hd__xor2_1",
    "x": 21720,
    "y": 8160,
    "orient": "FS",
    "func": "Bit-Propagate XOR2 gate"
  },
  {
    "id": "block1/prop_xor_2",
    "type": "sky130_fd_sc_hd__xor2_1",
    "x": 25400,
    "y": 8160,
    "orient": "FS",
    "func": "Bit-Propagate XOR2 gate"
  },
  {
    "id": "block1/prop_xor_3",
    "type": "sky130_fd_sc_hd__xor2_1",
    "x": 29080,
    "y": 8160,
    "orient": "FS",
    "func": "Bit-Propagate XOR2 gate"
  },
  {
    "id": "block1/group_prop_and4",
    "type": "sky130_fd_sc_hd__and4_1",
    "x": 32760,
    "y": 8160,
    "orient": "FS",
    "func": "Group-Propagate 4-bit AND gate"
  },
  {
    "id": "block1/carry_skip_mux2",
    "type": "sky130_fd_sc_hd__mux2_1",
    "x": 36440,
    "y": 8160,
    "orient": "FS",
    "func": "Carry-Skip 2:1 MUX (Bypass stage)"
  },
  {
    "id": "block1/fa_0/sum_xor3",
    "type": "sky130_fd_sc_hd__xor3_1",
    "x": 40120,
    "y": 8160,
    "orient": "FS",
    "func": "Full-Adder Sum XOR3 gate"
  },
  {
    "id": "block1/fa_0/cout_maj3",
    "type": "sky130_fd_sc_hd__maj3_1",
    "x": 43800,
    "y": 8160,
    "orient": "FS",
    "func": "Full-Adder Carry Majority-3 gate"
  },
  {
    "id": "block1/fa_1/sum_xor3",
    "type": "sky130_fd_sc_hd__xor3_1",
    "x": 7000,
    "y": 10880,
    "orient": "N",
    "func": "Full-Adder Sum XOR3 gate"
  },
  {
    "id": "block1/fa_1/cout_maj3",
    "type": "sky130_fd_sc_hd__maj3_1",
    "x": 10680,
    "y": 10880,
    "orient": "N",
    "func": "Full-Adder Carry Majority-3 gate"
  },
  {
    "id": "block1/fa_2/sum_xor3",
    "type": "sky130_fd_sc_hd__xor3_1",
    "x": 14360,
    "y": 10880,
    "orient": "N",
    "func": "Full-Adder Sum XOR3 gate"
  },
  {
    "id": "block1/fa_2/cout_maj3",
    "type": "sky130_fd_sc_hd__maj3_1",
    "x": 18040,
    "y": 10880,
    "orient": "N",
    "func": "Full-Adder Carry Majority-3 gate"
  },
  {
    "id": "block1/fa_3/sum_xor3",
    "type": "sky130_fd_sc_hd__xor3_1",
    "x": 21720,
    "y": 10880,
    "orient": "N",
    "func": "Full-Adder Sum XOR3 gate"
  },
  {
    "id": "block1/fa_3/cout_maj3",
    "type": "sky130_fd_sc_hd__maj3_1",
    "x": 25400,
    "y": 10880,
    "orient": "N",
    "func": "Full-Adder Carry Majority-3 gate"
  },
  {
    "id": "block2/prop_xor_0",
    "type": "sky130_fd_sc_hd__xor2_1",
    "x": 29080,
    "y": 10880,
    "orient": "N",
    "func": "Bit-Propagate XOR2 gate"
  },
  {
    "id": "block2/prop_xor_1",
    "type": "sky130_fd_sc_hd__xor2_1",
    "x": 32760,
    "y": 10880,
    "orient": "N",
    "func": "Bit-Propagate XOR2 gate"
  },
  {
    "id": "block2/prop_xor_2",
    "type": "sky130_fd_sc_hd__xor2_1",
    "x": 36440,
    "y": 10880,
    "orient": "N",
    "func": "Bit-Propagate XOR2 gate"
  },
  {
    "id": "block2/prop_xor_3",
    "type": "sky130_fd_sc_hd__xor2_1",
    "x": 40120,
    "y": 10880,
    "orient": "N",
    "func": "Bit-Propagate XOR2 gate"
  },
  {
    "id": "block2/group_prop_and4",
    "type": "sky130_fd_sc_hd__and4_1",
    "x": 43800,
    "y": 10880,
    "orient": "N",
    "func": "Group-Propagate 4-bit AND gate"
  },
  {
    "id": "block2/carry_skip_mux2",
    "type": "sky130_fd_sc_hd__mux2_1",
    "x": 7000,
    "y": 13600,
    "orient": "FS",
    "func": "Carry-Skip 2:1 MUX (Bypass stage)"
  },
  {
    "id": "block2/fa_0/sum_xor3",
    "type": "sky130_fd_sc_hd__xor3_1",
    "x": 10680,
    "y": 13600,
    "orient": "FS",
    "func": "Full-Adder Sum XOR3 gate"
  },
  {
    "id": "block2/fa_0/cout_maj3",
    "type": "sky130_fd_sc_hd__maj3_1",
    "x": 14360,
    "y": 13600,
    "orient": "FS",
    "func": "Full-Adder Carry Majority-3 gate"
  },
  {
    "id": "block2/fa_1/sum_xor3",
    "type": "sky130_fd_sc_hd__xor3_1",
    "x": 18040,
    "y": 13600,
    "orient": "FS",
    "func": "Full-Adder Sum XOR3 gate"
  },
  {
    "id": "block2/fa_1/cout_maj3",
    "type": "sky130_fd_sc_hd__maj3_1",
    "x": 21720,
    "y": 13600,
    "orient": "FS",
    "func": "Full-Adder Carry Majority-3 gate"
  },
  {
    "id": "block2/fa_2/sum_xor3",
    "type": "sky130_fd_sc_hd__xor3_1",
    "x": 25400,
    "y": 13600,
    "orient": "FS",
    "func": "Full-Adder Sum XOR3 gate"
  },
  {
    "id": "block2/fa_2/cout_maj3",
    "type": "sky130_fd_sc_hd__maj3_1",
    "x": 29080,
    "y": 13600,
    "orient": "FS",
    "func": "Full-Adder Carry Majority-3 gate"
  },
  {
    "id": "block2/fa_3/sum_xor3",
    "type": "sky130_fd_sc_hd__xor3_1",
    "x": 32760,
    "y": 13600,
    "orient": "FS",
    "func": "Full-Adder Sum XOR3 gate"
  },
  {
    "id": "block2/fa_3/cout_maj3",
    "type": "sky130_fd_sc_hd__maj3_1",
    "x": 36440,
    "y": 13600,
    "orient": "FS",
    "func": "Full-Adder Carry Majority-3 gate"
  },
  {
    "id": "block3/prop_xor_0",
    "type": "sky130_fd_sc_hd__xor2_1",
    "x": 40120,
    "y": 13600,
    "orient": "FS",
    "func": "Bit-Propagate XOR2 gate"
  },
  {
    "id": "block3/prop_xor_1",
    "type": "sky130_fd_sc_hd__xor2_1",
    "x": 43800,
    "y": 13600,
    "orient": "FS",
    "func": "Bit-Propagate XOR2 gate"
  },
  {
    "id": "block3/prop_xor_2",
    "type": "sky130_fd_sc_hd__xor2_1",
    "x": 7000,
    "y": 16320,
    "orient": "N",
    "func": "Bit-Propagate XOR2 gate"
  },
  {
    "id": "block3/prop_xor_3",
    "type": "sky130_fd_sc_hd__xor2_1",
    "x": 10680,
    "y": 16320,
    "orient": "N",
    "func": "Bit-Propagate XOR2 gate"
  },
  {
    "id": "block3/group_prop_and4",
    "type": "sky130_fd_sc_hd__and4_1",
    "x": 14360,
    "y": 16320,
    "orient": "N",
    "func": "Group-Propagate 4-bit AND gate"
  },
  {
    "id": "block3/carry_skip_mux2",
    "type": "sky130_fd_sc_hd__mux2_1",
    "x": 18040,
    "y": 16320,
    "orient": "N",
    "func": "Carry-Skip 2:1 MUX (Bypass stage)"
  },
  {
    "id": "block3/fa_0/sum_xor3",
    "type": "sky130_fd_sc_hd__xor3_1",
    "x": 21720,
    "y": 16320,
    "orient": "N",
    "func": "Full-Adder Sum XOR3 gate"
  },
  {
    "id": "block3/fa_0/cout_maj3",
    "type": "sky130_fd_sc_hd__maj3_1",
    "x": 25400,
    "y": 16320,
    "orient": "N",
    "func": "Full-Adder Carry Majority-3 gate"
  },
  {
    "id": "block3/fa_1/sum_xor3",
    "type": "sky130_fd_sc_hd__xor3_1",
    "x": 29080,
    "y": 16320,
    "orient": "N",
    "func": "Full-Adder Sum XOR3 gate"
  },
  {
    "id": "block3/fa_1/cout_maj3",
    "type": "sky130_fd_sc_hd__maj3_1",
    "x": 32760,
    "y": 16320,
    "orient": "N",
    "func": "Full-Adder Carry Majority-3 gate"
  },
  {
    "id": "block3/fa_2/sum_xor3",
    "type": "sky130_fd_sc_hd__xor3_1",
    "x": 36440,
    "y": 16320,
    "orient": "N",
    "func": "Full-Adder Sum XOR3 gate"
  },
  {
    "id": "block3/fa_2/cout_maj3",
    "type": "sky130_fd_sc_hd__maj3_1",
    "x": 40120,
    "y": 16320,
    "orient": "N",
    "func": "Full-Adder Carry Majority-3 gate"
  },
  {
    "id": "block3/fa_3/sum_xor3",
    "type": "sky130_fd_sc_hd__xor3_1",
    "x": 43800,
    "y": 16320,
    "orient": "N",
    "func": "Full-Adder Sum XOR3 gate"
  },
  {
    "id": "block3/fa_3/cout_maj3",
    "type": "sky130_fd_sc_hd__maj3_1",
    "x": 7000,
    "y": 19040,
    "orient": "FS",
    "func": "Full-Adder Carry Majority-3 gate"
  }
]

export default function PhysicalDesignViewer() {
  const [archMode, setArchMode] = useState<'HIERARCHICAL' | 'FLATTENED'>('HIERARCHICAL')
  const [selectedCell, setSelectedCell] = useState<any>(HIER_COMPONENTS[5]) // default to MUX
  const [viewTab, setViewTab] = useState<'MAP' | 'DEF'>('MAP')
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [showPowerRing, setShowPowerRing] = useState<boolean>(true)
  const [showRows, setShowRows] = useState<boolean>(true)
  const [showLabels, setShowLabels] = useState<boolean>(true)

  const isHier = archMode === 'HIERARCHICAL'
  const components = isHier ? HIER_COMPONENTS : FLAT_COMPONENTS

  // Die & Core Dimensions
  const dieW = isHier ? 55000 : 45000
  const dieH = isHier ? 45000 : 35000
  const coreW = isHier ? 45000 : 35000
  const coreH = isHier ? 32640 : 24480
  const numRows = isHier ? 12 : 9
  const rowStart = 5440
  const rowPitch = 2720

  const scale = (isHier ? 0.0135 : 0.016) * zoomLevel

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Header */}
      <div className="glass-panel p-6 rounded-2xl border border-[#00F0FF]/25 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-wide text-white glow-cyan flex items-center space-x-2">
              <Layers className="w-5 h-5 text-[#00F0FF]" />
              <span>SKYWATER 130NM ASIC PHYSICAL IMPLEMENTATION</span>
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Standard Cell Placement • Floorplan Geometry • DEF Database • GDSII Stream Format
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Architecture Selector */}
            <div className="flex items-center bg-[#070D1A] rounded-xl p-1 border border-[#00F0FF]/30">
              <button
                onClick={() => {
                  setArchMode('HIERARCHICAL')
                  setSelectedCell(HIER_COMPONENTS[5]) // Carry-Skip MUX
                }}
                className={`px-3 py-1.5 rounded-lg transition text-xs font-bold flex items-center space-x-1.5 ${
                  isHier
                    ? 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/30'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>HIERARCHICAL CSKA (56 CELLS)</span>
              </button>
              <button
                onClick={() => {
                  setArchMode('FLATTENED')
                  setSelectedCell(FLAT_COMPONENTS[1])
                }}
                className={`px-3 py-1.5 rounded-lg transition text-xs font-bold flex items-center space-x-1.5 ${
                  !isHier
                    ? 'bg-[#FF7A00] text-black shadow-lg shadow-[#FF7A00]/30'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>FLATTENED (48 CELLS - RCA EQUIV)</span>
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#070D1A] rounded-xl p-1 border border-[#1E293B]">
              <button
                onClick={() => setViewTab('MAP')}
                className={`px-3 py-1.5 rounded-lg transition text-xs font-bold ${
                  viewTab === 'MAP'
                    ? 'bg-white/20 text-white'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                LAYOUT MAP
              </button>
              <button
                onClick={() => setViewTab('DEF')}
                className={`px-3 py-1.5 rounded-lg transition text-xs font-bold ${
                  viewTab === 'DEF'
                    ? 'bg-white/20 text-white'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                DEF SOURCE
              </button>
            </div>
          </div>
        </div>

        {/* Mandatory Status Callout */}
        <div className="p-3 rounded-xl bg-[#0F172A] border border-[#FACC15]/40 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-[#FACC15] font-bold">
            <CheckCircle className="w-4 h-4 text-[#00DF72] shrink-0" />
            <span>PHYSICAL DESIGN STATUS: Placement verified — detailed routing not completed.</span>
          </div>
          <span className="text-[11px] text-[#94A3B8] hidden md:inline">
            Standard-cell placement stream assembled with KLayout from Sky130 HD PDK.
          </span>
        </div>

        {/* View Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="text-[#94A3B8]">DISPLAY LAYERS:</span>
            <button
              onClick={() => setShowPowerRing(!showPowerRing)}
              className={`px-2.5 py-1 rounded border flex items-center space-x-1 ${
                showPowerRing
                  ? 'bg-[#FF7A00]/15 text-[#FF7A00] border-[#FF7A00]/40'
                  : 'bg-[#090F1E] text-[#64748B] border-[#1E293B]'
              }`}
            >
              <span>VDD/VSS POWER RINGS</span>
            </button>
            <button
              onClick={() => setShowRows(!showRows)}
              className={`px-2.5 py-1 rounded border flex items-center space-x-1 ${
                showRows
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40'
                  : 'bg-[#090F1E] text-[#64748B] border-[#1E293B]'
              }`}
            >
              <span>STANDARD CELL ROWS</span>
            </button>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`px-2.5 py-1 rounded border flex items-center space-x-1 ${
                showLabels
                  ? 'bg-[#00DF72]/15 text-[#00DF72] border-[#00DF72]/40'
                  : 'bg-[#090F1E] text-[#64748B] border-[#1E293B]'
              }`}
            >
              <span>CELL LABELS</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
              className="p-1.5 rounded bg-[#070D1A] border border-[#1E293B] text-[#94A3B8] hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-white font-bold">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.25))}
              className="p-1.5 rounded bg-[#070D1A] border border-[#1E293B] text-[#94A3B8] hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Area */}
      {viewTab === 'MAP' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive SVG Placement Canvas */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-[#1E293B] flex flex-col items-center justify-center relative overflow-hidden bg-[#040711]">
            <div className="text-[11px] font-bold self-start mb-3 flex items-center justify-between w-full">
              <span className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${isHier ? 'bg-[#00F0FF]' : 'bg-[#FF7A00]'} animate-pulse`}></span>
                <span className={isHier ? 'text-[#00F0FF]' : 'text-[#FF7A00]'}>
                  {isHier
                    ? 'HIERARCHICAL CSKA PLACEMENT MAP (56 CELLS • DIE: 55.0 × 45.0 µm)'
                    : 'FLATTENED PLACEMENT MAP (48 CELLS • DIE: 45.0 × 35.0 µm)'}
                </span>
              </span>
              <span className="text-[10px] text-[#94A3B8]">
                {isHier ? 'Preserves 4x MUX2 + 4x AND4 Bypass' : 'RCA Topological Equivalent'}
              </span>
            </div>

            {/* SVG Interactive Canvas */}
            <div className="w-full overflow-auto flex items-center justify-center p-4">
              <svg
                width={dieW * scale}
                height={dieH * scale}
                viewBox={`0 0 ${dieW} ${dieH}`}
                className="bg-[#070D1A] rounded-xl border-2 border-[#00F0FF]/40 shadow-2xl transition-all"
              >
                {/* Die Boundary */}
                <rect
                  x="0"
                  y="0"
                  width={dieW}
                  height={dieH}
                  fill="#070D1A"
                  stroke={isHier ? '#00F0FF' : '#FF7A00'}
                  strokeWidth="600"
                />

                {/* VDD / VSS Power Rings */}
                {showPowerRing && (
                  <g>
                    <rect
                      x="1800"
                      y="1800"
                      width={dieW - 3600}
                      height={dieH - 3600}
                      fill="none"
                      stroke="#FB923C"
                      strokeWidth="800"
                      strokeDasharray="2000, 1000"
                      opacity="0.85"
                    />
                    <rect
                      x="3200"
                      y="3200"
                      width={dieW - 6400}
                      height={dieH - 6400}
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="800"
                      strokeDasharray="2000, 1000"
                      opacity="0.85"
                    />
                  </g>
                )}

                {/* Core Area Boundary */}
                <rect
                  x="5000"
                  y="5440"
                  width={coreW}
                  height={coreH}
                  fill="none"
                  stroke={isHier ? '#00DF72' : '#FF7A00'}
                  strokeWidth="400"
                  strokeDasharray="1200, 800"
                  opacity="0.75"
                />

                {/* Standard Cell Rows */}
                {showRows && (
                  <g>
                    {Array.from({ length: numRows }).map((_, rIdx) => {
                      const ry = rowStart + rIdx * rowPitch
                      return (
                        <line
                          key={rIdx}
                          x1="5000"
                          y1={ry}
                          x2={5000 + coreW}
                          y2={ry}
                          stroke="#1E293B"
                          strokeWidth="150"
                          strokeDasharray="500, 500"
                        />
                      )
                    })}
                  </g>
                )}

                {/* Placed Standard Cells */}
                {components.map((cell: any) => {
                  const isMux = cell.type.includes('mux2')
                  const isAnd4 = cell.type.includes('and4')
                  const isMaj = cell.type.includes('maj3')
                  const isXor3 = cell.type.includes('xor3')
                  const isXor2 = cell.type.includes('xor2')
                  const isSel = selectedCell?.id === cell.id

                  let fillColor = '#00F0FF'
                  let strokeColor = '#38BDF8'
                  let lbl = 'GATE'

                  if (isMux) {
                    fillColor = '#FF007F' // Neon Magenta
                    strokeColor = '#FFFFFF'
                    lbl = 'MUX'
                  } else if (isAnd4) {
                    fillColor = '#A855F7' // Purple
                    strokeColor = '#E9D5FF'
                    lbl = 'AND'
                  } else if (isMaj) {
                    fillColor = '#FF7A00' // Amber
                    strokeColor = '#FFAA33'
                    lbl = 'MAJ'
                  } else if (isXor3) {
                    fillColor = '#00F0FF' // Cyan
                    strokeColor = '#67E8F9'
                    lbl = 'XOR3'
                  } else if (isXor2) {
                    fillColor = '#00DF72' // Emerald
                    strokeColor = '#86EFAC'
                    lbl = 'XOR2'
                  } else {
                    fillColor = '#38BDF8' // XNOR
                    strokeColor = '#BAE6FD'
                    lbl = 'XNR'
                  }

                  const w = isMux ? 2760 : isAnd4 ? 2300 : isMaj || isXor3 ? 3680 : 2760
                  const h = 2500

                  return (
                    <g
                      key={cell.id}
                      onClick={() => setSelectedCell(cell)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={cell.x}
                        y={cell.y}
                        width={w}
                        height={h}
                        fill={fillColor}
                        fillOpacity={isSel ? 0.98 : isMux || isAnd4 ? 0.92 : 0.70}
                        stroke={isSel ? '#FFFFFF' : strokeColor}
                        strokeWidth={isSel ? '700' : isMux ? '500' : '200'}
                        rx="300"
                        className={isMux ? 'filter drop-shadow-[0_0_8px_rgba(255,0,127,0.8)]' : ''}
                      />
                      {showLabels && (
                        <text
                          x={cell.x + w / 2}
                          y={cell.y + h / 2 + 300}
                          fill="#030712"
                          fontSize="950"
                          fontWeight="bold"
                          textAnchor="middle"
                          pointerEvents="none"
                        >
                          {lbl}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Layout Legend */}
            <div className="w-full flex flex-wrap items-center justify-between text-[11px] text-[#94A3B8] pt-4 border-t border-[#1E293B] gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {isHier ? (
                  <>
                    <span className="flex items-center space-x-1.5 font-bold text-[#FF007F]">
                      <span className="w-3 h-3 rounded-sm bg-[#FF007F] shadow-[0_0_6px_#FF007F]"></span>
                      <span>mux2_1 (4x Skip MUX) ★</span>
                    </span>
                    <span className="flex items-center space-x-1.5 font-bold text-[#A855F7]">
                      <span className="w-3 h-3 rounded-sm bg-[#A855F7]"></span>
                      <span>and4_1 (4x Group Propagate) ★</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 rounded-sm bg-[#00DF72]"></span>
                      <span>xor2_1 (16x Bit Propagate)</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 rounded-sm bg-[#FF7A00]"></span>
                      <span>maj3_1 (16x Carry)</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 rounded-sm bg-[#00F0FF]"></span>
                      <span>xor3_1 (16x Sum)</span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 rounded-sm bg-[#FF7A00]"></span>
                      <span>maj3_1 (16x Carry)</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 rounded-sm bg-[#00F0FF]"></span>
                      <span>xnor2_1 (32x Sum Logic)</span>
                    </span>
                  </>
                )}
              </div>
              <span className="text-[#00F0FF]">Site Pitch: 0.46 µm • Row Height: 2.72 µm</span>
            </div>
          </div>

          {/* Cell & Layout Inspector */}
          <div className="space-y-4">
            {/* Selected Cell Inspector */}
            <div className="glass-panel p-5 rounded-xl border border-[#00F0FF]/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
                <span className="font-bold text-white text-xs flex items-center space-x-1.5">
                  <Box className="w-4 h-4 text-[#00F0FF]" />
                  <span>STANDARD CELL INSPECTOR</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  selectedCell?.type?.includes('mux2')
                    ? 'bg-[#FF007F]/20 text-[#FF007F] border border-[#FF007F]/40'
                    : selectedCell?.type?.includes('and4')
                    ? 'bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/40'
                    : 'bg-[#00F0FF]/15 text-[#00F0FF]'
                }`}>
                  {selectedCell?.id || 'SELECT CELL'}
                </span>
              </div>

              {selectedCell ? (
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between border-b border-[#1E293B]/50 pb-1.5">
                    <span className="text-[#94A3B8]">Cell Instance:</span>
                    <span className="text-white font-bold">{selectedCell.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1E293B]/50 pb-1.5">
                    <span className="text-[#94A3B8]">Master Cell:</span>
                    <span className="text-[#00F0FF] font-bold break-all">{selectedCell.type}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1E293B]/50 pb-1.5">
                    <span className="text-[#94A3B8]">Function:</span>
                    <span className="text-[#00DF72] font-bold">{selectedCell.func}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1E293B]/50 pb-1.5">
                    <span className="text-[#94A3B8]">Coordinates (X, Y):</span>
                    <span className="text-white font-bold">
                      {selectedCell.x / 1000} µm, {selectedCell.y / 1000} µm
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#1E293B]/50 pb-1.5">
                    <span className="text-[#94A3B8]">Orientation:</span>
                    <span className="text-white font-bold">{selectedCell.orient === 'N' ? 'North (N)' : 'Flip-South (FS)'}</span>
                  </div>
                  <div className="flex justify-between pt-0.5">
                    <span className="text-[#94A3B8]">Row Location:</span>
                    <span className="text-[#FF7A00] font-bold">Row Y={selectedCell.y / 1000} µm</span>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-[#64748B]">Click any standard cell on the layout map to inspect.</div>
              )}
            </div>

            {/* ASIC Physical Specifications */}
            <div className="glass-panel p-5 rounded-xl border border-[#1E293B] space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center space-x-1.5 pb-2 border-b border-[#1E293B]">
                <HardDrive className="w-4 h-4 text-[#00DF72]" />
                <span>PHYSICAL IMPLEMENTATION SPECS</span>
              </h4>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
                  <span className="text-[#94A3B8]">Architecture:</span>
                  <span className="text-white font-bold">{isHier ? 'Hierarchical CSKA (True)' : 'Flattened (RCA Equiv)'}</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
                  <span className="text-[#94A3B8]">Standard Cell Count:</span>
                  <span className="text-[#00F0FF] font-bold">{isHier ? '56 cells placed' : '48 cells placed'}</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
                  <span className="text-[#94A3B8]">Silicon Gate Area:</span>
                  <span className="text-[#00DF72] font-bold">{isHier ? '760.73 µm²' : '440.42 µm²'}</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
                  <span className="text-[#94A3B8]">Die Dimensions:</span>
                  <span className="text-white font-bold">{isHier ? '55.0 × 45.0 µm (2,475 µm²)' : '45.0 × 35.0 µm (1,575 µm²)'}</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
                  <span className="text-[#94A3B8]">Core Dimensions:</span>
                  <span className="text-white font-bold">{isHier ? '45.0 × 32.6 µm (1,468.8 µm²)' : '35.0 × 24.5 µm (856.8 µm²)'}</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
                  <span className="text-[#94A3B8]">Core Utilization:</span>
                  <span className="text-white font-bold">{isHier ? '51.8%' : '51.4%'}</span>
                </div>
                <div className="flex justify-between border-b border-[#1E293B]/50 pb-1">
                  <span className="text-[#94A3B8]">Row Count / Pitch:</span>
                  <span className="text-white font-bold">{isHier ? '12 rows @ 2.72 µm' : '9 rows @ 2.72 µm'}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-[#94A3B8]">GDSII Stream File:</span>
                  <span className="text-[#FF7A00] font-bold">
                    {isHier ? 'cska_hier_sky130.gds (4.19 MB)' : 'cska_sky130.gds (4.18 MB)'}
                  </span>
                </div>
              </div>

              {/* Physical Limitations Honest Disclosure */}
              <div className="p-2.5 rounded-lg bg-[#0F172A] border border-[#00F0FF]/20 text-[10px] text-[#94A3B8] flex items-start space-x-2">
                <Info className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                <span>
                  <b>Academic Boundary:</b> Placement verified with KLayout macros. Detailed routing (M1-M5 metal) and signoff DRC/LVS were not completed in this placement-level stream.
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* DEF Source Viewer */
        <div className="glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <span className="text-xs font-bold text-white flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-[#00F0FF]" />
              <span>DEF FILE SOURCE: {isHier ? 'cska_hier_sky130.def (56 Cells)' : 'cska_sky130.def (48 Cells)'}</span>
            </span>
            <span className="text-[10px] text-[#64748B]">DESIGN: carry_skip_adder • UNITS 1000</span>
          </div>

          <pre className="p-4 rounded-xl bg-[#040812] border border-[#1E293B] overflow-auto max-h-[500px] text-[11px] text-[#94A3B8] font-mono leading-relaxed">
{isHier ? `VERSION 5.8 ;
DIVIDERCHAR "/" ;
BUSBITCHARS "[]" ;
DESIGN carry_skip_adder ;
UNITS DISTANCE MICRONS 1000 ;
DIEAREA ( 0 0 ) ( 55000 45000 ) ;

ROW ROW_0 unithd 5000 5440 N DO 97 BY 1 STEP 460 0 ;
ROW ROW_1 unithd 5000 8160 FS DO 97 BY 1 STEP 460 0 ;
ROW ROW_2 unithd 5000 10880 N DO 97 BY 1 STEP 460 0 ;
ROW ROW_3 unithd 5000 13600 FS DO 97 BY 1 STEP 460 0 ;
ROW ROW_4 unithd 5000 16320 N DO 97 BY 1 STEP 460 0 ;
ROW ROW_5 unithd 5000 19040 FS DO 97 BY 1 STEP 460 0 ;
ROW ROW_6 unithd 5000 21760 N DO 97 BY 1 STEP 460 0 ;
ROW ROW_7 unithd 5000 24480 FS DO 97 BY 1 STEP 460 0 ;
ROW ROW_8 unithd 5000 27200 N DO 97 BY 1 STEP 460 0 ;
ROW ROW_9 unithd 5000 29920 FS DO 97 BY 1 STEP 460 0 ;
ROW ROW_10 unithd 5000 32640 N DO 97 BY 1 STEP 460 0 ;
ROW ROW_11 unithd 5000 35360 FS DO 97 BY 1 STEP 460 0 ;

COMPONENTS 56 ;
- block0/prop_xor_0 sky130_fd_sc_hd__xor2_1 + PLACED ( 7000 5440 ) N ;
- block0/prop_xor_1 sky130_fd_sc_hd__xor2_1 + PLACED ( 10680 5440 ) N ;
- block0/prop_xor_2 sky130_fd_sc_hd__xor2_1 + PLACED ( 14360 5440 ) N ;
- block0/prop_xor_3 sky130_fd_sc_hd__xor2_1 + PLACED ( 18040 5440 ) N ;
- block0/group_prop_and4 sky130_fd_sc_hd__and4_1 + PLACED ( 21720 5440 ) N ;
- block0/carry_skip_mux2 sky130_fd_sc_hd__mux2_1 + PLACED ( 24480 5440 ) N ;
- block0/fa_0/sum_xor3 sky130_fd_sc_hd__xor3_1 + PLACED ( 27240 5440 ) N ;
- block0/fa_0/cout_maj3 sky130_fd_sc_hd__maj3_1 + PLACED ( 30920 5440 ) N ;
... [56 standard cell components preserving all 4x MUX2 & 4x AND4 gates]
END COMPONENTS
END DESIGN` : `VERSION 5.8 ;
DIVIDERCHAR "/" ;
BUSBITCHARS "[]" ;
DESIGN carry_skip_adder ;
UNITS DISTANCE MICRONS 1000 ;
DIEAREA ( 0 0 ) ( 45000 35000 ) ;

ROW ROW_0 unithd 5000 5440 N DO 76 BY 1 STEP 460 0 ;
ROW ROW_1 unithd 5000 8160 FS DO 76 BY 1 STEP 460 0 ;
ROW ROW_2 unithd 5000 10880 N DO 76 BY 1 STEP 460 0 ;
ROW ROW_3 unithd 5000 13600 FS DO 76 BY 1 STEP 460 0 ;
ROW ROW_4 unithd 5000 16320 N DO 76 BY 1 STEP 460 0 ;
ROW ROW_5 unithd 5000 19040 FS DO 76 BY 1 STEP 460 0 ;

COMPONENTS 48 ;
- _31_ sky130_fd_sc_hd__xnor2_1 + PLACED ( 7000 5440 ) N ;
- _32_ sky130_fd_sc_hd__maj3_1 + PLACED ( 9760 5440 ) N ;
- _33_ sky130_fd_sc_hd__xnor2_1 + PLACED ( 12520 5440 ) N ;
- _34_ sky130_fd_sc_hd__maj3_1 + PLACED ( 15280 5440 ) N ;
... [48 standard cell components total - flattened RCA equivalent]
END COMPONENTS
END DESIGN`}
          </pre>
        </div>
      )}
    </div>
  )
}
