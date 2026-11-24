export type CycleId = 'carbon' | 'nitrogen' | 'phosphorus' | 'water';

export type LearningModuleId =
  | 'carbon'
  | 'nitrogen'
  | 'phosphorus'
  | 'water'
  | 'climate';

export type LayerId =
  | 'carbon'
  | 'nitrogen'
  | 'phosphorus'
  | 'water'
  | 'subsurface'
  | 'equations';

export type ScenarioId =
  | 'preindustrial'
  | 'industrial'
  | 'ag_intensification'
  | 'regenerative';

export type EcosystemStatus = 'NOMINAL' | 'STRESSED' | 'CRITICAL';

export interface SimulationVariables {
  // Carbon Cycle
  fossilFuelEmissions: number; // 0 - 20 GtC/yr (Coal & Oil Factories)
  deforestationRate: number; // 0 - 100 % (Wildfire & Clearing)
  reforestationEffort: number; // 0 - 100 % (Forests & Woodlands)
  grasslandCover: number; // 0 - 100 % (Grasslands & Prairies)

  // Nitrogen Cycle
  syntheticFertilizer: number; // 0 - 200 MtN/yr (Farm Fertilizer)
  wetlandBuffer: number; // 0 - 100 % (Marshes & Wetlands)
  legumeCoverCrops: number; // 0 - 100 % (Clover & Beans)
  livestockDensity: number; // 0 - 100 % (Livestock & Manure)

  // Phosphorus Cycle
  phosphateMining: number; // 0 - 50 MtP/yr (Phosphate Rock Mining)
  wastewaterPhosphates: number; // 0 - 100 % (Detergents & Sewage)
  erosionControl: number; // 0 - 100 % (Grass Buffers & Terracing)

  // Water Cycle
  solarForcing: number; // -1.0 to 4.0 degC (Sun Heat & Air Temp)
  imperviousSurface: number; // 0 - 100 % (Paved Cities & Roads)
  groundwaterExtraction: number; // 0 - 100 % (Well & Farm Pumping)
}

export interface SimulationMetrics {
  year: number;

  // Carbon reservoirs & fluxes
  atmosphericCO2: number; // ppm
  oceanPH: number; // pH units
  terrestrialBiomassC: number; // GtC
  soilOrganicC: number; // GtC
  netCarbonFlux: number; // GtC/yr (positive = atmospheric accumulation)
  photosynthesisFlux: number; // GtC/yr
  oceanCarbonUptake: number; // GtC/yr
  globalTempAnomaly: number; // degC

  // Nitrogen reservoirs & fluxes
  soilNitrate: number; // mg/kg
  nitrousOxideFlux: number; // Mt N2O/yr
  aquaticNitrateLoad: number; // mg/L
  nFixationFlux: number; // MtN/yr
  denitrificationFlux: number; // MtN/yr

  // Phosphorus reservoirs & fluxes
  reactivePhosphate: number; // ug/L
  sedimentPhosphatePool: number; // MtP
  pWeatheringAndMiningFlux: number; // MtP/yr
  pRunoffFlux: number; // MtP/yr
  algalBloomIndex: number; // 0 - 100
  dissolvedOxygen: number; // mg/L

  // Water reservoirs & fluxes
  precipitationRate: number; // mm/yr
  evaporationFlux: number; // mm/yr
  transpirationFlux: number; // mm/yr
  surfaceRunoff: number; // mm/yr
  infiltrationFlux: number; // mm/yr
  groundwaterTable: number; // % capacity
  snowpackVolume: number; // % baseline

  // Composite Indices (0 - 100)
  climateStability: number;
  waterQualityIndex: number;
  nutrientBalance: number;
  biodiversityHealth: number;
  ecosystemHealth: number;
  status: EcosystemStatus;
}

export interface ScenarioPreset {
  id: ScenarioId;
  name: string;
  shortName: string;
  description: string;
  learningGoal: string;
  variables: SimulationVariables;
}

export interface CycleNodeInfo {
  id: string;
  label: string;
  cycles: CycleId[];
  xPercent: number;
  yPercent: number;
  equation: string;
  summary: string;
  getReadout: (m: SimulationMetrics) => { label: string; value: string; unit: string }[];
}

export interface ChallengeGoal {
  id: string;
  title: string;
  criterionText: string;
  check: (m: SimulationMetrics) => boolean;
}

export interface GroupSnapshot {
  id: string;
  groupName: string;
  studentNames: string;
  scenarioId: ScenarioId;
  year: number;
  variables: SimulationVariables;
  metrics: SimulationMetrics;
  completedChallenges: string[];
  updatedAt: number;
  isLive: boolean;
  lockedMilestone?: boolean;
}

export interface ClassroomRoomState {
  roomCode: string;
  createdAt: number;
  groups: GroupSnapshot[];
  milestones: GroupSnapshot[];
}
