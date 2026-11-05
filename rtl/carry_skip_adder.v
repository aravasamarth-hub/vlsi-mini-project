`timescale 1ns/1ps

// ============================================================================
// Module: carry_skip_adder
// Width: 16-bit (PRIMARY ARCHITECTURE)
// Architecture: Four 4-bit Carry Skip Blocks (4 x 4-bit)
// Description:
//   Accelerates carry propagation across 16 bits by checking if each 4-bit
//   group satisfies the group propagate condition. If all bits in a group
//   satisfy A[i] ^ B[i] == 1, the carry-in bypasses the 4-bit ripple chain
//   via a 2:1 multiplexer in O(1) time rather than O(4) time.
//
// Block Partitioning:
//   Block 0: Bits [3:0]   - Inputs A[3:0],   B[3:0],   Cin -> C4
//   Block 1: Bits [7:4]   - Inputs A[7:4],   B[7:4],   C4  -> C8
//   Block 2: Bits [11:8]  - Inputs A[11:8],  B[11:8],  C8  -> C12
//   Block 3: Bits [15:12] - Inputs A[15:12], B[15:12], C12 -> Cout (C16)
// ============================================================================
module carry_skip_adder (
    input  wire [15:0] A,
    input  wire [15:0] B,
    input  wire        Cin,
    output wire [15:0] SUM,
    output wire        Cout
);

    // Intermediate block carries
    wire c0, c4, c8, c12, c16;
    assign c0   = Cin;
    assign Cout = c16;

    // Telemetry and observability wires (accessible by testbench and VCD)
    wire [15:0] bit_propagate;
    wire [3:0]  group_propagate;
    wire [3:0]  ripple_carries;
    wire [3:0]  skip_active;

    // Block 0: Bits 3:0
    carry_skip_block_4bit block0 (
        .A          (A[3:0]),
        .B          (B[3:0]),
        .Cin        (c0),
        .SUM        (SUM[3:0]),
        .Cout       (c4),
        .P_bits     (bit_propagate[3:0]),
        .P_group    (group_propagate[0]),
        .C_ripple   (ripple_carries[0]),
        .Skip_active(skip_active[0])
    );

    // Block 1: Bits 7:4
    carry_skip_block_4bit block1 (
        .A          (A[7:4]),
        .B          (B[7:4]),
        .Cin        (c4),
        .SUM        (SUM[7:4]),
        .Cout       (c8),
        .P_bits     (bit_propagate[7:4]),
        .P_group    (group_propagate[1]),
        .C_ripple   (ripple_carries[1]),
        .Skip_active(skip_active[1])
    );

    // Block 2: Bits 11:8
    carry_skip_block_4bit block2 (
        .A          (A[11:8]),
        .B          (B[11:8]),
        .Cin        (c8),
        .SUM        (SUM[11:8]),
        .Cout       (c12),
        .P_bits     (bit_propagate[11:8]),
        .P_group    (group_propagate[2]),
        .C_ripple   (ripple_carries[2]),
        .Skip_active(skip_active[2])
    );

    // Block 3: Bits 15:12
    carry_skip_block_4bit block3 (
        .A          (A[15:12]),
        .B          (B[15:12]),
        .Cin        (c12),
        .SUM        (SUM[15:12]),
        .Cout       (c16),
        .P_bits     (bit_propagate[15:12]),
        .P_group    (group_propagate[3]),
        .C_ripple   (ripple_carries[3]),
        .Skip_active(skip_active[3])
    );

endmodule
