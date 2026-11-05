`timescale 1ns/1ps

// ============================================================================
// Module: carry_lookahead_adder
// Width: 16-bit
// Architecture: Hierarchical 16-bit CLA with 4-bit CLA blocks & Look-Ahead Unit
// Description:
//   Computes all intermediate block carries (C4, C8, C12, C16) in parallel
//   using block generate (G_blk) and block propagate (P_blk) functions.
//   Removes the ripple delay completely.
// ============================================================================
module carry_lookahead_adder (
    input  wire [15:0] A,
    input  wire [15:0] B,
    input  wire        Cin,
    output wire [15:0] SUM,
    output wire        Cout
);

    wire [3:0] G_blk, P_blk;
    wire [4:0] C_blk;

    assign C_blk[0] = Cin;

    // Look-Ahead Carry Generator for block carries
    assign C_blk[1] = G_blk[0] | (P_blk[0] & C_blk[0]);
    assign C_blk[2] = G_blk[1] | (P_blk[1] & G_blk[0]) | (P_blk[1] & P_blk[0] & C_blk[0]);
    assign C_blk[3] = G_blk[2] | (P_blk[2] & G_blk[1]) | (P_blk[2] & P_blk[1] & G_blk[0]) | (P_blk[2] & P_blk[1] & P_blk[0] & C_blk[0]);
    assign C_blk[4] = G_blk[3] | (P_blk[3] & G_blk[2]) | (P_blk[3] & P_blk[2] & G_blk[1]) | (P_blk[3] & P_blk[2] & P_blk[1] & G_blk[0]) | (P_blk[3] & P_blk[2] & P_blk[1] & P_blk[0] & C_blk[0]);

    assign Cout = C_blk[4];

    // Four 4-bit CLA blocks
    cla_block_4bit cla0 (
        .A    (A[3:0]),
        .B    (B[3:0]),
        .Cin  (C_blk[0]),
        .SUM  (SUM[3:0]),
        .Cout (),
        .G_blk(G_blk[0]),
        .P_blk(P_blk[0])
    );

    cla_block_4bit cla1 (
        .A    (A[7:4]),
        .B    (B[7:4]),
        .Cin  (C_blk[1]),
        .SUM  (SUM[7:4]),
        .Cout (),
        .G_blk(G_blk[1]),
        .P_blk(P_blk[1])
    );

    cla_block_4bit cla2 (
        .A    (A[11:8]),
        .B    (B[11:8]),
        .Cin  (C_blk[2]),
        .SUM  (SUM[11:8]),
        .Cout (),
        .G_blk(G_blk[2]),
        .P_blk(P_blk[2])
    );

    cla_block_4bit cla3 (
        .A    (A[15:12]),
        .B    (B[15:12]),
        .Cin  (C_blk[3]),
        .SUM  (SUM[15:12]),
        .Cout (),
        .G_blk(G_blk[3]),
        .P_blk(P_blk[3])
    );

endmodule
