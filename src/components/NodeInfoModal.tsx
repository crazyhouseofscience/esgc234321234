import React, { useEffect } from 'react';
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  BookOpen,
  FlaskConical,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  LEARNING_MODULES,
  VARIABLE_DEFINITIONS,
} from '../simulation/engine';
import {
  MODULE_ES,
  NODE_ES,
  PATHWAY_ES,
  VARIABLE_ES,
  translateRateText,
  type Language,
} from '../i18n/translations';
import type { MapNodeSpec, MapPathwaySpec } from '../simulation/modulesMap';
import type {
  LearningModuleId,
  SimulationMetrics,
  SimulationVariables,
} from '../types/simulation';

interface NodeLinkConfig {
  incomingIds: string[];
  outgoingIds: string[];
  variableKeys: (keyof SimulationVariables)[];
  processHighlight: string;
  processHighlightEs: string;
}

const NODE_PROCESS_LINKS: Record<string, NodeLinkConfig> = {
  // Carbon Cycle
  c_atmosphere: {
    incomingIds: ['c_resp', 'c_fossil_flux', 'c_ocean_flux'],
    outgoingIds: ['c_photo', 'c_ocean_flux'],
    variableKeys: ['fossilFuelEmissions', 'reforestationEffort', 'deforestationRate'],
    processHighlight:
      'Receives CO₂ from respiration and fossil fuel combustion; supplies CO₂ for plant photosynthesis and exchanges two ways across the ocean surface.',
    processHighlightEs:
      'Recibe CO₂ de la respiración y combustión fósil; aporta CO₂ para la fotosíntesis vegetal e intercambia en dos sentidos con la superficie oceánica.',
  },
  c_forest: {
    incomingIds: ['c_photo'],
    outgoingIds: ['c_consume', 'c_litter', 'c_resp'],
    variableKeys: ['reforestationEffort', 'grasslandCover', 'deforestationRate'],
    processHighlight:
      'Captures atmospheric CO₂ via sunlight-powered photosynthesis into glucose (C₆H₁₂O₆), wood, and deep prairie roots, feeding consumers and soil humus.',
    processHighlightEs:
      'Captura CO₂ atmosférico mediante fotosíntesis solar en glucosa (C₆H₁₂O₆), madera y raíces profundas, alimentando consumidores y humus del suelo.',
  },
  c_animals: {
    incomingIds: ['c_consume'],
    outgoingIds: ['c_resp', 'c_litter'],
    variableKeys: ['grasslandCover', 'reforestationEffort'],
    processHighlight:
      'Assimilates organic plant carbon through grazing and food webs, then returns CO₂ gas continuously through cellular respiration and dead-matter detritus.',
    processHighlightEs:
      'Asimila carbono orgánico vegetal al alimentarse y devuelve gas CO₂ continuamente mediante respiración celular y detritos.',
  },
  c_soil: {
    incomingIds: ['c_litter'],
    outgoingIds: ['c_resp', 'c_fossil_flux'],
    variableKeys: ['grasslandCover', 'deforestationRate'],
    processHighlight:
      'Bacteria, fungi, and detritus feeders (worms, insects) decompose dead matter into humus and CO₂; oxygen-free deep burial over millions of years forms fossil fuels.',
    processHighlightEs:
      'Bacterias, hongos y detritívoros descomponen materia muerta en humus y CO₂; el entierro profundo sin oxígeno forma combustibles fósiles tras millones de años.',
  },
  c_fossil: {
    incomingIds: ['c_litter'],
    outgoingIds: ['c_fossil_flux'],
    variableKeys: ['fossilFuelEmissions'],
    processHighlight:
      'Burns ancient buried coal, oil, and natural gas in factories and vehicles, rapidly injecting locked geologic carbon straight into the atmosphere.',
    processHighlightEs:
      'Quema carbón, petróleo y gas natural enterrados en fábricas y vehículos, inyectando rápidamente carbono geológico hacia la atmósfera.',
  },
  c_ocean: {
    incomingIds: ['c_ocean_flux'],
    outgoingIds: ['c_ocean_flux'],
    variableKeys: ['fossilFuelEmissions', 'reforestationEffort'],
    processHighlight:
      'Buffers atmospheric CO₂ through two-way gas diffusion across sea waves; dissolving excess CO₂ forms carbonic acid (H₂CO₃), lowering ocean surface pH.',
    processHighlightEs:
      'Modera el CO₂ atmosférico por difusión gaseosa en dos sentidos; disolver exceso de CO₂ forma ácido carbónico (H₂CO₃) bajando el pH marino.',
  },

  // Nitrogen Cycle
  n_atmosphere: {
    incomingIds: ['n_denit'],
    outgoingIds: ['n_fix'],
    variableKeys: ['legumeCoverCrops', 'wetlandBuffer'],
    processHighlight:
      'Holds 78% of air as triple-bonded N₂(g) that plants and animals cannot break directly without nitrogen-fixing bacteria or lightning.',
    processHighlightEs:
      'Contiene 78% del aire como gas N₂ con enlace triple que plantas y animales no pueden romper sin bacterias fijadoras o rayos.',
  },
  n_legumes: {
    incomingIds: ['n_fix'],
    outgoingIds: ['n_nitrify', 'n_assim'],
    variableKeys: ['legumeCoverCrops'],
    processHighlight:
      'Symbiotic Rhizobia bacteria inside clover and bean root nodules split the N≡N bond into plant-usable ammonium (NH₄⁺).',
    processHighlightEs:
      'Las bacterias simbióticas Rhizobia en nódulos de trébol y frijol rompen el enlace N≡N convirtiéndolo en amonio utilizable (NH₄⁺).',
  },
  n_soil: {
    incomingIds: ['n_nitrify'],
    outgoingIds: ['n_assim', 'n_runoff_wetland'],
    variableKeys: ['syntheticFertilizer', 'livestockDensity'],
    processHighlight:
      'Decomposers convert waste to ammonium (ammonification), then nitrifying bacteria oxidize NH₄⁺ into soluble nitrates (NO₃⁻) alongside synthetic fertilizers.',
    processHighlightEs:
      'Descomponedores forman amonio (amonificación) y bacterias nitrificantes oxidan NH₄⁺ en nitratos solubles (NO₃⁻) junto a fertilizantes sintéticos.',
  },
  n_animals: {
    incomingIds: ['n_assim'],
    outgoingIds: ['n_nitrify'],
    variableKeys: ['livestockDensity', 'legumeCoverCrops'],
    processHighlight:
      'Plants build nitrates into amino acids, proteins, and DNA/RNA; herbivores eat plants to acquire nitrogen, and manure/waste recycles back to soil.',
    processHighlightEs:
      'Las plantas transforman nitratos en aminoácidos, proteínas y ADN/ARN; los herbívoros comen plantas y el estiércol recicla el nitrógeno al suelo.',
  },
  n_wetland: {
    incomingIds: ['n_runoff_wetland'],
    outgoingIds: ['n_denit', 'n_coastal'],
    variableKeys: ['wetlandBuffer', 'syntheticFertilizer'],
    processHighlight:
      'Oxygen-poor marsh soils house denitrifying bacteria that convert harmful runoff nitrate (NO₃⁻) back into harmless N₂ gas.',
    processHighlightEs:
      'Los suelos pantanosos pobres en oxígeno alojan bacterias desnitrificantes que devuelven el nitrato (NO₃⁻) como gas N₂ inofensivo.',
  },
  n_estuary: {
    incomingIds: ['n_coastal'],
    outgoingIds: [],
    variableKeys: ['syntheticFertilizer', 'wetlandBuffer', 'livestockDensity'],
    processHighlight:
      'Unfiltered nitrate reaching coastal bays triggers explosive algal blooms whose decay strips dissolved oxygen from marine habitats.',
    processHighlightEs:
      'El nitrato sin filtrar que llega a bahías costeras provoca floraciones algales explosivas cuya descomposición agota el oxígeno disuelto.',
  },

  // Phosphorus Cycle
  p_rock: {
    incomingIds: ['p_uplift'],
    outgoingIds: ['p_weather'],
    variableKeys: ['phosphateMining'],
    processHighlight:
      'Main terrestrial phosphorus reservoir; rain weathering slowly frees PO₄³⁻ from Ca₃(PO₄)₂ rock, while open-pit mining accelerates extraction.',
    processHighlightEs:
      'Principal reserva terrestre de fósforo; la meteorización libera PO₄³⁻ lentamente de la roca Ca₃(PO₄)₂, mientras la minería acelera la extracción.',
  },
  p_soil: {
    incomingIds: ['p_weather', 'p_decomp'],
    outgoingIds: ['p_absorb', 'p_erosion'],
    variableKeys: ['erosionControl', 'deforestationRate', 'wastewaterPhosphates'],
    processHighlight:
      'Binds dissolved and clay-attached PO₄³⁻ from weathered rock and decomposition; grass terraces hold soil while bare slopes erode into rivers.',
    processHighlightEs:
      'Retiene PO₄³⁻ disuelto y ligado a arcilla; las terrazas vegetales sujetan el suelo mientras las laderas desnudas se erosionan hacia los ríos.',
  },
  p_life: {
    incomingIds: ['p_absorb'],
    outgoingIds: ['p_decomp'],
    variableKeys: ['deforestationRate', 'erosionControl'],
    processHighlight:
      'Plants absorb PO₄³⁻ through roots and pass it to animals to build DNA, RNA, ATP energy, phospholipid membranes, and bones/teeth; decomposers recycle waste.',
    processHighlightEs:
      'Las plantas absorben PO₄³⁻ por raíces y lo pasan a animales para ADN, ARN, ATP, membranas celulares y huesos; los descomponedores reciclan desechos.',
  },
  p_estuary: {
    incomingIds: ['p_erosion'],
    outgoingIds: ['p_burial'],
    variableKeys: ['wastewaterPhosphates', 'phosphateMining', 'erosionControl'],
    processHighlight:
      'Collects phosphate from eroded soil, mined fertilizer, and household detergents—fueling freshwater and coastal algal blooms.',
    processHighlightEs:
      'Recoge fosfato de suelos erosionados, minería y detergentes domésticos—alimentando floraciones algales en ríos y costas.',
  },
  p_sediment: {
    incomingIds: ['p_burial'],
    outgoingIds: ['p_uplift'],
    variableKeys: ['erosionControl', 'phosphateMining'],
    processHighlight:
      'Locks settling phosphate on the ocean floor because phosphorus has no gas phase; returns to land only via plate tectonic upthrust over millions of years.',
    processHighlightEs:
      'Entierra el fosfato en el fondo marino porque el fósforo no tiene fase gaseosa; solo vuelve a tierra por levantamiento tectónico tras millones de años.',
  },

  // Water Cycle
  w_clouds: {
    incomingIds: ['w_evap', 'w_transp'],
    outgoingIds: ['w_precip'],
    variableKeys: ['solarForcing', 'reforestationEffort'],
    processHighlight:
      'Condenses ocean-evaporated and tree-transpired water vapor into clouds before gravity pulls rain, sleet, and snow back to Earth.',
    processHighlightEs:
      'Condensa vapor oceánico y transpirado por árboles formando nubes antes de que la gravedad atraiga lluvia, aguanieve y nieve a la Tierra.',
  },
  w_snow: {
    incomingIds: ['w_precip'],
    outgoingIds: ['w_transp', 'w_runoff'],
    variableKeys: ['solarForcing', 'reforestationEffort'],
    processHighlight:
      'Stores alpine snowpack and powers forest transpiration through leaf stomata, directly shaping soil moisture and biome wildlife.',
    processHighlightEs:
      'Almacena nieve alpina e impulsa la transpiración forestal por estomas, definiendo la humedad del suelo y la vida del bioma.',
  },
  w_valley: {
    incomingIds: ['w_precip'],
    outgoingIds: ['w_runoff', 'w_infilt'],
    variableKeys: ['imperviousSurface', 'reforestationEffort'],
    processHighlight:
      'Splits incoming rain between rapid surface runoff over paved roads/rivers and slow downward infiltration through vegetated soil sponges.',
    processHighlightEs:
      'Divide la lluvia entre escorrentía superficial rápida por calles/ríos e infiltración lenta hacia el subsuelo en suelos con vegetación.',
  },
  w_aquifer: {
    incomingIds: ['w_infilt'],
    outgoingIds: ['w_seepage'],
    variableKeys: ['imperviousSurface', 'groundwaterExtraction'],
    processHighlight:
      'Permeable underground rock, sand, and gravel pores store recharged groundwater and slowly feed rivers and oceans via subsurface seepage.',
    processHighlightEs:
      'Poros subterráneos de roca permeable, arena y grava almacenan agua subterránea recargada y alimentan lentamente ríos y océanos por filtración.',
  },
  w_ocean: {
    incomingIds: ['w_runoff', 'w_seepage'],
    outgoingIds: ['w_evap'],
    variableKeys: ['solarForcing', 'imperviousSurface'],
    processHighlight:
      'Stores ~97% of Earth’s water; receives land water from both river surface runoff and aquifer seepage while solar energy drives evaporation.',
    processHighlightEs:
      'Guarda ~97% del agua terrestre; recibe agua continental por escorrentía fluvial y filtración acuífera mientras la energía solar impulsa la evaporación.',
  },

  // Climate Impact
  cl_atmosphere: {
    incomingIds: ['cl_warming'],
    outgoingIds: ['cl_melt', 'cl_acid'],
    variableKeys: ['fossilFuelEmissions', 'syntheticFertilizer'],
    processHighlight:
      'Combines CO₂ and agricultural N₂O radiative forcing, raising air temperature, intensifying evaporation, and driving ocean acidification.',
    processHighlightEs:
      'Combina el calentamiento por CO₂ y N₂O agrícola, elevando la temperatura del aire, intensificando la evaporación y acidificando el océano.',
  },
  cl_snow: {
    incomingIds: ['cl_melt'],
    outgoingIds: ['cl_nutrient_flush'],
    variableKeys: ['fossilFuelEmissions', 'solarForcing'],
    processHighlight:
      'Warming air accelerates alpine glacier and snowpack melt, shifting seasonal river runoff peaks and flushing land nutrients downstream.',
    processHighlightEs:
      'El aire más cálido acelera el deshielo alpino, cambiando caudales estacionales y arrastrando nutrientes terrestres río abajo.',
  },
  cl_forest: {
    incomingIds: [],
    outgoingIds: ['cl_warming'],
    variableKeys: ['reforestationEffort', 'deforestationRate', 'grasslandCover'],
    processHighlight:
      'Simultaneously sequesters carbon, cools air via transpiration, and anchors soil phosphorus against extreme storm erosion.',
    processHighlightEs:
      'Captura carbono simultáneamente, enfría el aire por transpiración y fija el fósforo del suelo frente a la erosión tormentosa.',
  },
  cl_farmland: {
    incomingIds: ['cl_melt'],
    outgoingIds: ['cl_nutrient_flush'],
    variableKeys: ['syntheticFertilizer', 'phosphateMining', 'imperviousSurface'],
    processHighlight:
      'Heavy storm runoff washes excess Nitrogen (NO₃⁻) and Phosphorus (PO₄³⁻) simultaneously off fertilized and paved watersheds.',
    processHighlightEs:
      'Las tormentas lavan simultáneamente exceso de Nitrógeno (NO₃⁻) y Fósforo (PO₄³⁻) desde suelos fertilizados y pavimentados.',
  },
  cl_estuary: {
    incomingIds: ['cl_nutrient_flush', 'cl_acid'],
    outgoingIds: [],
    variableKeys: ['fossilFuelEmissions', 'syntheticFertilizer', 'phosphateMining'],
    processHighlight:
      'Experiences compound stress: CO₂ lowers ocean pH while warm N + P runoff sparks hypoxic algal blooms that strip dissolved oxygen.',
    processHighlightEs:
      'Sufre estrés compuesto: el CO₂ baja el pH marino mientras la escorrentía cálida de N + P genera algas que agotan el oxígeno disuelto.',
  },
};

interface NodeInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: LearningModuleId;
  node: MapNodeSpec | null;
  pathways: MapPathwaySpec[];
  metrics: SimulationMetrics;
  variables: SimulationVariables;
  onOpenCycleSummary?: () => void;
  language: Language;
}

export const NodeInfoModal: React.FC<NodeInfoModalProps> = ({
  isOpen,
  onClose,
  activeModule,
  node,
  pathways,
  metrics,
  variables,
  onOpenCycleSummary,
  language,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !node) return null;

  const isEs = language === 'es';
  const moduleMeta =
    LEARNING_MODULES.find((m) => m.id === activeModule) ?? LEARNING_MODULES[0];
  const moduleTitle = isEs ? MODULE_ES[activeModule].title : moduleMeta.title;
  const nodeTr = isEs ? NODE_ES[node.id] : undefined;
  const linkConfig = NODE_PROCESS_LINKS[node.id];

  const incomingPathways = linkConfig
    ? pathways.filter((p) => linkConfig.incomingIds.includes(p.id))
    : [];
  const outgoingPathways = linkConfig
    ? pathways.filter((p) => linkConfig.outgoingIds.includes(p.id))
    : [];
  const relatedVariables = linkConfig
    ? VARIABLE_DEFINITIONS.filter((d) => linkConfig.variableKeys.includes(d.key))
    : [];
  const readouts = node.getReadout(metrics, variables);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="node-info-modal-title"
    >
      <div
        className="w-full max-w-2xl max-h-[88vh] flex flex-col bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${moduleMeta.accentDot}`} />
              <span>
                {moduleMeta.step}. {moduleTitle} ·{' '}
                {isEs ? 'Punto de Proceso del Nodo' : 'Node Process Hotspot'}
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-2">
              <h2
                id="node-info-modal-title"
                className="text-base sm:text-lg font-bold text-slate-950"
              >
                {nodeTr?.label ?? node.label}
              </h2>
              <span className="text-xs font-mono font-semibold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
                {nodeTr?.chemicalForm ?? node.chemicalForm}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isEs ? 'Cerrar detalles del nodo' : 'Close node process details'}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Live Node Measurements */}
          <div className="grid grid-cols-2 gap-2.5">
            {readouts.map((r, idx) => (
              <div
                key={r.label}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 flex items-baseline justify-between gap-2"
              >
                <span className="text-xs font-semibold text-slate-600">
                  {nodeTr?.readouts[idx] ?? r.label}
                </span>
                <span className="text-base font-bold font-mono tabular-nums text-slate-950">
                  {r.value}{' '}
                  <span className="text-xs font-normal text-slate-500">
                    {isEs ? r.unit.replace('/yr', '/año') : r.unit}
                  </span>
                </span>
              </div>
            ))}
          </div>

          {/* Biogeochemical Process Explanation */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-700">
              <FlaskConical className="w-3.5 h-3.5 text-sky-700" />
              <span>
                {isEs
                  ? 'Procesos Biogeoquímicos en Este Nodo'
                  : 'Biogeochemical Processes at This Node'}
              </span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed">
              {nodeTr?.summary ?? node.summary}
            </p>
            {linkConfig && (
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                <strong className="text-slate-800">
                  {isEs ? `Rol Activo en ${moduleTitle}:` : `Active Role in ${moduleTitle}:`}
                </strong>{' '}
                {isEs ? linkConfig.processHighlightEs : linkConfig.processHighlight}
              </p>
            )}
            <div className="px-2.5 py-1.5 rounded-md bg-slate-900 text-sky-200 font-mono text-xs">
              {nodeTr?.equation ?? node.equation}
            </div>
          </div>

          {/* Connected Incoming & Outgoing Flows */}
          {(incomingPathways.length > 0 || outgoingPathways.length > 0) && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-700">
                <Activity className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {isEs ? 'Flujos y Rutas Conectadas' : 'Connected Fluxes & Pathways'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {incomingPathways.map((p) => {
                  const pTr = isEs ? PATHWAY_ES[p.id] : undefined;
                  return (
                    <div
                      key={`in-${p.id}`}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900">
                          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          {p.stepNum}. {pTr?.processName ?? p.processName}
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-slate-700">
                          {translateRateText(p.getRateText(metrics, variables), language)}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-600">
                        {pTr?.fromLabel ?? p.fromLabel} {p.bidirectional ? '⇌' : '→'}{' '}
                        {pTr?.toLabel ?? p.toLabel} · {pTr?.chemicalChange ?? p.chemicalChange}
                      </div>
                      <p className="text-xs text-slate-700 leading-snug">
                        {pTr?.explanation ?? p.explanation}
                      </p>
                    </div>
                  );
                })}

                {outgoingPathways.map((p) => {
                  const pTr = isEs ? PATHWAY_ES[p.id] : undefined;
                  return (
                    <div
                      key={`out-${p.id}`}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900">
                          <ArrowUpRight className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          {p.stepNum}. {pTr?.processName ?? p.processName}
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-slate-700">
                          {translateRateText(p.getRateText(metrics, variables), language)}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-600">
                        {pTr?.fromLabel ?? p.fromLabel} {p.bidirectional ? '⇌' : '→'}{' '}
                        {pTr?.toLabel ?? p.toLabel} · {pTr?.chemicalChange ?? p.chemicalChange}
                      </div>
                      <p className="text-xs text-slate-700 leading-snug">
                        {pTr?.explanation ?? p.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sliders That Control This Node */}
          {relatedVariables.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-700">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-700" />
                <span>
                  {isEs ? 'Variables que Afectan Este Nodo' : 'Variables That Affect This Node'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {relatedVariables.map((def) => {
                  const vTr = isEs ? VARIABLE_ES[def.key] : undefined;
                  return (
                    <div
                      key={def.key}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-0.5"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-slate-900">
                          {vTr?.label ?? def.label}
                        </span>
                        <span className="font-mono font-bold text-slate-900 tabular-nums">
                          {variables[def.key]} {vTr?.unit ?? def.unit}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {vTr?.mechanismHint ?? def.mechanismHint}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2 shrink-0">
          {onOpenCycleSummary ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCycleSummary();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-sky-200 bg-sky-50 text-sky-900 text-xs font-semibold hover:bg-sky-100 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-700" />
              <span>
                {isEs ? `Guía Completa: ${moduleTitle}` : `Full ${moduleTitle} Guide`}
              </span>
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isEs ? 'Cerrar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
