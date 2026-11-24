import type {
  ChallengeGoal,
  CycleId,
  CycleNodeInfo,
  LearningModuleId,
  ScenarioId,
  ScenarioPreset,
  SimulationMetrics,
  SimulationVariables,
} from '../types/simulation';

export interface LearningModuleMeta {
  id: LearningModuleId;
  step: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  coreQuestion: string;
  equation: string;
  summary: string;
  fieldImage: string;
  fieldImageAlt: string;
  accentDot: string;
  accentRing: string;
}

export interface SubstanceItem {
  name: string;
  formula: string;
  state: 'Gas' | 'Liquid / Dissolved' | 'Solid / Mineral' | 'Living Biomass';
  role: string;
}

export interface DiscussionGuide {
  substances: SubstanceItem[];
  discussionPrompts: string[];
  experiments: {
    label: string;
    description: string;
    patch: Partial<SimulationVariables>;
  }[];
}

export const MODULE_DISCUSSION_GUIDES: Record<LearningModuleId, DiscussionGuide> = {
  carbon: {
    substances: [
      { name: 'Carbon Dioxide', formula: 'CO₂', state: 'Gas', role: 'Traps infrared heat in air; absorbed by leaves & oceans.' },
      { name: 'Plant Sugars & Wood', formula: 'C₆H₁₂O₆', state: 'Living Biomass', role: 'Stored by forests and deep-rooted prairie grasses.' },
      { name: 'Coal, Oil & Natural Gas', formula: 'CₓHᵧ', state: 'Solid / Mineral', role: 'Fossilized carbon burned in factories and vehicles.' },
      { name: 'Carbonic Acid', formula: 'H₂CO₃', state: 'Liquid / Dissolved', role: 'Forms when excess CO₂ dissolves in ocean water, lowering pH.' },
    ],
    discussionPrompts: [
      'If factories increase CO₂ emissions, can planting forests and prairie grasses alone stop ocean acidification?',
      'Why do grasslands store most of their carbon underground in roots, while forests store more above ground in trunks?',
    ],
    experiments: [
      {
        label: 'Test: Factory Boom vs. Prairies',
        description: 'High factories with restored forests & prairie grasses',
        patch: { fossilFuelEmissions: 14, reforestationEffort: 80, grasslandCover: 85, deforestationRate: 10 },
      },
      {
        label: 'Test: Clear-Cutting + Emissions',
        description: 'Remove forests & grasses while running factories',
        patch: { fossilFuelEmissions: 12, reforestationEffort: 10, grasslandCover: 15, deforestationRate: 75 },
      },
    ],
  },
  nitrogen: {
    substances: [
      { name: 'Dinitrogen Gas', formula: 'N₂ (78% of air)', state: 'Gas', role: 'Inert atmospheric reservoir; unusable until fixed by bacteria.' },
      { name: 'Ammonia / Ammonium', formula: 'NH₃ / NH₄⁺', state: 'Liquid / Dissolved', role: 'Produced by legume root bacteria, manure, and fertilizer.' },
      { name: 'Nitrate', formula: 'NO₃⁻', state: 'Liquid / Dissolved', role: 'Water-soluble plant nutrient that easily leaches into rivers.' },
      { name: 'Nitrous Oxide', formula: 'N₂O', state: 'Gas', role: 'Potent greenhouse gas released from over-fertilized soils.' },
    ],
    discussionPrompts: [
      'Why can plants starve for nitrogen even though 78% of the air around their leaves is nitrogen gas (N₂)?',
      'How do riparian wetland marshes act like biological kidneys for farm runoff?',
    ],
    experiments: [
      {
        label: 'Test: Fertilizer + No Wetlands',
        description: 'Heavy farm fertilizer & livestock with drained marshes',
        patch: { syntheticFertilizer: 170, livestockDensity: 80, wetlandBuffer: 10, legumeCoverCrops: 15 },
      },
      {
        label: 'Test: Clover + Wetland Filters',
        description: 'Use clover cover crops & wide riparian wetlands',
        patch: { syntheticFertilizer: 30, livestockDensity: 25, wetlandBuffer: 90, legumeCoverCrops: 85 },
      },
    ],
  },
  phosphorus: {
    substances: [
      { name: 'Phosphate Mineral Rock', formula: 'Ca₃(PO₄)₂', state: 'Solid / Mineral', role: 'Locked in cliffs and mines; weathered slowly by rain.' },
      { name: 'Orthophosphate', formula: 'PO₄³⁻', state: 'Liquid / Dissolved', role: 'Dissolved in runoff from mines, fertilizers, and detergents.' },
      { name: 'Cell Energy & Genetics', formula: 'ATP / DNA', state: 'Living Biomass', role: 'Essential nutrient for every plant, algae, and animal cell.' },
    ],
    discussionPrompts: [
      'Unlike Carbon and Nitrogen, why does Phosphorus have ZERO gas phase in the atmosphere?',
      'How do household detergents, sewage, and eroded farm soil cause coastal algal blooms even when nitrate is low?',
    ],
    experiments: [
      {
        label: 'Test: Mining + Detergent Surge',
        description: 'High phosphate mining & wastewater with bare eroded soil',
        patch: { phosphateMining: 40, wastewaterPhosphates: 85, erosionControl: 15 },
      },
      {
        label: 'Test: Grass Buffers & P-Free Soap',
        description: 'Terracing, grass strips, and phosphate-free detergents',
        patch: { phosphateMining: 8, wastewaterPhosphates: 10, erosionControl: 90 },
      },
    ],
  },
  water: {
    substances: [
      { name: 'Water Vapor', formula: 'H₂O(g)', state: 'Gas', role: 'Invisible moisture evaporated from oceans and transpired by leaves.' },
      { name: 'Liquid Water & Aquifer', formula: 'H₂O(l)', state: 'Liquid / Dissolved', role: 'Flows as rain, rivers, and underground groundwater reserves.' },
      { name: 'Glacial Ice & Snowpack', formula: 'H₂O(s)', state: 'Solid / Mineral', role: 'Stores winter snow and feeds cool river flow all summer.' },
    ],
    discussionPrompts: [
      'When cities replace forests and grasslands with asphalt roads, what happens to aquifer recharge vs. flash flooding?',
      'How does a +2°C rise in air temperature affect mountain snowpack and summer water supply?',
    ],
    experiments: [
      {
        label: 'Test: Paved City + Heavy Pumping',
        description: '80% asphalt pavement and intense irrigation pumping',
        patch: { imperviousSurface: 80, groundwaterExtraction: 85, solarForcing: 1.5, reforestationEffort: 15 },
      },
      {
        label: 'Test: Sponge Watershed',
        description: 'Permeable forest/grassland soils with modest pumping',
        patch: { imperviousSurface: 12, groundwaterExtraction: 20, solarForcing: 0.0, reforestationEffort: 80 },
      },
    ],
  },
  climate: {
    substances: [
      { name: 'Greenhouse Gases', formula: 'CO₂ + N₂O + H₂O(g)', state: 'Gas', role: 'Amplify warming, melt snowpack, and intensify storm runoff.' },
      { name: 'Coastal Nutrient Cocktail', formula: 'NO₃⁻ + PO₄³⁻', state: 'Liquid / Dissolved', role: 'Washed from land by storms to spark massive algal blooms.' },
      { name: 'Dissolved Oxygen', formula: 'O₂(aq)', state: 'Liquid / Dissolved', role: 'Depleted by decomposing algae, creating hypoxic dead zones.' },
    ],
    discussionPrompts: [
      'Trace the chain reaction: How do factories (Carbon) + paved roads (Water) + fertilizers (N & P) combine to suffocate fish at the coast?',
      'Which combination of policy changes gives the fastest recovery in Ecosystem Health?',
    ],
    experiments: [
      {
        label: 'Test: Compound Crisis',
        description: 'High factories, high fertilizer, paved roads, low forests',
        patch: { ...{ fossilFuelEmissions: 14, deforestationRate: 65, syntheticFertilizer: 165, phosphateMining: 38, wastewaterPhosphates: 70, imperviousSurface: 65, solarForcing: 1.2, wetlandBuffer: 20 } },
      },
      {
        label: 'Test: Net-Zero & Wetland Fix',
        description: 'Cut factory fuels, restore forests, prairies, and wetlands',
        patch: { ...{ fossilFuelEmissions: 1.5, deforestationRate: 5, reforestationEffort: 85, grasslandCover: 85, syntheticFertilizer: 35, wetlandBuffer: 90, phosphateMining: 6, wastewaterPhosphates: 12, erosionControl: 90, imperviousSurface: 15, solarForcing: 0.1 } },
      },
    ],
  },
};

export const LEARNING_MODULES: LearningModuleMeta[] = [
  {
    id: 'carbon',
    step: '01',
    title: 'Carbon Cycle',
    shortTitle: '01. Carbon',
    subtitle: 'Atmosphere · Forests & Grasses · Factories · Ocean',
    coreQuestion: 'How do factories, forests, and grasslands change CO₂ gas and ocean pH?',
    equation: '6CO₂ + 6H₂O ⇌ C₆H₁₂O₆ + 6O₂  |  CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻',
    summary:
      'Carbon cycles between CO₂ gas in the sky, living trees and prairie grasses, dark soil humus, fossil fuels, and dissolved ocean carbonic acid.',
    fieldImage: '/src/assets/images/carbon_cycle_forest_1795468142278.jpg',
    fieldImageAlt: 'Temperate old-growth forest canopy sequestering carbon dioxide',
    accentDot: 'bg-amber-600',
    accentRing: 'ring-amber-600/20',
  },
  {
    id: 'nitrogen',
    step: '02',
    title: 'Nitrogen Cycle',
    shortTitle: '02. Nitrogen',
    subtitle: 'N₂ Air · Clover & Soil · Livestock · Wetlands',
    coreQuestion: 'How do fertilizers, livestock, and wetlands control nitrate runoff?',
    equation: 'N₂ → NH₄⁺ → NO₂⁻ → NO₃⁻  |  2NO₃⁻ → N₂O → N₂(g)',
    summary:
      'Air is 78% N₂ gas, which microbes or factories convert into ammonium and nitrate. Wetland marshes convert excess nitrate safely back into N₂ gas.',
    fieldImage: '/src/assets/images/nitrogen_cycle_farmland_1795468142438.jpg',
    fieldImageAlt: 'Terraced agricultural farmland bordering a riparian wetland river valley',
    accentDot: 'bg-emerald-600',
    accentRing: 'ring-emerald-600/20',
  },
  {
    id: 'phosphorus',
    step: '03',
    title: 'Phosphorus Cycle',
    shortTitle: '03. Phosphorus',
    subtitle: 'Phosphate Rock · Detergents · Grass Buffers · Sediment',
    coreQuestion: 'Why does phosphorus build up in rivers and sediments instead of air?',
    equation: 'Ca₃(PO₄)₂(s) → PO₄³⁻(aq) → Biomass → Marine Sediment',
    summary:
      'Phosphorus has NO atmospheric gas phase. Mining rock and pouring detergents into wastewater push dissolved PO₄³⁻ into lakes and seafloor sediments.',
    fieldImage: '/src/assets/images/phosphorus_cycle_geology_1795468141908.jpg',
    fieldImageAlt: 'Layered sedimentary phosphate rock formation alongside a clear mountain stream',
    accentDot: 'bg-violet-600',
    accentRing: 'ring-violet-600/20',
  },
  {
    id: 'water',
    step: '04',
    title: 'Water Cycle',
    shortTitle: '04. Water',
    subtitle: 'Clouds · Snowpack · Paved Cities · Aquifers',
    coreQuestion: 'How do pavement, forests, and pumping shift runoff vs. groundwater?',
    equation: 'P = ET + Q_runoff + ΔS_aquifer',
    summary:
      'Sun heat evaporates ocean water into rain and snow. Forest and grass soils soak water into aquifers, while paved cities force flash runoff.',
    fieldImage: '/src/assets/images/water_cycle_hydrology_1795468144445.jpg',
    fieldImageAlt: 'Alpine glacial snowmelt waterfall feeding a river valley under rain clouds',
    accentDot: 'bg-sky-600',
    accentRing: 'ring-sky-600/20',
  },
  {
    id: 'climate',
    step: '05',
    title: 'Climate Impact',
    shortTitle: '05. Climate Impact',
    subtitle: 'Cross-Cycle Feedbacks · Global Warming · Dead Zones',
    coreQuestion: 'How do factories, stormwater, and nutrients combine to impact climate & oceans?',
    equation: 'ΔT ∝ ln(CO₂/C₀) + N₂O  |  Warm Water + N + P → Algal Bloom → O₂ Collapse',
    summary:
      'Carbon warming melts snowpack and drives heavier runoff, flushing Nitrogen and Phosphorus into warmer bays where algal blooms deplete oxygen.',
    fieldImage: '/src/assets/images/biome_watershed_backdrop_1795468142106.jpg',
    fieldImageAlt: 'Complete coastal watershed cross-section showing coupled atmospheric, terrestrial, aquifer, and marine systems',
    accentDot: 'bg-rose-600',
    accentRing: 'ring-rose-600/20',
  },
];

export const SCENARIO_PRESETS: Record<ScenarioId, ScenarioPreset> = {
  preindustrial: {
    id: 'preindustrial',
    name: 'Pre-Industrial Equilibrium (1750)',
    shortName: '1750 Baseline',
    description:
      'Balanced carbon exchange, intact forests and prairies, natural N₂ fixation, slow rock weathering, and permeable soil aquifers.',
    learningGoal:
      'Establish natural equilibrium across all four cycles before industrial perturbation.',
    variables: {
      fossilFuelEmissions: 0.4,
      deforestationRate: 4,
      reforestationEffort: 60,
      grasslandCover: 75,
      syntheticFertilizer: 5,
      wetlandBuffer: 85,
      legumeCoverCrops: 45,
      livestockDensity: 12,
      phosphateMining: 2,
      wastewaterPhosphates: 4,
      erosionControl: 80,
      solarForcing: 0.0,
      imperviousSurface: 4,
      groundwaterExtraction: 8,
    },
  },
  industrial: {
    id: 'industrial',
    name: 'Factory Boom & Urban Expansion',
    shortName: 'Factory Boom',
    description:
      'Heavy coal/oil factory emissions, paved cities, and cleared forests raise CO₂, acidify oceans, melt snowpack, and trigger urban flash runoff.',
    learningGoal:
      'Observe how carbon warming ripples into ocean pH, snowpack loss, and storm runoff.',
    variables: {
      fossilFuelEmissions: 14.0,
      deforestationRate: 62,
      reforestationEffort: 15,
      grasslandCover: 22,
      syntheticFertilizer: 115,
      wetlandBuffer: 30,
      legumeCoverCrops: 20,
      livestockDensity: 55,
      phosphateMining: 24,
      wastewaterPhosphates: 62,
      erosionControl: 25,
      solarForcing: 0.8,
      imperviousSurface: 58,
      groundwaterExtraction: 55,
    },
  },
  ag_intensification: {
    id: 'ag_intensification',
    name: 'Intensive Farming & Runoff',
    shortName: 'Intensive Farm',
    description:
      'Heavy synthetic fertilizer, dense livestock, mined phosphate, and drained wetlands trigger severe algal blooms and coastal dead zones.',
    learningGoal:
      'Identify coupled N + P runoff thresholds that collapse dissolved oxygen below 2.0 mg/L.',
    variables: {
      fossilFuelEmissions: 6.2,
      deforestationRate: 38,
      reforestationEffort: 22,
      grasslandCover: 28,
      syntheticFertilizer: 175,
      wetlandBuffer: 15,
      legumeCoverCrops: 15,
      livestockDensity: 85,
      phosphateMining: 42,
      wastewaterPhosphates: 55,
      erosionControl: 18,
      solarForcing: 0.4,
      imperviousSurface: 28,
      groundwaterExtraction: 78,
    },
  },
  regenerative: {
    id: 'regenerative',
    name: 'Green Watershed & Net-Zero',
    shortName: 'Green Net-Zero',
    description:
      'Clean energy, restored forests & prairie grasses, wetland filters, and phosphate-free wastewater restore ecosystem equilibrium.',
    learningGoal:
      'Find the multi-cycle practices that keep CO₂ < 350 ppm and dissolved O₂ > 7.5 mg/L.',
    variables: {
      fossilFuelEmissions: 1.5,
      deforestationRate: 6,
      reforestationEffort: 88,
      grasslandCover: 85,
      syntheticFertilizer: 35,
      wetlandBuffer: 90,
      legumeCoverCrops: 82,
      livestockDensity: 20,
      phosphateMining: 7,
      wastewaterPhosphates: 10,
      erosionControl: 90,
      solarForcing: 0.1,
      imperviousSurface: 14,
      groundwaterExtraction: 20,
    },
  },
};

export interface VariableDefinition {
  key: keyof SimulationVariables;
  cycle: CycleId;
  label: string;
  substanceTag: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  mechanismHint: string;
}

export const VARIABLE_DEFINITIONS: VariableDefinition[] = [
  {
    key: 'fossilFuelEmissions',
    cycle: 'carbon',
    label: 'Factories & Fossil Fuels',
    substanceTag: 'Coal / Oil → CO₂ Gas',
    unit: 'GtC/yr',
    min: 0,
    max: 20,
    step: 0.5,
    mechanismHint: 'Burns coal and oil, releasing CO₂ gas into the air.',
  },
  {
    key: 'reforestationEffort',
    cycle: 'carbon',
    label: 'Forests & Woodlands',
    substanceTag: 'Trees (CO₂ → Wood)',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
    mechanismHint: 'Trees absorb CO₂ gas, cool valleys, and anchor soil.',
  },
  {
    key: 'grasslandCover',
    cycle: 'carbon',
    label: 'Grasslands & Prairies',
    substanceTag: 'Deep Root Soil C',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
    mechanismHint: 'Prairie grasses lock carbon deep underground and slow runoff.',
  },
  {
    key: 'deforestationRate',
    cycle: 'carbon',
    label: 'Land Clearing & Wildfire',
    substanceTag: 'Wood → CO₂ + Ash',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
    mechanismHint: 'Releases stored plant carbon and accelerates topsoil erosion.',
  },
  {
    key: 'syntheticFertilizer',
    cycle: 'nitrogen',
    label: 'Farm Chemical Fertilizer',
    substanceTag: 'NH₄NO₃ Nitrate Salt',
    unit: 'MtN/yr',
    min: 0,
    max: 200,
    step: 5,
    mechanismHint: 'Adds soluble ammonium & nitrate that easily leaches into rivers.',
  },
  {
    key: 'wetlandBuffer',
    cycle: 'nitrogen',
    label: 'Marshes & Wetland Buffers',
    substanceTag: 'NO₃⁻ → N₂ Gas',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
    mechanismHint: 'Wetland microbes convert harmful nitrate back into harmless N₂ air.',
  },
  {
    key: 'legumeCoverCrops',
    cycle: 'nitrogen',
    label: 'Clover & Bean Cover Crops',
    substanceTag: 'N₂ Air → Root NH₄⁺',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
    mechanismHint: 'Root-nodule bacteria fix N₂ gas naturally with minimal runoff.',
  },
  {
    key: 'livestockDensity',
    cycle: 'nitrogen',
    label: 'Livestock & Manure',
    substanceTag: 'NH₃ Ammonia & N₂O',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
    mechanismHint: 'Concentrated manure releases ammonia and nitrate runoff.',
  },
  {
    key: 'phosphateMining',
    cycle: 'phosphorus',
    label: 'Phosphate Rock Mining',
    substanceTag: 'Ca₃(PO₄)₂ Mineral',
    unit: 'MtP/yr',
    min: 0,
    max: 50,
    step: 1,
    mechanismHint: 'Extracts mineral rock phosphate for fertilizer faster than rain weathering.',
  },
  {
    key: 'wastewaterPhosphates',
    cycle: 'phosphorus',
    label: 'Detergents & Wastewater',
    substanceTag: 'Dissolved PO₄³⁻',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
    mechanismHint: 'Household soaps and untreated sewage add dissolved phosphate directly to rivers.',
  },
  {
    key: 'erosionControl',
    cycle: 'phosphorus',
    label: 'Grass Buffers & Terracing',
    substanceTag: 'Soil Clay Retention',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
    mechanismHint: 'Roots and terraces trap soil clay so phosphate stays on fields.',
  },
  {
    key: 'solarForcing',
    cycle: 'water',
    label: 'Sun Heat & Air Temp',
    substanceTag: 'H₂O(l) → Vapor Heat',
    unit: '°C',
    min: -1.0,
    max: 4.0,
    step: 0.1,
    mechanismHint: 'Higher air temperature boosts evaporation and melts mountain snowpack.',
  },
  {
    key: 'imperviousSurface',
    cycle: 'water',
    label: 'Paved Cities & Roads',
    substanceTag: 'Asphalt & Concrete',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
    mechanismHint: 'Blocks rain from soaking underground, creating flash surface runoff.',
  },
  {
    key: 'groundwaterExtraction',
    cycle: 'water',
    label: 'Well & Farm Pumping',
    substanceTag: 'Aquifer H₂O Drawdown',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
    mechanismHint: 'Pumps deep groundwater faster than rain percolation can refill it.',
  },
];

export const CHALLENGE_GOALS: ChallengeGoal[] = [
  {
    id: 'climate_cap',
    title: 'Stabilize Atmospheric Carbon',
    criterionText: 'CO2 < 350 ppm & Ocean pH >= 8.10',
    check: (m) => m.atmosphericCO2 < 350 && m.oceanPH >= 8.1,
  },
  {
    id: 'hypoxia_guard',
    title: 'Prevent Coastal Hypoxia',
    criterionText: 'Dissolved O2 >= 6.8 mg/L & Bloom < 30',
    check: (m) => m.dissolvedOxygen >= 6.8 && m.algalBloomIndex < 30,
  },
  {
    id: 'nutrient_steward',
    title: 'Balance Watershed Nutrients',
    criterionText: 'Nitrate < 3.0 mg/L & Phosphate < 35 ug/L',
    check: (m) => m.aquaticNitrateLoad < 3.0 && m.reactivePhosphate < 35,
  },
  {
    id: 'aquifer_resilience',
    title: 'Sustain Aquifer & Snowpack',
    criterionText: 'Groundwater >= 75% & Snowpack >= 65%',
    check: (m) => m.groundwaterTable >= 75 && m.snowpackVolume >= 65,
  },
];

export const CYCLE_NODES: CycleNodeInfo[] = [];

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function simulateTimeSeries(
  vars: SimulationVariables,
  maxYear = 100,
  stepYears = 5
): SimulationMetrics[] {
  const points: SimulationMetrics[] = [];

  let co2 = 285.0;
  let biomassC = 560.0;
  let soilC = 1520.0;
  let snowpack = 96.0;
  let groundwater = 92.0;
  let soilNitrate = 16.0;
  let sedimentP = 410.0;

  const totalSteps = Math.floor(maxYear / stepYears);

  for (let i = 0; i <= totalSteps; i++) {
    const year = i * stepYears;

    // 1. Carbon Cycle (Forests + Prairie Grasses + Factories)
    const vegetationSinkFactor = clamp(
      1 -
        vars.deforestationRate / 135 +
        vars.reforestationEffort / 165 +
        vars.grasslandCover / 260,
      0.32,
      1.55
    );
    const co2Fertilization = 1 + 0.18 * Math.log(Math.max(co2 / 285, 0.8));
    const photosynthesisFlux = 114 * vegetationSinkFactor * co2Fertilization;

    const landUseEmission = (vars.deforestationRate / 100) * 3.4;
    const baseTemp =
      vars.solarForcing + 5.35 * Math.log(Math.max(co2, 180) / 285) * 0.42;

    const oceanCarbonUptake = clamp(
      (co2 - 280) * 0.036 * (1 - Math.max(0, baseTemp) * 0.05),
      -1.5,
      6.5
    );

    const respirationFlux =
      115.0 * (biomassC / 560) * (1 + Math.max(-0.2, baseTemp) * 0.045);

    const netCarbonFlux =
      vars.fossilFuelEmissions +
      landUseEmission +
      respirationFlux -
      photosynthesisFlux -
      oceanCarbonUptake -
      (vars.reforestationEffort / 100) * 1.6 -
      (vars.grasslandCover / 100) * 1.1;

    // 2. Nitrogen Cycle (Fertilizer + Clover + Livestock + Wetlands)
    const naturalFixation = 56 + (vars.legumeCoverCrops / 100) * 42;
    const livestockN = (vars.livestockDensity / 100) * 52;
    const totalNInput = naturalFixation + vars.syntheticFertilizer + livestockN;
    const wetlandDenitRatio = 0.22 + (vars.wetlandBuffer / 100) * 0.48;
    const denitrificationFlux = totalNInput * wetlandDenitRatio;
    const n2oFraction =
      0.013 +
      (vars.syntheticFertilizer / 200) * 0.02 +
      (vars.livestockDensity / 100) * 0.012;
    const nitrousOxideFlux = totalNInput * n2oFraction;

    const n2oWarming = Math.max(0, (nitrousOxideFlux - 1.3) * 0.14);
    const globalTempAnomaly = clamp(baseTemp + n2oWarming, -1.2, 6.0);

    // 3. Water Cycle (Sun Heat + Paved Cities + Forests/Grasses + Pumping)
    const evaporationFlux = clamp(
      820 + globalTempAnomaly * 38 - (vars.deforestationRate / 100) * 28,
      650,
      1120
    );
    const transpirationFlux = clamp(
      420 * vegetationSinkFactor * (1 + globalTempAnomaly * 0.03),
      150,
      640
    );
    const precipitationRate = clamp(
      0.92 * (evaporationFlux + transpirationFlux) - 140,
      700,
      1400
    );

    const infiltrationFraction = clamp(
      0.44 -
        (vars.imperviousSurface / 100) * 0.34 -
        (vars.deforestationRate / 100) * 0.1 +
        (vars.reforestationEffort / 100) * 0.06 +
        (vars.grasslandCover / 100) * 0.06,
      0.06,
      0.6
    );
    const infiltrationFlux = precipitationRate * infiltrationFraction;
    const surfaceRunoff = precipitationRate * (1 - infiltrationFraction) * 0.72;

    // 4. Phosphorus & Aquatic Eutrophication (Mining + Detergents + Grass Buffers)
    const runoffIntensity = surfaceRunoff / 480;
    const aquaticNitrateLoad = clamp(
      ((totalNInput - denitrificationFlux) / 76) *
        (0.75 + 0.5 * runoffIntensity) *
        (1 - (vars.wetlandBuffer / 100) * 0.32),
      0.2,
      26.0
    );

    const pWeatheringAndMiningFlux =
      3.4 +
      vars.phosphateMining +
      (vars.wastewaterPhosphates / 100) * 14.0 +
      (vars.deforestationRate / 100) * 4.0;

    const erosionFactor = clamp(
      1.15 -
        (vars.erosionControl / 100) * 0.62 -
        (vars.grasslandCover / 100) * 0.22 +
        (vars.deforestationRate / 100) * 0.42,
      0.18,
      1.85
    );
    const pRunoffFlux =
      (pWeatheringAndMiningFlux * 0.32 * erosionFactor +
        (vars.wastewaterPhosphates / 100) * 5.2) *
      (0.7 + 0.42 * runoffIntensity) *
      (1 - (vars.wetlandBuffer / 100) * 0.25);

    const reactivePhosphate = clamp(pRunoffFlux * 6.4, 4.0, 280.0);

    const nScore = clamp((aquaticNitrateLoad - 0.8) / 10.0, 0, 1);
    const pScore = clamp((reactivePhosphate - 15) / 120.0, 0, 1);
    const tempBoost = clamp(1 + globalTempAnomaly * 0.12, 0.8, 1.55);
    const algalBloomIndex = clamp(
      (0.45 * nScore + 0.55 * pScore) * 100 * tempBoost,
      3,
      100
    );

    const saturationDO = clamp(10.1 - globalTempAnomaly * 0.28, 7.2, 11.2);
    const oxygenDemand = (algalBloomIndex / 100) * 7.6;
    const dissolvedOxygen = clamp(saturationDO - oxygenDemand, 0.6, 10.5);

    const oceanPH = clamp(
      8.22 - 0.34 * Math.log10(Math.max(co2, 260) / 280) * 1.45,
      7.65,
      8.26
    );

    const climateStability = clamp(
      100 - Math.abs(co2 - 295) * 0.22 - Math.max(0, globalTempAnomaly - 0.4) * 18,
      5,
      100
    );
    const waterQualityIndex = clamp(
      (dissolvedOxygen / 9.5) * 55 +
        (1 - clamp(aquaticNitrateLoad / 14, 0, 1)) * 25 +
        (1 - clamp(reactivePhosphate / 160, 0, 1)) * 20,
      5,
      100
    );
    const nutrientBalance = clamp(
      100 -
        Math.max(0, aquaticNitrateLoad - 2.5) * 5.2 -
        Math.max(0, reactivePhosphate - 30) * 0.45,
      5,
      100
    );
    const biodiversityHealth = clamp(
      0.3 * climateStability +
        0.35 * waterQualityIndex +
        0.2 * (100 - vars.deforestationRate * 0.65) +
        0.15 * groundwater,
      8,
      100
    );
    const ecosystemHealth = clamp(
      (climateStability + waterQualityIndex + nutrientBalance + biodiversityHealth) / 4,
      5,
      100
    );

    const status =
      ecosystemHealth >= 74 && dissolvedOxygen >= 6.5 && co2 < 385
        ? 'NOMINAL'
        : ecosystemHealth >= 48 && dissolvedOxygen >= 3.5 && co2 < 520
          ? 'STRESSED'
          : 'CRITICAL';

    points.push({
      year,
      atmosphericCO2: Number(co2.toFixed(1)),
      oceanPH: Number(oceanPH.toFixed(3)),
      terrestrialBiomassC: Number(biomassC.toFixed(1)),
      soilOrganicC: Number(soilC.toFixed(1)),
      netCarbonFlux: Number(netCarbonFlux.toFixed(2)),
      photosynthesisFlux: Number(photosynthesisFlux.toFixed(1)),
      oceanCarbonUptake: Number(oceanCarbonUptake.toFixed(2)),
      globalTempAnomaly: Number(globalTempAnomaly.toFixed(2)),
      soilNitrate: Number(soilNitrate.toFixed(1)),
      nitrousOxideFlux: Number(nitrousOxideFlux.toFixed(2)),
      aquaticNitrateLoad: Number(aquaticNitrateLoad.toFixed(2)),
      nFixationFlux: Number(naturalFixation.toFixed(1)),
      denitrificationFlux: Number(denitrificationFlux.toFixed(1)),
      reactivePhosphate: Number(reactivePhosphate.toFixed(1)),
      sedimentPhosphatePool: Number(sedimentP.toFixed(1)),
      pWeatheringAndMiningFlux: Number(pWeatheringAndMiningFlux.toFixed(1)),
      pRunoffFlux: Number(pRunoffFlux.toFixed(2)),
      algalBloomIndex: Number(algalBloomIndex.toFixed(1)),
      dissolvedOxygen: Number(dissolvedOxygen.toFixed(2)),
      precipitationRate: Number(precipitationRate.toFixed(0)),
      evaporationFlux: Number(evaporationFlux.toFixed(0)),
      transpirationFlux: Number(transpirationFlux.toFixed(0)),
      surfaceRunoff: Number(surfaceRunoff.toFixed(0)),
      infiltrationFlux: Number(infiltrationFlux.toFixed(0)),
      groundwaterTable: Number(groundwater.toFixed(1)),
      snowpackVolume: Number(snowpack.toFixed(1)),
      climateStability: Number(climateStability.toFixed(1)),
      waterQualityIndex: Number(waterQualityIndex.toFixed(1)),
      nutrientBalance: Number(nutrientBalance.toFixed(1)),
      biodiversityHealth: Number(biodiversityHealth.toFixed(1)),
      ecosystemHealth: Number(ecosystemHealth.toFixed(1)),
      status,
    });

    co2 = clamp(co2 + netCarbonFlux * 0.47 * stepYears, 240, 1100);
    biomassC = clamp(
      biomassC +
        ((vars.reforestationEffort - vars.deforestationRate) * 0.035) * stepYears,
      260,
      780
    );
    soilC = clamp(
      soilC +
        ((vars.reforestationEffort * 0.015 +
          vars.grasslandCover * 0.024 -
          vars.deforestationRate * 0.025) -
          Math.max(0, baseTemp) * 0.25) *
          stepYears,
      1100,
      1850
    );
    soilNitrate = clamp(
      soilNitrate +
        ((totalNInput - denitrificationFlux) * 0.045 - soilNitrate * 0.06) *
          (stepYears / 5),
      4,
      115
    );
    sedimentP = clamp(sedimentP + pRunoffFlux * 0.09 * stepYears, 380, 950);

    const targetSnow = clamp(98 - Math.max(0, globalTempAnomaly) * 19, 8, 100);
    snowpack = snowpack + (targetSnow - snowpack) * 0.25;

    const rechargeBalance =
      (infiltrationFlux - 360) * 0.045 - (vars.groundwaterExtraction - 20) * 0.14;
    groundwater = clamp(groundwater + rechargeBalance * (stepYears / 5), 10, 100);
  }

  return points;
}

export function getActiveChallengeIds(metrics: SimulationMetrics): string[] {
  return CHALLENGE_GOALS.filter((c) => c.check(metrics)).map((c) => c.id);
}

export function buildCSVReport(
  series: SimulationMetrics[],
  groupName: string,
  scenarioName: string
): string {
  const headers = [
    'Group',
    'Scenario',
    'Year',
    'CO2_ppm',
    'TempAnomaly_C',
    'Ocean_pH',
    'AquaticNitrate_mgL',
    'ReactivePhosphate_ugL',
    'AlgalBloom_Index',
    'DissolvedO2_mgL',
    'Precipitation_mmyr',
    'SurfaceRunoff_mmyr',
    'Groundwater_pct',
    'Snowpack_pct',
    'EcosystemHealth_pct',
    'Status',
  ];

  const rows = series.map((m) =>
    [
      `"${groupName.replace(/"/g, '""')}"`,
      `"${scenarioName.replace(/"/g, '""')}"`,
      m.year,
      m.atmosphericCO2,
      m.globalTempAnomaly,
      m.oceanPH,
      m.aquaticNitrateLoad,
      m.reactivePhosphate,
      m.algalBloomIndex,
      m.dissolvedOxygen,
      m.precipitationRate,
      m.surfaceRunoff,
      m.groundwaterTable,
      m.snowpackVolume,
      m.ecosystemHealth,
      m.status,
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

export function buildMarkdownLabReport(
  groupName: string,
  studentNames: string,
  roomCode: string,
  scenario: ScenarioPreset,
  vars: SimulationVariables,
  currentMetrics: SimulationMetrics
): string {
  const completed = CHALLENGE_GOALS.filter((g) => g.check(currentMetrics));
  return `# TerraFlux Biogeochemical Lab Report

**Group:** ${groupName}  
**Students:** ${studentNames || 'Not specified'}  
**Classroom Code:** ${roomCode}  
**Scenario:** ${scenario.name}  
**Simulation Year:** Year ${currentMetrics.year}  
**Overall Ecosystem Status:** ${currentMetrics.status} (${currentMetrics.ecosystemHealth}% Health)

---

## 1. Input Variables Configured
- **Carbon Cycle:** Factories & Fuels = ${vars.fossilFuelEmissions} GtC/yr | Forests = ${vars.reforestationEffort}% | Prairie Grasslands = ${vars.grasslandCover}% | Land Clearing = ${vars.deforestationRate}%
- **Nitrogen Cycle:** Farm Fertilizer = ${vars.syntheticFertilizer} MtN/yr | Wetland Buffers = ${vars.wetlandBuffer}% | Clover Cover Crops = ${vars.legumeCoverCrops}% | Livestock = ${vars.livestockDensity}%
- **Phosphorus Cycle:** Phosphate Mining = ${vars.phosphateMining} MtP/yr | Detergents & Sewage = ${vars.wastewaterPhosphates}% | Grass Buffers & Terracing = ${vars.erosionControl}%
- **Water Cycle:** Sun Heat Forcing = ${vars.solarForcing} °C | Paved Cities = ${vars.imperviousSurface}% | Well Pumping = ${vars.groundwaterExtraction}%

---

## 2. Simulated Environmental Impacts (Year ${currentMetrics.year})
| Metric | Value | Units |
| :--- | ---: | :--- |
| Atmospheric CO2 | ${currentMetrics.atmosphericCO2} | ppm |
| Global Temp Anomaly | ${currentMetrics.globalTempAnomaly} | °C |
| Ocean Surface pH | ${currentMetrics.oceanPH} | pH |
| Aquatic Nitrate Load | ${currentMetrics.aquaticNitrateLoad} | mg/L |
| Reactive Phosphate | ${currentMetrics.reactivePhosphate} | ug/L |
| Algal Bloom Index | ${currentMetrics.algalBloomIndex} | /100 |
| Dissolved Oxygen | ${currentMetrics.dissolvedOxygen} | mg/L |
| Surface Runoff | ${currentMetrics.surfaceRunoff} | mm/yr |
| Groundwater Table | ${currentMetrics.groundwaterTable} | % |
| Alpine Snowpack | ${currentMetrics.snowpackVolume} | % |

---

## 3. Classroom Scenario Challenges Achieved (${completed.length}/${CHALLENGE_GOALS.length})
${CHALLENGE_GOALS.map(
  (g) => `- [${completed.some((c) => c.id === g.id) ? 'x' : ' '}] **${g.title}** (${g.criterionText})`
).join('\n')}
`;
}
