`timescale 1ns/1ps

// ============================================================================
// Module: common_reference_model
// Description: Behavioral 17-bit golden addition reference model
// ============================================================================
module common_reference_model (
    input  wire [15:0] A,
    input  wire [15:0] B,
    input  wire        Cin,
    output wire [15:0] SUM_exp,
    output wire        Cout_exp,
    output wire [16:0] Full_exp
);
    assign Full_exp  = A + B + Cin;
    assign SUM_exp   = Full_exp[15:0];
    assign Cout_exp  = Full_exp[16];
endmodule
