module carry_skip_adder (Cin,
    Cout,
    A,
    B,
    SUM);
 input Cin;
 output Cout;
 input [15:0] A;
 input [15:0] B;
 output [15:0] SUM;

 wire net1;
 wire net2;
 wire net3;
 wire net4;
 wire net5;
 wire net6;
 wire net7;
 wire net8;
 wire net9;
 wire net10;
 wire net11;
 wire net12;
 wire net13;
 wire net14;
 wire net15;
 wire net16;
 wire net17;
 wire net18;
 wire net19;
 wire net20;
 wire net21;
 wire net22;
 wire net23;
 wire net24;
 wire net25;
 wire net26;
 wire net27;
 wire net28;
 wire net29;
 wire net30;
 wire net31;
 wire net32;
 wire net33;
 wire net34;
 wire net35;
 wire net36;
 wire net37;
 wire net38;
 wire net39;
 wire net40;
 wire net41;
 wire net42;
 wire net43;
 wire net44;
 wire net45;
 wire net46;
 wire net47;
 wire net48;
 wire net49;
 wire net50;
 wire \bit_propagate[0] ;
 wire \bit_propagate[10] ;
 wire \bit_propagate[11] ;
 wire \bit_propagate[12] ;
 wire \bit_propagate[13] ;
 wire \bit_propagate[14] ;
 wire \bit_propagate[15] ;
 wire \bit_propagate[1] ;
 wire \bit_propagate[2] ;
 wire \bit_propagate[3] ;
 wire \bit_propagate[4] ;
 wire \bit_propagate[5] ;
 wire \bit_propagate[6] ;
 wire \bit_propagate[7] ;
 wire \bit_propagate[8] ;
 wire \bit_propagate[9] ;
 wire c12;
 wire c4;
 wire c8;
 wire \group_propagate[0] ;
 wire \group_propagate[1] ;
 wire \group_propagate[2] ;
 wire \group_propagate[3] ;
 wire \ripple_carries[0] ;
 wire \ripple_carries[1] ;
 wire \ripple_carries[2] ;
 wire \ripple_carries[3] ;
 wire \block0/c_int[1] ;
 wire \block0/c_int[2] ;
 wire \block0/c_int[3] ;
 wire \block1/c_int[1] ;
 wire \block1/c_int[2] ;
 wire \block1/c_int[3] ;
 wire \block2/c_int[1] ;
 wire \block2/c_int[2] ;
 wire \block2/c_int[3] ;
 wire \block3/c_int[1] ;
 wire \block3/c_int[2] ;
 wire \block3/c_int[3] ;

 sky130_fd_sc_hs__xor2_1 \block0/_0_  (.A(net1),
    .B(net17),
    .X(\bit_propagate[0] ));
 sky130_fd_sc_hs__xor2_1 \block0/_1_  (.A(net8),
    .B(net24),
    .X(\bit_propagate[1] ));
 sky130_fd_sc_hs__xor2_1 \block0/_2_  (.A(net10),
    .B(net26),
    .X(\bit_propagate[3] ));
 sky130_fd_sc_hs__xor2_1 \block0/_3_  (.A(net9),
    .B(net25),
    .X(\bit_propagate[2] ));
 sky130_fd_sc_hs__and4_2 \block0/_4_  (.A(\bit_propagate[0] ),
    .B(\bit_propagate[1] ),
    .C(\bit_propagate[3] ),
    .D(\bit_propagate[2] ),
    .X(\group_propagate[0] ));
 sky130_fd_sc_hs__mux2_1 \block0/_5_  (.A0(\ripple_carries[0] ),
    .A1(net33),
    .S(\group_propagate[0] ),
    .X(c4));
 sky130_fd_sc_hs__fa_1 \block0/gen_fa[0].fa_inst/_0_  (.A(net1),
    .B(net17),
    .CIN(net33),
    .COUT(\block0/c_int[1] ),
    .SUM(net35));
 sky130_fd_sc_hs__fa_1 \block0/gen_fa[1].fa_inst/_0_  (.A(net8),
    .B(net24),
    .CIN(\block0/c_int[1] ),
    .COUT(\block0/c_int[2] ),
    .SUM(net42));
 sky130_fd_sc_hs__fa_1 \block0/gen_fa[2].fa_inst/_0_  (.A(net9),
    .B(net25),
    .CIN(\block0/c_int[2] ),
    .COUT(\block0/c_int[3] ),
    .SUM(net43));
 sky130_fd_sc_hs__fa_1 \block0/gen_fa[3].fa_inst/_0_  (.A(net10),
    .B(net26),
    .CIN(\block0/c_int[3] ),
    .COUT(\ripple_carries[0] ),
    .SUM(net44));
 sky130_fd_sc_hs__xor2_1 \block1/_0_  (.A(net11),
    .B(net27),
    .X(\bit_propagate[4] ));
 sky130_fd_sc_hs__xor2_1 \block1/_1_  (.A(net12),
    .B(net28),
    .X(\bit_propagate[5] ));
 sky130_fd_sc_hs__xor2_1 \block1/_2_  (.A(net14),
    .B(net30),
    .X(\bit_propagate[7] ));
 sky130_fd_sc_hs__xor2_1 \block1/_3_  (.A(net13),
    .B(net29),
    .X(\bit_propagate[6] ));
 sky130_fd_sc_hs__and4_2 \block1/_4_  (.A(\bit_propagate[4] ),
    .B(\bit_propagate[5] ),
    .C(\bit_propagate[7] ),
    .D(\bit_propagate[6] ),
    .X(\group_propagate[1] ));
 sky130_fd_sc_hs__mux2_1 \block1/_5_  (.A0(\ripple_carries[1] ),
    .A1(c4),
    .S(\group_propagate[1] ),
    .X(c8));
 sky130_fd_sc_hs__fa_1 \block1/gen_fa[0].fa_inst/_0_  (.A(net11),
    .B(net27),
    .CIN(c4),
    .COUT(\block1/c_int[1] ),
    .SUM(net45));
 sky130_fd_sc_hs__fa_1 \block1/gen_fa[1].fa_inst/_0_  (.A(net12),
    .B(net28),
    .CIN(\block1/c_int[1] ),
    .COUT(\block1/c_int[2] ),
    .SUM(net46));
 sky130_fd_sc_hs__fa_1 \block1/gen_fa[2].fa_inst/_0_  (.A(net13),
    .B(net29),
    .CIN(\block1/c_int[2] ),
    .COUT(\block1/c_int[3] ),
    .SUM(net47));
 sky130_fd_sc_hs__fa_1 \block1/gen_fa[3].fa_inst/_0_  (.A(net14),
    .B(net30),
    .CIN(\block1/c_int[3] ),
    .COUT(\ripple_carries[1] ),
    .SUM(net48));
 sky130_fd_sc_hs__xor2_1 \block2/_0_  (.A(net15),
    .B(net31),
    .X(\bit_propagate[8] ));
 sky130_fd_sc_hs__xor2_1 \block2/_1_  (.A(net16),
    .B(net32),
    .X(\bit_propagate[9] ));
 sky130_fd_sc_hs__xor2_1 \block2/_2_  (.A(net3),
    .B(net19),
    .X(\bit_propagate[11] ));
 sky130_fd_sc_hs__xor2_1 \block2/_3_  (.A(net2),
    .B(net18),
    .X(\bit_propagate[10] ));
 sky130_fd_sc_hs__and4_2 \block2/_4_  (.A(\bit_propagate[8] ),
    .B(\bit_propagate[9] ),
    .C(\bit_propagate[11] ),
    .D(\bit_propagate[10] ),
    .X(\group_propagate[2] ));
 sky130_fd_sc_hs__mux2_1 \block2/_5_  (.A0(\ripple_carries[2] ),
    .A1(c8),
    .S(\group_propagate[2] ),
    .X(c12));
 sky130_fd_sc_hs__fa_1 \block2/gen_fa[0].fa_inst/_0_  (.A(net15),
    .B(net31),
    .CIN(c8),
    .COUT(\block2/c_int[1] ),
    .SUM(net49));
 sky130_fd_sc_hs__fa_1 \block2/gen_fa[1].fa_inst/_0_  (.A(net16),
    .B(net32),
    .CIN(\block2/c_int[1] ),
    .COUT(\block2/c_int[2] ),
    .SUM(net50));
 sky130_fd_sc_hs__fa_1 \block2/gen_fa[2].fa_inst/_0_  (.A(net2),
    .B(net18),
    .CIN(\block2/c_int[2] ),
    .COUT(\block2/c_int[3] ),
    .SUM(net36));
 sky130_fd_sc_hs__fa_1 \block2/gen_fa[3].fa_inst/_0_  (.A(net3),
    .B(net19),
    .CIN(\block2/c_int[3] ),
    .COUT(\ripple_carries[2] ),
    .SUM(net37));
 sky130_fd_sc_hs__xor2_1 \block3/_0_  (.A(net4),
    .B(net20),
    .X(\bit_propagate[12] ));
 sky130_fd_sc_hs__xor2_1 \block3/_1_  (.A(net5),
    .B(net21),
    .X(\bit_propagate[13] ));
 sky130_fd_sc_hs__xor2_1 \block3/_2_  (.A(net7),
    .B(net23),
    .X(\bit_propagate[15] ));
 sky130_fd_sc_hs__xor2_1 \block3/_3_  (.A(net6),
    .B(net22),
    .X(\bit_propagate[14] ));
 sky130_fd_sc_hs__and4_2 \block3/_4_  (.A(\bit_propagate[12] ),
    .B(\bit_propagate[13] ),
    .C(\bit_propagate[15] ),
    .D(\bit_propagate[14] ),
    .X(\group_propagate[3] ));
 sky130_fd_sc_hs__mux2_1 \block3/_5_  (.A0(\ripple_carries[3] ),
    .A1(c12),
    .S(\group_propagate[3] ),
    .X(net34));
 sky130_fd_sc_hs__fa_1 \block3/gen_fa[0].fa_inst/_0_  (.A(net4),
    .B(net20),
    .CIN(c12),
    .COUT(\block3/c_int[1] ),
    .SUM(net38));
 sky130_fd_sc_hs__fa_1 \block3/gen_fa[1].fa_inst/_0_  (.A(net5),
    .B(net21),
    .CIN(\block3/c_int[1] ),
    .COUT(\block3/c_int[2] ),
    .SUM(net39));
 sky130_fd_sc_hs__fa_1 \block3/gen_fa[2].fa_inst/_0_  (.A(net6),
    .B(net22),
    .CIN(\block3/c_int[2] ),
    .COUT(\block3/c_int[3] ),
    .SUM(net40));
 sky130_fd_sc_hs__fa_1 \block3/gen_fa[3].fa_inst/_0_  (.A(net7),
    .B(net23),
    .CIN(\block3/c_int[3] ),
    .COUT(\ripple_carries[3] ),
    .SUM(net41));
 sky130_fd_sc_hs__buf_1 input1 (.A(A[0]),
    .X(net1));
 sky130_fd_sc_hs__buf_1 input10 (.A(A[3]),
    .X(net10));
 sky130_fd_sc_hs__buf_1 input11 (.A(A[4]),
    .X(net11));
 sky130_fd_sc_hs__buf_1 input12 (.A(A[5]),
    .X(net12));
 sky130_fd_sc_hs__buf_1 input13 (.A(A[6]),
    .X(net13));
 sky130_fd_sc_hs__buf_1 input14 (.A(A[7]),
    .X(net14));
 sky130_fd_sc_hs__buf_1 input15 (.A(A[8]),
    .X(net15));
 sky130_fd_sc_hs__buf_1 input16 (.A(A[9]),
    .X(net16));
 sky130_fd_sc_hs__buf_1 input17 (.A(B[0]),
    .X(net17));
 sky130_fd_sc_hs__buf_1 input18 (.A(B[10]),
    .X(net18));
 sky130_fd_sc_hs__buf_1 input19 (.A(B[11]),
    .X(net19));
 sky130_fd_sc_hs__buf_1 input2 (.A(A[10]),
    .X(net2));
 sky130_fd_sc_hs__buf_1 input20 (.A(B[12]),
    .X(net20));
 sky130_fd_sc_hs__buf_1 input21 (.A(B[13]),
    .X(net21));
 sky130_fd_sc_hs__buf_1 input22 (.A(B[14]),
    .X(net22));
 sky130_fd_sc_hs__buf_1 input23 (.A(B[15]),
    .X(net23));
 sky130_fd_sc_hs__buf_1 input24 (.A(B[1]),
    .X(net24));
 sky130_fd_sc_hs__buf_1 input25 (.A(B[2]),
    .X(net25));
 sky130_fd_sc_hs__buf_1 input26 (.A(B[3]),
    .X(net26));
 sky130_fd_sc_hs__buf_1 input27 (.A(B[4]),
    .X(net27));
 sky130_fd_sc_hs__buf_1 input28 (.A(B[5]),
    .X(net28));
 sky130_fd_sc_hs__buf_1 input29 (.A(B[6]),
    .X(net29));
 sky130_fd_sc_hs__buf_1 input3 (.A(A[11]),
    .X(net3));
 sky130_fd_sc_hs__buf_1 input30 (.A(B[7]),
    .X(net30));
 sky130_fd_sc_hs__buf_1 input31 (.A(B[8]),
    .X(net31));
 sky130_fd_sc_hs__buf_1 input32 (.A(B[9]),
    .X(net32));
 sky130_fd_sc_hs__buf_1 input33 (.A(Cin),
    .X(net33));
 sky130_fd_sc_hs__buf_1 input4 (.A(A[12]),
    .X(net4));
 sky130_fd_sc_hs__buf_1 input5 (.A(A[13]),
    .X(net5));
 sky130_fd_sc_hs__buf_1 input6 (.A(A[14]),
    .X(net6));
 sky130_fd_sc_hs__buf_1 input7 (.A(A[15]),
    .X(net7));
 sky130_fd_sc_hs__buf_1 input8 (.A(A[1]),
    .X(net8));
 sky130_fd_sc_hs__buf_1 input9 (.A(A[2]),
    .X(net9));
 sky130_fd_sc_hs__buf_1 output34 (.A(net34),
    .X(Cout));
 sky130_fd_sc_hs__buf_1 output35 (.A(net35),
    .X(SUM[0]));
 sky130_fd_sc_hs__buf_1 output36 (.A(net36),
    .X(SUM[10]));
 sky130_fd_sc_hs__buf_1 output37 (.A(net37),
    .X(SUM[11]));
 sky130_fd_sc_hs__buf_1 output38 (.A(net38),
    .X(SUM[12]));
 sky130_fd_sc_hs__buf_1 output39 (.A(net39),
    .X(SUM[13]));
 sky130_fd_sc_hs__buf_1 output40 (.A(net40),
    .X(SUM[14]));
 sky130_fd_sc_hs__buf_1 output41 (.A(net41),
    .X(SUM[15]));
 sky130_fd_sc_hs__buf_1 output42 (.A(net42),
    .X(SUM[1]));
 sky130_fd_sc_hs__buf_1 output43 (.A(net43),
    .X(SUM[2]));
 sky130_fd_sc_hs__buf_1 output44 (.A(net44),
    .X(SUM[3]));
 sky130_fd_sc_hs__buf_1 output45 (.A(net45),
    .X(SUM[4]));
 sky130_fd_sc_hs__buf_1 output46 (.A(net46),
    .X(SUM[5]));
 sky130_fd_sc_hs__buf_1 output47 (.A(net47),
    .X(SUM[6]));
 sky130_fd_sc_hs__buf_1 output48 (.A(net48),
    .X(SUM[7]));
 sky130_fd_sc_hs__buf_1 output49 (.A(net49),
    .X(SUM[8]));
 sky130_fd_sc_hs__buf_1 output50 (.A(net50),
    .X(SUM[9]));
endmodule
