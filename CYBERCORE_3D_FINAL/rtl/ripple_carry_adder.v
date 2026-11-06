`timescale 1ns/1ps

// ============================================================================
// Module: ripple_carry_adder
// Width: 16-bit
// Description: Classical 16-bit Ripple Carry Adder (RCA).
//              Sixteen 1-bit full adders cascaded in series.
//              Critical path is O(N) carry propagation from LSB to MSB.
// ============================================================================
module ripple_carry_adder (
    input  wire [15:0] A,
    input  wire [15:0] B,
    input  wire        Cin,
    output wire [15:0] SUM,
    output wire        Cout
);

    wire [16:0] c;
    assign c[0] = Cin;
    assign Cout = c[16];

    genvar i;
    generate
        for (i = 0; i < 16; i = i + 1) begin : gen_rca_stages
            full_adder fa_inst (
                .a   (A[i]),
                .b   (B[i]),
                .cin (c[i]),
                .sum (SUM[i]),
                .cout(c[i+1])
            );
        end
    endgenerate

endmodule

