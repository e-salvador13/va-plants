export interface Plant {
  id: string;
  commonName: string;
  scientificName: string;
  wetlandStatus: 'OBL' | 'FACW' | 'FAC' | 'FACU' | 'UPL' | 'NI';
  category: 'tree' | 'shrub' | 'herb' | 'vine' | 'grass' | 'fern';
  native: boolean;
  description: string;
  habitat: string;
  imageUrl: string;
  funFact?: string;
}

// Wetland Indicator Status:
// OBL = Obligate Wetland (>99% in wetlands)
// FACW = Facultative Wetland (67-99% in wetlands)
// FAC = Facultative (34-66% in wetlands)
// FACU = Facultative Upland (1-33% in wetlands)
// UPL = Upland (<1% in wetlands)
// NI = No Indicator status

export const plants: Plant[] = [
  // TREES
  {
    id: 'red-maple',
    commonName: 'Red Maple',
    scientificName: 'Acer rubrum',
    wetlandStatus: 'FAC',
    category: 'tree',
    native: true,
    description: 'Medium to large tree with opposite, 3-5 lobed leaves. Red flowers in early spring, red samaras.',
    habitat: 'Swamps, floodplains, upland forests - very adaptable',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Acer_rubrum_001.jpg/440px-Acer_rubrum_001.jpg',
    funFact: 'Most common tree in eastern North America'
  },
  {
    id: 'tulip-poplar',
    commonName: 'Tulip Poplar',
    scientificName: 'Liriodendron tulipifera',
    wetlandStatus: 'FACU',
    category: 'tree',
    native: true,
    description: 'Tall tree with distinctive 4-lobed leaves that look like tulips. Yellow-green flowers.',
    habitat: 'Rich, moist upland forests',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Liriodendron_tulipifera_%28Tulip_Tree%29.jpg/440px-Liriodendron_tulipifera_%28Tulip_Tree%29.jpg',
    funFact: 'State tree of Virginia, can grow over 150 feet tall'
  },
  {
    id: 'sweetgum',
    commonName: 'Sweetgum',
    scientificName: 'Liquidambar styraciflua',
    wetlandStatus: 'FAC',
    category: 'tree',
    native: true,
    description: 'Star-shaped 5-7 lobed leaves, spiky ball fruits. Brilliant fall colors.',
    habitat: 'Bottomlands, moist woods, old fields',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Sweetgum_leaf.jpg/440px-Sweetgum_leaf.jpg',
    funFact: 'The resin was used as chewing gum by Native Americans'
  },
  {
    id: 'bald-cypress',
    commonName: 'Bald Cypress',
    scientificName: 'Taxodium distichum',
    wetlandStatus: 'OBL',
    category: 'tree',
    native: true,
    description: 'Deciduous conifer with feathery needles. Forms "knees" in wet areas. Buttressed trunk.',
    habitat: 'Swamps, floodplains, along streams',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Taxodium_distichum_NRCS-1.jpg/440px-Taxodium_distichum_NRCS-1.jpg',
    funFact: 'Can live over 1,000 years and tolerates standing water'
  },
  {
    id: 'river-birch',
    commonName: 'River Birch',
    scientificName: 'Betula nigra',
    wetlandStatus: 'FACW',
    category: 'tree',
    native: true,
    description: 'Multi-stemmed tree with distinctive peeling, salmon-pink to reddish-brown bark.',
    habitat: 'Streambanks, floodplains, wet areas',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Betula_nigra_bark.jpg/440px-Betula_nigra_bark.jpg',
    funFact: 'Most heat-tolerant of all birches'
  },
  {
    id: 'willow-oak',
    commonName: 'Willow Oak',
    scientificName: 'Quercus phellos',
    wetlandStatus: 'FACW',
    category: 'tree',
    native: true,
    description: 'Oak with narrow, willow-like unlobed leaves. Small acorns.',
    habitat: 'Bottomlands, floodplains, poorly drained areas',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Quercus_phellos.jpg/440px-Quercus_phellos.jpg',
    funFact: 'Popular street tree due to its graceful form'
  },
  {
    id: 'green-ash',
    commonName: 'Green Ash',
    scientificName: 'Fraxinus pennsylvanica',
    wetlandStatus: 'FACW',
    category: 'tree',
    native: true,
    description: 'Compound leaves with 5-9 leaflets. Opposite branching. Winged seeds (samaras).',
    habitat: 'Floodplains, streambanks, moist lowlands',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Fraxinus_pennsylvanica.jpg/440px-Fraxinus_pennsylvanica.jpg',
    funFact: 'Threatened by emerald ash borer'
  },
  {
    id: 'sycamore',
    commonName: 'American Sycamore',
    scientificName: 'Platanus occidentalis',
    wetlandStatus: 'FACW',
    category: 'tree',
    native: true,
    description: 'Massive tree with mottled bark (white, tan, green). Large maple-like leaves.',
    habitat: 'Streambanks, floodplains, rich bottomlands',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sycamore_bark.JPG/440px-Sycamore_bark.JPG',
    funFact: 'Largest deciduous tree in North America by trunk diameter'
  },
  {
    id: 'black-gum',
    commonName: 'Black Gum / Tupelo',
    scientificName: 'Nyssa sylvatica',
    wetlandStatus: 'FAC',
    category: 'tree',
    native: true,
    description: 'Medium tree with glossy leaves that turn brilliant scarlet in fall. Blue-black drupes.',
    habitat: 'Swamps, upland forests, mixed habitats',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Nyssa_sylvatica_foliage.jpg/440px-Nyssa_sylvatica_foliage.jpg',
    funFact: 'One of the first trees to turn color in fall'
  },
  {
    id: 'swamp-white-oak',
    commonName: 'Swamp White Oak',
    scientificName: 'Quercus bicolor',
    wetlandStatus: 'FACW',
    category: 'tree',
    native: true,
    description: 'Oak with two-toned leaves (dark green above, whitish below). Peeling bark on branches.',
    habitat: 'Swamps, floodplains, wet bottomlands',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Quercus_bicolor.jpg/440px-Quercus_bicolor.jpg',
    funFact: 'Acorns are sweet and important wildlife food'
  },
  
  // SHRUBS
  {
    id: 'buttonbush',
    commonName: 'Buttonbush',
    scientificName: 'Cephalanthus occidentalis',
    wetlandStatus: 'OBL',
    category: 'shrub',
    native: true,
    description: 'Shrub with spherical white flower heads like pin cushions. Opposite or whorled leaves.',
    habitat: 'Swamps, pond edges, stream margins',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Cephalanthus_occidentalis_flowers.jpg/440px-Cephalanthus_occidentalis_flowers.jpg',
    funFact: 'Important nectar source for butterflies and bees'
  },
  {
    id: 'silky-dogwood',
    commonName: 'Silky Dogwood',
    scientificName: 'Cornus amomum',
    wetlandStatus: 'FACW',
    category: 'shrub',
    native: true,
    description: 'Multi-stemmed shrub with opposite leaves, flat-topped white flower clusters, blue berries.',
    habitat: 'Wet thickets, stream edges, swamp margins',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Cornus_amomum.jpg/440px-Cornus_amomum.jpg',
    funFact: 'Berries are important food for migrating birds'
  },
  {
    id: 'spicebush',
    commonName: 'Spicebush',
    scientificName: 'Lindera benzoin',
    wetlandStatus: 'FACW',
    category: 'shrub',
    native: true,
    description: 'Aromatic shrub with yellow flowers before leaves. Red berries. Crushed leaves smell spicy.',
    habitat: 'Rich moist woods, stream edges, bottomlands',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Lindera_benzoin_flowers.jpg/440px-Lindera_benzoin_flowers.jpg',
    funFact: 'Host plant for Spicebush Swallowtail butterfly'
  },
  {
    id: 'elderberry',
    commonName: 'American Elderberry',
    scientificName: 'Sambucus nigra ssp. canadensis',
    wetlandStatus: 'FACW',
    category: 'shrub',
    native: true,
    description: 'Large shrub with compound leaves, flat-topped white flower clusters, purple-black berries.',
    habitat: 'Moist woods, roadsides, stream edges',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Sambucus_nigra_ssp._canadensis.jpg/440px-Sambucus_nigra_ssp._canadensis.jpg',
    funFact: 'Berries used to make wine, jam, and syrup'
  },
  {
    id: 'highbush-blueberry',
    commonName: 'Highbush Blueberry',
    scientificName: 'Vaccinium corymbosum',
    wetlandStatus: 'FACW',
    category: 'shrub',
    native: true,
    description: 'Shrub with small white bell-shaped flowers and delicious blue berries.',
    habitat: 'Swamps, bogs, moist acidic woods',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Vaccinium_corymbosum_flowers.jpg/440px-Vaccinium_corymbosum_flowers.jpg',
    funFact: 'Parent species of most cultivated blueberries'
  },
  {
    id: 'winterberry',
    commonName: 'Winterberry Holly',
    scientificName: 'Ilex verticillata',
    wetlandStatus: 'FACW',
    category: 'shrub',
    native: true,
    description: 'Deciduous holly with bright red berries that persist through winter on bare stems.',
    habitat: 'Swamps, wet woods, pond margins',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Ilex_verticillata_berries.jpg/440px-Ilex_verticillata_berries.jpg',
    funFact: 'Important winter food for birds when other berries are gone'
  },
  {
    id: 'swamp-rose',
    commonName: 'Swamp Rose',
    scientificName: 'Rosa palustris',
    wetlandStatus: 'OBL',
    category: 'shrub',
    native: true,
    description: 'Thorny shrub with pink 5-petaled flowers. Compound leaves with 5-7 leaflets.',
    habitat: 'Swamps, marshes, wet meadows',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Rosa_palustris.jpg/440px-Rosa_palustris.jpg',
    funFact: 'Rose hips are high in Vitamin C'
  },
  
  // HERBS & WILDFLOWERS
  {
    id: 'cardinal-flower',
    commonName: 'Cardinal Flower',
    scientificName: 'Lobelia cardinalis',
    wetlandStatus: 'FACW',
    category: 'herb',
    native: true,
    description: 'Brilliant red tubular flowers on tall spikes. Attracts hummingbirds.',
    habitat: 'Streambanks, wet meadows, swamp edges',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Lobelia_cardinalis.jpg/440px-Lobelia_cardinalis.jpg',
    funFact: 'Named for the red robes of Roman Catholic cardinals'
  },
  {
    id: 'blue-flag-iris',
    commonName: 'Blue Flag Iris',
    scientificName: 'Iris versicolor',
    wetlandStatus: 'OBL',
    category: 'herb',
    native: true,
    description: 'Showy violet-blue flowers with yellow markings. Sword-shaped leaves.',
    habitat: 'Marshes, wet meadows, pond edges',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Iris_versicolor_3.jpg/440px-Iris_versicolor_3.jpg',
    funFact: 'Fleur-de-lis symbol may be based on this iris'
  },
  {
    id: 'joe-pye-weed',
    commonName: 'Joe-Pye Weed',
    scientificName: 'Eutrochium purpureum',
    wetlandStatus: 'FAC',
    category: 'herb',
    native: true,
    description: 'Tall plant with whorled leaves and large domed clusters of pink-purple flowers.',
    habitat: 'Moist meadows, stream edges, open woods',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Eupatorium_purpureum.jpg/440px-Eupatorium_purpureum.jpg',
    funFact: 'Named after a Native American healer who used it medicinally'
  },
  {
    id: 'boneset',
    commonName: 'Boneset',
    scientificName: 'Eupatorium perfoliatum',
    wetlandStatus: 'FACW',
    category: 'herb',
    native: true,
    description: 'Distinctive perfoliate leaves (stem appears to pierce the leaf). White flower clusters.',
    habitat: 'Wet meadows, marshes, stream edges',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Eupatorium_perfoliatum.jpg/440px-Eupatorium_perfoliatum.jpg',
    funFact: 'Used historically to treat "breakbone fever" (dengue)'
  },
  {
    id: 'swamp-milkweed',
    commonName: 'Swamp Milkweed',
    scientificName: 'Asclepias incarnata',
    wetlandStatus: 'OBL',
    category: 'herb',
    native: true,
    description: 'Pink to mauve flower clusters. Narrow opposite leaves. Milky sap.',
    habitat: 'Marshes, wet meadows, stream edges',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Asclepias_incarnata.jpg/440px-Asclepias_incarnata.jpg',
    funFact: 'Critical host plant for Monarch butterflies'
  },
  {
    id: 'skunk-cabbage',
    commonName: 'Skunk Cabbage',
    scientificName: 'Symplocarpus foetidus',
    wetlandStatus: 'OBL',
    category: 'herb',
    native: true,
    description: 'One of earliest spring flowers. Purple-brown hooded spathe. Large cabbage-like leaves.',
    habitat: 'Swamps, seeps, wet woods',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Eastern_skunk_cabbage.jpg/440px-Eastern_skunk_cabbage.jpg',
    funFact: 'Generates heat to melt through snow in early spring'
  },
  {
    id: 'pickerelweed',
    commonName: 'Pickerelweed',
    scientificName: 'Pontederia cordata',
    wetlandStatus: 'OBL',
    category: 'herb',
    native: true,
    description: 'Emergent aquatic with heart-shaped leaves and spikes of blue-violet flowers.',
    habitat: 'Pond margins, marshes, slow streams',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Pontederia_cordata.jpg/440px-Pontederia_cordata.jpg',
    funFact: 'Named because it grows where pickerel fish live'
  },
  {
    id: 'arrow-arum',
    commonName: 'Arrow Arum',
    scientificName: 'Peltandra virginica',
    wetlandStatus: 'OBL',
    category: 'herb',
    native: true,
    description: 'Arrow-shaped leaves. Green spathe with hidden spadix. Green berries.',
    habitat: 'Swamps, marshes, pond edges',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Peltandra_virginica.jpg/440px-Peltandra_virginica.jpg',
    funFact: 'Related to Jack-in-the-pulpit but prefers wetter habitats'
  },
  {
    id: 'lizards-tail',
    commonName: "Lizard's Tail",
    scientificName: 'Saururus cernuus',
    wetlandStatus: 'OBL',
    category: 'herb',
    native: true,
    description: 'Heart-shaped leaves. Nodding white flower spikes that curve like a lizard tail.',
    habitat: 'Swamps, shallow water, stream margins',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Saururus_cernuus.jpg/440px-Saururus_cernuus.jpg',
    funFact: 'Often forms dense colonies in shallow water'
  },
  {
    id: 'jewelweed',
    commonName: 'Jewelweed / Touch-me-not',
    scientificName: 'Impatiens capensis',
    wetlandStatus: 'FACW',
    category: 'herb',
    native: true,
    description: 'Orange spotted flowers. Succulent stems. Seed pods explode when touched.',
    habitat: 'Moist woods, stream edges, shaded wetlands',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Impatiens_capensis.jpg/440px-Impatiens_capensis.jpg',
    funFact: 'Juice from stems is a traditional remedy for poison ivy'
  },
  
  // GRASSES & SEDGES
  {
    id: 'soft-rush',
    commonName: 'Soft Rush',
    scientificName: 'Juncus effusus',
    wetlandStatus: 'FACW',
    category: 'grass',
    native: true,
    description: 'Round, smooth stems in dense clumps. Flowers appear to emerge from side of stem.',
    habitat: 'Marshes, wet meadows, pond margins',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Juncus_effusus.jpg/440px-Juncus_effusus.jpg',
    funFact: 'Stems were historically used to make rush lights (candles)'
  },
  {
    id: 'woolgrass',
    commonName: 'Woolgrass',
    scientificName: 'Scirpus cyperinus',
    wetlandStatus: 'OBL',
    category: 'grass',
    native: true,
    description: 'Tall sedge with woolly, reddish-brown drooping flower clusters.',
    habitat: 'Marshes, wet meadows, swamp edges',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Scirpus_cyperinus.jpg/440px-Scirpus_cyperinus.jpg',
    funFact: 'Important for wetland restoration projects'
  },
  {
    id: 'switchgrass',
    commonName: 'Switchgrass',
    scientificName: 'Panicum virgatum',
    wetlandStatus: 'FAC',
    category: 'grass',
    native: true,
    description: 'Tall warm-season grass with airy panicle seed heads. Blue-green to yellow in fall.',
    habitat: 'Prairies, open woods, moist to dry areas',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Panicum_virgatum.jpg/440px-Panicum_virgatum.jpg',
    funFact: 'Being studied as a biofuel crop'
  },
  {
    id: 'sedge-carex',
    commonName: 'Tussock Sedge',
    scientificName: 'Carex stricta',
    wetlandStatus: 'OBL',
    category: 'grass',
    native: true,
    description: 'Forms large tussocks (raised mounds). Triangular stems. "Sedges have edges."',
    habitat: 'Marshes, wet meadows, swamps',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Carex_stricta.jpg/440px-Carex_stricta.jpg',
    funFact: 'Tussocks provide nesting habitat for birds'
  },
  
  // FERNS
  {
    id: 'cinnamon-fern',
    commonName: 'Cinnamon Fern',
    scientificName: 'Osmundastrum cinnamomeum',
    wetlandStatus: 'FACW',
    category: 'fern',
    native: true,
    description: 'Large fern with separate cinnamon-colored fertile fronds in center.',
    habitat: 'Swamps, bogs, moist woods',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Osmunda_cinnamomea.jpg/440px-Osmunda_cinnamomea.jpg',
    funFact: 'Fiddleheads are edible in early spring'
  },
  {
    id: 'royal-fern',
    commonName: 'Royal Fern',
    scientificName: 'Osmunda regalis',
    wetlandStatus: 'OBL',
    category: 'fern',
    native: true,
    description: 'Large fern with widely-spaced leaflets giving an airy look. Fertile fronds at tip.',
    habitat: 'Swamps, stream edges, wet woods',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Osmunda_regalis.jpg/440px-Osmunda_regalis.jpg',
    funFact: 'One of the largest ferns, can reach 6 feet tall'
  },
  {
    id: 'sensitive-fern',
    commonName: 'Sensitive Fern',
    scientificName: 'Onoclea sensibilis',
    wetlandStatus: 'FACW',
    category: 'fern',
    native: true,
    description: 'Distinctive wavy-edged pinnae. Separate fertile fronds look like beaded sticks.',
    habitat: 'Wet woods, swamps, stream edges',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Onoclea_sensibilis.jpg/440px-Onoclea_sensibilis.jpg',
    funFact: 'Called "sensitive" because it dies back at first frost'
  },
  
  // VINES
  {
    id: 'virginia-creeper',
    commonName: 'Virginia Creeper',
    scientificName: 'Parthenocissus quinquefolia',
    wetlandStatus: 'FACU',
    category: 'vine',
    native: true,
    description: 'Vine with 5 leaflets (NOT poison ivy which has 3). Brilliant red fall color.',
    habitat: 'Woods, fencerows, varied habitats',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Parthenocissus_quinquefolia.jpg/440px-Parthenocissus_quinquefolia.jpg',
    funFact: 'Berries are toxic to humans but loved by birds'
  },
  {
    id: 'trumpet-creeper',
    commonName: 'Trumpet Creeper',
    scientificName: 'Campsis radicans',
    wetlandStatus: 'FAC',
    category: 'vine',
    native: true,
    description: 'Woody vine with large orange-red trumpet-shaped flowers. Attracts hummingbirds.',
    habitat: 'Fencerows, forest edges, disturbed areas',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Campsis_radicans.jpg/440px-Campsis_radicans.jpg',
    funFact: 'Can become aggressive and damage structures'
  },
];

export const wetlandStatusDescriptions: Record<string, string> = {
  'OBL': 'Obligate Wetland - Almost always occurs in wetlands (>99%)',
  'FACW': 'Facultative Wetland - Usually occurs in wetlands (67-99%)',
  'FAC': 'Facultative - Equally likely in wetlands or non-wetlands (34-66%)',
  'FACU': 'Facultative Upland - Usually occurs in non-wetlands (1-33%)',
  'UPL': 'Upland - Almost never occurs in wetlands (<1%)',
  'NI': 'No Indicator - Insufficient data to determine status',
};

export const categories = [
  { id: 'all', name: 'All Plants', emoji: '🌿' },
  { id: 'tree', name: 'Trees', emoji: '🌳' },
  { id: 'shrub', name: 'Shrubs', emoji: '🌲' },
  { id: 'herb', name: 'Herbs & Wildflowers', emoji: '🌸' },
  { id: 'grass', name: 'Grasses & Sedges', emoji: '🌾' },
  { id: 'fern', name: 'Ferns', emoji: '🌿' },
  { id: 'vine', name: 'Vines', emoji: '🍇' },
];
