#!/usr/bin/env python3
"""
Generate botanical plant images using Flux.
Outputs to public/plants/{plant-id}.png
"""

import subprocess
import json
import os
from pathlib import Path

# Plant data extracted from the app
PLANTS = [
    {"id": "red-maple", "name": "Red Maple", "scientific": "Acer rubrum", "category": "tree"},
    {"id": "tulip-poplar", "name": "Tulip Poplar", "scientific": "Liriodendron tulipifera", "category": "tree"},
    {"id": "sweetgum", "name": "Sweetgum", "scientific": "Liquidambar styraciflua", "category": "tree"},
    {"id": "bald-cypress", "name": "Bald Cypress", "scientific": "Taxodium distichum", "category": "tree"},
    {"id": "river-birch", "name": "River Birch", "scientific": "Betula nigra", "category": "tree"},
    {"id": "willow-oak", "name": "Willow Oak", "scientific": "Quercus phellos", "category": "tree"},
    {"id": "green-ash", "name": "Green Ash", "scientific": "Fraxinus pennsylvanica", "category": "tree"},
    {"id": "sycamore", "name": "American Sycamore", "scientific": "Platanus occidentalis", "category": "tree"},
    {"id": "black-gum", "name": "Black Gum / Tupelo", "scientific": "Nyssa sylvatica", "category": "tree"},
    {"id": "swamp-white-oak", "name": "Swamp White Oak", "scientific": "Quercus bicolor", "category": "tree"},
    {"id": "buttonbush", "name": "Buttonbush", "scientific": "Cephalanthus occidentalis", "category": "shrub"},
    {"id": "silky-dogwood", "name": "Silky Dogwood", "scientific": "Cornus amomum", "category": "shrub"},
    {"id": "spicebush", "name": "Spicebush", "scientific": "Lindera benzoin", "category": "shrub"},
    {"id": "elderberry", "name": "American Elderberry", "scientific": "Sambucus nigra ssp. canadensis", "category": "shrub"},
    {"id": "highbush-blueberry", "name": "Highbush Blueberry", "scientific": "Vaccinium corymbosum", "category": "shrub"},
    {"id": "winterberry", "name": "Winterberry Holly", "scientific": "Ilex verticillata", "category": "shrub"},
    {"id": "swamp-rose", "name": "Swamp Rose", "scientific": "Rosa palustris", "category": "shrub"},
    {"id": "cardinal-flower", "name": "Cardinal Flower", "scientific": "Lobelia cardinalis", "category": "herb"},
    {"id": "blue-flag-iris", "name": "Blue Flag Iris", "scientific": "Iris versicolor", "category": "herb"},
    {"id": "joe-pye-weed", "name": "Joe-Pye Weed", "scientific": "Eutrochium purpureum", "category": "herb"},
    {"id": "boneset", "name": "Boneset", "scientific": "Eupatorium perfoliatum", "category": "herb"},
    {"id": "swamp-milkweed", "name": "Swamp Milkweed", "scientific": "Asclepias incarnata", "category": "herb"},
    {"id": "skunk-cabbage", "name": "Skunk Cabbage", "scientific": "Symplocarpus foetidus", "category": "herb"},
    {"id": "pickerelweed", "name": "Pickerelweed", "scientific": "Pontederia cordata", "category": "herb"},
    {"id": "arrow-arum", "name": "Arrow Arum", "scientific": "Peltandra virginica", "category": "herb"},
    {"id": "lizards-tail", "name": "Lizard's Tail", "scientific": "Saururus cernuus", "category": "herb"},
    {"id": "jewelweed", "name": "Jewelweed / Touch-me-not", "scientific": "Impatiens capensis", "category": "herb"},
    {"id": "soft-rush", "name": "Soft Rush", "scientific": "Juncus effusus", "category": "grass"},
    {"id": "woolgrass", "name": "Woolgrass", "scientific": "Scirpus cyperinus", "category": "grass"},
    {"id": "switchgrass", "name": "Switchgrass", "scientific": "Panicum virgatum", "category": "grass"},
    {"id": "sedge-carex", "name": "Tussock Sedge", "scientific": "Carex stricta", "category": "grass"},
    {"id": "cinnamon-fern", "name": "Cinnamon Fern", "scientific": "Osmundastrum cinnamomeum", "category": "fern"},
    {"id": "royal-fern", "name": "Royal Fern", "scientific": "Osmunda regalis", "category": "fern"},
    {"id": "sensitive-fern", "name": "Sensitive Fern", "scientific": "Onoclea sensibilis", "category": "fern"},
    {"id": "virginia-creeper", "name": "Virginia Creeper", "scientific": "Parthenocissus quinquefolia", "category": "vine"},
    {"id": "trumpet-creeper", "name": "Trumpet Creeper", "scientific": "Campsis radicans", "category": "vine"},
]

def get_prompt(plant):
    """Generate a good prompt for botanical illustration."""
    category_details = {
        "tree": "full tree with trunk, branches, and characteristic leaves",
        "shrub": "shrub showing stems, leaves, and any flowers or berries",
        "herb": "flowering plant with leaves, stems, and distinctive flowers",
        "grass": "grass or sedge showing stems, leaves, and seed heads",
        "fern": "fern showing fronds and characteristic leaf pattern",
        "vine": "climbing vine with leaves, tendrils, and any flowers",
    }
    
    detail = category_details.get(plant["category"], "plant")
    
    return (
        f"Botanical illustration of {plant['name']} ({plant['scientific']}), "
        f"{detail}, scientific field guide style, detailed realistic drawing, "
        f"white background, natural colors, high detail, educational illustration, "
        f"clean professional botanical art"
    )

def generate_image(plant, output_dir):
    """Generate a single plant image using mflux."""
    output_path = output_dir / f"{plant['id']}.png"
    
    if output_path.exists():
        print(f"  Skipping {plant['id']} (already exists)")
        return True
    
    prompt = get_prompt(plant)
    print(f"  Generating: {plant['name']}...")
    
    try:
        result = subprocess.run(
            [
                "mflux-generate",
                "--model", "schnell",
                "--prompt", prompt,
                "--width", "512",
                "--height", "512",
                "--steps", "4",
                "--seed", str(hash(plant["id"]) % 2**31),
                "--output", str(output_path),
            ],
            capture_output=True,
            text=True,
            timeout=120,
        )
        
        if result.returncode == 0 and output_path.exists():
            print(f"  ✓ {plant['name']}")
            return True
        else:
            print(f"  ✗ {plant['name']}: {result.stderr[:200]}")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"  ✗ {plant['name']}: Timeout")
        return False
    except Exception as e:
        print(f"  ✗ {plant['name']}: {e}")
        return False

def main():
    script_dir = Path(__file__).parent.parent
    output_dir = script_dir / "public" / "plants"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Generating {len(PLANTS)} plant images to {output_dir}")
    print("-" * 50)
    
    success = 0
    for i, plant in enumerate(PLANTS, 1):
        print(f"[{i}/{len(PLANTS)}] {plant['name']}")
        if generate_image(plant, output_dir):
            success += 1
    
    print("-" * 50)
    print(f"Done! {success}/{len(PLANTS)} images generated")
    
    # Update the mapping file
    mapping = {p["id"]: f"/plants/{p['id']}.png" for p in PLANTS}
    mapping_path = output_dir.parent / "plant-images.json"
    with open(mapping_path, "w") as f:
        json.dump(mapping, f, indent=2)
    print(f"Image mapping saved to {mapping_path}")

if __name__ == "__main__":
    main()
