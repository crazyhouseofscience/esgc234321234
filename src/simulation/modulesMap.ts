import type {
  LearningModuleId,
  SimulationMetrics,
  SimulationVariables,
} from '../types/simulation';

export interface MapNodeSpec {
  id: string;
  label: string;
  chemicalForm: string;
  xPercent: number;
  yPercent: number;
  equation: string;
  summary: string;
  getReadout: (
    m: SimulationMetrics,
    v: SimulationVariables
  ) => { label: string; value: string; unit: string }[];
}

export interface MapPathwaySpec {
  id: string;
  stepNum: string;
  processName: string;
  fromLabel: string;
  toLabel: string;
  chemicalChange: string;
  explanation: string;
  svgPath: string;
  labelX: number;
  labelY: number;
  color: string;
  particleColor: string;
  bidirectional?: boolean;
  getRateNorm: (m: SimulationMetrics, v: SimulationVariables) => number;
  getRateText: (m: SimulationMetrics, v: SimulationVariables) => string;
}

export interface ModuleMapConfig {
  backdropSrc: string;
  perturbedSrc: string;
  backdropAlt: string;
  nodes: MapNodeSpec[];
  pathways: MapPathwaySpec[];
}

export const MODULE_MAP_CONFIGS: Record<LearningModuleId, ModuleMapConfig> = {
  carbon: {
    backdropSrc: '/src/assets/images/stage_carbon_cycle_1795469119911.jpg',
    perturbedSrc: '/src/assets/images/stage_carbon_perturbed_1795469841799.jpg',
    backdropAlt:
      'Carbon cycle cross-section showing forest canopy, soil humus, industrial power plant, and deep coastal ocean',
    nodes: [
      {
        id: 'c_atmosphere',
        label: 'Atmosphere',
        chemicalForm: 'CO₂ Gas Reservoir',
        xPercent: 50,
        yPercent: 10,
        equation: 'CO₂(g) | ΔT ≈ 5.35 · ln(C / C₀)',
        summary:
          'Gaseous reservoir holding carbon dioxide. Enters plants via photosynthesis, exchanges two ways with oceans, and increases from respiration and fossil fuel combustion.',
        getReadout: (m) => [
          { label: 'Atmospheric CO₂', value: m.atmosphericCO2.toFixed(1), unit: 'ppm' },
          { label: 'Net Flux', value: `${m.netCarbonFlux >= 0 ? '+' : ''}${m.netCarbonFlux.toFixed(1)}`, unit: 'GtC/yr' },
        ],
      },
      {
        id: 'c_forest',
        label: 'Plants & Forests',
        chemicalForm: 'Photosynthesis (C₆H₁₂O₆)',
        xPercent: 15,
        yPercent: 34,
        equation: '6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂',
        summary:
          'Primary producers absorb CO₂ through leaf stomata during photosynthesis, building glucose sugars, wood, and roots that feed animals.',
        getReadout: (m) => [
          { label: 'Photosynthesis', value: m.photosynthesisFlux.toFixed(1), unit: 'GtC/yr' },
          { label: 'Biomass Pool', value: m.terrestrialBiomassC.toFixed(0), unit: 'GtC' },
        ],
      },
      {
        id: 'c_animals',
        label: 'Animals (Consumers)',
        chemicalForm: 'Consumption & Respiration',
        xPercent: 38,
        yPercent: 63,
        equation: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy',
        summary:
          'Herbivores and consumers obtain carbon by eating plants (or other animals) and return CO₂ gas to the atmosphere through cellular respiration.',
        getReadout: (m) => [
          { label: 'Living Biomass', value: m.terrestrialBiomassC.toFixed(0), unit: 'GtC' },
          { label: 'Photosynthesis Feed', value: m.photosynthesisFlux.toFixed(1), unit: 'GtC/yr' },
        ],
      },
      {
        id: 'c_soil',
        label: 'Decomposers & Fossil Fuels',
        chemicalForm: 'Detritus, Humus & Coal/Oil',
        xPercent: 22,
        yPercent: 83,
        equation: 'Dead Matter → Humus + CO₂ | Deep Burial + Heat/Pressure → Coal, Oil, Gas',
        summary:
          'Bacteria, fungi, and detritus feeders (worms, insects) break down dead organisms into soil humus and CO₂. Deeply buried ancient remains compressed over millions of years under heat and pressure without oxygen form coal, oil, and natural gas.',
        getReadout: (m) => [
          { label: 'Soil Carbon Pool', value: m.soilOrganicC.toFixed(0), unit: 'GtC' },
          { label: 'Photosynthesis Sink', value: m.photosynthesisFlux.toFixed(1), unit: 'GtC/yr' },
        ],
      },
      {
        id: 'c_fossil',
        label: 'Factories (Combustion)',
        chemicalForm: 'Coal / Oil / Gas → CO₂',
        xPercent: 63,
        yPercent: 53,
        equation: 'CₓHᵧ + O₂ → CO₂(g) + H₂O + Heat',
        summary:
          'Combustion burns underground fossil fuels (coal, oil, natural gas), rapidly increasing atmospheric CO₂ concentration beyond natural uptake.',
        getReadout: (_m, v) => [
          { label: 'Fossil Emissions', value: v.fossilFuelEmissions.toFixed(1), unit: 'GtC/yr' },
          { label: 'Deforestation', value: v.deforestationRate.toFixed(0), unit: '%' },
        ],
      },
      {
        id: 'c_ocean',
        label: 'Ocean Exchange',
        chemicalForm: 'CO₂(g) ⇌ H₂CO₃ / HCO₃⁻',
        xPercent: 86,
        yPercent: 59,
        equation: 'CO₂(g) + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻',
        summary:
          'Oceans exchange CO₂ two ways with the atmosphere across the sea surface. Absorbing excess CO₂ forms carbonic acid (H₂CO₃), lowering ocean pH.',
        getReadout: (m) => [
          { label: 'Ocean Uptake', value: m.oceanCarbonUptake.toFixed(2), unit: 'GtC/yr' },
          { label: 'Ocean Surface pH', value: m.oceanPH.toFixed(3), unit: 'pH' },
        ],
      },
    ],
    pathways: [
      {
        id: 'c_photo',
        stepNum: '01',
        processName: 'Photosynthesis',
        fromLabel: 'Atmosphere',
        toLabel: 'Plants',
        chemicalChange: 'CO₂(g) → C₆H₁₂O₆',
        explanation:
          'Plants (primary producers) absorb CO₂ gas from the air and lock carbon into sugars using sunlight.',
        svgPath: 'M 435 72 Q 265 92 175 170',
        labelX: 280,
        labelY: 107,
        color: '#10b981',
        particleColor: '#6ee7b7',
        getRateNorm: (m, v) =>
          Math.max(0.15, (m.photosynthesisFlux / 120) * (0.65 + (v.reforestationEffort + v.grasslandCover) / 220)),
        getRateText: (m) => `${m.photosynthesisFlux.toFixed(0)} GtC/yr`,
      },
      {
        id: 'c_consume',
        stepNum: '02',
        processName: 'Consumption',
        fromLabel: 'Plants',
        toLabel: 'Animals',
        chemicalChange: 'Plant C → Consumer Tissue',
        explanation:
          'Carbon moves from primary producers to herbivores and other consumers when animals eat plants.',
        svgPath: 'M 178 220 Q 258 295 345 340',
        labelX: 280,
        labelY: 281,
        color: '#22c55e',
        particleColor: '#bbf7d0',
        getRateNorm: (m, v) =>
          Math.max(0.18, (m.photosynthesisFlux / 135) * (0.6 + v.grasslandCover / 180)),
        getRateText: (m) => `${m.terrestrialBiomassC.toFixed(0)} GtC pool`,
      },
      {
        id: 'c_litter',
        stepNum: '03',
        processName: 'Decomposers',
        fromLabel: 'Dead Matter',
        toLabel: 'Soil & Fossil C',
        chemicalChange: 'Biomass → Humus / Fossil Fuels',
        explanation:
          'Detritus feeders (worms) and decomposers break down dead plants/animals into soil humus; deep burial forms coal, oil, and gas.',
        svgPath: 'M 148 225 Q 158 335 192 428',
        labelX: 150,
        labelY: 348,
        color: '#84cc16',
        particleColor: '#bef264',
        getRateNorm: (_m, v) => 0.18 + (v.reforestationEffort * 0.5 + v.grasslandCover * 0.5) / 100,
        getRateText: (m) => `${m.soilOrganicC.toFixed(0)} GtC pool`,
      },
      {
        id: 'c_resp',
        stepNum: '04',
        processName: 'Respiration',
        fromLabel: 'Living & Soil',
        toLabel: 'Atmosphere',
        chemicalChange: 'Organic C → CO₂(g)',
        explanation:
          'Plant, animal, and decomposer respiration—plus wildfire and forest clearing—return CO₂ gas to the atmosphere.',
        svgPath: 'M 395 322 Q 435 195 490 92',
        labelX: 420,
        labelY: 191,
        color: '#f59e0b',
        particleColor: '#fde68a',
        getRateNorm: (_m, v) => 0.28 + (v.deforestationRate / 100) * 1.15,
        getRateText: (_m, v) => `Clearing ${v.deforestationRate}%`,
      },
      {
        id: 'c_fossil_flux',
        stepNum: '05',
        processName: 'Combustion',
        fromLabel: 'Fossil Fuels',
        toLabel: 'Atmosphere',
        chemicalChange: 'Coal/Oil/Gas → CO₂(g)',
        explanation:
          'Burning fossil fuels in factories and vehicles rapidly injects underground carbon straight into the sky as CO₂.',
        svgPath: 'M 615 262 Q 595 168 545 92',
        labelX: 620,
        labelY: 185,
        color: '#ef4444',
        particleColor: '#fca5a5',
        getRateNorm: (_m, v) => (v.fossilFuelEmissions / 14) * 1.1,
        getRateText: (_m, v) => `${v.fossilFuelEmissions.toFixed(1)} GtC/yr`,
      },
      {
        id: 'c_ocean_flux',
        stepNum: '06',
        processName: 'Ocean Exchange',
        fromLabel: 'Atmosphere',
        toLabel: 'Ocean',
        chemicalChange: 'CO₂(g) ⇌ H₂CO₃(aq)',
        explanation:
          'Two-way gas diffusion exchanges CO₂ between air and ocean water, buffering warming but lowering ocean pH.',
        svgPath: 'M 588 76 Q 765 125 848 292',
        labelX: 790,
        labelY: 140,
        color: '#0ea5e9',
        particleColor: '#7dd3fc',
        bidirectional: true,
        getRateNorm: (m, v) => Math.max(0.18, Math.abs(m.oceanCarbonUptake) / 3.2 + v.fossilFuelEmissions / 30),
        getRateText: (m) => `${m.oceanCarbonUptake.toFixed(1)} GtC/yr`,
      },
    ],
  },

  nitrogen: {
    backdropSrc: '/src/assets/images/stage_nitrogen_cycle_1795469120519.jpg',
    perturbedSrc: '/src/assets/images/stage_nitrogen_perturbed_1795469841402.jpg',
    backdropAlt:
      'Nitrogen cycle cross-section showing clear sky, legume crop field with root zone, marshy riparian wetland, and river estuary',
    nodes: [
      {
        id: 'n_atmosphere',
        label: 'Atmosphere (78% N₂)',
        chemicalForm: 'Strong Triple-Bond N₂',
        xPercent: 50,
        yPercent: 10,
        equation: '78% N₂(g) — Triple covalent bond (N≡N)',
        summary:
          'Makes up 78% of Earth’s air, yet plants and animals cannot use N₂ directly because they cannot break its strong triple covalent bond without N-fixing bacteria or lightning.',
        getReadout: (m) => [
          { label: 'Bio N₂ Fixation', value: m.nFixationFlux.toFixed(1), unit: 'MtN/yr' },
          { label: 'N₂O Emission', value: m.nitrousOxideFlux.toFixed(2), unit: 'Mt/yr' },
        ],
      },
      {
        id: 'n_legumes',
        label: 'N-Fixing Bacteria & Clover',
        chemicalForm: 'N₂ → NH₄⁺ Root Nodules',
        xPercent: 15,
        yPercent: 44,
        equation: 'N₂ + 8H⁺ + 8e⁻ → 2NH₃ + H₂ (Rhizobia + Lightning)',
        summary:
          'Nitrogen-fixing bacteria in soil and legume root nodules (plus lightning) break the N₂ bond and convert nitrogen into plant-usable ammonium (NH₄⁺).',
        getReadout: (m, v) => [
          { label: 'Cover Crop Level', value: v.legumeCoverCrops.toFixed(0), unit: '%' },
          { label: 'Bio Fixation', value: m.nFixationFlux.toFixed(1), unit: 'MtN/yr' },
        ],
      },
      {
        id: 'n_soil',
        label: 'Ammonification & Nitrification',
        chemicalForm: 'Dead Matter → NH₄⁺ → NO₃⁻',
        xPercent: 26,
        yPercent: 81,
        equation: 'Waste → NH₄⁺ (Ammonification) → NO₂⁻ → NO₃⁻ (Nitrification)',
        summary:
          'Decomposers convert dead matter and waste into ammonium (ammonification). Nitrifying soil bacteria then oxidize ammonium into nitrates (NO₃⁻).',
        getReadout: (m, v) => [
          { label: 'Soil Nitrate', value: m.soilNitrate.toFixed(1), unit: 'mg/kg' },
          { label: 'Synthetic Input', value: v.syntheticFertilizer.toFixed(0), unit: 'MtN/yr' },
        ],
      },
      {
        id: 'n_animals',
        label: 'Plants & Animals',
        chemicalForm: 'Proteins & DNA / RNA',
        xPercent: 44,
        yPercent: 46,
        equation: 'NO₃⁻ / NH₄⁺ → Plant Proteins & DNA → Herbivores (Consumption)',
        summary:
          'Plants assimilate nitrate and ammonium to build proteins (amino acids) and nucleic acids (DNA/RNA). Herbivores and animals obtain nitrogen by eating plants.',
        getReadout: (m, v) => [
          { label: 'Livestock Density', value: v.livestockDensity.toFixed(0), unit: '%' },
          { label: 'N₂O Gas Flux', value: m.nitrousOxideFlux.toFixed(2), unit: 'Mt/yr' },
        ],
      },
      {
        id: 'n_wetland',
        label: 'Riparian Wetland',
        chemicalForm: 'Denitrification (NO₃⁻ → N₂)',
        xPercent: 66,
        yPercent: 60,
        equation: '2NO₃⁻ + 10e⁻ + 12H⁺ → N₂(g) + 6H₂O',
        summary:
          'Denitrifying bacteria in waterlogged wetland soils convert excess nitrate (NO₃⁻) back into N₂ gas, completing the nitrogen cycle and protecting estuaries.',
        getReadout: (m, v) => [
          { label: 'Denitrification', value: m.denitrificationFlux.toFixed(1), unit: 'MtN/yr' },
          { label: 'Wetland Buffer', value: v.wetlandBuffer.toFixed(0), unit: '%' },
        ],
      },
      {
        id: 'n_estuary',
        label: 'Coastal Estuary',
        chemicalForm: 'Dissolved NO₃⁻ Runoff',
        xPercent: 87,
        yPercent: 52,
        equation: 'Excess NO₃⁻ → Algal Bloom → O₂ Depletion',
        summary:
          'Nitrate escaping past wetlands enters coastal bays, fueling algae overgrowth that later decomposes and strips dissolved oxygen from water.',
        getReadout: (m) => [
          { label: 'Aquatic Nitrate', value: m.aquaticNitrateLoad.toFixed(2), unit: 'mg/L' },
          { label: 'Dissolved O₂', value: m.dissolvedOxygen.toFixed(2), unit: 'mg/L' },
        ],
      },
    ],
    pathways: [
      {
        id: 'n_fix',
        stepNum: '01',
        processName: 'N₂ Fixation',
        fromLabel: 'Atmosphere N₂',
        toLabel: 'Bacteria & Legumes',
        chemicalChange: 'N₂(g) → NH₄⁺',
        explanation:
          'Root-nodule bacteria, soil microbes, and lightning break the N≡N bond into usable ammonium.',
        svgPath: 'M 435 76 Q 255 118 175 220',
        labelX: 270,
        labelY: 124,
        color: '#10b981',
        particleColor: '#6ee7b7',
        getRateNorm: (m, v) => 0.2 + (v.legumeCoverCrops / 100) * 0.95 + m.nFixationFlux / 350,
        getRateText: (m) => `${m.nFixationFlux.toFixed(0)} MtN/yr`,
      },
      {
        id: 'n_nitrify',
        stepNum: '02',
        processName: 'Ammonify & Nitrify',
        fromLabel: 'Fixers & Waste',
        toLabel: 'Soil NO₃⁻',
        chemicalChange: 'Waste → NH₄⁺ → NO₃⁻',
        explanation:
          'Decomposers form ammonium (NH₄⁺), then nitrifying bacteria convert it into nitrate (NO₃⁻) alongside synthetic fertilizer.',
        svgPath: 'M 172 280 Q 202 365 245 426',
        labelX: 160,
        labelY: 360,
        color: '#059669',
        particleColor: '#a7f3d0',
        getRateNorm: (_m, v) => 0.15 + (v.syntheticFertilizer / 155) + (v.livestockDensity / 220),
        getRateText: (m) => `${m.soilNitrate.toFixed(0)} mg/kg`,
      },
      {
        id: 'n_assim',
        stepNum: '03',
        processName: 'Assimilation & Food',
        fromLabel: 'Soil NO₃⁻',
        toLabel: 'Plants & Animals',
        chemicalChange: 'NO₃⁻ → Proteins & DNA',
        explanation:
          'Plants assimilate soil nitrate into proteins and DNA/RNA; herbivores eat plants to get nitrogen, and decomposition recycles it.',
        svgPath: 'M 295 425 Q 375 355 425 288',
        labelX: 400,
        labelY: 360,
        color: '#14b8a6',
        particleColor: '#99f6e4',
        getRateNorm: (_m, v) => 0.25 + (v.legumeCoverCrops / 160) + (v.livestockDensity / 150),
        getRateText: (_m, v) => `Livestock ${v.livestockDensity}%`,
      },
      {
        id: 'n_runoff_wetland',
        stepNum: '04',
        processName: 'Leaching & Runoff',
        fromLabel: 'Farm Soil',
        toLabel: 'Riparian Wetland',
        chemicalChange: 'Dissolved NO₃⁻ flow',
        explanation:
          'Rainwater washes soluble nitrate out of farm soils and animal waste toward riverside wetlands.',
        svgPath: 'M 332 452 Q 505 425 620 355',
        labelX: 530,
        labelY: 450,
        color: '#34d399',
        particleColor: '#d1fae5',
        getRateNorm: (m, v) => 0.15 + v.syntheticFertilizer / 170 + v.livestockDensity / 220 + m.aquaticNitrateLoad / 24,
        getRateText: (m) => `${m.aquaticNitrateLoad.toFixed(1)} mg/L`,
      },
      {
        id: 'n_denit',
        stepNum: '05',
        processName: 'Denitrification',
        fromLabel: 'Wetland',
        toLabel: 'Atmosphere N₂',
        chemicalChange: 'NO₃⁻ → N₂(g)',
        explanation:
          'Wetland bacteria convert nitrate back into N₂ gas, completing the nitrogen cycle and protecting coasts.',
        svgPath: 'M 642 308 Q 595 170 532 88',
        labelX: 620,
        labelY: 145,
        color: '#0d9488',
        particleColor: '#5eead4',
        getRateNorm: (m, v) => (v.wetlandBuffer / 100) * (0.45 + m.denitrificationFlux / 140),
        getRateText: (m) => `${m.denitrificationFlux.toFixed(0)} MtN/yr`,
      },
      {
        id: 'n_coastal',
        stepNum: '06',
        processName: 'Estuary Export',
        fromLabel: 'Wetland',
        toLabel: 'Coastal Estuary',
        chemicalChange: 'Unfiltered NO₃⁻',
        explanation:
          'Excess nitrate bypassing wetlands enters the coastal estuary, driving algal overgrowth.',
        svgPath: 'M 712 325 Q 785 305 842 292',
        labelX: 820,
        labelY: 192,
        color: '#f59e0b',
        particleColor: '#fde68a',
        getRateNorm: (m, v) =>
          Math.max(0.08, (m.aquaticNitrateLoad / 8.5) * (1.2 - (v.wetlandBuffer / 100) * 0.45)),
        getRateText: (m) => `${m.aquaticNitrateLoad.toFixed(1)} mg/L`,
      },
    ],
  },

  phosphorus: {
    backdropSrc: '/src/assets/images/stage_phosphorus_cycle_1795469121539.jpg',
    perturbedSrc: '/src/assets/images/stage_phosphorus_perturbed_1795469842737.jpg',
    backdropAlt:
      'Phosphorus cycle cross-section showing phosphate rock cliffs, terraced hillside soil, river delta, and layered seafloor sediments',
    nodes: [
      {
        id: 'p_rock',
        label: 'Phosphate Rock',
        chemicalForm: 'Main Reservoir: Ca₃(PO₄)₂',
        xPercent: 14,
        yPercent: 28,
        equation: 'Ca₃(PO₄)₂(s) + Weathering / Mining → PO₄³⁻',
        summary:
          'Earth’s main phosphorus reservoir is sedimentary rock on land and marine sediments. Rain weathering releases PO₄³⁻ slowly; mining speeds it up.',
        getReadout: (m, v) => [
          { label: 'Mining + Weathering', value: m.pWeatheringAndMiningFlux.toFixed(1), unit: 'MtP/yr' },
          { label: 'Phosphate Mining', value: v.phosphateMining.toFixed(0), unit: 'MtP/yr' },
        ],
      },
      {
        id: 'p_soil',
        label: 'Soil & Water Zone',
        chemicalForm: 'Dissolved & Clay PO₄³⁻',
        xPercent: 29,
        yPercent: 52,
        equation: 'Weathering & Decomposition → Soil PO₄³⁻(aq)',
        summary:
          'Receives dissolved phosphate from rock weathering, fertilizer, and decomposition. Clay particles bind phosphate unless bare soil erodes in rain.',
        getReadout: (m, v) => [
          { label: 'Erosion Control', value: v.erosionControl.toFixed(0), unit: '%' },
          { label: 'Runoff Flux', value: m.pRunoffFlux.toFixed(2), unit: 'MtP/yr' },
        ],
      },
      {
        id: 'p_life',
        label: 'Plants, Animals & Decomposers',
        chemicalForm: 'DNA, RNA, ATP, Membranes & Bones',
        xPercent: 60,
        yPercent: 35,
        equation: 'PO₄³⁻ → Plant Absorption → Animal Consumption → Decomposition',
        summary:
          'Plants absorb PO₄³⁻ from soil; animals eat plants or animals to build DNA, RNA, ATP energy, cell membrane phospholipids, and bones/teeth. Decomposers return waste and dead matter to soil.',
        getReadout: (m, v) => [
          { label: 'Land Clearing', value: v.deforestationRate.toFixed(0), unit: '%' },
          { label: 'Nutrient Balance', value: m.nutrientBalance.toFixed(0), unit: '%' },
        ],
      },
      {
        id: 'p_estuary',
        label: 'Coastal Delta',
        chemicalForm: 'Runoff PO₄³⁻',
        xPercent: 85,
        yPercent: 48,
        equation: 'PO₄³⁻ > 35 ug/L → Algal Bloom → O₂ Drop',
        summary:
          'Eroded soil, phosphate mining, and wastewater detergents carry dissolved PO₄³⁻ into rivers and oceans, triggering algal blooms.',
        getReadout: (m) => [
          { label: 'Reactive Phosphate', value: m.reactivePhosphate.toFixed(1), unit: 'ug/L' },
          { label: 'Algal Bloom Index', value: m.algalBloomIndex.toFixed(0), unit: '/100' },
        ],
      },
      {
        id: 'p_sediment',
        label: 'Marine Sediment',
        chemicalForm: 'Geologic Upthrust (0% Gas)',
        xPercent: 83,
        yPercent: 84,
        equation: 'Marine Sediment → Plate Tectonic Upthrust (Millions of Years)',
        summary:
          'Phosphorus has NO atmospheric gas phase. Sinking dead organisms bury P in marine sediment; only millions of years of geologic upthrust lifts it back onto land.',
        getReadout: (m) => [
          { label: 'Sediment P Pool', value: m.sedimentPhosphatePool.toFixed(0), unit: 'MtP' },
          { label: 'Dissolved O₂', value: m.dissolvedOxygen.toFixed(2), unit: 'mg/L' },
        ],
      },
    ],
    pathways: [
      {
        id: 'p_weather',
        stepNum: '01',
        processName: 'Weathering',
        fromLabel: 'Rock',
        toLabel: 'Soil & Water',
        chemicalChange: 'Ca₃(PO₄)₂ → PO₄³⁻',
        explanation:
          'Rain weathering and mining release mineral phosphate from cliffs into soil and water.',
        svgPath: 'M 178 188 Q 238 232 272 268',
        labelX: 260,
        labelY: 101,
        color: '#a855f7',
        particleColor: '#e9d5ff',
        getRateNorm: (_m, v) => 0.12 + (v.phosphateMining / 38),
        getRateText: (m) => `${m.pWeatheringAndMiningFlux.toFixed(1)} MtP/yr`,
      },
      {
        id: 'p_absorb',
        stepNum: '02',
        processName: 'Absorption & Food',
        fromLabel: 'Soil',
        toLabel: 'Plants & Animals',
        chemicalChange: 'PO₄³⁻ → DNA, ATP, Bones',
        explanation:
          'Plants absorb PO₄³⁻ through roots; animals incorporate phosphate by eating plants or other animals.',
        svgPath: 'M 335 270 Q 435 215 545 198',
        labelX: 520,
        labelY: 101,
        color: '#10b981',
        particleColor: '#6ee7b7',
        getRateNorm: (_m, v) => 0.35 + (v.erosionControl / 180) + (100 - v.deforestationRate) / 220,
        getRateText: () => 'DNA / ATP / Bones',
      },
      {
        id: 'p_decomp',
        stepNum: '03',
        processName: 'Decomposition',
        fromLabel: 'Waste & Dead',
        toLabel: 'Soil & Water',
        chemicalChange: 'Organic P → Inorganic PO₄³⁻',
        explanation:
          'When plants and animals produce waste or die, decomposers break them down and return phosphate to soil and water.',
        svgPath: 'M 555 225 Q 455 295 348 292',
        labelX: 520,
        labelY: 315,
        color: '#d946ef',
        particleColor: '#f5d0fe',
        getRateNorm: (_m, v) => 0.3 + v.deforestationRate / 220 + v.phosphateMining / 90,
        getRateText: () => 'Recycles PO₄³⁻',
      },
      {
        id: 'p_erosion',
        stepNum: '04',
        processName: 'Runoff to Ocean',
        fromLabel: 'Soil & Soap',
        toLabel: 'Coastal Delta',
        chemicalChange: 'Eroded & Dissolved PO₄³⁻',
        explanation:
          'Bare soil erosion, fertilizer, and phosphate detergents wash excess PO₄³⁻ down rivers to the ocean.',
        svgPath: 'M 348 308 Q 595 342 795 282',
        labelX: 590,
        labelY: 393,
        color: '#c084fc',
        particleColor: '#f3e8ff',
        getRateNorm: (m, v) =>
          Math.max(0.1, (m.pRunoffFlux / 11) + (v.wastewaterPhosphates / 200) + ((100 - v.erosionControl) / 180)),
        getRateText: (m) => `${m.reactivePhosphate.toFixed(0)} ug/L`,
      },
      {
        id: 'p_burial',
        stepNum: '05',
        processName: 'Marine Sediment',
        fromLabel: 'Delta',
        toLabel: 'Ocean Floor',
        chemicalChange: 'Settling → Sediment Rock',
        explanation:
          'Dead plankton and mineral phosphate sink to the ocean floor, locking phosphorus into marine sediment.',
        svgPath: 'M 845 305 Q 848 375 835 442',
        labelX: 860,
        labelY: 377,
        color: '#7c3aed',
        particleColor: '#d8b4fe',
        getRateNorm: (m) => 0.15 + m.pRunoffFlux / 12,
        getRateText: (m) => `${m.sedimentPhosphatePool.toFixed(0)} MtP`,
      },
      {
        id: 'p_uplift',
        stepNum: '06',
        processName: 'Geologic Upthrust',
        fromLabel: 'Sediment',
        toLabel: 'Land Rock',
        chemicalChange: 'Tectonic Uplift (No Gas!)',
        explanation:
          'Over millions of years, plate tectonic geologic upthrust lifts ocean-floor sediments back onto land.',
        svgPath: 'M 775 480 Q 425 512 145 195',
        labelX: 430,
        labelY: 472,
        color: '#6b21a8',
        particleColor: '#c084fc',
        getRateNorm: () => 0.14,
        getRateText: () => 'Millions of yrs',
      },
    ],
  },

  water: {
    backdropSrc: '/src/assets/images/stage_water_cycle_1795469121761.jpg',
    perturbedSrc: '/src/assets/images/stage_water_perturbed_1795469843831.jpg',
    backdropAlt:
      'Water cycle cross-section showing cumulus rain clouds, snow-capped mountains, forest, riverside town, groundwater aquifer, and ocean bay',
    nodes: [
      {
        id: 'w_clouds',
        label: 'Clouds & Vapor',
        chemicalForm: 'Sun Heat → Condensation',
        xPercent: 44,
        yPercent: 11,
        equation: 'Solar Energy → Evaporation | Gravity → Precipitation',
        summary:
          'The Sun’s energy evaporates water vapor upward from oceans and forests. As vapor cools and condenses into clouds, gravity pulls precipitation back down as rain, sleet, or snow.',
        getReadout: (m) => [
          { label: 'Precipitation', value: m.precipitationRate.toFixed(0), unit: 'mm/yr' },
          { label: 'Evaporation', value: m.evaporationFlux.toFixed(0), unit: 'mm/yr' },
        ],
      },
      {
        id: 'w_snow',
        label: 'Trees & Snowpeaks',
        chemicalForm: 'Transpiration & H₂O(s)',
        xPercent: 15,
        yPercent: 36,
        equation: 'Root Uptake → Leaf Stomata Vapor (Transpiration)',
        summary:
          'Trees and plants release water vapor directly to the atmosphere via transpiration. Precipitation levels shape which plants and animals can survive in a biome.',
        getReadout: (m, v) => [
          { label: 'Snowpack Volume', value: m.snowpackVolume.toFixed(1), unit: '%' },
          { label: 'Forest Cover', value: v.reforestationEffort.toFixed(0), unit: '%' },
        ],
      },
      {
        id: 'w_valley',
        label: 'Land & River Runoff',
        chemicalForm: 'Runoff vs. Infiltration',
        xPercent: 49,
        yPercent: 56,
        equation: 'P = Transpiration + Surface Runoff + Infiltration',
        summary:
          'Forest soil sponges absorb rain into groundwater, while paved cities force water rapidly across land as surface runoff into rivers and oceans.',
        getReadout: (m, v) => [
          { label: 'Surface Runoff', value: m.surfaceRunoff.toFixed(0), unit: 'mm/yr' },
          { label: 'Impervious Cover', value: v.imperviousSurface.toFixed(0), unit: '%' },
        ],
      },
      {
        id: 'w_aquifer',
        label: 'Groundwater Aquifer',
        chemicalForm: 'Permeable Rock Storage',
        xPercent: 36,
        yPercent: 84,
        equation: 'Aquifer = Permeable Rock/Sand/Gravel → Slow Ocean Seepage',
        summary:
          'An aquifer is an underground layer of permeable rock, sand, or gravel holding groundwater. It moves slowly through rock pores via subsurface seepage toward rivers and the ocean.',
        getReadout: (m, v) => [
          { label: 'Aquifer Capacity', value: m.groundwaterTable.toFixed(1), unit: '%' },
          { label: 'Well Pumping', value: v.groundwaterExtraction.toFixed(0), unit: '%' },
        ],
      },
      {
        id: 'w_ocean',
        label: 'Ocean (~97% of Water)',
        chemicalForm: 'Main Storage + Sun Evap',
        xPercent: 86,
        yPercent: 52,
        equation: '97% Global H₂O + Solar Energy → Evaporation',
        summary:
          'Earth’s oceans store ~97% of all water on the planet. Solar energy from the Sun drives evaporation from the ocean surface, powering the entire water cycle.',
        getReadout: (m) => [
          { label: 'Evaporation Flux', value: m.evaporationFlux.toFixed(0), unit: 'mm/yr' },
          { label: 'Infiltration Flux', value: m.infiltrationFlux.toFixed(0), unit: 'mm/yr' },
        ],
      },
    ],
    pathways: [
      {
        id: 'w_evap',
        stepNum: '01',
        processName: 'Solar Evaporation',
        fromLabel: 'Ocean',
        toLabel: 'Clouds',
        chemicalChange: 'Solar Heat + H₂O(l) → H₂O(g)',
        explanation:
          'Energy from the Sun heats ocean water (where ~97% of Earth’s water is stored), evaporating vapor into clouds.',
        svgPath: 'M 852 258 Q 785 112 515 72',
        labelX: 740,
        labelY: 140,
        color: '#38bdf8',
        particleColor: '#e0f2fe',
        getRateNorm: (m, v) => 0.35 + Math.max(0, (v.solarForcing + 1) / 4.2) * 0.7 + (m.evaporationFlux - 750) / 450,
        getRateText: (m) => `${m.evaporationFlux.toFixed(0)} mm/yr`,
      },
      {
        id: 'w_precip',
        stepNum: '02',
        processName: 'Precipitation',
        fromLabel: 'Clouds',
        toLabel: 'Land & Trees',
        chemicalChange: 'Gravity: H₂O(g) → Rain/Snow',
        explanation:
          'Gravity draws condensed water droplets and ice back to Earth as rain, sleet, or snow—shaping which plants and animals thrive.',
        svgPath: 'M 372 78 Q 248 94 182 168',
        labelX: 240,
        labelY: 107,
        color: '#0ea5e9',
        particleColor: '#bae6fd',
        getRateNorm: (m) => 0.3 + (m.precipitationRate - 700) / 550,
        getRateText: (m) => `${m.precipitationRate.toFixed(0)} mm/yr`,
      },
      {
        id: 'w_transp',
        stepNum: '03',
        processName: 'Transpiration',
        fromLabel: 'Trees',
        toLabel: 'Atmosphere',
        chemicalChange: 'Leaf Stomata → H₂O(g)',
        explanation:
          'Trees and plants pull groundwater through roots and return water vapor directly to the atmosphere through leaves.',
        svgPath: 'M 220 250 Q 325 182 415 98',
        labelX: 350,
        labelY: 197,
        color: '#2dd4bf',
        particleColor: '#99f6e4',
        getRateNorm: (m, v) => 0.2 + (m.transpirationFlux / 550) * (0.45 + v.reforestationEffort / 140),
        getRateText: (m) => `${m.transpirationFlux.toFixed(0)} mm/yr`,
      },
      {
        id: 'w_runoff',
        stepNum: '04',
        processName: 'Surface Runoff',
        fromLabel: 'Land',
        toLabel: 'Ocean',
        chemicalChange: 'Rivers & Pavement Flow',
        explanation:
          'One of two ways land water reaches the ocean: rain and snowmelt flow across rivers and paved streets straight to the sea.',
        svgPath: 'M 555 318 Q 685 322 802 302',
        labelX: 680,
        labelY: 258,
        color: '#0284c7',
        particleColor: '#7dd3fc',
        getRateNorm: (m, v) => 0.25 + (v.imperviousSurface / 100) * 0.95 + (m.surfaceRunoff - 350) / 600,
        getRateText: (m) => `${m.surfaceRunoff.toFixed(0)} mm/yr`,
      },
      {
        id: 'w_infilt',
        stepNum: '05',
        processName: 'Infiltration',
        fromLabel: 'Land Soil',
        toLabel: 'Aquifer',
        chemicalChange: 'Percolation into Rock Pores',
        explanation:
          'Forest soils allow rain to soak downward through permeable rock and sand to recharge underground aquifers.',
        svgPath: 'M 465 345 Q 422 398 386 446',
        labelX: 310,
        labelY: 388,
        color: '#0369a1',
        particleColor: '#38bdf8',
        getRateNorm: (_m, v) => Math.max(0.08, (1 - v.imperviousSurface / 105) * (0.85 + v.reforestationEffort / 200)),
        getRateText: (m) => `${m.infiltrationFlux.toFixed(0)} mm/yr`,
      },
      {
        id: 'w_seepage',
        stepNum: '06',
        processName: 'Aquifer Seepage',
        fromLabel: 'Aquifer',
        toLabel: 'Ocean',
        chemicalChange: 'Subsurface Groundwater Flow',
        explanation:
          'Second route from land to sea: water stored in an underground aquifer slowly seeps laterally through rock into the ocean.',
        svgPath: 'M 442 478 Q 665 470 832 326',
        labelX: 680,
        labelY: 461,
        color: '#0891b2',
        particleColor: '#67e8f9',
        getRateNorm: (m, v) => Math.max(0.1, (m.groundwaterTable / 100) * (1.05 - v.groundwaterExtraction / 180)),
        getRateText: (m) => `Table ${m.groundwaterTable.toFixed(0)}%`,
      },
    ],
  },

  climate: {
    backdropSrc: '/src/assets/images/biome_watershed_backdrop_1795468142106.jpg',
    perturbedSrc: '/src/assets/images/stage_climate_perturbed_1795469843438.jpg',
    backdropAlt:
      'Complete Earth watershed cross-section showing coupled atmospheric, alpine, forest, agricultural, aquifer, and coastal ocean impacts',
    nodes: [
      {
        id: 'cl_atmosphere',
        label: 'Atmosphere & Climate',
        chemicalForm: 'CO₂ + N₂O + Vapor',
        xPercent: 52,
        yPercent: 14,
        equation: 'ΔT ≈ 5.35 · ln(CO₂/C₀) + N₂O Forcing',
        summary:
          'Greenhouse gases trap outgoing heat, warming air and oceans while accelerating evaporation and snowmelt.',
        getReadout: (m) => [
          { label: 'Atmospheric CO₂', value: m.atmosphericCO2.toFixed(1), unit: 'ppm' },
          { label: 'Temp Anomaly', value: `${m.globalTempAnomaly >= 0 ? '+' : ''}${m.globalTempAnomaly.toFixed(2)}`, unit: '°C' },
        ],
      },
      {
        id: 'cl_snow',
        label: 'Alpine Snowpack',
        chemicalForm: 'Meltwater + Weathering',
        xPercent: 18,
        yPercent: 22,
        equation: 'Warming ΔT → Rapid Glacial Melt',
        summary:
          'Higher temperatures shrink alpine snowpacks, altering river seasonality and accelerating mineral runoff.',
        getReadout: (m) => [
          { label: 'Snowpack Volume', value: m.snowpackVolume.toFixed(1), unit: '%' },
          { label: 'Surface Runoff', value: m.surfaceRunoff.toFixed(0), unit: 'mm/yr' },
        ],
      },
      {
        id: 'cl_forest',
        label: 'Forest & Land Sink',
        chemicalForm: 'C Sink & Soil Anchor',
        xPercent: 30,
        yPercent: 45,
        equation: 'Intact Forest = Carbon Sink + Erosion Shield',
        summary:
          'Forests simultaneously absorb CO₂, pump moisture via transpiration, and anchor soil phosphorus.',
        getReadout: (m) => [
          { label: 'Photosynthesis', value: m.photosynthesisFlux.toFixed(1), unit: 'GtC/yr' },
          { label: 'Biomass C', value: m.terrestrialBiomassC.toFixed(0), unit: 'GtC' },
        ],
      },
      {
        id: 'cl_farmland',
        label: 'Watershed Soils',
        chemicalForm: 'N + P Nutrient Load',
        xPercent: 54,
        yPercent: 58,
        equation: 'Excess N + P + Storm Runoff → Estuary Load',
        summary:
          'Intensive fertilizer and phosphate mining combine with high runoff to flush nutrients toward the coast.',
        getReadout: (m) => [
          { label: 'Aquatic NO₃⁻', value: m.aquaticNitrateLoad.toFixed(2), unit: 'mg/L' },
          { label: 'Reactive PO₄³⁻', value: m.reactivePhosphate.toFixed(0), unit: 'ug/L' },
        ],
      },
      {
        id: 'cl_estuary',
        label: 'Coastal Ocean',
        chemicalForm: 'pH + Hypoxia Zone',
        xPercent: 84,
        yPercent: 63,
        equation: 'Warm Water + N + P → Algal Bloom → O₂ Collapse',
        summary:
          'Absorbs CO₂ (acidifying seawater) while receiving agricultural N and P runoff that sparks oxygen-depleting algal blooms.',
        getReadout: (m) => [
          { label: 'Dissolved O₂', value: m.dissolvedOxygen.toFixed(2), unit: 'mg/L' },
          { label: 'Ocean pH', value: m.oceanPH.toFixed(3), unit: 'pH' },
        ],
      },
    ],
    pathways: [
      {
        id: 'cl_warming',
        stepNum: '01',
        processName: 'Carbon Warming',
        fromLabel: 'Land & Fuels',
        toLabel: 'Atmosphere',
        chemicalChange: 'CO₂ + N₂O Heat Trap',
        explanation:
          'Fossil carbon and agricultural N₂O warm the atmosphere, driving faster hydrologic cycling.',
        svgPath: 'M 540 300 Q 575 190 532 98',
        labelX: 610,
        labelY: 185,
        color: '#ef4444',
        particleColor: '#fca5a5',
        getRateNorm: (_m, v) => (v.fossilFuelEmissions / 13) * 1.1,
        getRateText: (m) => `${m.atmosphericCO2.toFixed(0)} ppm`,
      },
      {
        id: 'cl_melt',
        stepNum: '02',
        processName: 'Snowmelt',
        fromLabel: 'Warm Air',
        toLabel: 'Snowpack',
        chemicalChange: 'ΔT → Melt & Runoff',
        explanation:
          'Rising temperatures shrink mountain snowpacks and intensify rainfall runoff across slopes.',
        svgPath: 'M 472 82 Q 305 78 206 118',
        labelX: 310,
        labelY: 79,
        color: '#0ea5e9',
        particleColor: '#bae6fd',
        getRateNorm: (m) => 0.18 + Math.max(0, m.globalTempAnomaly) / 2.2,
        getRateText: (m) => `Snow ${m.snowpackVolume.toFixed(0)}%`,
      },
      {
        id: 'cl_nutrient_flush',
        stepNum: '03',
        processName: 'Nutrient Flush',
        fromLabel: 'Soils',
        toLabel: 'Estuary',
        chemicalChange: 'NO₃⁻ + PO₄³⁻ + Warm H₂O',
        explanation:
          'Heavy runoff carries Nitrogen and Phosphorus into warmer coastal waters, fueling algal blooms.',
        svgPath: 'M 568 338 Q 705 375 815 356',
        labelX: 690,
        labelY: 427,
        color: '#a855f7',
        particleColor: '#e9d5ff',
        getRateNorm: (m, v) =>
          Math.max(0.12, (m.algalBloomIndex / 65) + (v.syntheticFertilizer / 300) + (v.phosphateMining / 80)),
        getRateText: (m) => `Bloom ${m.algalBloomIndex.toFixed(0)}/100`,
      },
      {
        id: 'cl_acid',
        stepNum: '04',
        processName: 'Acidification',
        fromLabel: 'Air CO₂',
        toLabel: 'Ocean',
        chemicalChange: 'CO₂ + H₂O → H⁺ + HCO₃⁻',
        explanation:
          'Excess atmospheric CO₂ dissolves into seawater, dropping ocean pH and stressing shell-forming life.',
        svgPath: 'M 575 86 Q 765 130 842 325',
        labelX: 800,
        labelY: 157,
        color: '#f59e0b',
        particleColor: '#fde68a',
        getRateNorm: (m, v) => Math.max(0.15, Math.abs(m.oceanCarbonUptake) / 3.2 + v.fossilFuelEmissions / 35),
        getRateText: (m) => `pH ${m.oceanPH.toFixed(2)}`,
      },
    ],
  },
};
