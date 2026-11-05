`timescale 1ns/1ps

// ============================================================================
// Module: full_adder
// Description: Gate-level synthesizable 1-bit full adder with explicit
//              propagate and generate expressions.
// Equations:
//   sum  = a ^ b ^ cin
//   cout = (a & b) | (cin & (a ^ b))
// ============================================================================
module full_adder (
    input  wire a,
    input  wire b,
    input  wire cin,
    output wire sum,
    output wire cout
);
    wire p, g;

    assign p = a ^ b;
    assign g = a & b;

    assign sum  = p ^ cin;
    assign cout = g | (cin & p);

endmodule
