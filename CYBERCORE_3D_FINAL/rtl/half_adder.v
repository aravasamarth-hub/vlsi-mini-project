`timescale 1ns/1ps

// ============================================================================
// Module: half_adder
// Description: Basic 1-bit half adder computing sum and carry-out
// ============================================================================
module half_adder (
    input  wire a,
    input  wire b,
    output wire sum,
    output wire cout
);
    assign sum  = a ^ b;
    assign cout = a & b;
endmodule

