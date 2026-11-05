`timescale 1ns/1ps

// ============================================================================
// Module: cla_block_4bit
// Width: 4-bit Carry Look-Ahead Block
// Equations:
//   G[i] = A[i] & B[i]
//   P[i] = A[i] ^ B[i]
//   C[1] = G[0] | (P[0] & Cin)
//   C[2] = G[1] | (P[1] & G[0]) | (P[1] & P[0] & Cin)
//   C[3] = G[2] | (P[2] & G[1]) | (P[2] & P[1] & G[0]) | (P[2] & P[1] & P[0] & Cin)
//   G_blk = G[3] | (P[3] & G[2]) | (P[3] & P[2] & G[1]) | (P[3] & P[2] & P[1] & G[0])
//   P_blk = P[3] & P[2] & P[1] & P[0]
// ============================================================================
module cla_block_4bit (
    input  wire [3:0] A,
    input  wire [3:0] B,
    input  wire       Cin,
    output wire [3:0] SUM,
    output wire       Cout,
    output wire       G_blk,
    output wire       P_blk
);

    wire [3:0] g, p;
    wire [4:0] c;

    assign c[0] = Cin;

    // Bit generate and propagate
    assign g = A & B;
    assign p = A ^ B;

    // Internal carry lookahead expansion
    assign c[1] = g[0] | (p[0] & c[0]);
    assign c[2] = g[1] | (p[1] & g[0]) | (p[1] & p[0] & c[0]);
    assign c[3] = g[2] | (p[2] & g[1]) | (p[2] & p[1] & g[0]) | (p[2] & p[1] & p[0] & c[0]);
    assign c[4] = g[3] | (p[3] & g[2]) | (p[3] & p[2] & g[1]) | (p[3] & p[2] & p[1] & g[0]) | (p[3] & p[2] & p[1] & p[0] & c[0]);

    // Block-level generate and propagate for hierarchical carry generation
    assign G_blk = g[3] | (p[3] & g[2]) | (p[3] & p[2] & g[1]) | (p[3] & p[2] & p[1] & g[0]);
    assign P_blk = p[3] & p[2] & p[1] & p[0];

    // Sum calculation
    assign SUM = p ^ c[3:0];
    assign Cout = c[4];

endmodule

