`timescale 1ns/1ps

// ============================================================================
// Module: carry_select_adder
// Width: 16-bit
// Architecture: 4-block Carry Select Adder (CSLA)
// Description:
//   Block 0 adds directly with Cin.
//   Blocks 1, 2, and 3 use speculative dual execution (Cin=0 and Cin=1)
//   and select the correct results via multiplexers as the carry ripples
//   through block boundaries.
// ============================================================================
module carry_select_adder (
    input  wire [15:0] A,
    input  wire [15:0] B,
    input  wire        Cin,
    output wire [15:0] SUM,
    output wire        Cout
);

    wire c4, c8, c12;

    // Block 0: standard ripple carry section for bits 3:0
    wire [4:0] c0_chain;
    assign c0_chain[0] = Cin;
    assign c4 = c0_chain[4];

    genvar i;
    generate
        for (i = 0; i < 4; i = i + 1) begin : gen_blk0_fa
            full_adder fa_inst (
                .a   (A[i]),
                .b   (B[i]),
                .cin (c0_chain[i]),
                .sum (SUM[i]),
                .cout(c0_chain[i+1])
            );
        end
    endgenerate

    // Block 1: Carry Select for bits 7:4, selected by c4
    csla_block_4bit blk1 (
        .A   (A[7:4]),
        .B   (B[7:4]),
        .Cin (c4),
        .SUM (SUM[7:4]),
        .Cout(c8)
    );

    // Block 2: Carry Select for bits 11:8, selected by c8
    csla_block_4bit blk2 (
        .A   (A[11:8]),
        .B   (B[11:8]),
        .Cin (c8),
        .SUM (SUM[11:8]),
        .Cout(c12)
    );

    // Block 3: Carry Select for bits 15:12, selected by c12
    csla_block_4bit blk3 (
        .A   (A[15:12]),
        .B   (B[15:12]),
        .Cin (c12),
        .SUM (SUM[15:12]),
        .Cout(Cout)
    );

endmodule
