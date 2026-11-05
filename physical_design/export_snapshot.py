import pya, os

layout_path = r"X:\physical_design\gds\cska_sky130.gds"
img_out = r"X:\physical_design\reports\cska_layout_snapshot.png"
lyp_path = r"X:\synthesis\sky130_pdk\sky130hd.lyp"

print("[KLayout] Generating high-resolution layout snapshot...")
view = pya.LayoutView()
view.load_layout(layout_path, 0)
if os.path.exists(lyp_path):
    view.load_layer_props(lyp_path)
view.max_hier()
view.zoom_fit()
view.save_image(img_out, 1200, 900)
print(f"[KLayout] Snapshot successfully saved: {img_out} ({os.path.getsize(img_out)} bytes)")

