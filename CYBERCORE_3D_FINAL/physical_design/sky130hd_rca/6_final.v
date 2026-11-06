module ripple_carry_adder (Cin,
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
 wire \c[10] ;
 wire \c[11] ;
 wire \c[12] ;
 wire \c[13] ;
 wire \c[14] ;
 wire \c[15] ;
 wire \c[1] ;
 wire \c[2] ;
 wire \c[3] ;
 wire \c[4] ;
 wire \c[5] ;
 wire \c[6] ;
 wire \c[7] ;
 wire \c[8] ;
 wire \c[9] ;

 sky130_fd_sc_hd__fa_1 \gen_rca_stages[0].fa_inst/_0_  (.A(net1),
    .B(net17),
    .CIN(net33),
    .COUT(\c[1] ),
    .SUM(net35));
 sky130_fd_sc_hd__fa_1 \gen_rca_stages[10].fa_inst/_0_  (.A(net2),
    .B(net18),
    .CIN(\c[10] ),
    .COUT(\c[11] ),
    .SUM(net36));
 sky130_fd_sc_hd__fa_1 \gen_rca_stages[11].fa_inst/_0_  (.A(net3),
    .B(net19),
    .CIN(\c[11] ),
    .COUT(\c[12] ),
    .SUM(net37));
 sky130_fd_sc_hd__fa_1 \gen_rca_stages[12].fa_inst/_0_  (.A(net4),
    .B(net20),
    .CIN(\c[12] ),
    .COUT(\c[13] ),
    .SUM(net38));
 sky130_fd_sc_hd__fa_1 \gen_rca_stages[13].fa_inst/_0_  (.A(net5),
    .B(net21),
    .CIN(\c[13] ),
    .COUT(\c[14] ),
    .SUM(net39));
 sky130_fd_sc_hd__fa_1 \gen_rca_stages[14].fa_inst/_0_  (.A(net6),
    .B(net22),
    .CIN(\c[14] ),
    .COUT(\c[15] ),
    .SUM(net40));
 sky130_fd_sc_hd__fa_1 \gen_rca_stages[15].fa_inst/_0_  (.A(net7),
    .B(net23),
    .CIN(\c[15] ),
    .COUT(net34),
    .SUM(net41));
 sky130_fd_sc_hd__fa_1 \gen_rca_stages[1].fa_inst/_0_  (.A(net8),
    .B(net24),
    .CIN(\c[1] ),
    .COUT(\c[2] ),
    .SUM(net42));
 sky130_fd_sc_hd__fa_1 \gen_rca_stages[2].fa_inst/_0_  (.A(net9),
    .B(net25),
    .CIN(\c[2] ),
    .COUT(\c[3] ),
    .SUM(net43));
 sky130_fd_sc_hd__fa_1 \gen_rca_stages[3].fa_inst/_0_  (.A(net10),
    .B(net26),
    .CIN(\c[3] ),
    .COUT(\c[4] ),
    .SUM(net44));
 sky130_fd_sc_hd__fa_1 \gen_rca_stages[4].fa_inst/_0_  (.A(net11),
    .B(net27),
    .CIN(\c[4] ),
    .COUT(\c[5] ),
    .SUM(net45));
 sky130_fd_sc_hd__fa_1 \gen_rca_stages[5].fa_inst/_0_  (.A(net12),
    .B(net28),
    .CIN(\c[5] ),
    .COUT(\c[6] ),
    .SUM(net46));
 sky130_fd_sc_hd__fa_1 \gen_rca_stages[6].fa_inst/_0_  (.A(net13),
    .B(net29),
    .CIN(\c[6] ),
    .COUT(\c[7] ),
    .SUM(net47));
 sky130_fd_sc_hd__fa_1 \gen_rca_stages[7].fa_inst/_0_  (.A(net14),
    .B(net30),
    .CIN(\c[7] ),
    .COUT(\c[8] ),
    .SUM(net48));
 sky130_fd_sc_hd__fa_1 \gen_rca_stages[8].fa_inst/_0_  (.A(net15),
    .B(net31),
    .CIN(\c[8] ),
    .COUT(\c[9] ),
    .SUM(net49));
 sky130_fd_sc_hd__fa_1 \gen_rca_stages[9].fa_inst/_0_  (.A(net16),
    .B(net32),
    .CIN(\c[9] ),
    .COUT(\c[10] ),
    .SUM(net50));
 sky130_fd_sc_hd__buf_1 input1 (.A(A[0]),
    .X(net1));
 sky130_fd_sc_hd__buf_1 input10 (.A(A[3]),
    .X(net10));
 sky130_fd_sc_hd__buf_1 input11 (.A(A[4]),
    .X(net11));
 sky130_fd_sc_hd__buf_1 input12 (.A(A[5]),
    .X(net12));
 sky130_fd_sc_hd__buf_1 input13 (.A(A[6]),
    .X(net13));
 sky130_fd_sc_hd__buf_1 input14 (.A(A[7]),
    .X(net14));
 sky130_fd_sc_hd__buf_1 input15 (.A(A[8]),
    .X(net15));
 sky130_fd_sc_hd__buf_1 input16 (.A(A[9]),
    .X(net16));
 sky130_fd_sc_hd__buf_1 input17 (.A(B[0]),
    .X(net17));
 sky130_fd_sc_hd__buf_1 input18 (.A(B[10]),
    .X(net18));
 sky130_fd_sc_hd__buf_1 input19 (.A(B[11]),
    .X(net19));
 sky130_fd_sc_hd__buf_1 input2 (.A(A[10]),
    .X(net2));
 sky130_fd_sc_hd__buf_1 input20 (.A(B[12]),
    .X(net20));
 sky130_fd_sc_hd__buf_1 input21 (.A(B[13]),
    .X(net21));
 sky130_fd_sc_hd__buf_1 input22 (.A(B[14]),
    .X(net22));
 sky130_fd_sc_hd__buf_1 input23 (.A(B[15]),
    .X(net23));
 sky130_fd_sc_hd__buf_1 input24 (.A(B[1]),
    .X(net24));
 sky130_fd_sc_hd__buf_1 input25 (.A(B[2]),
    .X(net25));
 sky130_fd_sc_hd__buf_1 input26 (.A(B[3]),
    .X(net26));
 sky130_fd_sc_hd__buf_1 input27 (.A(B[4]),
    .X(net27));
 sky130_fd_sc_hd__buf_1 input28 (.A(B[5]),
    .X(net28));
 sky130_fd_sc_hd__buf_1 input29 (.A(B[6]),
    .X(net29));
 sky130_fd_sc_hd__buf_1 input3 (.A(A[11]),
    .X(net3));
 sky130_fd_sc_hd__buf_1 input30 (.A(B[7]),
    .X(net30));
 sky130_fd_sc_hd__buf_1 input31 (.A(B[8]),
    .X(net31));
 sky130_fd_sc_hd__buf_1 input32 (.A(B[9]),
    .X(net32));
 sky130_fd_sc_hd__buf_1 input33 (.A(Cin),
    .X(net33));
 sky130_fd_sc_hd__buf_1 input4 (.A(A[12]),
    .X(net4));
 sky130_fd_sc_hd__buf_1 input5 (.A(A[13]),
    .X(net5));
 sky130_fd_sc_hd__buf_1 input6 (.A(A[14]),
    .X(net6));
 sky130_fd_sc_hd__buf_1 input7 (.A(A[15]),
    .X(net7));
 sky130_fd_sc_hd__buf_1 input8 (.A(A[1]),
    .X(net8));
 sky130_fd_sc_hd__buf_1 input9 (.A(A[2]),
    .X(net9));
 sky130_fd_sc_hd__buf_1 output34 (.A(net34),
    .X(Cout));
 sky130_fd_sc_hd__buf_1 output35 (.A(net35),
    .X(SUM[0]));
 sky130_fd_sc_hd__buf_1 output36 (.A(net36),
    .X(SUM[10]));
 sky130_fd_sc_hd__buf_1 output37 (.A(net37),
    .X(SUM[11]));
 sky130_fd_sc_hd__buf_1 output38 (.A(net38),
    .X(SUM[12]));
 sky130_fd_sc_hd__buf_1 output39 (.A(net39),
    .X(SUM[13]));
 sky130_fd_sc_hd__buf_1 output40 (.A(net40),
    .X(SUM[14]));
 sky130_fd_sc_hd__buf_1 output41 (.A(net41),
    .X(SUM[15]));
 sky130_fd_sc_hd__buf_1 output42 (.A(net42),
    .X(SUM[1]));
 sky130_fd_sc_hd__buf_1 output43 (.A(net43),
    .X(SUM[2]));
 sky130_fd_sc_hd__buf_1 output44 (.A(net44),
    .X(SUM[3]));
 sky130_fd_sc_hd__buf_1 output45 (.A(net45),
    .X(SUM[4]));
 sky130_fd_sc_hd__buf_1 output46 (.A(net46),
    .X(SUM[5]));
 sky130_fd_sc_hd__buf_1 output47 (.A(net47),
    .X(SUM[6]));
 sky130_fd_sc_hd__buf_1 output48 (.A(net48),
    .X(SUM[7]));
 sky130_fd_sc_hd__buf_1 output49 (.A(net49),
    .X(SUM[8]));
 sky130_fd_sc_hd__buf_1 output50 (.A(net50),
    .X(SUM[9]));
endmodule
