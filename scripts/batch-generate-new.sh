#!/bin/bash
# Generate images for newly added plants
# Run in background: nohup ./scripts/batch-generate-new.sh > flux-new.log 2>&1 &

set -e
cd "$(dirname "$0")/.."

export PATH="/usr/sbin:/usr/bin:/bin:/sbin:$PATH"

# New plants that need images
PLANTS=(
    "silver-maple:Silver Maple tree, Acer saccharinum, deeply lobed leaves with silvery undersides"
    "boxelder:Boxelder tree, Acer negundo, compound leaves with 3-5 leaflets"
    "atlantic-white-cedar:Atlantic White Cedar, Chamaecyparis thyoides, evergreen conifer with scale-like leaves"
    "swamp-tupelo:Swamp Tupelo tree, Nyssa biflora, swamp tree with swollen base"
    "water-oak:Water Oak tree, Quercus nigra, spatula-shaped leaves"
    "overcup-oak:Overcup Oak tree, Quercus lyrata, acorn almost covered by cup"
    "pin-oak:Pin Oak tree, Quercus palustris, deeply cut leaves, drooping branches"
    "cherrybark-oak:Cherrybark Oak tree, Quercus pagoda, pagoda-shaped leaf lobes"
    "sweetbay-magnolia:Sweetbay Magnolia, Magnolia virginiana, white fragrant flowers, silvery leaf undersides"
    "pawpaw:Pawpaw tree, Asimina triloba, large tropical-looking leaves, purple flowers"
    "persimmon:American Persimmon tree, Diospyros virginiana, blocky bark, orange fruit"
    "american-elm:American Elm tree, Ulmus americana, vase-shaped crown"
    "water-hickory:Water Hickory tree, Carya aquatica, many narrow leaflets"
    "virginia-willow:Virginia Willow shrub, Itea virginica, white flower racemes"
    "sweet-pepperbush:Sweet Pepperbush shrub, Clethra alnifolia, fragrant white flower spikes"
    "inkberry:Inkberry holly shrub, Ilex glabra, evergreen with black berries"
    "swamp-azalea:Swamp Azalea, Rhododendron viscosum, fragrant white to pink flowers"
    "common-ninebark:Common Ninebark shrub, Physocarpus opulifolius, exfoliating bark"
    "southern-arrowwood:Southern Arrowwood shrub, Viburnum dentatum, white flower clusters, blue berries"
    "possumhaw:Possumhaw shrub, Viburnum nudum, berries changing pink to blue to black"
    "wax-myrtle:Wax Myrtle shrub, Morella cerifera, aromatic evergreen, waxy blue berries"
    "american-hazelnut:American Hazelnut shrub, Corylus americana, edible nuts in leafy husk"
    "black-chokeberry:Black Chokeberry shrub, Aronia melanocarpa, white flowers, black berries"
    "marsh-marigold:Marsh Marigold, Caltha palustris, bright yellow spring flowers"
    "great-blue-lobelia:Great Blue Lobelia, Lobelia siphilitica, tall blue flower spikes"
    "blue-vervain:Blue Vervain, Verbena hastata, branching blue flower spikes"
    "new-york-ironweed:New York Ironweed, Vernonia noveboracensis, deep purple flower clusters"
    "common-arrowhead:Common Arrowhead, Sagittaria latifolia, arrow-shaped leaves, white flowers"
    "water-plantain:Water Plantain, Alisma subcordatum, oval aquatic leaves, tiny white flowers"
    "golden-ragwort:Golden Ragwort, Packera aurea, yellow daisy flowers, heart-shaped leaves"
    "turtlehead:White Turtlehead, Chelone glabra, white turtle-head shaped flowers"
    "common-cattail:Common Cattail, Typha latifolia, brown cylindrical seed heads"
    "spotted-joe-pye-weed:Spotted Joe-Pye Weed, Eutrochium maculatum, purple-spotted stems, pink flowers"
    "meadow-beauty:Virginia Meadow Beauty, Rhexia virginica, bright pink 4-petaled flowers"
    "wild-rice:Wild Rice grass, Zizania aquatica, tall aquatic grass, drooping seed heads"
    "rice-cutgrass:Rice Cutgrass, Leersia oryzoides, grass with sharp leaf edges"
    "blue-joint-grass:Blue-joint Grass, Calamagrostis canadensis, purplish feathery seed heads"
    "fowl-mannagrass:Fowl Mannagrass, Glyceria striata, open drooping grass panicles"
    "dark-green-bulrush:Dark Green Bulrush, Scirpus atrovirens, dark sedge with drooping flowers"
    "river-bulrush:River Bulrush, Bolboschoenus fluviatilis, robust sedge"
    "common-rush:Common Rush, Juncus effusus, round green stems in tufts"
    "path-rush:Path Rush, Juncus tenuis, small tufted rush"
    "netted-chain-fern:Netted Chain Fern, Woodwardia areolata, chain-like sori pattern"
    "virginia-chain-fern:Virginia Chain Fern, Woodwardia virginica, large fern with chain sori"
    "marsh-fern:Marsh Fern, Thelypteris palustris, delicate fern with pointed pinnae"
    "new-york-fern:New York Fern, Thelypteris noveboracensis, fronds taper at both ends"
    "lady-fern:Lady Fern, Athyrium filix-femina, delicate lacy fronds"
    "climbing-hydrangea:Climbing Hydrangea vine, Decumaria barbara, white flower clusters"
    "crossvine:Crossvine, Bignonia capreolata, red-orange trumpet flowers"
    "common-greenbrier:Common Greenbrier vine, Smilax rotundifolia, thorny with round leaves"
    "muscadine-grape:Muscadine Grape vine, Vitis rotundifolia, thick-skinned grape"
    "poison-ivy:Poison Ivy, Toxicodendron radicans, 3 leaflets, white berries"
)

mkdir -p public/plants

echo "Starting batch generation of ${#PLANTS[@]} NEW plant images..."
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
echo "Total images in directory:"
ls public/plants/*.png | wc -l
