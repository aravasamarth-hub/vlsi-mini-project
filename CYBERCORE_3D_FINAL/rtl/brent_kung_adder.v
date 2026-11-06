`timescale 1ns/1ps

// ============================================================================
// Module: prefix_operator
// Description: Associative Black-Cell prefix operator for Parallel Prefix Adders
// Equations:
//   G_out = G_hi | (P_hi & G_lo)
//   P_out = P_hi & P_lo
// ============================================================================
module prefix_operator (
    input  wire g_hi,
    input  wire p_hi,
    input  wire g_lo,
    input  wire p_lo,
    output wire g_out,
    output wire p_out
);
    assign g_out = g_hi | (p_hi & g_lo);
    assign p_out = p_hi & p_lo;
endmodule

// ============================================================================
// Module: brent_kung_adder
// Width: 16-bit
// Architecture: 16-bit Brent-Kung Parallel Prefix Adder
// Description:
//   Logarithmic depth parallel prefix tree that computes prefix carries in
//   2*log2(N) - 1 logic levels. Balances fan-out, gate count, and wiring area.
// ============================================================================
module brent_kung_adder (
    input  wire [15:0] A,
    input  wire [15:0] B,
    input  wire        Cin,
    output wire [15:0] SUM,
    output wire        Cout
);

    // Level 0: Bit generate and propagate
    wire [15:0] g0, p0;
    assign g0 = A & B;
    assign p0 = A ^ B;

    // Level 1: Span 1 (Pairs: 1, 3, 5, 7, 9, 11, 13, 15)
    wire [15:0] g1, p1;
    assign g1[0] = g0[0]; assign p1[0] = p0[0];
    assign g1[2] = g0[2]; assign p1[2] = p0[2];
    assign g1[4] = g0[4]; assign p1[4] = p0[4];
    assign g1[6] = g0[6]; assign p1[6] = p0[6];
    assign g1[8] = g0[8]; assign p1[8] = p0[8];
    assign g1[10] = g0[10]; assign p1[10] = p0[10];
    assign g1[12] = g0[12]; assign p1[12] = p0[12];
    assign g1[14] = g0[14]; assign p1[14] = p0[14];

    genvar i1;
    generate
        for (i1 = 1; i1 < 16; i1 = i1 + 2) begin : gen_l1
            prefix_operator op1 (
                .g_hi (g0[i1]),   .p_hi (p0[i1]),
                .g_lo (g0[i1-1]), .p_lo (p0[i1-1]),
                .g_out(g1[i1]),   .p_out(p1[i1])
            );
        end
    endgenerate

    // Level 2: Span 2 (Quads: 3, 7, 11, 15)
    wire [15:0] g2, p2;
    assign g2[0] = g1[0]; assign p2[0] = p1[0];
    assign g2[1] = g1[1]; assign p2[1] = p1[1];
    assign g2[2] = g1[2]; assign p2[2] = p1[2];
    assign g2[4] = g1[4]; assign p2[4] = p1[4];
    assign g2[5] = g1[5]; assign p2[5] = p1[5];
    assign g2[6] = g1[6]; assign p2[6] = p1[6];
    assign g2[8] = g1[8]; assign p2[8] = p1[8];
    assign g2[9] = g1[9]; assign p2[9] = p1[9];
    assign g2[10] = g1[10]; assign p2[10] = p1[10];
    assign g2[12] = g1[12]; assign p2[12] = p1[12];
    assign g2[13] = g1[13]; assign p2[13] = p1[13];
    assign g2[14] = g1[14]; assign p2[14] = p1[14];

    genvar i2;
    generate
        for (i2 = 3; i2 < 16; i2 = i2 + 4) begin : gen_l2
            prefix_operator op2 (
                .g_hi (g1[i2]),   .p_hi (p1[i2]),
                .g_lo (g1[i2-2]), .p_lo (p1[i2-2]),
                .g_out(g2[i2]),   .p_out(p2[i2])
            );
        end
    endgenerate

    // Level 3: Span 4 (Octs: 7, 15)
    wire [15:0] g3, p3;
    assign g3[6:0]   = g2[6:0];
    assign p3[6:0]   = p2[6:0];
    assign g3[14:8]  = g2[14:8];
    assign p3[14:8]  = p2[14:8];

    prefix_operator op3_7  (.g_hi(g2[7]),  .p_hi(p2[7]),  .g_lo(g2[3]),  .p_lo(p2[3]),  .g_out(g3[7]),  .p_out(p3[7]));
    prefix_operator op3_15 (.g_hi(g2[15]), .p_hi(p2[15]), .g_lo(g2[11]), .p_lo(p2[11]), .g_out(g3[15]), .p_out(p3[15]));

    // Level 4: Span 8 (Hex: 15)
    wire [15:0] g4, p4;
    assign g4[14:0] = g3[14:0];
    assign p4[14:0] = p3[14:0];
    prefix_operator op4_15 (.g_hi(g3[15]), .p_hi(p3[15]), .g_lo(g3[7]),  .p_lo(p3[7]),  .g_out(g4[15]), .p_out(p4[15]));

    // Level 5: Inverse distribution 1 (Indices: 5, 9, 11, 13)
    wire [15:0] g5, p5;
    assign g5[4:0]   = g4[4:0];
    assign p5[4:0]   = p4[4:0];
    assign g5[8:6]   = g4[8:6];
    assign p5[8:6]   = p4[8:6];
    assign g5[10]    = g4[10];
    assign p5[10]    = p4[10];
    assign g5[12]    = g4[12];
    assign p5[12]    = p4[12];
    assign g5[15:14] = g4[15:14];
    assign p5[15:14] = p4[15:14];

    prefix_operator op5_5  (.g_hi(g1[5]),  .p_hi(p1[5]),  .g_lo(g2[3]),  .p_lo(p2[3]),  .g_out(g5[5]),  .p_out(p5[5]));
    prefix_operator op5_9  (.g_hi(g1[9]),  .p_hi(p1[9]),  .g_lo(g3[7]),  .p_lo(p3[7]),  .g_out(g5[9]),  .p_out(p5[9]));
    prefix_operator op5_11 (.g_hi(g2[11]), .p_hi(p2[11]), .g_lo(g3[7]),  .p_lo(p3[7]),  .g_out(g5[11]), .p_out(p5[11]));
    prefix_operator op5_13 (.g_hi(g1[13]), .p_hi(p1[13]), .g_lo(g5[11]), .p_lo(p5[11]), .g_out(g5[13]), .p_out(p5[13]));

    // Level 6: Inverse distribution 2 (Even indices: 2, 4, 6, 8, 10, 12, 14)
    wire [15:0] g6, p6;
    assign g6[0]  = g5[0];  assign p6[0]  = p5[0];
    assign g6[1]  = g5[1];  assign p6[1]  = p5[1];
    assign g6[3]  = g5[3];  assign p6[3]  = p5[3];
    assign g6[5]  = g5[5];  assign p6[5]  = p5[5];
    assign g6[7]  = g5[7];  assign p6[7]  = p5[7];
    assign g6[9]  = g5[9];  assign p6[9]  = p5[9];
    assign g6[11] = g5[11]; assign p6[11] = p5[11];
    assign g6[13] = g5[13]; assign p6[13] = p5[13];
    assign g6[15] = g5[15]; assign p6[15] = p5[15];

    prefix_operator op6_2  (.g_hi(g0[2]),  .p_hi(p0[2]),  .g_lo(g1[1]),  .p_lo(p1[1]),  .g_out(g6[2]),  .p_out(p6[2]));
    prefix_operator op6_4  (.g_hi(g0[4]),  .p_hi(p0[4]),  .g_lo(g2[3]),  .p_lo(p2[3]),  .g_out(g6[4]),  .p_out(p6[4]));
    prefix_operator op6_6  (.g_hi(g0[6]),  .p_hi(p0[6]),  .g_lo(g5[5]),  .p_lo(p5[5]),  .g_out(g6[6]),  .p_out(p6[6]));
    prefix_operator op6_8  (.g_hi(g0[8]),  .p_hi(p0[8]),  .g_lo(g3[7]),  .p_lo(p3[7]),  .g_out(g6[8]),  .p_out(p6[8]));
    prefix_operator op6_10 (.g_hi(g0[10]), .p_hi(p0[10]), .g_lo(g5[9]),  .p_lo(p5[9]),  .g_out(g6[10]), .p_out(p6[10]));
    prefix_operator op6_12 (.g_hi(g0[12]), .p_hi(p0[12]), .g_lo(g5[11]), .p_lo(p5[11]), .g_out(g6[12]), .p_out(p6[12]));
    prefix_operator op6_14 (.g_hi(g0[14]), .p_hi(p0[14]), .g_lo(g5[13]), .p_lo(p5[13]), .g_out(g6[14]), .p_out(p6[14]));

    // Carry computation from prefix results and Cin
    wire [16:0] c;
    assign c[0] = Cin;

    genvar k;
    generate
        for (k = 0; k < 16; k = k + 1) begin : gen_carries
            assign c[k+1] = g6[k] | (p6[k] & Cin);
        end
    endgenerate

    // Final Sum and Carry-out
    assign SUM  = p0 ^ c[15:0];
    assign Cout = c[16];

endmodule

