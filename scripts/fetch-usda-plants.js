#!/usr/bin/env node
/**
 * Fetch Virginia native wetland plants from USDA PLANTS API
 * Outputs to app/data/plants-expanded.ts
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Common Virginia wetland plants to fetch (USDA symbols)
// These are well-known native species with wetland indicator status
const VA_WETLAND_PLANTS = [
  // Trees
  'ACRU', 'LITU', 'LIST2', 'TADI2', 'BENI', 'QUPH', 'FRPE', 'PLOC', 'NYSY', 'QUBI',
  'ACNE2', 'ACSA2', 'QUPA2', 'QUAL', 'QURU', 'QUVE', 'QUCO2', 'FAGR', 'CARO8', 'JUNI',
  'PITA', 'PIVI2', 'SANI', 'ULAM', 'ULRU', 'CEOC', 'DIVI5', 'MAAC', 'PODE3', 'PRSE2',
  // Shrubs
  'CEOC2', 'COAM2', 'LIBE3', 'SANIC5', 'VACO', 'ILVE', 'ROPA', 'ARAR7', 'CLAL3', 'RHTY',
  'VIRA', 'LOJA', 'ITVI', 'HAVI4', 'MYGA', 'MYRI2', 'COST4', 'PHOP', 'ALSE2', 'RHVE',
  // Herbs/Wildflowers
  'LOCA2', 'IRVE2', 'EUPU9', 'EUPE3', 'ASIN', 'SYFO', 'POCO14', 'PEVI', 'SACE', 'IMCA',
  'LOCA3', 'MIVI', 'CHGL', 'EUMA11', 'HEAU', 'RUHI2', 'CASA12', 'EUFI2', 'POLY9', 'EQHY',
  'VELA4', 'TYPHA', 'SALA2', 'ACCA2', 'IRPS', 'PELE2', 'LOOR', 'ECTE', 'HYVE', 'NULU',
  // Grasses/Sedges/Rushes
  'JUEF', 'SCCY', 'PAVI2', 'CAST8', 'CALU7', 'CAGR4', 'CACO15', 'CAVE4', 'SPCY', 'SCAM6',
  'SCPU10', 'ELQU2', 'DIAC', 'GLYG', 'LEER', 'PHAM4', 'ZIZA', 'SPPA', 'SPPE', 'ANGE',
  // Ferns
  'OSCI', 'OSRE', 'ONSE', 'ATFI', 'DRCA12', 'WOOD', 'THNO', 'THPA', 'DIPU3', 'BLSP',
  // Vines
  'PAQU2', 'CARA2', 'VIRO3', 'VIRU', 'VILA5', 'DECA7', 'SMRO', 'BISA', 'CECA4', 'MIRE'
];

function fetchPlant(symbol) {
  return new Promise((resolve, reject) => {
    const url = `https://plantsservices.sc.egov.usda.gov/api/PlantProfile?symbol=${symbol}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const plant = JSON.parse(data);
          resolve(plant);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function fetchWetlandData(symbol) {
  return new Promise((resolve, reject) => {
    const url = `https://plantsservices.sc.egov.usda.gov/api/WetlandData?symbol=${symbol}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const wetland = JSON.parse(data);
          resolve(wetland);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function cleanScientificName(name) {
  return name.replace(/<\/?i>/g, '').replace(/ L\.$/, '').replace(/ \(.*\)$/, '').trim();
}

function getCategory(habits) {
  if (!habits || !habits.length) return 'herb';
  const h = habits[0].toLowerCase();
  if (h.includes('tree')) return 'tree';
  if (h.includes('shrub')) return 'shrub';
  if (h.includes('vine')) return 'vine';
  if (h.includes('fern')) return 'fern';
  if (h.includes('grass') || h.includes('sedge') || h.includes('rush')) return 'grass';
  return 'herb';
}

function getWetlandStatus(wetlandData, symbol) {
  if (!wetlandData || !Array.isArray(wetlandData)) return 'NI';
  
  // Look for Eastern Mountain and Piedmont (EMP) or Atlantic Gulf Coastal Plain (AGCP) regions
  const empData = wetlandData.find(w => w.Region === 'EMP');
  const agcpData = wetlandData.find(w => w.Region === 'AGCP');
  const data = empData || agcpData || wetlandData[0];
  
  if (!data || !data.Indicator) return 'NI';
  return data.Indicator;
}

async function main() {
  console.log(`Fetching ${VA_WETLAND_PLANTS.length} plants from USDA...`);
  
  const plants = [];
  const errors = [];
  
  for (let i = 0; i < VA_WETLAND_PLANTS.length; i++) {
    const symbol = VA_WETLAND_PLANTS[i];
    process.stdout.write(`\r[${i + 1}/${VA_WETLAND_PLANTS.length}] Fetching ${symbol}...`);
    
    try {
      const [plantData, wetlandData] = await Promise.all([
        fetchPlant(symbol),
        fetchWetlandData(symbol)
      ]);
      
      if (!plantData || !plantData.CommonName) {
        errors.push({ symbol, error: 'No data' });
        continue;
      }
      
      // Check if native to Virginia (L48 native status)
      const isNative = plantData.NativeStatuses?.some(s => s.Region === 'L48' && s.Status === 'N');
      
      const status = getWetlandStatus(wetlandData, symbol);
      
      // Only include plants with wetland indicator status
      if (status === 'NI' || !['OBL', 'FACW', 'FAC', 'FACU', 'UPL'].includes(status)) {
        continue;
      }
      
      const plant = {
        id: plantData.CommonName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
        symbol: symbol,
        commonName: plantData.CommonName.split(',')[0].trim(),
        scientificName: cleanScientificName(plantData.ScientificName),
        wetlandStatus: status,
        category: getCategory(plantData.GrowthHabits),
        native: isNative !== false,
        description: `${plantData.GrowthHabits?.[0] || 'Plant'} species. ${plantData.Durations?.[0] || ''}.`.trim(),
        habitat: 'Virginia wetlands and adjacent areas',
      };
      
      plants.push(plant);
      
      // Small delay to be nice to the API
      await new Promise(r => setTimeout(r, 100));
      
    } catch (e) {
      errors.push({ symbol, error: e.message });
    }
  }
  
  console.log(`\n\nFetched ${plants.length} plants with wetland status`);
  console.log(`Errors: ${errors.length}`);
  
  // Sort by category then name
  plants.sort((a, b) => {
    const catOrder = ['tree', 'shrub', 'herb', 'grass', 'fern', 'vine'];
    const catDiff = catOrder.indexOf(a.category) - catOrder.indexOf(b.category);
    if (catDiff !== 0) return catDiff;
    return a.commonName.localeCompare(b.commonName);
  });
  
  // Output as JSON for now
  const outputPath = path.join(__dirname, '..', 'usda-plants.json');
  fs.writeFileSync(outputPath, JSON.stringify(plants, null, 2));
  console.log(`\nSaved to ${outputPath}`);
  
  // Also output the list of plants that need images
  const needImages = plants.filter(p => {
    const imgPath = path.join(__dirname, '..', 'public', 'plants', `${p.id}.png`);
    return !fs.existsSync(imgPath);
  });
  
  console.log(`\n${needImages.length} plants need images:`);
  needImages.forEach(p => console.log(`  - ${p.id}: ${p.commonName}`));
}

main().catch(console.error);
