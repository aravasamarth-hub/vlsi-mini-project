import streamlit as st
import pandas as pd
import json
import os
import sys

# Configure Streamlit page layout
st.set_page_config(
    page_title="CYBERCORE - VLSI Adder Lab (SKY130)",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

PROJECT_ROOT = r"X:" if os.path.exists(r"X:\rtl") else r"D:\mini project"

# Dark Engineering Theme CSS
st.markdown("""
<style>
    .main {
        background-color: #060913;
        color: #E2E8F0;
    }
    .stApp {
        background-color: #060913;
    }
    .metric-card {
        background: rgba(15, 23, 42, 0.75);
        border: 1px solid rgba(0, 240, 255, 0.2);
        border-radius: 12px;
        padding: 18px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }
    .metric-val {
        font-size: 26px;
        font-weight: 700;
        color: #00F0FF;
        font-family: 'Courier New', monospace;
    }
    .metric-lbl {
        font-size: 13px;
        color: #94A3B8;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .highlight-skip {
        background: rgba(255, 122, 0, 0.15);
        border: 1px solid #FF7A00;
        color: #FF7A00;
        font-weight: bold;
        padding: 4px 8px;
        border-radius: 6px;
    }
    .highlight-ripple {
        background: rgba(0, 240, 255, 0.15);
        border: 1px solid #00F0FF;
        color: #00F0FF;
        font-weight: bold;
        padding: 4px 8px;
        border-radius: 6px;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar Navigation
st.sidebar.image("https://img.icons8.com/nolan/96/integrated-circuit.png", width=64)
st.sidebar.title("CYBERCORE LAB")
st.sidebar.caption("16-Bit Adder Engineering Suite • SKY130 PDK")

page = st.sidebar.radio(
    "Navigation",
    [
        "🚀 Project Overview",
        "🧮 Interactive Simulator",
        "⚡ Carry Skip Visualizer",
        "🏛️ Architecture Lab (5 Adders)",
        "📊 PPA Performance Benchmark",
        "🔬 Yosys Synthesis Reports",
        "📐 Physical Design & GDSII",
        "📚 Complete Project Documentation",
        "💾 Export Center"
    ]
)

st.sidebar.markdown("---")
st.sidebar.markdown("**Technology:** SkyWater 130nm (`sky130_fd_sc_hd`)")
st.sidebar.markdown("**Verification:** 60,000 Vectors (100% Passed)")
st.sidebar.markdown("**GDS Status:** Placed & Generated (4.09 MB)")

# Helper function to compute hardware signals
def compute_signals(A, B, Cin):
    bit_p = [( (A >> i) & 1 ) ^ ( (B >> i) & 1 ) for i in range(16)]
    bit_g = [( (A >> i) & 1 ) & ( (B >> i) & 1 ) for i in range(16)]
    blocks = []
    c_curr = Cin
    block_carries = [Cin]

    for b in range(4):
        p_bits = bit_p[b*4 : (b+1)*4]
        g_bits = bit_g[b*4 : (b+1)*4]
        a_bits = [(A >> (b*4 + i)) & 1 for i in range(4)]
        b_bits = [(B >> (b*4 + i)) & 1 for i in range(4)]
        p_group = 1 if (p_bits[0] and p_bits[1] and p_bits[2] and p_bits[3]) else 0
        
        c_chain = [c_curr]
        sum_bits = []
        for i in range(4):
            s = p_bits[i] ^ c_chain[i]
            cout = g_bits[i] | (c_chain[i] & p_bits[i])
            sum_bits.append(s)
            c_chain.append(cout)
            
        c_ripple = c_chain[4]
        skip_active = bool(p_group)
        c_out_block = c_curr if skip_active else c_ripple
        
        blocks.append({
            "block_id": b,
            "bit_range": f"[{b*4+3}:{b*4}]",
            "a_hex": f"0x{(A >> (b*4)) & 0xF:X}",
            "b_hex": f"0x{(B >> (b*4)) & 0xF:X}",
            "p_bits": p_bits,
            "p_group": p_group,
            "cin": c_curr,
            "c_ripple": c_ripple,
            "c_out": c_out_block,
            "skip_active": skip_active,
            "path": "SKIP PATH (Bypass)" if (skip_active and c_curr == 1) else ("SKIP READY" if skip_active else "RIPPLE PATH"),
            "sum_bits": sum_bits
        })
        c_curr = c_out_block
        block_carries.append(c_curr)

    full = A + B + Cin
    return {
        "A": A, "B": B, "Cin": Cin,
        "SUM": full & 0xFFFF,
        "Cout": (full >> 16) & 1,
        "FullResult": full,
        "bit_p": bit_p,
        "blocks": blocks,
        "block_carries": block_carries
    }

# Load PPA data
def load_ppa():
    path = os.path.join(PROJECT_ROOT, "analysis", "comparison_results.json")
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return []

# ==============================================================================
# PAGE 1: OVERVIEW
# ==============================================================================
if page == "🚀 Project Overview":
    st.title("CYBERCORE — 16-BIT CARRY SKIP ADDER USING SKY130 PDK")
    st.subheader("Design, RTL Verification, ASIC Physical Implementation and Comparative Analysis")

    st.markdown("""
    Welcome to the **CYBERCORE VLSI Engineering Suite**. This platform provides an end-to-end silicon design demonstration 
    of a **16-bit Carry Skip Adder (CSKA)** and four benchmark architectures (**RCA, CLA, CSLA, and Brent-Kung**) 
    targeted to the official **SkyWater 130nm High-Density (`sky130_fd_sc_hd`)** standard cell library.
    """)

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown("""<div class="metric-card">
            <div class="metric-lbl">PDK Node</div>
            <div class="metric-val">130 nm</div>
            <div style="color: #64748B; font-size: 12px; margin-top:4px;">SkyWater SKY130 HD</div>
        </div>""", unsafe_allow_html=True)
    with col2:
        st.markdown("""<div class="metric-card">
            <div class="metric-lbl">CSKA Speedup</div>
            <div class="metric-val">+57.1%</div>
            <div style="color: #00DF72; font-size: 12px; margin-top:4px;">Vs. Ripple Carry Baseline</div>
        </div>""", unsafe_allow_html=True)
    with col3:
        st.markdown("""<div class="metric-card">
            <div class="metric-lbl">Verified Vectors</div>
            <div class="metric-val">60,000+</div>
            <div style="color: #00DF72; font-size: 12px; margin-top:4px;">100% Zero-Defect Pass</div>
        </div>""", unsafe_allow_html=True)
    with col4:
        st.markdown("""<div class="metric-card">
            <div class="metric-lbl">Layout Status</div>
            <div class="metric-val">GDSII Ready</div>
            <div style="color: #00F0FF; font-size: 12px; margin-top:4px;">4.09 MB Synthesized Layout</div>
        </div>""", unsafe_allow_html=True)

    st.markdown("### Engineering Flow Lifecycle")
    st.info("RTL Design (Verilog) ➔ Functional Verification (Icarus/VVP) ➔ Logic Synthesis (Yosys) ➔ Technology Mapping (Sky130) ➔ Placement & Layout (DEF/GDSII) ➔ Timing & Power Analysis")

    st.markdown("### Executive Summary Table")
    ppa = load_ppa()
    if ppa:
        df = pd.DataFrame(ppa)
        df_display = df[["architecture", "total_cells", "cell_area_um2", "delay_ns", "power_mw", "area_delay_product", "speed_improvement_pct"]]
        df_display.columns = ["Architecture", "Std Cells", "Area (µm²)", "Delay (ns)", "Power (mW)", "ADP (µm²·ns)", "Speedup vs RCA (%)"]
        st.dataframe(df_display.style.highlight_max(subset=["Speedup vs RCA (%)"], color="#064E3B").highlight_min(subset=["ADP (µm²·ns)"], color="#064E3B"), use_container_width=True)

# ==============================================================================
# PAGE 2: INTERACTIVE SIMULATOR
# ==============================================================================
elif page == "🧮 Interactive Simulator":
    st.title("🧮 Interactive 16-Bit Adder Simulator")
    st.write("Test any 16-bit binary/decimal operand pair and observe the hardware calculation cycle.")

    colA, colB, colC = st.columns(3)
    with colA:
        a_mode = st.radio("Input A Format", ["Decimal", "Hexadecimal"], horizontal=True)
        if a_mode == "Decimal":
            a_val = st.number_input("Input A (0 - 65535)", min_value=0, max_value=65535, value=43690)
        else:
            a_hex = st.text_input("Input A (Hex)", value="AAAA")
            try:
                a_val = int(a_hex, 16)
            except:
                a_val = 0
    with colB:
        b_mode = st.radio("Input B Format", ["Decimal", "Hexadecimal"], horizontal=True)
        if b_mode == "Decimal":
            b_val = st.number_input("Input B (0 - 65535)", min_value=0, max_value=65535, value=21845)
        else:
            b_hex = st.text_input("Input B (Hex)", value="5555")
            try:
                b_val = int(b_hex, 16)
            except:
                b_val = 0
    with colC:
        st.write("Carry-In (Cin)")
        cin_val = st.selectbox("Cin", [0, 1], index=1)
        selected_arch = st.selectbox("Target Architecture", ["CSKA (Carry Skip)", "RCA (Ripple Carry)", "CLA (Look-Ahead)", "CSLA (Select)", "Brent-Kung"])

    sim = compute_signals(a_val, b_val, cin_val)

    st.markdown("---")
    st.subheader("Hardware Simulation Results")
    res1, res2, res3, res4 = st.columns(4)
    res1.metric("16-Bit SUM (Dec)", f"{sim['SUM']}")
    res2.metric("16-Bit SUM (Hex)", f"0x{sim['SUM']:04X}")
    res3.metric("Carry-Out (Cout)", f"{sim['Cout']}")
    res4.metric("17-Bit Full Result", f"{sim['FullResult']} (0x{sim['FullResult']:05X})")

    st.markdown("#### Binary Bit Alignment (LSB ➔ MSB)")
    st.code(f"""
    A   : {sim['A']:016b}  (0x{sim['A']:04X} = {sim['A']})
    B   : {sim['B']:016b}  (0x{sim['B']:04X} = {sim['B']})
    Cin : {sim['Cin']}
    --------------------------------------------------
    SUM : {sim['SUM']:016b}  (0x{sim['SUM']:04X} = {sim['SUM']})
    Cout: {sim['Cout']}
    """, language="text")

# ==============================================================================
# PAGE 3: CARRY SKIP VISUALIZER
# ==============================================================================
elif page == "⚡ Carry Skip Visualizer":
    st.title("⚡ 16-Bit Carry Skip Adder: 4-Block Microarchitecture Visualizer")
    st.write("Inspect how the four 4-bit blocks dynamically select between the 4-bit ripple chain and the bypass skip multiplexer.")

    col1, col2 = st.columns([1, 1])
    with col1:
        preset = st.selectbox(
            "Select Educational Test Scenario",
            [
                "Full 16-Bit Carry Skip (A=0xAAAA, B=0x5555, Cin=1) -> All 4 Blocks Bypass",
                "Pure Ripple Propagation (A=0x0001, B=0x0001, Cin=0)",
                "Alternating Skip (A=0xF0F0, B=0x0F0F, Cin=1)",
                "Custom Operands"
            ]
        )
    if "Full 16-Bit Carry Skip" in preset:
        a_in, b_in, cin_in = 0xAAAA, 0x5555, 1
    elif "Pure Ripple" in preset:
        a_in, b_in, cin_in = 0x0001, 0x0001, 0
    elif "Alternating" in preset:
        a_in, b_in, cin_in = 0xF0F0, 0x0F0F, 1
    else:
        a_in = st.number_input("Custom A", 0, 65535, 43690)
        b_in = st.number_input("Custom B", 0, 65535, 21845)
        cin_in = st.selectbox("Custom Cin", [0, 1], index=1)

    sim = compute_signals(a_in, b_in, cin_in)

    st.markdown("---")
    st.subheader("Four 4-Bit Block Status & Skip Logic Decisions")
    
    b_cols = st.columns(4)
    for idx, b in enumerate(sim["blocks"]):
        with b_cols[idx]:
            is_skip = "SKIP" in b["path"]
            color_border = "#FF7A00" if is_skip else "#00F0FF"
            badge = f"<span class='highlight-skip'>{b['path']}</span>" if is_skip else f"<span class='highlight-ripple'>{b['path']}</span>"
            
            st.markdown(f"""
            <div style="border: 2px solid {color_border}; border-radius: 10px; padding: 14px; background: rgba(15,23,42,0.8);">
                <div style="font-size: 16px; font-weight: bold; color: {color_border};">BLOCK {b['block_id']} {b['bit_range']}</div>
                <div style="margin: 8px 0;">{badge}</div>
                <div style="font-size: 13px; line-height: 1.6;">
                    <b>A[i] :</b> {b['a_hex']}<br>
                    <b>B[i] :</b> {b['b_hex']}<br>
                    <b>Bit Propagate P[i]:</b> {b['p_bits']}<br>
                    <b>Group Propagate P_grp:</b> <span style="color:#00DF72; font-weight:bold;">{b['p_group']}</span><br>
                    <b>Block Cin:</b> {b['cin']}<br>
                    <b>Ripple Cout:</b> {b['c_ripple']}<br>
                    <b>Actual Cout:</b> <span style="color:{color_border}; font-weight:bold;">{b['c_out']}</span>
                </div>
            </div>
            """, unsafe_allow_html=True)

    st.markdown("### Carry Propagation Path across Block Boundaries")
    carries_str = " ➔ ".join([f"<b>C{i*4}</b>={sim['block_carries'][i]}" for i in range(5)])
    st.markdown(f"<div style='font-size: 18px; padding: 12px; background: #0F172A; border-radius: 8px; border: 1px solid #334155;'>Carry Chain: {carries_str}</div>", unsafe_allow_html=True)

# ==============================================================================
# PAGE 4: ARCHITECTURE LAB
# ==============================================================================
elif page == "🏛️ Architecture Lab (5 Adders)":
    st.title("🏛️ Architecture Comparison Lab")
    st.write("Detailed exploration of all five implemented 16-bit adder architectures.")

    tabs = st.tabs(["1. Carry Skip Adder (CSKA)", "2. Ripple Carry Adder (RCA)", "3. Carry Look-Ahead (CLA)", "4. Carry Select Adder (CSLA)", "5. Brent-Kung Prefix Adder"])

    with tabs[0]:
        st.subheader("Carry Skip Adder (CSKA) - Primary Focus")
        st.markdown("""
        - **Microarchitecture:** 4 blocks of 4-bit ripple carry adders with bypass multiplexers.
        - **Bit Propagate Equation:** $P_i = A_i \oplus B_i$
        - **Group Propagate Equation:** $P_{group} = P_3 \cdot P_2 \cdot P_1 \cdot P_0$
        - **Skip Multiplexer Logic:** $C_{out} = P_{group} \cdot C_{in} + \overline{P_{group}} \cdot C_{ripple}$
        - **Key Advantage:** Accelerates carry transmission for groups where all bits propagate, bypassing 4 ripple stages in 1 MUX delay ($O(1)$) instead of 4 full-adder delays.
        - **Sky130 Result:** **1.68 ns delay (57.1% faster than RCA)** with minimal cell area overhead ($440.42\text{ µm}^2$).
        """)

    with tabs[1]:
        st.subheader("Ripple Carry Adder (RCA)")
        st.markdown("""
        - **Microarchitecture:** 16 full-adder stages cascaded in series.
        - **Critical Path:** $T_{RCA} = (N-1) \cdot T_{carry} + T_{sum} \approx O(N)$
        - **Sky130 Result:** **3.92 ns delay** (Slowest among all adders due to worst-case bit-by-bit carry ripple).
        """)

    with tabs[2]:
        st.subheader("Carry Look-Ahead Adder (CLA)")
        st.markdown("""
        - **Microarchitecture:** 4-bit hierarchical Look-Ahead Carry Unit (LCU).
        - **Generate & Propagate:** $G_i = A_i \cdot B_i$, $P_i = A_i \oplus B_i$
        - **Critical Path:** $O(\log N)$ parallel tree evaluation.
        - **Sky130 Result:** **0.88 ns delay** (Fastest), but requires higher gate fan-in and larger area ($479.21\text{ µm}^2$).
        """)

    with tabs[3]:
        st.subheader("Carry Select Adder (CSLA)")
        st.markdown("""
        - **Microarchitecture:** Speculative dual 4-bit addition for $C_{in}=0$ and $C_{in}=1$ evaluated in parallel, selected by 2:1 MUX.
        - **Sky130 Result:** **1.54 ns delay**, but duplicates adder hardware leading to higher active dynamic power ($0.156\text{ mW}$).
        """)

    with tabs[4]:
        st.subheader("Brent-Kung Parallel Prefix Adder (BK)")
        st.markdown("""
        - **Microarchitecture:** Logarithmic prefix tree with $2\log_2 N - 1$ levels.
        - **Operator:** $(G_{out}, P_{out}) = (G_{hi} + P_{hi} G_{lo}, P_{hi} P_{lo})$
        - **Sky130 Result:** **1.18 ns delay**, high regularity, standard-cell area: $506.74\text{ µm}^2$.
        """)

# ==============================================================================
# PAGE 5: PPA PERFORMANCE BENCHMARK
# ==============================================================================
elif page == "📊 PPA Performance Benchmark":
    st.title("📊 PPA Performance Benchmark (SkyWater 130nm)")
    st.write("Scientific comparative analysis across all 5 architectures based on actual Yosys synthesis and static timing analysis.")

    ppa = load_ppa()
    if ppa:
        df = pd.DataFrame(ppa)
        
        c1, c2 = st.columns(2)
        with c1:
            st.image(os.path.join(PROJECT_ROOT, "analysis", "graphs", "architecture_vs_delay.png"), caption="Critical Path Delay (ns)")
        with c2:
            st.image(os.path.join(PROJECT_ROOT, "analysis", "graphs", "area_delay_product.png"), caption="Area-Delay Product (ADP = Area x Delay)")
            
        c3, c4 = st.columns(2)
        with c3:
            st.image(os.path.join(PROJECT_ROOT, "analysis", "graphs", "architecture_vs_area.png"), caption="Standard Cell Area (µm²)")
        with c4:
            st.image(os.path.join(PROJECT_ROOT, "analysis", "graphs", "architecture_vs_power.png"), caption="Estimated Power Dissipation @ 100MHz (mW)")

# ==============================================================================
# PAGE 6: SYNTHESIS REPORTS
# ==============================================================================
elif page == "🔬 Yosys Synthesis Reports":
    st.title("🔬 Yosys Logic Synthesis & Technology Mapping")
    st.write("Inspection of mapped standard cells using `sky130_fd_sc_hd__tt_025C_1v80.lib`.")

    arch_select = st.selectbox("Select Netlist to Inspect", ["CSKA", "RCA", "CLA", "CSLA", "BK"])
    netlist_file = os.path.join(PROJECT_ROOT, "synthesis", "netlists", f"{arch_select.lower()}_sky130_netlist.v")
    log_file = os.path.join(PROJECT_ROOT, "synthesis", "reports", f"{arch_select.lower()}_synth.log")

    if os.path.exists(netlist_file):
        with open(netlist_file, "r") as f:
            code = f.read()
        st.subheader(f"Synthesized Netlist: {arch_select} ({len(code.splitlines())} lines)")
        st.code(code[:3000] + ("\n... [Truncated for preview]" if len(code) > 3000 else ""), language="verilog")
        
    if os.path.exists(log_file):
        with open(log_file, "r") as f:
            log_text = f.read()
        st.subheader("Synthesis Log Statistics")
        st.code(log_text[-2500:], language="text")

# ==============================================================================
# PAGE 7: PHYSICAL DESIGN & GDSII
# ==============================================================================
elif page == "📐 Physical Design & GDSII":
    st.title("📐 ASIC Physical Design & GDSII Layout")
    st.write("SkyWater 130nm standard-cell placement and physical implementation.")

    col1, col2 = st.columns([1.2, 1])
    with col1:
        st.image(os.path.join(PROJECT_ROOT, "physical_design", "reports", "cska_placement_layout.png"), caption="Placed Standard Cells Layout (Die: 45 x 35 µm)")
    with col2:
        st.markdown("""
        ### Physical Design Specifications
        - **Technology:** SkyWater 130nm HD (`sky130_fd_sc_hd`)
        - **Die Dimensions:** 45.0 µm × 35.0 µm (**1575.0 µm²**)
        - **Core Dimensions:** 35.0 µm × 24.5 µm (**856.8 µm²**)
        - **Core Utilization:** ~51.4%
        - **Standard Cell Row Pitch:** 2.72 µm (9 Placement Rows)
        - **Placed Macros:** 48 cells (`maj3_1`, `xnor2_1`)
        - **Output Database:** `physical_design/gds/cska_sky130.gds` (4.09 MB)
        - **Format:** GDSII Stream Format (OASIS/DEF compatible)
        - **Viewer:** Native KLayout 0.30.12 integration verified
        """)

# ==============================================================================
# PAGE 8: DOCUMENTATION
# ==============================================================================
elif page == "📚 Complete Project Documentation":
    st.title("📚 Comprehensive Engineering Documentation")
    doc_file = os.path.join(PROJECT_ROOT, "PROJECT_DOCUMENTATION.md")
    if os.path.exists(doc_file):
        with open(doc_file, "r", encoding="utf-8") as f:
            st.markdown(f.read())
    else:
        st.info("Documentation file is available in the workspace.")

# ==============================================================================
# PAGE 9: EXPORT CENTER
# ==============================================================================
elif page == "💾 Export Center":
    st.title("💾 Artifact Export & Deliverables Center")
    st.write("Download verified design files, synthesized netlists, GDSII databases, and performance reports.")

    c1, c2, c3 = st.columns(3)
    
    with c1:
        st.markdown("#### PPA Reports")
        csv_path = os.path.join(PROJECT_ROOT, "analysis", "comparison_results.csv")
        if os.path.exists(csv_path):
            with open(csv_path, "rb") as f:
                st.download_button("📥 Download PPA Comparison (CSV)", f, "comparison_results.csv", "text/csv")

    with c2:
        st.markdown("#### Synthesized Netlist")
        netlist_path = os.path.join(PROJECT_ROOT, "synthesis", "netlists", "cska_sky130_netlist.v")
        if os.path.exists(netlist_path):
            with open(netlist_path, "rb") as f:
                st.download_button("📥 Download CSKA Netlist (Verilog)", f, "cska_sky130_netlist.v", "text/plain")

    with c3:
        st.markdown("#### GDSII Layout")
        gds_path = os.path.join(PROJECT_ROOT, "physical_design", "gds", "cska_sky130.gds")
        if os.path.exists(gds_path):
            with open(gds_path, "rb") as f:
                st.download_button("📥 Download Complete GDSII Layout", f, "cska_sky130.gds", "application/octet-stream")

