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
        chemicalForm: 'CO₂ Gas',
        xPercent: 50,
        yPercent: 14,
        equation: 'CO₂(g) | ΔT ≈ 5.35 · ln(C / C₀)',
        summary:
          'Gaseous reservoir holding carbon dioxide. Receives carbon from fossil fuel burning and respiration; loses carbon to forest photosynthesis and ocean dissolution.',
        getReadout: (m) => [
          { label: 'Atmospheric CO₂', value: m.atmosphericCO2.toFixed(1), unit: 'ppm' },
          { label: 'Net Flux', value: `${m.netCarbonFlux >= 0 ? '+' : ''}${m.netCarbonFlux.toFixed(1)}`, unit: 'GtC/yr' },
        ],
      },
      {
        id: 'c_forest',
        label: 'Forest Canopy',
        chemicalForm: 'C₆H₁₂O₆ Biomass',
        xPercent: 19,
        yPercent: 39,
        equation: '6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂',
        summary:
          'Living trees absorb atmospheric CO₂ through leaf stomata during photosynthesis, converting gas into wood, leaves, and root sugars.',
        getReadout: (m) => [
          { label: 'Photosynthesis', value: m.photosynthesisFlux.toFixed(1), unit: 'GtC/yr' },
          { label: 'Biomass Pool', value: m.terrestrialBiomassC.toFixed(0), unit: 'GtC' },
        ],
      },
      {
        id: 'c_soil',
        label: 'Soil Humus',
        chemicalForm: 'Organic Carbon',
        xPercent: 23,
        yPercent: 79,
        equation: 'Dead Biomass → Soil Organic C + CO₂ (Respiration)',
        summary:
          'Fallen leaves and dead roots enter the soil food web. Microbes decompose organic matter, storing humus carbon or respiring CO₂ back to air.',
        getReadout: (m) => [
          { label: 'Soil Carbon Pool', value: m.soilOrganicC.toFixed(0), unit: 'GtC' },
          { label: 'Photosynthesis Sink', value: m.photosynthesisFlux.toFixed(1), unit: 'GtC/yr' },
        ],
      },
      {
        id: 'c_fossil',
        label: 'Fossil Combustion',
        chemicalForm: 'Coal / Oil → CO₂',
        xPercent: 51,
        yPercent: 54,
        equation: 'CₓHᵧ + O₂ → CO₂(g) + H₂O + Energy',
        summary:
          'Burning ancient coal, oil, and natural gas transfers locked geological carbon rapidly into the atmosphere as CO₂.',
        getReadout: (_m, v) => [
          { label: 'Fossil Emissions', value: v.fossilFuelEmissions.toFixed(1), unit: 'GtC/yr' },
          { label: 'Deforestation', value: v.deforestationRate.toFixed(0), unit: '%' },
        ],
      },
      {
        id: 'c_ocean',
        label: 'Surface Ocean',
        chemicalForm: 'H₂CO₃ / HCO₃⁻',
        xPercent: 84,
        yPercent: 58,
        equation: 'CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻',
        summary:
          'Oceans dissolve atmospheric CO₂ across the air-sea boundary. Higher CO₂ uptake produces carbonic acid (H⁺), lowering seawater pH.',
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
        toLabel: 'Forest Canopy',
        chemicalChange: 'CO₂(g) → Plant Sugars',
        explanation:
          'Tree leaves pull CO₂ gas from the air and lock carbon into living plant tissue using sunlight.',
        svgPath: 'M 435 90 Q 290 105 215 192',
        labelX: 300,
        labelY: 112,
        color: '#10b981',
        particleColor: '#6ee7b7',
        getRateNorm: (m) => m.photosynthesisFlux / 140,
        getRateText: (m) => `${m.photosynthesisFlux.toFixed(0)} GtC/yr`,
      },
      {
        id: 'c_litter',
        stepNum: '02',
        processName: 'Litterfall & Decay',
        fromLabel: 'Forest Canopy',
        toLabel: 'Soil Humus',
        chemicalChange: 'Biomass → Soil Organic C',
        explanation:
          'Leaves, branches, and roots transfer organic carbon downward into soil humus layers.',
        svgPath: 'M 192 252 Q 195 340 218 415',
        labelX: 120,
        labelY: 335,
        color: '#84cc16',
        particleColor: '#bef264',
        getRateNorm: (m) => m.terrestrialBiomassC / 650,
        getRateText: (m) => `${m.soilOrganicC.toFixed(0)} GtC pool`,
      },
      {
        id: 'c_resp',
        stepNum: '03',
        processName: 'Respiration & Clearing',
        fromLabel: 'Soil & Forest',
        toLabel: 'Atmosphere',
        chemicalChange: 'Organic C → CO₂(g)',
        explanation:
          'Microbial decay, plant respiration, and forest clearing return carbon back into atmospheric CO₂.',
        svgPath: 'M 255 415 Q 355 280 465 108',
        labelX: 365,
        labelY: 265,
        color: '#f59e0b',
        particleColor: '#fde68a',
        getRateNorm: (_m, v) => 0.7 + v.deforestationRate / 100,
        getRateText: (_m, v) => `Deforest ${v.deforestationRate}%`,
      },
      {
        id: 'c_fossil_flux',
        stepNum: '04',
        processName: 'Fossil Combustion',
        fromLabel: 'Power Plant',
        toLabel: 'Atmosphere',
        chemicalChange: 'Ancient C → CO₂(g)',
        explanation:
          'Burning coal and oil injects long-buried geological carbon straight into the sky.',
        svgPath: 'M 512 275 Q 528 185 508 106',
        labelX: 590,
        labelY: 190,
        color: '#ef4444',
        particleColor: '#fca5a5',
        getRateNorm: (_m, v) => (v.fossilFuelEmissions + 1) / 14,
        getRateText: (_m, v) => `${v.fossilFuelEmissions.toFixed(1)} GtC/yr`,
      },
      {
        id: 'c_ocean_flux',
        stepNum: '05',
        processName: 'Air-Sea Diffusion',
        fromLabel: 'Atmosphere',
        toLabel: 'Surface Ocean',
        chemicalChange: 'CO₂(g) → H₂CO₃(aq)',
        explanation:
          'Ocean surface waters absorb excess atmospheric CO₂, buffering climate but lowering ocean pH.',
        svgPath: 'M 568 88 Q 740 130 828 295',
        labelX: 745,
        labelY: 162,
        color: '#0ea5e9',
        particleColor: '#7dd3fc',
        getRateNorm: (m) => Math.max(0.3, Math.abs(m.oceanCarbonUptake) / 3.5),
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
        label: 'Atmosphere',
        chemicalForm: '78% N₂ Gas',
        xPercent: 50,
        yPercent: 15,
        equation: 'N₂(g) — Triple-bonded atmospheric reservoir',
        summary:
          'Makes up 78% of Earth’s air, yet plants cannot absorb N₂ directly until bacteria or industrial Haber-Bosch synthesis breaks its strong triple bond.',
        getReadout: (m) => [
          { label: 'Bio N₂ Fixation', value: m.nFixationFlux.toFixed(1), unit: 'MtN/yr' },
          { label: 'N₂O Emission', value: m.nitrousOxideFlux.toFixed(2), unit: 'Mt/yr' },
        ],
      },
      {
        id: 'n_legumes',
        label: 'Legume Crops',
        chemicalForm: 'NH₄⁺ Root Nodules',
        xPercent: 18,
        yPercent: 52,
        equation: 'N₂ + 8H⁺ + 8e⁻ → 2NH₃ + H₂ (Rhizobia)',
        summary:
          'Symbiotic Rhizobia bacteria inside clover and bean root nodules convert atmospheric N₂ gas into usable ammonium (NH₄⁺).',
        getReadout: (m, v) => [
          { label: 'Cover Crop Level', value: v.legumeCoverCrops.toFixed(0), unit: '%' },
          { label: 'Bio Fixation', value: m.nFixationFlux.toFixed(1), unit: 'MtN/yr' },
        ],
      },
      {
        id: 'n_soil',
        label: 'Soil Root Zone',
        chemicalForm: 'NH₄⁺ → NO₃⁻',
        xPercent: 28,
        yPercent: 80,
        equation: 'NH₄⁺ → NO₂⁻ → NO₃⁻ (Nitrification)',
        summary:
          'Soil bacteria oxidize ammonium into mobile nitrate (NO₃⁻). Synthetic fertilizer adds massive extra nitrate that crops cannot fully absorb.',
        getReadout: (m, v) => [
          { label: 'Soil Nitrate', value: m.soilNitrate.toFixed(1), unit: 'mg/kg' },
          { label: 'Synthetic Input', value: v.syntheticFertilizer.toFixed(0), unit: 'MtN/yr' },
        ],
      },
      {
        id: 'n_wetland',
        label: 'Riparian Wetland',
        chemicalForm: 'NO₃⁻ → N₂ Gas',
        xPercent: 64,
        yPercent: 56,
        equation: '2NO₃⁻ + 10e⁻ + 12H⁺ → N₂(g) + 6H₂O',
        summary:
          'Waterlogged anaerobic soils host denitrifying bacteria that strip oxygen from nitrate runoff and safely vent harmless N₂ gas back into the sky.',
        getReadout: (m, v) => [
          { label: 'Denitrification', value: m.denitrificationFlux.toFixed(1), unit: 'MtN/yr' },
          { label: 'Wetland Buffer', value: v.wetlandBuffer.toFixed(0), unit: '%' },
        ],
      },
      {
        id: 'n_estuary',
        label: 'Coastal Estuary',
        chemicalForm: 'Dissolved NO₃⁻',
        xPercent: 88,
        yPercent: 48,
        equation: 'Excess NO₃⁻ → Rapid Phytoplankton Growth',
        summary:
          'Nitrate escaping past wetlands enters coastal bays, fueling algae overgrowth that later decomposes and strips oxygen from water.',
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
        fromLabel: 'Atmosphere',
        toLabel: 'Legume Roots',
        chemicalChange: 'N₂(g) → NH₄⁺',
        explanation:
          'Root-nodule bacteria (and Haber-Bosch factories) split atmospheric N₂ into plant-usable ammonium.',
        svgPath: 'M 442 96 Q 275 130 190 264',
        labelX: 290,
        labelY: 145,
        color: '#10b981',
        particleColor: '#6ee7b7',
        getRateNorm: (m) => m.nFixationFlux / 90,
        getRateText: (m) => `${m.nFixationFlux.toFixed(0)} MtN/yr`,
      },
      {
        id: 'n_nitrify',
        stepNum: '02',
        processName: 'Nitrification & Fertilizer',
        fromLabel: 'Legumes & Farm',
        toLabel: 'Soil Root Zone',
        chemicalChange: 'NH₄⁺ → NO₃⁻',
        explanation:
          'Nitrifying bacteria convert ammonium into soluble nitrate (NO₃⁻), joined by synthetic fertilizer.',
        svgPath: 'M 192 325 Q 220 385 268 424',
        labelX: 158,
        labelY: 385,
        color: '#059669',
        particleColor: '#a7f3d0',
        getRateNorm: (_m, v) => 0.45 + v.syntheticFertilizer / 150,
        getRateText: (m) => `${m.soilNitrate.toFixed(0)} mg/kg`,
      },
      {
        id: 'n_runoff_wetland',
        stepNum: '03',
        processName: 'Subsurface Leaching',
        fromLabel: 'Agricultural Soil',
        toLabel: 'Riparian Wetland',
        chemicalChange: 'Dissolved NO₃⁻ flow',
        explanation:
          'Rainwater washes highly soluble nitrate out of farm soils toward riverside wetlands.',
        svgPath: 'M 338 438 Q 495 395 612 332',
        labelX: 485,
        labelY: 398,
        color: '#34d399',
        particleColor: '#d1fae5',
        getRateNorm: (m) => 0.4 + m.aquaticNitrateLoad / 10,
        getRateText: (m) => `${m.aquaticNitrateLoad.toFixed(1)} mg/L`,
      },
      {
        id: 'n_denit',
        stepNum: '04',
        processName: 'Denitrification',
        fromLabel: 'Riparian Wetland',
        toLabel: 'Atmosphere',
        chemicalChange: 'NO₃⁻ → N₂(g)',
        explanation:
          'Wetland microbes convert nitrate back into N₂ gas, cleansing water before it hits the coast.',
        svgPath: 'M 632 285 Q 590 175 526 106',
        labelX: 608,
        labelY: 184,
        color: '#0d9488',
        particleColor: '#5eead4',
        getRateNorm: (m) => m.denitrificationFlux / 110,
        getRateText: (m) => `${m.denitrificationFlux.toFixed(0)} MtN/yr`,
      },
      {
        id: 'n_coastal',
        stepNum: '05',
        processName: 'Estuary Export',
        fromLabel: 'Riparian Wetland',
        toLabel: 'Coastal Estuary',
        chemicalChange: 'Unfiltered NO₃⁻',
        explanation:
          'Whatever nitrate bypasses wetlands enters the coastal estuary, driving algal growth.',
        svgPath: 'M 692 308 Q 775 290 838 274',
        labelX: 775,
        labelY: 252,
        color: '#f59e0b',
        particleColor: '#fde68a',
        getRateNorm: (m) => m.aquaticNitrateLoad / 8,
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
        chemicalForm: 'Ca₃(PO₄)₂ Mineral',
        xPercent: 14,
        yPercent: 35,
        equation: 'Ca₃(PO₄)₂(s) + Weathering / Mining → PO₄³⁻',
        summary:
          'Earth’s primary phosphorus reservoir is locked inside sedimentary rock. Natural rain weathering releases it very slowly; industrial mining accelerates release.',
        getReadout: (m, v) => [
          { label: 'Mining + Weathering', value: m.pWeatheringAndMiningFlux.toFixed(1), unit: 'MtP/yr' },
          { label: 'Phosphate Mining', value: v.phosphateMining.toFixed(0), unit: 'MtP/yr' },
        ],
      },
      {
        id: 'p_soil',
        label: 'Terraced Topsoil',
        chemicalForm: 'Adsorbed PO₄³⁻',
        xPercent: 51,
        yPercent: 45,
        equation: 'PO₄³⁻(aq) → Plant Uptake (ATP / DNA) & Clay Binding',
        summary:
          'Plants take up dissolved phosphate for DNA and ATP. Excess phosphate clings tightly to clay soil particles, moving mainly when soil erodes.',
        getReadout: (m, v) => [
          { label: 'Erosion Control', value: v.erosionControl.toFixed(0), unit: '%' },
          { label: 'Runoff Flux', value: m.pRunoffFlux.toFixed(2), unit: 'MtP/yr' },
        ],
      },
      {
        id: 'p_estuary',
        label: 'Coastal Delta',
        chemicalForm: 'Dissolved PO₄³⁻',
        xPercent: 80,
        yPercent: 53,
        equation: 'PO₄³⁻ > 35 ug/L → Freshwater / Coastal Algal Bloom',
        summary:
          'When eroded soil and fertilizer phosphate wash into rivers and estuaries, it acts as the limiting trigger for explosive algal blooms.',
        getReadout: (m) => [
          { label: 'Reactive Phosphate', value: m.reactivePhosphate.toFixed(1), unit: 'ug/L' },
          { label: 'Algal Bloom Index', value: m.algalBloomIndex.toFixed(0), unit: '/100' },
        ],
      },
      {
        id: 'p_sediment',
        label: 'Seafloor Sediment',
        chemicalForm: 'Buried Mineral P',
        xPercent: 82,
        yPercent: 85,
        equation: 'Dead Algae + Mineral Particles → Deep Sediment Rock',
        summary:
          'Phosphorus has NO gaseous atmospheric phase—it settles onto the seafloor and takes millions of years of geologic uplift to return to land.',
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
        processName: 'Weathering & Mining',
        fromLabel: 'Phosphate Rock',
        toLabel: 'Terraced Topsoil',
        chemicalChange: 'Ca₃(PO₄)₂ → PO₄³⁻',
        explanation:
          'Rainwater weathering and phosphate mining release mineral phosphorus from cliffs into farm soils.',
        svgPath: 'M 205 212 Q 350 225 452 248',
        labelX: 332,
        labelY: 198,
        color: '#a855f7',
        particleColor: '#e9d5ff',
        getRateNorm: (m) => m.pWeatheringAndMiningFlux / 40,
        getRateText: (m) => `${m.pWeatheringAndMiningFlux.toFixed(1)} MtP/yr`,
      },
      {
        id: 'p_erosion',
        stepNum: '02',
        processName: 'Soil Erosion & Runoff',
        fromLabel: 'Terraced Topsoil',
        toLabel: 'Coastal Delta',
        chemicalChange: 'Clay-bound & Dissolved P',
        explanation:
          'Without terracing or cover crops, heavy rain washes phosphate-rich topsoil straight into coastal waters.',
        svgPath: 'M 565 262 Q 675 275 752 292',
        labelX: 662,
        labelY: 245,
        color: '#c084fc',
        particleColor: '#f3e8ff',
        getRateNorm: (m) => m.pRunoffFlux / 14,
        getRateText: (m) => `${m.reactivePhosphate.toFixed(0)} ug/L`,
      },
      {
        id: 'p_burial',
        stepNum: '03',
        processName: 'Sinking & Sedimentation',
        fromLabel: 'Coastal Delta',
        toLabel: 'Seafloor Sediment',
        chemicalChange: 'Algae → Seafloor Burial',
        explanation:
          'Dead plankton and mineral phosphate sink to the ocean floor, removing P from biological circulation.',
        svgPath: 'M 812 325 Q 825 385 820 448',
        labelX: 892,
        labelY: 388,
        color: '#7c3aed',
        particleColor: '#d8b4fe',
        getRateNorm: (m) => 0.4 + m.pRunoffFlux / 16,
        getRateText: (m) => `${m.sedimentPhosphatePool.toFixed(0)} MtP`,
      },
      {
        id: 'p_uplift',
        stepNum: '04',
        processName: 'Geologic Uplift (Slow)',
        fromLabel: 'Seafloor Sediment',
        toLabel: 'Phosphate Rock',
        chemicalChange: 'Millions of Years (No Gas!)',
        explanation:
          'Because P never becomes a gas, only slow plate tectonics lifts seafloor rock back onto mountains.',
        svgPath: 'M 758 486 Q 430 515 156 232',
        labelX: 430,
        labelY: 492,
        color: '#6b21a8',
        particleColor: '#c084fc',
        getRateNorm: () => 0.25,
        getRateText: () => 'Geologic timescale',
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
        chemicalForm: 'H₂O(g) / Droplets',
        xPercent: 45,
        yPercent: 14,
        equation: 'Condensation → Precipitation (P = ET + Q + ΔS)',
        summary:
          'Solar warming evaporates ocean water and draws vapor from forest leaves. Rising air cools and condenses into rain and snow clouds.',
        getReadout: (m) => [
          { label: 'Precipitation', value: m.precipitationRate.toFixed(0), unit: 'mm/yr' },
          { label: 'Evaporation', value: m.evaporationFlux.toFixed(0), unit: 'mm/yr' },
        ],
      },
      {
        id: 'w_snow',
        label: 'Alpine Snowpack',
        chemicalForm: 'H₂O(s) Ice Storage',
        xPercent: 18,
        yPercent: 34,
        equation: 'Snowpack Storage → Spring Meltwater Baseflow',
        summary:
          'Mountain glaciers and snowpacks act as natural seasonal reservoirs, slowly feeding rivers throughout dry summer months.',
        getReadout: (m, v) => [
          { label: 'Snowpack Volume', value: m.snowpackVolume.toFixed(1), unit: '%' },
          { label: 'Thermal Forcing', value: `${v.solarForcing >= 0 ? '+' : ''}${v.solarForcing.toFixed(1)}`, unit: '°C' },
        ],
      },
      {
        id: 'w_valley',
        label: 'Watershed Valley',
        chemicalForm: 'Runoff vs. Soil',
        xPercent: 49,
        yPercent: 60,
        equation: 'Permeable Soil → Infiltration | Pavement → Flash Runoff',
        summary:
          'Forest roots absorb rainfall into soil, whereas urban pavement forces water rapidly across the surface into rivers.',
        getReadout: (m, v) => [
          { label: 'Surface Runoff', value: m.surfaceRunoff.toFixed(0), unit: 'mm/yr' },
          { label: 'Impervious Cover', value: v.imperviousSurface.toFixed(0), unit: '%' },
        ],
      },
      {
        id: 'w_aquifer',
        label: 'Groundwater Aquifer',
        chemicalForm: 'Subsurface H₂O(l)',
        xPercent: 36,
        yPercent: 86,
        equation: 'Recharge = Infiltration − Irrigation Pumping',
        summary:
          'Water percolating through soil pores fills underground rock aquifers. Heavy irrigation pumping drains reserves faster than rain refills them.',
        getReadout: (m, v) => [
          { label: 'Aquifer Capacity', value: m.groundwaterTable.toFixed(1), unit: '%' },
          { label: 'Pumping Rate', value: v.groundwaterExtraction.toFixed(0), unit: '%' },
        ],
      },
      {
        id: 'w_ocean',
        label: 'Coastal Ocean',
        chemicalForm: '97% Global H₂O',
        xPercent: 86,
        yPercent: 52,
        equation: 'Solar Energy + H₂O(l) → H₂O(g) Evaporation',
        summary:
          'Receives river discharge and supplies ~86% of global atmospheric moisture via solar evaporation.',
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
        fromLabel: 'Coastal Ocean',
        toLabel: 'Clouds & Vapor',
        chemicalChange: 'H₂O(l) → H₂O(g)',
        explanation:
          'Sun-warmed ocean water evaporates upward into atmospheric moisture.',
        svgPath: 'M 855 262 Q 795 112 518 76',
        labelX: 742,
        labelY: 118,
        color: '#38bdf8',
        particleColor: '#e0f2fe',
        getRateNorm: (m) => m.evaporationFlux / 950,
        getRateText: (m) => `${m.evaporationFlux.toFixed(0)} mm/yr`,
      },
      {
        id: 'w_precip',
        stepNum: '02',
        processName: 'Precipitation',
        fromLabel: 'Clouds & Vapor',
        toLabel: 'Alpine & Valley',
        chemicalChange: 'H₂O(g) → Rain / Snow',
        explanation:
          'Moist air cools over mountains, falling as snow on peaks and rain across the valley.',
        svgPath: 'M 392 86 Q 260 95 198 165',
        labelX: 278,
        labelY: 96,
        color: '#0ea5e9',
        particleColor: '#bae6fd',
        getRateNorm: (m) => m.precipitationRate / 1100,
        getRateText: (m) => `${m.precipitationRate.toFixed(0)} mm/yr`,
      },
      {
        id: 'w_transp',
        stepNum: '03',
        processName: 'Transpiration',
        fromLabel: 'Forest Canopy',
        toLabel: 'Clouds & Vapor',
        chemicalChange: 'Root Water → Leaf Vapor',
        explanation:
          'Forests pump soil water through roots and release vapor back into clouds.',
        svgPath: 'M 250 285 Q 345 195 432 105',
        labelX: 352,
        labelY: 196,
        color: '#2dd4bf',
        particleColor: '#99f6e4',
        getRateNorm: (m) => m.transpirationFlux / 480,
        getRateText: (m) => `${m.transpirationFlux.toFixed(0)} mm/yr`,
      },
      {
        id: 'w_runoff',
        stepNum: '04',
        processName: 'Surface Runoff',
        fromLabel: 'Alpine Snowpack',
        toLabel: 'Valley → Ocean',
        chemicalChange: 'River & Urban Flow',
        explanation:
          'Snowmelt and rain over pavement flow rapidly down rivers back to the sea.',
        svgPath: 'M 205 215 Q 485 375 805 305',
        labelX: 615,
        labelY: 325,
        color: '#0284c7',
        particleColor: '#7dd3fc',
        getRateNorm: (m) => m.surfaceRunoff / 560,
        getRateText: (m) => `${m.surfaceRunoff.toFixed(0)} mm/yr`,
      },
      {
        id: 'w_infilt',
        stepNum: '05',
        processName: 'Aquifer Infiltration',
        fromLabel: 'Watershed Soil',
        toLabel: 'Groundwater Aquifer',
        chemicalChange: 'Percolation Recharge',
        explanation:
          'Permeable soils filter rainwater downward to replenish underground aquifers.',
        svgPath: 'M 472 362 Q 425 415 378 462',
        labelX: 345,
        labelY: 412,
        color: '#0369a1',
        particleColor: '#38bdf8',
        getRateNorm: (m) => m.infiltrationFlux / 420,
        getRateText: (m) => `${m.infiltrationFlux.toFixed(0)} mm/yr`,
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
        labelX: 605,
        labelY: 188,
        color: '#ef4444',
        particleColor: '#fca5a5',
        getRateNorm: (_m, v) => (v.fossilFuelEmissions + 2) / 14,
        getRateText: (m) => `${m.atmosphericCO2.toFixed(0)} ppm`,
      },
      {
        id: 'cl_melt',
        stepNum: '02',
        processName: 'Warming → Snowmelt',
        fromLabel: 'Atmosphere Heat',
        toLabel: 'Alpine Snowpack',
        chemicalChange: 'ΔT → Melt & Runoff',
        explanation:
          'Rising temperatures shrink mountain snowpacks and intensify rainfall runoff across slopes.',
        svgPath: 'M 472 82 Q 305 78 206 118',
        labelX: 332,
        labelY: 74,
        color: '#0ea5e9',
        particleColor: '#bae6fd',
        getRateNorm: (m) => 0.4 + Math.max(0, m.globalTempAnomaly) / 3,
        getRateText: (m) => `Snow ${m.snowpackVolume.toFixed(0)}%`,
      },
      {
        id: 'cl_nutrient_flush',
        stepNum: '03',
        processName: 'Nutrient Runoff Flush',
        fromLabel: 'Watershed Soils',
        toLabel: 'Coastal Estuary',
        chemicalChange: 'NO₃⁻ + PO₄³⁻ + Warm H₂O',
        explanation:
          'Heavy runoff carries Nitrogen and Phosphorus into warmer coastal waters, fueling algal blooms.',
        svgPath: 'M 568 338 Q 705 375 815 356',
        labelX: 695,
        labelY: 382,
        color: '#a855f7',
        particleColor: '#e9d5ff',
        getRateNorm: (m) => m.algalBloomIndex / 75,
        getRateText: (m) => `Bloom ${m.algalBloomIndex.toFixed(0)}/100`,
      },
      {
        id: 'cl_acid',
        stepNum: '04',
        processName: 'Ocean Acidification',
        fromLabel: 'Atmosphere CO₂',
        toLabel: 'Coastal Ocean',
        chemicalChange: 'CO₂ + H₂O → H⁺ + HCO₃⁻',
        explanation:
          'Excess atmospheric CO₂ dissolves into seawater, dropping ocean pH and stressing shell-forming life.',
        svgPath: 'M 575 86 Q 765 130 842 325',
        labelX: 755,
        labelY: 162,
        color: '#f59e0b',
        particleColor: '#fde68a',
        getRateNorm: (m) => Math.max(0.3, Math.abs(m.oceanCarbonUptake) / 3.5),
        getRateText: (m) => `pH ${m.oceanPH.toFixed(2)}`,
      },
    ],
  },
};
