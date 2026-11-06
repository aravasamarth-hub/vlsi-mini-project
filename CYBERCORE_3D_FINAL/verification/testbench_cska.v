`timescale 1ns/1ps

module testbench_cska;
    reg  [15:0] A;
    reg  [15:0] B;
    reg         Cin;
    wire [15:0] SUM;
    wire        Cout;

    wire [15:0] SUM_exp;
    wire        Cout_exp;
    wire [16:0] Full_exp;

    // Instantiate Carry Skip Adder (Design Under Test)
    carry_skip_adder uut (
        .A   (A),
        .B   (B),
        .Cin (Cin),
        .SUM (SUM),
        .Cout(Cout)
    );

    // Instantiate Golden Reference Model
    common_reference_model ref_model (
        .A       (A),
        .B       (B),
        .Cin     (Cin),
        .SUM_exp (SUM_exp),
        .Cout_exp(Cout_exp),
        .Full_exp(Full_exp)
    );

    integer i;
    integer pass_count;
    integer fail_count;
    integer skip_activated_count;

    // Helper task to check a test vector
    task check_vector(input [15:0] in_a, input [15:0] in_b, input in_cin, input [256:1] test_name);
        begin
            A   = in_a;
            B   = in_b;
            Cin = in_cin;
            #5;
            if (SUM === SUM_exp && Cout === Cout_exp) begin
                pass_count = pass_count + 1;
                $display("[PASS] %0s | A=%0d (0x%04h), B=%0d (0x%04h), Cin=%b => SUM=%0d (0x%04h), Cout=%b | GP=%b, SkipActive=%b",
                         test_name, A, A, B, B, Cin, SUM, SUM, Cout, uut.group_propagate, uut.skip_active);
            end else begin
                fail_count = fail_count + 1;
                $display("[FAIL] %0s | A=%0d, B=%0d, Cin=%b => ACT: SUM=%0d Cout=%b | EXP: SUM=%0d Cout=%b",
                         test_name, A, B, Cin, SUM, Cout, SUM_exp, Cout_exp);
            end
        end
    endtask

    initial begin
        // VCD waveform dump
        $dumpfile("simulation/waveforms/carry_skip_adder.vcd");
        $dumpvars(0, testbench_cska);

        pass_count = 0;
        fail_count = 0;
        skip_activated_count = 0;

        $display("==========================================================================");
        $display(">>> STARTING FUNCTIONAL VERIFICATION: 16-BIT CARRY SKIP ADDER (CSKA) <<<");
        $display("==========================================================================");

        // 1. Mandatory Corner Cases
        check_vector(16'd0, 16'd0, 1'b0, "Corner 1: Zero Addition (Cin=0)");
        check_vector(16'd0, 16'd0, 1'b1, "Corner 1b: Zero Addition (Cin=1)");
        check_vector(16'd1, 16'd1, 1'b0, "Corner 2: 1 + 1");
        check_vector(16'd65535, 16'd1, 1'b0, "Corner 3: Max Int + 1 (Overflow test)");
        check_vector(16'd65535, 16'd65535, 1'b0, "Corner 4: Max + Max (Cin=0)");
        check_vector(16'd65535, 16'd65535, 1'b1, "Corner 4b: Max + Max (Cin=1)");
        check_vector(16'd32768, 16'd32768, 1'b0, "Corner 5: Midpoint 32768 + 32768");
        check_vector(16'd12345, 16'd54321, 1'b0, "Corner 6: Arbitrary Pattern (12345+54321)");
        check_vector(16'd255, 16'd1, 1'b0, "Corner 7: 8-bit Boundary (255 + 1)");
        check_vector(16'd4095, 16'd1, 1'b0, "Corner 8: 12-bit Boundary (4095 + 1)");
        check_vector(16'd32767, 16'd1, 1'b0, "Corner 9: 15-bit Boundary (32767 + 1)");

        // 2. Full 16-Bit Carry Skip Path Validation
        // When A ^ B == 16'hFFFF (all bits propagate), carry must bypass all 4 blocks!
        check_vector(16'hAAAA, 16'h5555, 1'b1, "Full Skip Test 1 (All 4 Blocks Skip)");
        check_vector(16'hF0F0, 16'h0F0F, 1'b1, "Full Skip Test 2 (Alternating Blocks)");
        check_vector(16'hFF00, 16'h00FF, 1'b1, "Full Skip Test 3 (Byte-wise Propagate)");

        $display("--------------------------------------------------------------------------");
        $display(">>> RUNNING 10,000 RANDOMIZED STRESS TEST VECTORS <<<");
        $display("--------------------------------------------------------------------------");

        // 3. 10,000 Randomized Test Cases
        for (i = 1; i <= 10000; i = i + 1) begin
            A   = $random;
            B   = $random;
            Cin = $random & 1'b1;
            #5;

            if (uut.group_propagate != 4'b0000) begin
                skip_activated_count = skip_activated_count + 1;
            end

            if (SUM === SUM_exp && Cout === Cout_exp) begin
                pass_count = pass_count + 1;
            end else begin
                fail_count = fail_count + 1;
                $display("[ERROR Vector #%0d] A=%h, B=%h, Cin=%b => ACT=(Cout=%b, SUM=%h) EXP=(Cout=%b, SUM=%h)",
                         i, A, B, Cin, Cout, SUM, Cout_exp, SUM_exp);
            end
        end

        $display("==========================================================================");
        $display(">>> CARRY SKIP ADDER VERIFICATION COMPLETE <<<");
        $display("  Total Vectors Executed : %0d", pass_count + fail_count);
        $display("  Passed Vectors         : %0d", pass_count);
        $display("  Failed Vectors         : %0d", fail_count);
        $display("  Skip Logic Activations : %0d cycles", skip_activated_count);
        if (fail_count == 0) begin
            $display("  VERIFICATION RESULT    : [100%% PASSED - ZERO DEFECTS]");
            $finish;
        end else begin
            $display("  VERIFICATION RESULT    : [FAILED - %0d ERRORS]", fail_count);
            $fatal(1, "Testbench verification mismatch detected!");
        end
        $display("==========================================================================");
    end
endmodule

