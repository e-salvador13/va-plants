#!/bin/bash
# Batch generate plant images with Flux
# Run in background: nohup ./scripts/batch-generate.sh > flux.log 2>&1 &

set -e
cd "$(dirname "$0")/.."

export PATH="/usr/sbin:/usr/bin:/bin:/sbin:$PATH"

PLANTS=(
    "red-maple:Red Maple tree, Acer rubrum, red autumn leaves"
    "tulip-poplar:Tulip Poplar tree, Liriodendron tulipifera, distinctive 4-lobed leaves"
    "sweetgum:Sweetgum tree, Liquidambar styraciflua, star-shaped leaves"
    "bald-cypress:Bald Cypress tree, Taxodium distichum, feathery needles, swamp tree with knees"
    "river-birch:River Birch tree, Betula nigra, peeling salmon-pink bark"
    "willow-oak:Willow Oak tree, Quercus phellos, narrow willow-like leaves"
    "green-ash:Green Ash tree, Fraxinus pennsylvanica, compound leaves"
    "sycamore:American Sycamore tree, Platanus occidentalis, mottled white bark"
    "black-gum:Black Gum tree, Nyssa sylvatica, glossy leaves, red fall color"
    "swamp-white-oak:Swamp White Oak tree, Quercus bicolor, two-toned leaves"
    "buttonbush:Buttonbush shrub, Cephalanthus occidentalis, spherical white flower heads"
    "silky-dogwood:Silky Dogwood shrub, Cornus amomum, white flowers, blue berries"
    "spicebush:Spicebush shrub, Lindera benzoin, yellow flowers, red berries"
    "elderberry:American Elderberry shrub, Sambucus nigra, white flower clusters, purple berries"
    "highbush-blueberry:Highbush Blueberry shrub, Vaccinium corymbosum, white bell flowers, blue berries"
    "winterberry:Winterberry Holly shrub, Ilex verticillata, bright red berries on bare branches"
    "swamp-rose:Swamp Rose shrub, Rosa palustris, pink 5-petaled flowers"
    "cardinal-flower:Cardinal Flower, Lobelia cardinalis, brilliant red tubular flowers on tall spike"
    "blue-flag-iris:Blue Flag Iris, Iris versicolor, violet-blue iris flowers"
    "joe-pye-weed:Joe-Pye Weed, Eutrochium purpureum, pink-purple domed flower clusters"
    "boneset:Boneset, Eupatorium perfoliatum, white flower clusters, perfoliate leaves"
    "swamp-milkweed:Swamp Milkweed, Asclepias incarnata, pink flower clusters"
    "skunk-cabbage:Skunk Cabbage, Symplocarpus foetidus, purple-brown hooded spathe"
    "pickerelweed:Pickerelweed, Pontederia cordata, heart-shaped leaves, blue-violet flower spikes"
    "arrow-arum:Arrow Arum, Peltandra virginica, arrow-shaped leaves"
    "lizards-tail:Lizard's Tail, Saururus cernuus, white nodding flower spikes"
    "jewelweed:Jewelweed, Impatiens capensis, orange spotted flowers"
    "soft-rush:Soft Rush, Juncus effusus, round green stems in dense clumps"
    "woolgrass:Woolgrass sedge, Scirpus cyperinus, woolly reddish-brown drooping flower clusters"
    "switchgrass:Switchgrass, Panicum virgatum, tall grass with airy seed heads"
    "sedge-carex:Tussock Sedge, Carex stricta, triangular stems forming tussocks"
    "cinnamon-fern:Cinnamon Fern, Osmundastrum cinnamomeum, cinnamon-colored fertile fronds"
    "royal-fern:Royal Fern, Osmunda regalis, large fern with widely-spaced leaflets"
    "sensitive-fern:Sensitive Fern, Onoclea sensibilis, wavy-edged pinnae"
    "virginia-creeper:Virginia Creeper vine, Parthenocissus quinquefolia, 5 leaflets, red fall color"
    "trumpet-creeper:Trumpet Creeper vine, Campsis radicans, orange-red trumpet flowers"
)

mkdir -p public/plants

echo "Starting batch generation of ${#PLANTS[@]} plant images..."
echo "Started at: $(date)"
echo ""

for entry in "${PLANTS[@]}"; do
    IFS=':' read -r id desc <<< "$entry"
    output="public/plants/${id}.png"
    
    if [ -f "$output" ]; then
        echo "✓ Skipping $id (exists)"
        continue
    fi
    
    echo "→ Generating $id..."
    prompt="Botanical illustration of ${desc}, scientific field guide style, detailed realistic drawing, white background, natural colors, educational illustration, clean professional botanical art"
    
    .venv/bin/mflux-generate \
        --model schnell \
        --prompt "$prompt" \
        --width 512 \
        --height 512 \
        --steps 2 \
        --seed $((0x$(echo -n "$id" | md5sum | cut -c1-8))) \
        --output "$output" 2>&1 || echo "  ✗ Failed: $id"
    
    if [ -f "$output" ]; then
        echo "  ✓ Done: $id ($(du -h "$output" | cut -f1))"
    fi
done

echo ""
echo "Completed at: $(date)"
echo "Generated images:"
ls -la public/plants/
