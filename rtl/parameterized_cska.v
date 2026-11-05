`timescale 1ns/1ps

// ============================================================================
// Module: parameterized_cska
// Description: Generic N-bit Parameterized Carry Skip Adder (Scalability Model)
// Parameters:
//   WIDTH      : Total word width (8, 16, 32, 64)
//   BLOCK_SIZE : Word size per skip block (default 4)
// ============================================================================
module parameterized_cska #(
    parameter WIDTH = 16,
    parameter BLOCK_SIZE = 4
)(
    input  wire [WIDTH-1:0] A,
    input  wire [WIDTH-1:0] B,
    input  wire             Cin,
    output wire [WIDTH-1:0] SUM,
    output wire             Cout
);

    localparam NUM_BLOCKS = WIDTH / BLOCK_SIZE;

    wire [NUM_BLOCKS:0] block_carry;
    assign block_carry[0] = Cin;
    assign Cout = block_carry[NUM_BLOCKS];

    genvar b;
    generate
        for (b = 0; b < NUM_BLOCKS; b = b + 1) begin : gen_skip_blocks
            wire [BLOCK_SIZE-1:0] blk_a = A[(b+1)*BLOCK_SIZE - 1 : b*BLOCK_SIZE];
            wire [BLOCK_SIZE-1:0] blk_b = B[(b+1)*BLOCK_SIZE - 1 : b*BLOCK_SIZE];
            wire [BLOCK_SIZE-1:0] blk_sum;
            wire [BLOCK_SIZE-1:0] p_bits;
            wire                  p_group;
            wire [BLOCK_SIZE:0]   c_chain;
            wire                  c_ripple;

            assign c_chain[0] = block_carry[b];

            // Propagate bits and group propagate AND-reduction
            assign p_bits = blk_a ^ blk_b;
            assign p_group = &p_bits;

            // Ripple carry stages inside block
            genvar i;
            for (i = 0; i < BLOCK_SIZE; i = i + 1) begin : gen_fa
                full_adder fa (
                    .a   (blk_a[i]),
                    .b   (blk_b[i]),
                    .cin (c_chain[i]),
                    .sum (blk_sum[i]),
                    .cout(c_chain[i+1])
                );
            end

            assign c_ripple = c_chain[BLOCK_SIZE];
            assign SUM[(b+1)*BLOCK_SIZE - 1 : b*BLOCK_SIZE] = blk_sum;

            // 2:1 Skip Multiplexer
            assign block_carry[b+1] = p_group ? block_carry[b] : c_ripple;
        end
    endgenerate

endmodule

