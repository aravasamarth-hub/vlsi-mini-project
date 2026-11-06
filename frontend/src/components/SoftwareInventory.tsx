import React, { useState } from 'react'
import {
  ShieldCheck,
  Search,
  Laptop,
  CheckCircle2
} from 'lucide-react'

interface InventoryItem {
  id: string
  category: 'HARDWARE' | 'LANGUAGES' | 'EDA_TOOLS' | 'PYTHON' | 'FRONTEND' | 'EXTENSIONS'
  name: string
  version: string
  publisherOrDetails: string
  role: string
  status: 'VERIFIED' | 'ACTIVE' | 'INSTALLED'
  locationOrBinary?: string
}

const INVENTORY: InventoryItem[] = [
  // Hardware
  {
    id: 'hw-cpu',
    category: 'HARDWARE',
    name: 'Intel(R) Core(TM) 5 210H',
    version: '8 Cores / 12 Logical Processors @ 2.20 GHz',
    publisherOrDetails: 'Intel Corporation (High-Throughput Mobile Workstation)',
    role: 'Primary compute engine for parallel Verilog simulation & logic synthesis',
    status: 'ACTIVE',
    locationOrBinary: 'Device Manager / Win32_Processor'
  },
  {
    id: 'hw-gpu',
    category: 'HARDWARE',
    name: 'NVIDIA GeForce RTX 4050 Laptop GPU',
    version: '6.0 GB GDDR6 VRAM (Driver: 32.0.16.1742)',
    publisherOrDetails: 'NVIDIA Corporation',
    role: 'Hardware WebGL 2.0 / Three.js 3D acceleration for VLSI Mini Project 3D studio',
    status: 'ACTIVE',
    locationOrBinary: 'PCIe Bus / Win32_VideoController'
  },
  {
    id: 'hw-ram',
    category: 'HARDWARE',
    name: 'System RAM (DDR5)',
    version: '16.0 GB (16,370,968 KB Total)',
    publisherOrDetails: 'High-speed dual-channel memory bus',
    role: 'In-memory caching of 12.8MB SkyWater Liberty timing models during ABC mapping',
    status: 'ACTIVE',
    locationOrBinary: 'Win32_PhysicalMemory'
  },
  {
    id: 'hw-storage',
    category: 'HARDWARE',
    name: 'Fast NVMe PCIe 4.0 SSD (Drive D:)',
    version: '244.9 GB NTFS (151.7 GB Free)',
    publisherOrDetails: 'High-speed primary project partition',
    role: 'Instantaneous random I/O for 4.18MB GDSII files, DEF layouts, and VCD waveforms',
    status: 'ACTIVE',
    locationOrBinary: 'D:/mini project'
  },
  {
    id: 'hw-os',
    category: 'HARDWARE',
    name: 'Microsoft Windows 11 Home',
    version: 'Build 26220 (64-bit NT Kernel 10.0)',
    publisherOrDetails: 'Microsoft Corporation',
    role: 'Host operating system running native Windows EDA toolchain',
    status: 'ACTIVE',
    locationOrBinary: 'C:/Windows/System32'
  },

  // Languages
  {
    id: 'lang-verilog',
    category: 'LANGUAGES',
    name: 'Verilog HDL',
    version: 'IEEE 1364-2005 Standard',
    publisherOrDetails: 'IEEE Computer Society',
    role: 'Synthesizable digital hardware description: 11 RTL modules and 7 testbenches',
    status: 'VERIFIED',
    locationOrBinary: 'rtl/*.v & verification/*.v'
  },
  {
    id: 'lang-python',
    category: 'LANGUAGES',
    name: 'Python Runtime',
    version: '3.11.15 / 3.14.10 (64-bit)',
    publisherOrDetails: 'Python Software Foundation',
    role: 'Floorplanning, DEF generation, KLayout Pya automation, FastAPI backend',
    status: 'VERIFIED',
    locationOrBinary: 'D:/mini project/.venv/Scripts/python.exe'
  },
  {
    id: 'lang-typescript',
    category: 'LANGUAGES',
    name: 'TypeScript',
    version: '5.8+ (Strict Mode)',
    publisherOrDetails: 'Microsoft Corporation',
    role: 'Strict type safety across 3D rendering state, simulator telemetry, and UI components',
    status: 'VERIFIED',
    locationOrBinary: 'frontend/tsconfig.json'
  },
  {
    id: 'lang-javascript',
    category: 'LANGUAGES',
    name: 'ECMAScript 2024 / Node.js',
    version: 'Node v24.17.0 / npm 11.13.0',
    publisherOrDetails: 'OpenJS Foundation',
    role: 'Frontend build orchestration, module resolution, and Vite server runtime',
    status: 'VERIFIED',
    locationOrBinary: 'C:/Program Files/nodejs/node.exe'
  },
  {
    id: 'lang-tailwind',
    category: 'LANGUAGES',
    name: 'Tailwind CSS v4 & PostCSS',
    version: 'v4.0.0',
    publisherOrDetails: 'Tailwind Labs',
    role: 'Semiconductor lab styling, glassmorphism, glowing neon borders, responsive HUD',
    status: 'VERIFIED',
    locationOrBinary: 'frontend/src/index.css'
  },
  {
    id: 'lang-tcl',
    category: 'LANGUAGES',
    name: 'Yosys Synthesis Scripting (Tcl-like)',
    version: 'Yosys 0.70 dialect',
    publisherOrDetails: 'YosysHQ',
    role: 'Automation of technology mapping, boundary preservation, and ABC cell binding',
    status: 'VERIFIED',
    locationOrBinary: 'synthesis/yosys_scripts/*.ys'
  },

  // EDA Tools
  {
    id: 'eda-iverilog',
    category: 'EDA_TOOLS',
    name: 'Icarus Verilog (iverilog)',
    version: 'v14.0 (devel) s20260301-812',
    publisherOrDetails: 'Stephen Williams (OSS-CAD-Suite)',
    role: 'IEEE 1364 Verilog RTL simulation compiler',
    status: 'VERIFIED',
    locationOrBinary: 'D:/mini project/tools/oss-cad-suite/bin/iverilog.exe'
  },
  {
    id: 'eda-vvp',
    category: 'EDA_TOOLS',
    name: 'vvp Runtime Engine',
    version: 'v14.0 (devel)',
    publisherOrDetails: 'OSS-CAD-Suite',
    role: 'High-speed execution engine for compiled testbench binaries (60,038 vectors)',
    status: 'VERIFIED',
    locationOrBinary: 'D:/mini project/tools/oss-cad-suite/bin/vvp.exe'
  },
  {
    id: 'eda-gtkwave',
    category: 'EDA_TOOLS',
    name: 'GTKWave Waveform Viewer',
    version: 'v3.3.118',
    publisherOrDetails: 'Tony Bybell / OSS-CAD-Suite',
    role: 'Digital VCD waveform visualization and glitch/transition inspection',
    status: 'VERIFIED',
    locationOrBinary: 'D:/mini project/tools/oss-cad-suite/bin/gtkwave.exe'
  },
  {
    id: 'eda-yosys',
    category: 'EDA_TOOLS',
    name: 'Yosys Open SYnthesis Suite',
    version: 'v0.70+',
    publisherOrDetails: 'Claire Wolf / YosysHQ',
    role: 'Logic synthesis, hierarchy analysis, and technology mapping to Sky130 HD library',
    status: 'VERIFIED',
    locationOrBinary: 'D:/mini project/tools/oss-cad-suite/bin/yosys.exe'
  },
  {
    id: 'eda-abc',
    category: 'EDA_TOOLS',
    name: 'Berkeley ABC Logic Mapper',
    version: 'Integrated in Yosys',
    publisherOrDetails: 'UC Berkeley (Robert Brayton et al.)',
    role: 'And-Inverter Graph (AIG) logic optimization and standard-cell delay/area binding',
    status: 'VERIFIED',
    locationOrBinary: 'Embedded inside Yosys'
  },
  {
    id: 'eda-klayout',
    category: 'EDA_TOOLS',
    name: 'KLayout Layout Viewer & Engine',
    version: 'v0.30.12 (Native) / v0.30.0 (Ref)',
    publisherOrDetails: 'Matthias Köfferlein',
    role: 'DEF placement loading, Python Pya GDSII binary streaming, and mask inspection',
    status: 'VERIFIED',
    locationOrBinary: 'C:/Users/arava/AppData/Roaming/KLayout/klayout_app.exe'
  },
  {
    id: 'eda-sky130',
    category: 'EDA_TOOLS',
    name: 'SkyWater SKY130 HD PDK',
    version: 'sky130_fd_sc_hd Rev 1.0',
    publisherOrDetails: 'Google & SkyWater Technology Foundry',
    role: '433 standard cells characterized across PVT (.lib, .lef, .gds)',
    status: 'VERIFIED',
    locationOrBinary: 'D:/mini project/synthesis/sky130_pdk/'
  },

  // Python Libraries
  {
    id: 'py-fastapi',
    category: 'PYTHON',
    name: 'FastAPI',
    version: '0.110.1',
    publisherOrDetails: 'Tiangolo',
    role: 'High-performance REST API serving live Verilog simulation telemetry to UI',
    status: 'ACTIVE',
    locationOrBinary: 'http://127.0.0.1:8000'
  },
  {
    id: 'py-uvicorn',
    category: 'PYTHON',
    name: 'Uvicorn ASGI Server',
    version: '0.25.0',
    publisherOrDetails: 'Encode',
    role: 'Lightning-fast async server hosting FastAPI daemon',
    status: 'ACTIVE',
    locationOrBinary: 'D:/mini project/.venv/Scripts/uvicorn.exe'
  },
  {
    id: 'py-numpy',
    category: 'PYTHON',
    name: 'NumPy',
    version: '2.4.6',
    publisherOrDetails: 'NumPy Developers',
    role: 'Mathematical array vectorization for delay modeling and power matrices',
    status: 'ACTIVE',
    locationOrBinary: 'D:/mini project/.venv/Lib/site-packages/numpy'
  },
  {
    id: 'py-pandas',
    category: 'PYTHON',
    name: 'Pandas',
    version: '3.0.6',
    publisherOrDetails: 'Pandas Development Team',
    role: 'Tabular aggregation of synthesis reports into synthesis_summary.csv',
    status: 'ACTIVE',
    locationOrBinary: 'D:/mini project/.venv/Lib/site-packages/pandas'
  },
  {
    id: 'py-pydantic',
    category: 'PYTHON',
    name: 'Pydantic',
    version: '2.13.5',
    publisherOrDetails: 'Pydantic Services Inc.',
    role: 'Typed data schemas for REST API simulation payloads',
    status: 'ACTIVE',
    locationOrBinary: 'D:/mini project/.venv/Lib/site-packages/pydantic'
  },
  {
    id: 'py-pytest',
    category: 'PYTHON',
    name: 'Pytest',
    version: '9.1.1',
    publisherOrDetails: 'Holger Krekel et al.',
    role: 'Automated test execution harness for Python analysis routines',
    status: 'ACTIVE',
    locationOrBinary: 'D:/mini project/.venv/Lib/site-packages/pytest'
  },
  {
    id: 'py-matplotlib',
    category: 'PYTHON',
    name: 'Matplotlib',
    version: '3.10.0+',
    publisherOrDetails: 'John D. Hunter et al.',
    role: 'Generation of 6 high-resolution publication charts in analysis/graphs/',
    status: 'ACTIVE',
    locationOrBinary: 'D:/mini project/.venv/Lib/site-packages/matplotlib'
  },
  {
    id: 'py-streamlit',
    category: 'PYTHON',
    name: 'Streamlit',
    version: '1.40.0+',
    publisherOrDetails: 'Snowflake Inc.',
    role: 'Secondary academic telemetry and benchmark analytics dashboard',
    status: 'ACTIVE',
    locationOrBinary: 'http://localhost:8501'
  },

  // Frontend Libraries
  {
    id: 'fe-react',
    category: 'FRONTEND',
    name: 'React & React DOM',
    version: '18.3.1',
    publisherOrDetails: 'Meta Open Source',
    role: 'Declarative component hierarchy, virtual DOM, and reactive UI state',
    status: 'ACTIVE',
    locationOrBinary: 'frontend/node_modules/react'
  },
  {
    id: 'fe-three',
    category: 'FRONTEND',
    name: 'Three.js WebGL Engine',
    version: '0.170.0',
    publisherOrDetails: 'Mr.doob',
    role: 'Hardware-accelerated 3D scene rendering, procedural chip shaders, QFP package',
    status: 'ACTIVE',
    locationOrBinary: 'frontend/node_modules/three'
  },
  {
    id: 'fe-r3f',
    category: 'FRONTEND',
    name: '@react-three/fiber',
    version: '8.17.10',
    publisherOrDetails: 'Poimandres',
    role: 'Declarative Three.js wrapper with 60 FPS hardware loop',
    status: 'ACTIVE',
    locationOrBinary: 'frontend/node_modules/@react-three/fiber'
  },
  {
    id: 'fe-drei',
    category: 'FRONTEND',
    name: '@react-three/drei',
    version: '9.117.3',
    publisherOrDetails: 'Poimandres',
    role: 'OrbitControls camera manipulation, MeshTransmissionMaterial, Floating effects',
    status: 'ACTIVE',
    locationOrBinary: 'frontend/node_modules/@react-three/drei'
  },
  {
    id: 'fe-lucide',
    category: 'FRONTEND',
    name: 'Lucide React',
    version: '0.460.0',
    publisherOrDetails: 'Lucide Project',
    role: 'Crisp vector SVG engineering icons for HUD and control panels',
    status: 'ACTIVE',
    locationOrBinary: 'frontend/node_modules/lucide-react'
  },
  {
    id: 'fe-vite',
    category: 'FRONTEND',
    name: 'Vite Bundler',
    version: '6.0.1',
    publisherOrDetails: 'Evan You / Vite Community',
    role: 'Sub-second Hot Module Replacement (HMR) and optimized rollup production build',
    status: 'ACTIVE',
    locationOrBinary: 'http://localhost:3000'
  },

  // IDE Extensions
  {
    id: 'ext-verilog',
    category: 'EXTENSIONS',
    name: 'Verilog-HDL/SystemVerilog/Bluespec',
    version: '1.29.0',
    publisherOrDetails: 'mshr-h (ID: mshr-h.veriloghdl)',
    role: 'IEEE Verilog syntax highlighting, linter integration, and symbol navigation',
    status: 'INSTALLED',
    locationOrBinary: 'C:/Users/arava/.antigravity-ide/extensions/mshr-h.veriloghdl-1.29.0-universal'
  },
  {
    id: 'ext-rainbow-csv',
    category: 'EXTENSIONS',
    name: 'Rainbow CSV',
    version: '3.24.1',
    publisherOrDetails: 'mechatroner (ID: mechatroner.rainbow-csv)',
    role: 'Colorized tabular column inspection of synthesis_summary.csv and benchmark results',
    status: 'INSTALLED',
    locationOrBinary: 'C:/Users/arava/.antigravity-ide/extensions/mechatroner.rainbow-csv-3.24.1-universal'
  },
  {
    id: 'ext-sonarlint',
    category: 'EXTENSIONS',
    name: 'SonarLint Code Quality',
    version: '6.2.0',
    publisherOrDetails: 'SonarSource (ID: sonarsource.sonarlint-vscode)',
    role: 'Static code auditing, security flaw detection, and clean TypeScript standards',
    status: 'INSTALLED',
    locationOrBinary: 'C:/Users/arava/.antigravity-ide/extensions/sonarsource.sonarlint-vscode-6.2.0-win32-x64'
  },
  {
    id: 'ext-tailwind',
    category: 'EXTENSIONS',
    name: 'Tailwind CSS IntelliSense',
    version: '0.16.0',
    publisherOrDetails: 'Tailwind Labs (ID: bradlc.vscode-tailwindcss)',
    role: 'Intelligent class autocomplete, linting, and CSS hover previews',
    status: 'INSTALLED',
    locationOrBinary: 'C:/Users/arava/.antigravity-ide/extensions/bradlc.vscode-tailwindcss-0.16.0-universal'
  },
  {
    id: 'ext-prettier',
    category: 'EXTENSIONS',
    name: 'Prettier - Code Formatter',
    version: '12.4.0',
    publisherOrDetails: 'Prettier (ID: esbenp.prettier-vscode)',
    role: 'Automated formatting across TypeScript, CSS, JSON, and Markdown',
    status: 'INSTALLED',
    locationOrBinary: 'C:/Users/arava/.antigravity-ide/extensions/esbenp.prettier-vscode-12.4.0-universal'
  },
  {
    id: 'ext-eslint',
    category: 'EXTENSIONS',
    name: 'ESLint',
    version: '3.0.34',
    publisherOrDetails: 'Microsoft (ID: dbaeumer.vscode-eslint)',
    role: 'JavaScript/TypeScript linting and style enforcement',
    status: 'INSTALLED',
    locationOrBinary: 'C:/Users/arava/.antigravity-ide/extensions/dbaeumer.vscode-eslint-3.0.34-universal'
  },
  {
    id: 'ext-errorlens',
    category: 'EXTENSIONS',
    name: 'ErrorLens',
    version: '3.30.0',
    publisherOrDetails: 'usernamehw (ID: usernamehw.errorlens)',
    role: 'Inline highlight of diagnostic errors, warnings, and type hints',
    status: 'INSTALLED',
    locationOrBinary: 'C:/Users/arava/.antigravity-ide/extensions/usernamehw.errorlens-3.30.0-universal'
  },
  {
    id: 'ext-gitlens',
    category: 'EXTENSIONS',
    name: 'GitLens — Git Supercharged',
    version: '19.5.0',
    publisherOrDetails: 'GitKraken (ID: eamodio.gitlens)',
    role: 'Line-by-line Git blame, repository telemetry, and revision navigation',
    status: 'INSTALLED',
    locationOrBinary: 'C:/Users/arava/.antigravity-ide/extensions/eamodio.gitlens-19.5.0-universal'
  },
  {
    id: 'ext-gitgraph',
    category: 'EXTENSIONS',
    name: 'Git Graph',
    version: '1.30.0',
    publisherOrDetails: 'mhutchie (ID: mhutchie.git-graph)',
    role: 'Interactive graphical visualization of repository commit topology',
    status: 'INSTALLED',
    locationOrBinary: 'C:/Users/arava/.antigravity-ide/extensions/mhutchie.git-graph-1.30.0-universal'
  },
  {
    id: 'ext-python',
    category: 'EXTENSIONS',
    name: 'Python Extension Pack',
    version: '2026.4.0',
    publisherOrDetails: 'Microsoft (ID: ms-python.python)',
    role: 'Python language server, environment manager, and script execution',
    status: 'INSTALLED',
    locationOrBinary: 'C:/Users/arava/.antigravity-ide/extensions/ms-python.python-2026.4.0-universal'
  },
  {
    id: 'ext-ruff',
    category: 'EXTENSIONS',
    name: 'Ruff Python Linter & Formatter',
    version: '2026.92.0',
    publisherOrDetails: 'Astral Software (ID: charliermarsh.ruff)',
    role: 'Ultra-fast Python static analysis and linting',
    status: 'INSTALLED',
    locationOrBinary: 'C:/Users/arava/.antigravity-ide/extensions/charliermarsh.ruff-2026.92.0-win32-x64'
  },
  {
    id: 'ext-markdownlint',
    category: 'EXTENSIONS',
    name: 'markdownlint',
    version: '0.62.1',
    publisherOrDetails: 'David Anson (ID: davidanson.vscode-markdownlint)',
    role: 'Markdown style and syntax validation across all academic reports',
    status: 'INSTALLED',
    locationOrBinary: 'C:/Users/arava/.antigravity-ide/extensions/davidanson.vscode-markdownlint-0.62.1-universal'
  }
]

export default function SoftwareInventory() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categories = [
    { id: 'ALL', label: 'All Assets', count: INVENTORY.length },
    { id: 'HARDWARE', label: 'Hardware Specs', count: INVENTORY.filter((i) => i.category === 'HARDWARE').length },
    { id: 'LANGUAGES', label: 'Languages', count: INVENTORY.filter((i) => i.category === 'LANGUAGES').length },
    { id: 'EDA_TOOLS', label: 'EDA Tools', count: INVENTORY.filter((i) => i.category === 'EDA_TOOLS').length },
    { id: 'PYTHON', label: 'Python Stack', count: INVENTORY.filter((i) => i.category === 'PYTHON').length },
    { id: 'FRONTEND', label: 'Web 3D Stack', count: INVENTORY.filter((i) => i.category === 'FRONTEND').length },
    { id: 'EXTENSIONS', label: 'IDE Extensions', count: INVENTORY.filter((i) => i.category === 'EXTENSIONS').length }
  ]

  const filteredItems = INVENTORY.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.version.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-[#00F0FF]/25 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-xl bg-gradient-to-tr from-[#00F0FF] to-[#0066FF] text-black">
              <Laptop className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white glow-cyan">
                COMPLETE SOFTWARE, HARDWARE & EXTENSION INVENTORY
              </h1>
              <p className="text-xs text-[#94A3B8]">
                Audit of Local Hardware, EDA Compilers, Python Libraries, Web Runtimes, and Antigravity IDE Extensions
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-lg bg-[#00DF72]/15 text-[#00DF72] border border-[#00DF72]/40 font-bold flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>100% ENVIRONMENT AUDITED</span>
            </span>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50 shadow-md shadow-[#00F0FF]/15'
                    : 'bg-[#060A14] text-[#94A3B8] border border-[#1E293B] hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span className="px-1.5 py-0.2 rounded bg-[#1E293B] text-[10px] text-white">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-64">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tools, versions, paths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#060A14] border border-[#1E293B] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]/50"
            />
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="glass-panel p-5 rounded-2xl border border-[#1E293B] hover:border-[#00F0FF]/40 transition-all duration-200 flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-[#00F0FF]/5"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1E293B] text-[#94A3B8]">
                  {item.category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00DF72]/15 text-[#00DF72] border border-[#00DF72]/30 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{item.status}</span>
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white tracking-wide truncate">{item.name}</h3>
                <div className="text-[11px] text-[#00F0FF] font-mono mt-0.5 truncate">{item.version}</div>
              </div>

              <div className="text-[11px] text-[#94A3B8] leading-relaxed line-clamp-2">
                {item.role}
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E293B]/70 space-y-1 text-[10px]">
              <div className="text-[#64748B] truncate">
                <span className="text-[#94A3B8]">Provider:</span> {item.publisherOrDetails}
              </div>
              {item.locationOrBinary && (
                <div className="text-[#64748B] font-mono truncate">
                  <span className="text-[#94A3B8]">Path:</span> {item.locationOrBinary}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

