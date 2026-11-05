`timescale 1ns/1ps

// ============================================================================
// Module: testbench_all
// Description: Multi-Architecture Master Functional Verification Harness
// Simulates:
//   1. Ripple Carry Adder (RCA)
//   2. Carry Skip Adder (CSKA)
//   3. Carry Look-Ahead Adder (CLA)
//   4. Carry Select Adder (CSLA)
//   5. Brent-Kung Parallel Prefix Adder (BK)
// Concurrently drives all five architectures with identical inputs and checks
// against a 17-bit behavioral reference model for full functional equivalence.
// ============================================================================
module testbench_all;
    reg  [15:0] A;
    reg  [15:0] B;
    reg         Cin;

    // Golden Model Outputs
    wire [15:0] sum_gold;
    wire        cout_gold;
    wire [16:0] full_gold;

    // Design 1: RCA
    wire [15:0] sum_rca;
    wire        cout_rca;

    // Design 2: CSKA
    wire [15:0] sum_cska;
    wire        cout_cska;

    // Design 3: CLA
    wire [15:0] sum_cla;
    wire        cout_cla;

    // Design 4: CSLA
    wire [15:0] sum_csla;
    wire        cout_csla;

    // Design 5: Brent-Kung
    wire [15:0] sum_bk;
    wire        cout_bk;

    // Reference Model
    common_reference_model ref_inst (
        .A       (A),
        .B       (B),
        .Cin     (Cin),
        .SUM_exp (sum_gold),
        .Cout_exp(cout_gold),
        .Full_exp(full_gold)
    );

    // DUT 1: RCA
    ripple_carry_adder dut_rca (
        .A   (A),
        .B   (B),
        .Cin (Cin),
        .SUM (sum_rca),
        .Cout(cout_rca)
    );

    // DUT 2: CSKA
    carry_skip_adder dut_cska (
        .A   (A),
        .B   (B),
        .Cin (Cin),
        .SUM (sum_cska),
        .Cout(cout_cska)
    );

    // DUT 3: CLA
    carry_lookahead_adder dut_cla (
        .A   (A),
        .B   (B),
        .Cin (Cin),
        .SUM (sum_cla),
        .Cout(cout_cla)
    );

    // DUT 4: CSLA
    carry_select_adder dut_csla (
        .A   (A),
        .B   (B),
        .Cin (Cin),
        .SUM (sum_csla),
        .Cout(cout_csla)
    );

    // DUT 5: Brent-Kung
    brent_kung_adder dut_bk (
        .A   (A),
        .B   (B),
        .Cin (Cin),
        .SUM (sum_bk),
        .Cout(cout_bk)
    );

    integer i;
    integer rca_errors, cska_errors, cla_errors, csla_errors, bk_errors;
    integer total_vectors;

    initial begin
        $dumpfile("simulation/waveforms/all_adders_comparison.vcd");
        $dumpvars(0, testbench_all);

        rca_errors  = 0;
        cska_errors = 0;
        cla_errors  = 0;
        csla_errors = 0;
        bk_errors   = 0;
        total_vectors = 0;

        $display("================================================================================");
        $display(">>> RUNNING MASTER 5-ARCHITECTURE VERIFICATION HARNESS (10,000 CYCLES) <<<");
        $display("================================================================================");

        // Run 10,000 synchronized pseudo-random vectors
        for (i = 1; i <= 10000; i = i + 1) begin
            A   = $random;
            B   = $random;
            Cin = $random & 1'b1;
            #10;
            total_vectors = total_vectors + 1;

            if (sum_rca !== sum_gold || cout_rca !== cout_gold)
                rca_errors = rca_errors + 1;

            if (sum_cska !== sum_gold || cout_cska !== cout_gold)
                cska_errors = cska_errors + 1;

            if (sum_cla !== sum_gold || cout_cla !== cout_gold)
                cla_errors = cla_errors + 1;

            if (sum_csla !== sum_gold || cout_csla !== cout_gold)
                csla_errors = csla_errors + 1;

            if (sum_bk !== sum_gold || cout_bk !== cout_gold)
                bk_errors = bk_errors + 1;

            if (i % 2500 == 0) begin
                $display("  [Progress] %0d / 10,000 vectors evaluated across all 5 architectures...", i);
            end
        end

        $display("================================================================================");
        $display(">>> FINAL VERIFICATION SCOREBOARD <<<");
        $display("  Total Test Vectors Simulated : %0d", total_vectors);
        $display("  Ripple Carry Adder (RCA)     : %0d Failed / %0d Passed -> %s",
                 rca_errors, total_vectors - rca_errors, (rca_errors == 0) ? "PASS" : "FAIL");
        $display("  Carry Skip Adder (CSKA)      : %0d Failed / %0d Passed -> %s",
                 cska_errors, total_vectors - cska_errors, (cska_errors == 0) ? "PASS" : "FAIL");
        $display("  Carry Look-Ahead Adder (CLA) : %0d Failed / %0d Passed -> %s",
                 cla_errors, total_vectors - cla_errors, (cla_errors == 0) ? "PASS" : "FAIL");
        $display("  Carry Select Adder (CSLA)    : %0d Failed / %0d Passed -> %s",
                 csla_errors, total_vectors - csla_errors, (csla_errors == 0) ? "PASS" : "FAIL");
        $display("  Brent-Kung Adder (BK)        : %0d Failed / %0d Passed -> %s",
                 bk_errors, total_vectors - bk_errors, (bk_errors == 0) ? "PASS" : "FAIL");
        $display("================================================================================");

        if ((rca_errors + cska_errors + cla_errors + csla_errors + bk_errors) == 0) begin
            $display(">>> OVERALL STATUS: ALL FIVE 16-BIT ARCHITECTURES SIMULATION-EQUIVALENT (10,000 VECTORS VERIFIED) <<<");
        end else begin
            $display(">>> OVERALL STATUS: DISCREPANCIES DETECTED IN HARNESS <<<");
        end

        $finish;
    end
endmodule

