`timescale 1ns/1ps

// ============================================================================
// Module: csla_block_4bit
// Width: 4-bit Carry Select Block
// Description:
//   Computes two additions concurrently:
//     Path 0: assuming carry-in = 0
//     Path 1: assuming carry-in = 1
//   When the incoming carry arrives, 2:1 multiplexers instantly select the
//   valid sum and carry-out without waiting for internal ripple propagation.
// ============================================================================
module csla_block_4bit (
    input  wire [3:0] A,
    input  wire [3:0] B,
    input  wire       Cin,
    output wire [3:0] SUM,
    output wire       Cout
);

    wire [3:0] sum0, sum1;
    wire       cout0, cout1;
    wire [4:0] c0_int, c1_int;

    assign c0_int[0] = 1'b0;
    assign c1_int[0] = 1'b1;

    // Dual ripple carry paths in parallel
    genvar i;
    generate
        for (i = 0; i < 4; i = i + 1) begin : gen_dual_adders
            // Path 0: Cin = 0
            full_adder fa0 (
                .a   (A[i]),
                .b   (B[i]),
                .cin (c0_int[i]),
                .sum (sum0[i]),
                .cout(c0_int[i+1])
            );
            // Path 1: Cin = 1
            full_adder fa1 (
                .a   (A[i]),
                .b   (B[i]),
                .cin (c1_int[i]),
                .sum (sum1[i]),
                .cout(c1_int[i+1])
            );
        end
    endgenerate

    assign cout0 = c0_int[4];
    assign cout1 = c1_int[4];

    // Multiplexer selection based on incoming carry
    assign SUM  = Cin ? sum1  : sum0;
    assign Cout = Cin ? cout1 : cout0;

endmodule
