"""
SkyWater 130nm Standard-Cell Timing Arc Query Tool.
Parses Liberty (.lib) models for precise cell-level rise/fall timing arcs.
"""

import os
import re
from typing import Any, Dict, List, Optional

# Resolve default Liberty library path with workspace-relative fallback
DEFAULT_LIB = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "synthesis",
    "sky130_pdk",
    "sky130_fd_sc_hd__tt_025C_1v80.lib",
)
LIB_PATH = DEFAULT_LIB if os.path.exists(DEFAULT_LIB) else r"X:\synthesis\sky130_pdk\sky130_fd_sc_hd__tt_025C_1v80.lib"


def parse_grid_value(table_str: str, row_idx: int = 2, col_idx: int = 2) -> Optional[float]:
    """Extract a 2D grid lookup table value from a Liberty values(...) block."""
    if not table_str:
        return None
    val_match = re.search(r"values\s*\(([^)]+)\)", table_str)
    if not val_match:
        return None

    raw_rows = val_match.group(1).split("\\")
    rows: List[List[float]] = []
    for raw_row in raw_rows:
        cleaned = raw_row.strip().strip('"').strip(";").strip(",")
        nums = [float(x.strip().strip('"')) for x in cleaned.split(",") if x.strip().strip('"')]
        if nums:
            rows.append(nums)

    if len(rows) > row_idx and len(rows[row_idx]) > col_idx:
        return rows[row_idx][col_idx]
    return None


def extract_delay_metric(block: str, metric: str) -> Optional[float]:
    """Extract cell_rise or cell_fall nominal delay value from a timing block."""
    pattern = rf"{metric}\s*\([^)]*\)\s*\{{([^}}]+)\}}"
    match = re.search(pattern, block)
    if not match:
        return None
    return parse_grid_value(match.group(1))


def parse_timing_block(block: str) -> Dict[str, Any]:
    """Parse attributes and nominal delay metrics for a single pin timing arc."""
    related_pin_m = re.search(r'related_pin\s*:\s*"([A-Za-z0-9_]+)"', block)
    when_m = re.search(r'when\s*:\s*"([^"\r\n]+)"', block)
    timing_sense_m = re.search(r'timing_sense\s*:\s*"?([A-Za-z0-9_]+)"?', block)

    return {
        "related_pin": related_pin_m.group(1) if related_pin_m else None,
        "when": when_m.group(1) if when_m else None,
        "sense": timing_sense_m.group(1).strip() if timing_sense_m else None,
        "cell_rise_nom": extract_delay_metric(block, "cell_rise"),
        "cell_fall_nom": extract_delay_metric(block, "cell_fall"),
    }


def find_pin_block(cell_name: str, library_text: str, pin_name: str = "X") -> str:
    """Find the slice of text corresponding to a specific output pin within a cell."""
    cell_token = f'cell ("{cell_name}")'
    cell_idx = library_text.find(cell_token)
    if cell_idx == -1:
        return ""

    cell_text = library_text[cell_idx : cell_idx + 50000]
    pin_token = f'pin ("{pin_name}")'
    pin_idx = cell_text.find(pin_token)
    if pin_idx == -1:
        return ""

    return cell_text[pin_idx:]


def get_pin_x_timings(cell_name: str, library_text: str) -> List[Dict[str, Any]]:
    """Retrieve all timing arcs for output pin X of the target standard cell."""
    pin_text = find_pin_block(cell_name, library_text, "X")
    if not pin_text:
        return []

    timing_matches = list(re.finditer(r"timing\s*\(\s*\)\s*\{", pin_text))
    timings: List[Dict[str, Any]] = []

    for i, match in enumerate(timing_matches):
        start = match.start()
        end = timing_matches[i + 1].start() if i + 1 < len(timing_matches) else len(pin_text)
        arc_block = pin_text[start:end]
        timings.append(parse_timing_block(arc_block))

    return timings


def main() -> None:
    """Execute arc queries across primary CSKA standard cell types."""
    if not os.path.exists(LIB_PATH):
        print(f"Error: Liberty file not found at: {LIB_PATH}")
        return

    with open(LIB_PATH, "r", errors="ignore") as f:
        text = f.read()

    cells_to_query = [
        "sky130_fd_sc_hd__maj3_1",
        "sky130_fd_sc_hd__mux2_1",
        "sky130_fd_sc_hd__xor3_1",
        "sky130_fd_sc_hd__and4_1",
        "sky130_fd_sc_hd__xor2_1",
    ]

    for cell in cells_to_query:
        print(f"\n==================== {cell} ====================")
        timing_list = get_pin_x_timings(cell, text)
        for t in timing_list:
            cr = f"{t['cell_rise_nom']:.4f} ns" if t["cell_rise_nom"] is not None else "None"
            cf = f"{t['cell_fall_nom']:.4f} ns" if t["cell_fall_nom"] is not None else "None"
            when_str = f" [when: {t['when']}]" if t["when"] else ""
            print(f"  {t['related_pin']} -> X ({t['sense']}){when_str}: rise={cr}, fall={cf}")


if __name__ == "__main__":
    main()
