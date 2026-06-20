#!/usr/bin/env python3
"""Generate all icon formats needed for electron-builder from a 1024x1024 PNG source."""

import os
import sys
import struct
import zlib
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("ERROR: Pillow not installed. Run: pip3 install Pillow")
    sys.exit(1)

ICONS_DIR = Path(__file__).parent / "icons"
ICONSET_DIR = ICONS_DIR / "icon.iconset"
SOURCE_PNG = ICONS_DIR / "icon_1024.png"

# macOS iconset sizes
ICNS_SIZES = [
    ("icon_16x16.png", 16),
    ("icon_16x16@2x.png", 32),
    ("icon_32x32.png", 32),
    ("icon_32x32@2x.png", 64),
    ("icon_128x128.png", 128),
    ("icon_128x128@2x.png", 256),
    ("icon_256x256.png", 256),
    ("icon_256x256@2x.png", 512),
    ("icon_512x512.png", 512),
    ("icon_512x512@2x.png", 1024),
]

# Linux PNG sizes
LINUX_SIZES = [16, 24, 32, 48, 64, 128, 256, 512, 1024]

def create_ico_from_pngs(source_img, output_path):
    """Create a Windows .ico file with multiple sizes."""
    sizes = [16, 24, 32, 48, 64, 128, 256]
    images = []
    
    for size in sizes:
        img = source_img.copy()
        img = img.resize((size, size), Image.LANCZOS)
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        images.append(img)
    
    # Save as ICO
    images[0].save(
        output_path,
        format='ICO',
        sizes=[(img.width, img.height) for img in images],
        append_images=images[1:]
    )
    print(f"  ✓ Created {output_path}")

def main():
    print("🌱 SeedScreen Icon Generator")
    print("=" * 40)
    
    if not SOURCE_PNG.exists():
        print(f"ERROR: Source PNG not found: {SOURCE_PNG}")
        sys.exit(1)
    
    # Open source image
    print(f"\n📷 Loading source: {SOURCE_PNG}")
    source = Image.open(SOURCE_PNG)
    if source.mode != 'RGBA':
        source = source.convert('RGBA')
    print(f"   Size: {source.size}, Mode: {source.mode}")
    
    # ---- macOS .icns ----
    print("\n🍎 Generating macOS iconset...")
    ICONSET_DIR.mkdir(parents=True, exist_ok=True)
    
    for filename, size in ICNS_SIZES:
        img = source.copy()
        img = img.resize((size, size), Image.LANCZOS)
        out_path = ICONSET_DIR / filename
        img.save(out_path, format='PNG')
        print(f"  ✓ {filename} ({size}x{size})")
    
    # Convert iconset to icns using iconutil
    icns_path = ICONS_DIR / "icon.icns"
    ret = os.system(f'iconutil -c icns "{ICONSET_DIR}" -o "{icns_path}"')
    if ret == 0:
        print(f"  ✓ Created icon.icns ({icns_path.stat().st_size // 1024} KB)")
    else:
        print(f"  ✗ iconutil failed with code {ret}")
    
    # ---- Windows .ico ----
    print("\n🪟 Generating Windows icon...")
    ico_path = ICONS_DIR / "icon.ico"
    create_ico_from_pngs(source, ico_path)
    print(f"     Size: {ico_path.stat().st_size // 1024} KB")
    
    # ---- Linux PNG (512x512) ----
    print("\n🐧 Generating Linux icons...")
    linux_dir = ICONS_DIR / "linux"
    linux_dir.mkdir(parents=True, exist_ok=True)
    
    for size in LINUX_SIZES:
        img = source.copy()
        img = img.resize((size, size), Image.LANCZOS)
        out_path = linux_dir / f"{size}x{size}.png"
        img.save(out_path, format='PNG')
        print(f"  ✓ {size}x{size}.png")
    
    # Also copy 512x512 as main icon.png
    img_512 = source.copy()
    img_512 = img_512.resize((512, 512), Image.LANCZOS)
    img_512.save(ICONS_DIR / "icon.png", format='PNG')
    print(f"  ✓ icon.png (512x512 - main)")
    
    print("\n" + "=" * 40)
    print("✅ All icons generated successfully!")
    print(f"\nFiles in {ICONS_DIR}:")
    for f in sorted(ICONS_DIR.glob("*")):
        if f.is_file():
            print(f"  {f.name} ({f.stat().st_size // 1024} KB)")

if __name__ == "__main__":
    main()
