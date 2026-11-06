`timescale 1ns/1ps

module testbench_rca;
    reg  [15:0] A;
    reg  [15:0] B;
    reg         Cin;
    wire [15:0] SUM;
    wire        Cout;

    wire [15:0] SUM_exp;
    wire        Cout_exp;
    wire [16:0] Full_exp;

    ripple_carry_adder uut (
        .A   (A),
        .B   (B),
        .Cin (Cin),
        .SUM (SUM),
        .Cout(Cout)
    );

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

    task check_vector(input [15:0] in_a, input [15:0] in_b, input in_cin, input [256:1] test_name);
        begin
            A   = in_a;
            B   = in_b;
            Cin = in_cin;
            #5;
            if (SUM === SUM_exp && Cout === Cout_exp) begin
                pass_count = pass_count + 1;
                $display("[PASS] %0s | A=%0d, B=%0d, Cin=%b => SUM=%0d, Cout=%b", test_name, A, B, Cin, SUM, Cout);
            end else begin
                fail_count = fail_count + 1;
                $display("[FAIL] %0s | A=%0d, B=%0d, Cin=%b => ACT=(%0d,%b) EXP=(%0d,%b)", test_name, A, B, Cin, SUM, Cout, SUM_exp, Cout_exp);
            end
        end
    endtask

    initial begin
        $dumpfile("simulation/waveforms/ripple_carry_adder.vcd");
        $dumpvars(0, testbench_rca);

        pass_count = 0;
        fail_count = 0;

        $display("==========================================================================");
        $display(">>> STARTING FUNCTIONAL VERIFICATION: RIPPLE CARRY ADDER (RCA) <<<");
        $display("==========================================================================");

        check_vector(16'd0, 16'd0, 1'b0, "Corner 1: Zero Addition");
        check_vector(16'd1, 16'd1, 1'b0, "Corner 2: 1 + 1");
        check_vector(16'd65535, 16'd1, 1'b0, "Corner 3: Overflow 65535 + 1");
        check_vector(16'd65535, 16'd65535, 1'b1, "Corner 4: Max + Max + Cin");
        check_vector(16'd32768, 16'd32768, 1'b0, "Corner 5: 32768 + 32768");
        check_vector(16'd12345, 16'd54321, 1'b0, "Corner 6: 12345 + 54321");

        for (i = 1; i <= 10000; i = i + 1) begin
            A   = $random;
            B   = $random;
            Cin = $random & 1'b1;
            #5;
            if (SUM === SUM_exp && Cout === Cout_exp) begin
                pass_count = pass_count + 1;
            end else begin
                fail_count = fail_count + 1;
            end
        end

        $display("RCA Verification: Total=%0d, Passed=%0d, Failed=%0d", pass_count + fail_count, pass_count, fail_count);
        if (fail_count > 0) $fatal(1, "RCA verification mismatch!");
        $finish;
    end
endmodule

