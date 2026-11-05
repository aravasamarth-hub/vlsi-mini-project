# PROJECT FILE TREE & DIRECTORY ARCHITECTURE

**Project:** 16-Bit Carry Skip Adder Using SKY130 PDK  
**Workspace Root:** `D:\mini project`  
**Generated Date:** November 05, 2026  
**Auditor:** Principal VLSI Systems & Software Architect  

---

```
D:\mini project\
│
├── .gemini/                                  # Antigravity agent configuration
│   ├── rules/
│   │   └── cybercore_vlsi_rules.md           # Engineering rules & design guidelines
│   └── skills/
│       └── vlsi-flow-auditor/
│           └── SKILL.md                      # VLSI toolchain audit skill
│
├── .vscode/                                  # IDE Workspace settings & automation
│   ├── launch.json                           # Debugging configurations for Python/FastAPI
│   ├── settings.json                         # Linter settings & SonarLint config
│   └── tasks.json                            # 1-click build, test, and synthesis tasks
│
├── analysis/                                 # Post-synthesis PPA & algorithmic analysis
│   ├── graphs/                               # High-resolution Matplotlib 300-DPI charts
│   │   ├── architecture_vs_area.png          # Silicon area comparison across 5 adders
│   │   ├── architecture_vs_delay.png         # Analytical critical-path delay comparison
│   │   ├── architecture_vs_power.png         # Dynamic switching power comparison (100MHz)
│   │   ├── area_delay_product.png            # Area-Delay Product (ADP) sweet spot curve
│   │   ├── block_size_experiment.png         # 2, 4, 8-bit CSKA block delay analysis
│   │   └── scalability_delay_curve.png       # Delay scaling up to 128 bits: O(N) vs O(√N)
│   ├── block_size_experiment.csv             # Raw data from block-sizing study
│   ├── block_size_experiment.py              # Block-size analytical simulator
│   ├── comparison_results.csv                # Master 5-adder PPA metric matrix (CSV)
│   ├── comparison_results.json               # Master 5-adder PPA metric matrix (JSON)
│   ├── performance_analysis.py               # Liberty cell-delay arc extraction engine
│   ├── recommendation_engine.py              # Context-aware architecture selector
│   ├── recommendation_report.json            # Pareto-optimal architecture recommendations
│   ├── scalability_results.csv               # Asymptotic scaling data (16-128 bits)
│   └── scalability_study.py                  # Bitwidth scaling evaluator
│
├── backend/                                  # FastAPI live simulation server
│   ├── app.py                                # REST API endpoints (/api/simulate, /api/health)
│   └── test_api.py                           # Pytest unit tests for API endpoints
│
├── dashboard/                                # Streamlit secondary academic analytics
│   └── app.py                                # Multi-page interactive Streamlit dashboard
│
├── documentation/                            # Presentation & defense materials
│   ├── examiner_viva_defense.md              # 30 comprehensive viva questions & answers
│   └── seminar_speaking_script.md            # 15-slide verbal presentation script
│
├── FINAL_SCREENSHOTS/                        # Production UI verification renders
│   ├── chip_studio_viewport.png              # 3D chip studio viewport capture
│   └── master_dashboard_full.png             # Full master dashboard 1920x1080 screenshot
│
├── frontend/                                 # React 18 + Three.js CyberCore 3D Web App
│   ├── dist/                                 # Verified production build output
│   │   ├── assets/
│   │   │   ├── index-F-yDl48a.css            # Compiled CSS bundle (Tailwind v4)
│   │   │   └── index-jeN6zJ0c.js             # Compiled JavaScript/Three.js bundle
│   │   └── index.html                        # Production HTML entry point
│   ├── src/
│   │   ├── components/                       # 14 modular React components
│   │   │   ├── AdderSimulator.tsx            # Live 16-bit interactive adder simulator
│   │   │   ├── CarryVisualizer.tsx           # Carry propagation path & skip animator
│   │   │   ├── Chip3D.tsx                    # Three.js 3D chip model & QFP package
│   │   │   ├── CSKAExplanation.tsx           # Step-by-step binary addition tutorial
│   │   │   ├── InspectionPanel.tsx           # 4-block CSKA telemetry inspector
│   │   │   ├── LearningCenter.tsx            # 15-term glossary with Beginner/VLSI toggle
│   │   │   ├── LogicGateLab.tsx              # Standard cell gate-level breakdown
│   │   │   ├── OutputGallery.tsx             # Deliverables & artifact download center
│   │   │   ├── PhysicalDesignViewer.tsx      # DEF floorplan & standard-cell row viewer
│   │   │   ├── PPABenchmark.tsx              # PPA comparative charts and analysis
│   │   │   ├── PPAComparisonCard.tsx         # Analytical PPA comparison card
│   │   │   ├── PresentationMode.tsx          # 15-slide seminar presentation overlay
│   │   │   ├── ProjectOverview.tsx           # 12 foundational questions with dual-mode
│   │   │   ├── ProjectWorkflow.tsx           # 7-stage engineering lifecycle flowchart
│   │   │   ├── SoftwareInventory.tsx         # Hardware, language, tool, and extension audit
│   │   │   └── SourceCodeExplorer.tsx        # 1-click copy script & program catalog
│   │   ├── App.tsx                           # Master UI shell with 13 views
│   │   ├── index.css                         # Tailwind CSS v4 directives & obsidian theme
│   │   └── main.tsx                          # React 18 DOM mount point
│   ├── index.html                            # Vite HTML template
│   ├── package.json                          # Frontend dependencies & scripts
│   ├── tsconfig.json                         # Strict TypeScript configuration
│   └── vite.config.ts                        # Vite build configuration
│
├── physical_design/                          # ASIC physical design & GDSII streamout
│   ├── gds/
│   │   └── cska_sky130.gds                   # Binary multi-layer GDSII stream (4.18 MB)
│   ├── placement/
│   │   └── cska_sky130.def                   # 48 standard-cell placement DEF (3.6 KB)
│   ├── reports/
│   │   └── cska_placement_layout.png         # 2D cell row placement render
│   ├── sdc/
│   │   └── cska_sky130.sdc                   # Synopsys Design Constraints timing file
│   ├── export_gds.py                         # KLayout Pya DEF-to-GDSII streamout script
│   ├── export_snapshot.py                    # Automated KLayout layout renderer
│   ├── generate_physical_layout.py           # Core/die floorplan & row placement engine
│   └── plot_layout.py                        # Matplotlib 2D floorplan plot generator
│
├── rtl/                                      # Synthesizable Verilog HDL modules (11 files)
│   ├── brent_kung_adder.v                    # 16-bit parallel prefix Brent-Kung adder
│   ├── carry_lookahead_adder.v               # 16-bit hierarchical Carry Lookahead Adder
│   ├── carry_select_adder.v                  # 16-bit speculative Carry Select Adder
│   ├── carry_skip_adder.v                    # Top-level 16-bit Carry Skip Adder (Primary DUT)
│   ├── carry_skip_block_4bit.v               # 4-bit CSKA building block with bypass MUX
│   ├── cla_block_4bit.v                      # 4-bit CLA generator block
│   ├── csla_block_4bit.v                     # 4-bit speculative CSLA block (Cin=0/1)
│   ├── full_adder.v                          # 1-bit full adder gate primitive
│   ├── half_adder.v                          # 1-bit half adder gate primitive
│   ├── parameterized_cska.v                  # Parameterized N-bit CSKA generator
│   └── ripple_carry_adder.v                  # Baseline 16-bit Ripple Carry Adder
│
├── scripts/                                  # Build orchestration & packaging
│   ├── package_submission.py                 # Automated academic ZIP bundler
│   ├── setup_env.bat                         # Windows Batch environment launcher
│   └── setup_env.ps1                         # PowerShell environment setup script
│
├── simulation/                               # Simulation binaries & runtime logs
│   ├── tb_all.vvp                            # Compiled master testbench binary
│   └── tb_cska.vvp                           # Compiled CSKA testbench binary
│
├── submission/                               # Academic deliverables archive
│   ├── 16bit_carry_skip_adder_sky130_submission.zip # Final submission archive (21.00 MB)
│   └── SUBMISSION_MANIFEST.txt               # Manifest of 156 packaged candidate files
│
├── synthesis/                                # Yosys logic synthesis & technology mapping
│   ├── netlists/                             # Synthesized gate-level Verilog netlists
│   │   ├── bk_sky130_netlist.v               # 16-bit Brent-Kung netlist (64 cells)
│   │   ├── cla_sky130_netlist.v              # 16-bit CLA netlist (61 cells)
│   │   ├── cska_hier_sky130_netlist.v        # Hierarchical CSKA netlist (56 cells)
│   │   ├── cska_sky130_netlist.v             # Flattened CSKA netlist (48 cells)
│   │   ├── csla_sky130_netlist.v             # 16-bit CSLA netlist (87 cells)
│   │   ├── rca_hier_sky130_netlist.v         # Hierarchical RCA netlist (32 cells)
│   │   └── rca_sky130_netlist.v              # Flattened RCA netlist (48 cells)
│   ├── reports/                              # Synthesis logs & statistics
│   │   ├── bk_synth.log                      # Brent-Kung synthesis log
│   │   ├── cla_synth.log                     # CLA synthesis log
│   │   ├── cska_hier_synth.log               # Hierarchical CSKA synthesis log
│   │   ├── cska_synth.log                    # Flattened CSKA synthesis log
│   │   ├── csla_synth.log                    # CSLA synthesis log
│   │   ├── rca_hier_synth.log                # Hierarchical RCA synthesis log
│   │   ├── rca_synth.log                     # Flattened RCA synthesis log
│   │   ├── synthesis_summary.csv             # Tabular synthesis comparison (CSV)
│   │   └── synthesis_summary.json            # Tabular synthesis comparison (JSON)
│   ├── sky130_pdk/                           # SkyWater 130nm High-Density PDK subset
│   │   ├── sky130_fd_sc_hd__tt_025C_1v80.lib # Liberty standard cell timing models (12.8 MB)
│   │   ├── sky130_fd_sc_hd.gds               # Standard cell binary geometries (4.18 MB)
│   │   ├── sky130_fd_sc_hd.tlef              # Technology LEF (layer pitch, width, rules)
│   │   ├── sky130_fd_sc_hd_merged.lef        # Macro LEF (pin locations & cell boundaries)
│   │   ├── sky130hd.lyp                      # KLayout layer properties & colors
│   │   └── sky130hd.lyt                      # KLayout technology setup
│   ├── yosys_scripts/                        # 7 automated Yosys synthesis scripts
│   │   ├── synth_bk.ys                       # Brent-Kung synthesis recipe
│   │   ├── synth_cla.ys                      # CLA synthesis recipe
│   │   ├── synth_cska.ys                     # Flattened CSKA synthesis recipe
│   │   ├── synth_cska_hier.ys                # Hierarchical CSKA synthesis recipe
│   │   ├── synth_csla.ys                     # CSLA synthesis recipe
│   │   ├── synth_rca.ys                      # Flattened RCA synthesis recipe
│   │   └── synth_rca_hier.ys                 # Hierarchical RCA synthesis recipe
│   └── run_synthesis.py                      # Master Python synthesis runner
│
├── tools/                                    # Portable EDA suite & verification logs
│   ├── oss-cad-suite/                        # OSS CAD Suite (Icarus, Yosys, ABC, GTKWave)
│   ├── klayout_test.log                      # KLayout Pya verification log (0.30.12)
│   └── test_klayout.py                       # KLayout Python API verification script
│
├── verification/                             # Testbenches & simulation verification
│   ├── vcd/                                  # Value Change Dump waveform files
│   │   └── cska.vcd                          # CSKA signal transition dump (1.2 MB)
│   ├── verification_results/
│   │   └── summary.json                      # Verification manifesto (60,038 vectors, 100% pass)
│   ├── common_reference_model.v              # 17-bit self-checking golden adder model
│   ├── testbench_all.v                       # Master unified 5-adder lockstep testbench
│   ├── testbench_bk.v                        # Brent-Kung dedicated testbench (10,000 vectors)
│   ├── testbench_cla.v                       # CLA dedicated testbench (10,000 vectors)
│   ├── testbench_cska.v                      # CSKA dedicated testbench (10,038 vectors)
│   ├── testbench_csla.v                      # CSLA dedicated testbench (10,000 vectors)
│   └── testbench_rca.v                       # RCA dedicated testbench (10,000 vectors)
│
└── Master Documentation Reports:
    ├── 3D_VISUALIZATION_GUIDE.md             # Guide to Three.js semiconductor rendering
    ├── ACADEMIC_RESULTS_AND_LIMITATIONS.md   # RCA vs CSKA synthesis, 48 vs 56 cells, timing limits
    ├── ANTIGRAVITY_OPTIMIZATION_REPORT.md    # IDE configuration & extension audit
    ├── DEVELOPMENT_LOG.md                    # Engineering milestone chronological log
    ├── FINAL_ACADEMIC_READINESS_CHECKLIST.md # Defense readiness verification checklist
    ├── FINAL_DOCUMENTATION_REPORT.md         # Comprehensive project defense document
    ├── FINAL_PROJECT_STATUS.md               # Executive project status report
    ├── GDSII_LAYOUT_EXPLANATION.md           # GDSII stream, Sky130 layers, DEF placement
    ├── INDEPENDENT_AUDIT_REPORT.md           # Third-party technical audit & verification
    ├── INSTALLATION_GUIDE.md                 # Complete local setup & deployment guide
    ├── PROGRAMS_AND_SCRIPTS_CATALOG.md       # Catalog of 11 RTL, 7 TBs, 11 scripts with commands
    ├── PROJECT_DOCUMENTATION.md              # Original baseline project documentation
    ├── PROJECT_INVENTORY.md                  # Comprehensive asset inventory & manifests
    ├── PROJECT_WORKFLOW.md                   # 7-stage digital VLSI engineering lifecycle
    ├── RCA_CSKA_TIMING_INVESTIGATION.md      # Root-cause analysis of flattened vs hierarchical timing
    ├── README.md                             # Repository entry point & quickstart guide
    ├── SOFTWARE_AND_EXTENSION_INVENTORY.md   # Detailed hardware, EDA, and extension specs
    ├── SYSTEM_AUDIT.md                       # Initial system assessment
    ├── TEST_RESULTS.md                       # Test vector execution summary
    ├── UI_REDESIGN_REPORT.md                 # Glassmorphic UI redesign log
    └── VISUAL_QA_REPORT.md                   # Browser QA & WebGL performance audit
```

