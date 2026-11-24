import type {
  LearningModuleId,
  ScenarioId,
  SimulationMetrics,
  SimulationVariables,
} from '../types/simulation';

export type Language = 'en' | 'es';

export interface TranslatedModuleMeta {
  title: string;
  shortTitle: string;
  subtitle: string;
  coreQuestion: string;
  summary: string;
  fieldImageAlt: string;
}

export const MODULE_ES: Record<LearningModuleId, TranslatedModuleMeta> = {
  carbon: {
    title: 'Ciclo del Carbono',
    shortTitle: '01. Carbono',
    subtitle: 'Atmósfera · Bosques y Praderas · Fábricas · Océano',
    coreQuestion: '¿Cómo cambian las fábricas, los bosques y las praderas el gas CO₂ y el pH del océano?',
    summary:
      'El carbono circula entre el gas CO₂ en el aire, los árboles y pastizales vivos, el humus del suelo, los combustibles fósiles y el ácido carbónico disuelto en el océano.',
    fieldImageAlt: 'Dosel de bosque templado antiguo capturando dióxido de carbono',
  },
  nitrogen: {
    title: 'Ciclo del Nitrógeno',
    shortTitle: '02. Nitrógeno',
    subtitle: 'Aire N₂ · Trébol y Suelo · Ganado · Humedales',
    coreQuestion: '¿Cómo controlan los fertilizantes, el ganado y los humedales la escorrentía de nitratos?',
    summary:
      'El aire es 78% gas N₂, que los microbios o fábricas convierten en amonio y nitrato. Los humedales transforman el exceso de nitrato nuevamente en gas N₂ inofensivo.',
    fieldImageAlt: 'Tierras agrícolas en terrazas junto a un humedal ribereño',
  },
  phosphorus: {
    title: 'Ciclo del Fósforo',
    shortTitle: '03. Fósforo',
    subtitle: 'Roca Fosfórica · Detergentes · Barreras Vegetales · Sedimento',
    coreQuestion: '¿Por qué el fósforo se acumula en ríos y sedimentos en lugar de pasar al aire?',
    summary:
      'El fósforo NO tiene fase gaseosa atmosférica. La minería de rocas y los detergentes en aguas residuales envían PO₄³⁻ disuelto hacia lagos y sedimentos marinos.',
    fieldImageAlt: 'Formación de roca fosfórica sedimentaria junto a un arroyo de montaña',
  },
  water: {
    title: 'Ciclo del Agua',
    shortTitle: '04. Agua',
    subtitle: 'Nubes · Nieve · Ciudades Pavimentadas · Acuíferos',
    coreQuestion: '¿Cómo cambian el pavimento, los bosques y el bombeo la escorrentía frente al agua subterránea?',
    summary:
      'El calor del Sol evapora agua del océano formando lluvia y nieve. Los suelos de bosques y praderas filtran el agua hacia acuíferos, mientras el asfalto provoca escorrentía rápida.',
    fieldImageAlt: 'Cascada alpina de deshielo glacial alimentando un valle fluvial bajo nubes de lluvia',
  },
  climate: {
    title: 'Impacto Climático',
    shortTitle: '05. Impacto Climático',
    subtitle: 'Retroalimentación entre Ciclos · Calentamiento Global · Zonas Muertas',
    coreQuestion: '¿Cómo se combinan las fábricas, las lluvias intensas y los nutrientes para impactar el clima y los océanos?',
    summary:
      'El calentamiento por carbono derrite la nieve e intensifica las tormentas, arrastrando nitrógeno y fósforo hacia bahías cálidas donde las algas agotan el oxígeno.',
    fieldImageAlt: 'Sección transversal completa de una cuenca costera con sistemas atmosféricos, terrestres, acuíferos y marinos',
  },
};

export const SCENARIO_ES: Record<
  ScenarioId,
  { name: string; shortName: string; description: string; learningGoal: string }
> = {
  preindustrial: {
    name: 'Equilibrio Preindustrial (1750)',
    shortName: 'Base 1750',
    description:
      'Intercambio de carbono equilibrado, bosques y praderas intactos, fijación natural de N₂, meteorización lenta y acuíferos permeables.',
    learningGoal:
      'Establecer el equilibrio natural de los cuatro ciclos antes de la perturbación industrial.',
  },
  industrial: {
    name: 'Auge Industrial y Expansión Urbana',
    shortName: 'Auge Fabril',
    description:
      'Fábricas de carbón y petróleo, ciudades pavimentadas y tala de bosques elevan el CO₂, acidifican los océanos y provocan inundaciones.',
    learningGoal:
      'Observar cómo el calentamiento por carbono afecta el pH oceánico, la nieve y la escorrentía urbana.',
  },
  ag_intensification: {
    name: 'Agricultura Intensiva y Escorrentía',
    shortName: 'Agro Intensivo',
    description:
      'Fertilizantes sintéticos, ganado denso, minería de fosfato y drenaje de humedales provocan floraciones algales y zonas muertas costeras.',
    learningGoal:
      'Identificar los umbrales de N + P que colapsan el oxígeno disuelto por debajo de 2.0 mg/L.',
  },
  regenerative: {
    name: 'Cuenca Verde y Cero Neto',
    shortName: 'Verde Cero Neto',
    description:
      'Energía limpia, bosques y praderas restaurados, filtros de humedales y aguas sin fosfatos devuelven el equilibrio al ecosistema.',
    learningGoal:
      'Encontrar las prácticas combinadas que mantienen CO₂ < 350 ppm y O₂ disuelto > 7.5 mg/L.',
  },
};

export const VARIABLE_ES: Record<
  keyof SimulationVariables,
  { label: string; substanceTag: string; mechanismHint: string; unit: string }
> = {
  fossilFuelEmissions: {
    label: 'Fábricas y Combustibles Fósiles',
    substanceTag: 'Carbón / Petróleo → Gas CO₂',
    mechanismHint: 'La combustión quema carbón y petróleo, liberando antiguo gas CO₂ al aire.',
    unit: 'GtC/año',
  },
  reforestationEffort: {
    label: 'Bosques y Arbolado',
    substanceTag: 'Árboles (CO₂ y Transpiración)',
    mechanismHint: 'Los árboles absorben CO₂, transpiran vapor por las hojas y aumentan la infiltración.',
    unit: '%',
  },
  grasslandCover: {
    label: 'Pastizales y Praderas',
    substanceTag: 'Carbono en Raíces Profundas',
    mechanismHint: 'Los pastos de pradera fijan carbono en el subsuelo y frenan la escorrentía.',
    unit: '%',
  },
  deforestationRate: {
    label: 'Tala y Erosión del Suelo',
    substanceTag: 'Madera → CO₂ + Suelo Desnudo',
    mechanismHint: 'Libera carbono vegetal y expone la capa superior del suelo a la erosión por lluvia.',
    unit: '%',
  },
  syntheticFertilizer: {
    label: 'Fertilizante Químico Agrícola',
    substanceTag: 'Sal Nitrato NH₄NO₃',
    mechanismHint: 'Agrega amonio y nitrato solubles que se filtran fácilmente hacia los ríos.',
    unit: 'MtN/año',
  },
  wetlandBuffer: {
    label: 'Pantanos y Humedales Filtro',
    substanceTag: 'NO₃⁻ → Gas N₂',
    mechanismHint: 'Los microbios del humedal convierten el nitrato dañino en gas N₂ inofensivo.',
    unit: '%',
  },
  legumeCoverCrops: {
    label: 'Cultivos de Trébol y Leguminosas',
    substanceTag: 'Aire N₂ → NH₄⁺ en Raíces',
    mechanismHint: 'Las bacterias de nódulos radiculares fijan gas N₂ naturalmente con poca escorrentía.',
    unit: '%',
  },
  livestockDensity: {
    label: 'Ganado y Estiércol',
    substanceTag: 'Amoníaco NH₃ y N₂O',
    mechanismHint: 'El estiércol concentrado libera amoníaco y escorrentía de nitratos.',
    unit: '%',
  },
  phosphateMining: {
    label: 'Minería de Roca Fosfórica',
    substanceTag: 'Mineral Ca₃(PO₄)₂',
    mechanismHint: 'Extrae fosfato mineral para fertilizantes mucho más rápido que la lluvia.',
    unit: 'MtP/año',
  },
  wastewaterPhosphates: {
    label: 'Detergentes y Aguas Residuales',
    substanceTag: 'PO₄³⁻ Disuelto',
    mechanismHint: 'Jabones domésticos y aguas residuales añaden fosfato disuelto directo a los ríos.',
    unit: '%',
  },
  erosionControl: {
    label: 'Barreras Vegetales y Terrazas',
    substanceTag: 'Retención de Arcilla del Suelo',
    mechanismHint: 'Las raíces y terrazas retienen la arcilla para que el fosfato permanezca en el campo.',
    unit: '%',
  },
  solarForcing: {
    label: 'Calor Solar y Temp. del Aire',
    substanceTag: 'H₂O(l) → Calor de Vapor',
    mechanismHint: 'Mayor temperatura del aire acelera la evaporación y derrite la nieve de montaña.',
    unit: '°C',
  },
  imperviousSurface: {
    label: 'Ciudades y Calles Pavimentadas',
    substanceTag: 'Asfalto y Concreto',
    mechanismHint: 'Impide que la lluvia se infiltre al subsuelo, creando escorrentía superficial rápida.',
    unit: '%',
  },
  groundwaterExtraction: {
    label: 'Bombeo de Pozos y Riego',
    substanceTag: 'Extracción de Acuífero H₂O',
    mechanismHint: 'Extrae agua subterránea profunda más rápido de lo que la lluvia puede recargarla.',
    unit: '%',
  },
};

export const NODE_ES: Record<
  string,
  { label: string; chemicalForm: string; summary: string; equation: string; readouts: string[] }
> = {
  c_atmosphere: {
    label: 'Atmósfera',
    chemicalForm: 'Reserva de Gas CO₂',
    summary:
      'Reserva gaseosa de dióxido de carbono. Entra a las plantas por fotosíntesis, se intercambia en dos sentidos con los océanos y aumenta por respiración y combustión fósil.',
    equation: 'CO₂(g) | ΔT ≈ 5.35 · ln(C / C₀)',
    readouts: ['CO₂ Atmosférico', 'Flujo Neto'],
  },
  c_forest: {
    label: 'Plantas y Bosques',
    chemicalForm: 'Fotosíntesis (C₆H₁₂O₆)',
    summary:
      'Los productores primarios absorben CO₂ por los estomas de las hojas durante la fotosíntesis, creando glucosa, madera y raíces que alimentan a los animales.',
    equation: '6CO₂ + 6H₂O + Luz Solar → C₆H₁₂O₆ + 6O₂',
    readouts: ['Fotosíntesis', 'Biomasa Vegetal'],
  },
  c_animals: {
    label: 'Animales (Consumidores)',
    chemicalForm: 'Consumo y Respiración',
    summary:
      'Los herbívoros y consumidores obtienen carbono al comer plantas (u otros animales) y devuelven gas CO₂ a la atmósfera mediante la respiración celular.',
    equation: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energía',
    readouts: ['Biomasa Viva', 'Aporte Fotosintético'],
  },
  c_soil: {
    label: 'Descomponedores y Fósiles',
    chemicalForm: 'Detritos, Humus y Carbón/Petróleo',
    summary:
      'Bacterias, hongos y detritívoros (lombrices, insectos) descomponen restos muertos en humus y CO₂. Los restos sepultados bajo calor y presión sin oxígeno forman carbón, petróleo y gas.',
    equation: 'Materia Muerta → Humus + CO₂ | Entierro + Calor/Presión → Carbón, Petróleo, Gas',
    readouts: ['Carbono del Suelo', 'Sumidero Fotosintético'],
  },
  c_fossil: {
    label: 'Fábricas (Combustión)',
    chemicalForm: 'Carbón / Petróleo / Gas → CO₂',
    summary:
      'La combustión quema combustibles fósiles subterráneos (carbón, petróleo, gas natural), aumentando rápidamente el CO₂ atmosférico más allá de la absorción natural.',
    equation: 'CₓHᵧ + O₂ → CO₂(g) + H₂O + Calor',
    readouts: ['Emisiones Fósiles', 'Deforestación'],
  },
  c_ocean: {
    label: 'Intercambio Oceánico',
    chemicalForm: 'CO₂(g) ⇌ H₂CO₃ / HCO₃⁻',
    summary:
      'Los océanos intercambian CO₂ en ambos sentidos con la atmósfera. Absorber exceso de CO₂ forma ácido carbónico (H₂CO₃), reduciendo el pH del mar.',
    equation: 'CO₂(g) + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻',
    readouts: ['Captura Oceánica', 'pH Superficial del Mar'],
  },
  n_atmosphere: {
    label: 'Atmósfera (78% N₂)',
    chemicalForm: 'Enlace Triple Fuerte N₂',
    summary:
      'Constituye el 78% del aire, pero plantas y animales no pueden usar N₂ directamente porque no pueden romper su fuerte enlace covalente triple sin bacterias fijadoras o rayos.',
    equation: '78% N₂(g) — Enlace covalente triple (N≡N)',
    readouts: ['Fijación Biológica N₂', 'Emisión N₂O'],
  },
  n_legumes: {
    label: 'Bacterias Fijadoras y Trébol',
    chemicalForm: 'N₂ → NH₄⁺ Nódulos Radiculares',
    summary:
      'Las bacterias fijadoras de nitrógeno en el suelo y nódulos de leguminosas (más los rayos) rompen el enlace del N₂ y lo convierten en amonio utilizable (NH₄⁺).',
    equation: 'N₂ + 8H⁺ + 8e⁻ → 2NH₃ + H₂ (Rhizobia + Rayos)',
    readouts: ['Cultivos de Cobertura', 'Fijación Biológica'],
  },
  n_soil: {
    label: 'Amonificación y Nitrificación',
    chemicalForm: 'Restos → NH₄⁺ → NO₃⁻',
    summary:
      'Los descomponedores transforman materia muerta y desechos en amonio (amonificación). Luego las bacterias nitrificantes oxidan el amonio en nitratos (NO₃⁻).',
    equation: 'Desechos → NH₄⁺ (Amonificación) → NO₂⁻ → NO₃⁻ (Nitrificación)',
    readouts: ['Nitrato del Suelo', 'Fertilizante Sintético'],
  },
  n_animals: {
    label: 'Plantas y Animales',
    chemicalForm: 'Proteínas y ADN / ARN',
    summary:
      'Las plantas asimilan nitrato y amonio para formar proteínas (aminoácidos) y ácidos nucleicos (ADN/ARN). Los animales obtienen nitrógeno comiendo plantas.',
    equation: 'NO₃⁻ / NH₄⁺ → Proteínas y ADN Vegetal → Herbívoros (Consumo)',
    readouts: ['Densidad Ganadera', 'Flujo de Gas N₂O'],
  },
  n_wetland: {
    label: 'Humedal Ribereño',
    chemicalForm: 'Desnitrificación (NO₃⁻ → N₂)',
    summary:
      'Las bacterias desnitrificantes en suelos inundados convierten el exceso de nitrato (NO₃⁻) nuevamente en gas N₂, completando el ciclo y protegiendo los estuarios.',
    equation: '2NO₃⁻ + 10e⁻ + 12H⁺ → N₂(g) + 6H₂O',
    readouts: ['Desnitrificación', 'Filtro de Humedal'],
  },
  n_estuary: {
    label: 'Estuario Costero',
    chemicalForm: 'Escorrentía de NO₃⁻ Disuelto',
    summary:
      'El nitrato que escapa de los humedales llega a las bahías costeras, provocando floraciones algales que al descomponerse agotan el oxígeno disuelto del agua.',
    equation: 'Exceso NO₃⁻ → Floración Algal → Pérdida de O₂',
    readouts: ['Nitrato Acuático', 'Oxígeno Disuelto'],
  },
  p_rock: {
    label: 'Roca Fosfórica',
    chemicalForm: 'Reserva Principal: Ca₃(PO₄)₂',
    summary:
      'La reserva principal de fósforo en la Tierra es la roca sedimentaria terrestre y los sedimentos marinos. La lluvia la meteoriza lentamente; la minería la acelera.',
    equation: 'Ca₃(PO₄)₂(s) + Meteorización / Minería → PO₄³⁻',
    readouts: ['Minería + Meteorización', 'Minería de Fosfato'],
  },
  p_soil: {
    label: 'Zona de Suelo y Agua',
    chemicalForm: 'PO₄³⁻ Disuelto y en Arcilla',
    summary:
      'Recibe fosfato disuelto de rocas meteorizadas, fertilizantes y descomposición. La arcilla retiene el fosfato salvo que el suelo desnudo se erosione con la lluvia.',
    equation: 'Meteorización y Descomposición → PO₄³⁻ en Suelo(ac)',
    readouts: ['Control de Erosión', 'Flujo de Escorrentía'],
  },
  p_life: {
    label: 'Plantas, Animales y Descomponedores',
    chemicalForm: 'ADN, ARN, ATP, Membranas y Huesos',
    summary:
      'Las plantas absorben PO₄³⁻ del suelo; los animales comen plantas o animales para construir ADN, ARN, energía ATP, fosfolípidos y huesos/dientes. Los descomponedores lo reciclan.',
    equation: 'PO₄³⁻ → Absorción Vegetal → Consumo Animal → Descomposición',
    readouts: ['Tala de Tierra', 'Balance de Nutrientes'],
  },
  p_estuary: {
    label: 'Delta Costero',
    chemicalForm: 'Escorrentía PO₄³⁻',
    summary:
      'El suelo erosionado, la minería de fosfato y los detergentes llevan PO₄³⁻ disuelto hacia ríos y océanos, desencadenando floraciones de algas.',
    equation: 'PO₄³⁻ > 35 ug/L → Floración Algal → Caída de O₂',
    readouts: ['Fosfato Reactivo', 'Índice Algal'],
  },
  p_sediment: {
    label: 'Sedimento Marino',
    chemicalForm: 'Levantamiento Geológico (0% Gas)',
    summary:
      'El fósforo NO tiene fase gaseosa. Los organismos muertos que se hunden entierran P en sedimentos marinos; solo millones de años de levantamiento tectónico lo devuelven a tierra.',
    equation: 'Sedimento Marino → Levantamiento Tectónico (Millones de Años)',
    readouts: ['Reserva en Sedimento', 'Oxígeno Disuelto'],
  },
  w_clouds: {
    label: 'Nubes y Vapor',
    chemicalForm: 'Calor Solar → Condensación',
    summary:
      'La energía del Sol evapora vapor de agua desde océanos y bosques. Al enfriarse y condensarse en nubes, la gravedad atrae la precipitación como lluvia, aguanieve o nieve.',
    equation: 'Energía Solar → Evaporación | Gravedad → Precipitación',
    readouts: ['Precipitación', 'Evaporación'],
  },
  w_snow: {
    label: 'Árboles y Cumbres Nevadas',
    chemicalForm: 'Transpiración y H₂O(s)',
    summary:
      'Los árboles y plantas liberan vapor de agua directamente a la atmósfera mediante transpiración. El nivel de lluvia determina qué plantas y animales sobreviven en un bioma.',
    equation: 'Absorción por Raíces → Vapor por Estomas (Transpiración)',
    readouts: ['Volumen de Nieve', 'Cobertura Forestal'],
  },
  w_valley: {
    label: 'Tierra y Escorrentía Fluvial',
    chemicalForm: 'Escorrentía vs. Infiltración',
    summary:
      'Los suelos boscosos absorben la lluvia hacia el subsuelo, mientras las ciudades pavimentadas desvían el agua rápidamente como escorrentía superficial hacia ríos y océanos.',
    equation: 'P = Transpiración + Escorrentía Superficial + Infiltración',
    readouts: ['Escorrentía Superficial', 'Superficie Pavimentada'],
  },
  w_aquifer: {
    label: 'Acuífero Subterráneo',
    chemicalForm: 'Roca Permeable Almacenadora',
    summary:
      'Un acuífero es una capa subterránea de roca permeable, arena o grava que almacena agua subterránea. Se mueve lentamente entre los poros rocosos hacia ríos y el océano.',
    equation: 'Acuífero = Roca/Arena/Grava Permeable → Filtración Lenta al Océano',
    readouts: ['Capacidad del Acuífero', 'Bombeo de Pozos'],
  },
  w_ocean: {
    label: 'Océano (~97% del Agua)',
    chemicalForm: 'Almacén Principal + Evap. Solar',
    summary:
      'Los océanos almacenan ~97% de toda el agua del planeta. La energía solar impulsa la evaporación desde la superficie oceánica, poniendo en marcha todo el ciclo del agua.',
    equation: '97% H₂O Global + Energía Solar → Evaporación',
    readouts: ['Flujo de Evaporación', 'Flujo de Infiltración'],
  },
  cl_atmosphere: {
    label: 'Atmósfera y Clima',
    chemicalForm: 'CO₂ + N₂O + Vapor',
    summary:
      'Los gases de efecto invernadero atrapan el calor saliente, calentando el aire y los océanos mientras aceleran la evaporación y el deshielo.',
    equation: 'ΔT ≈ 5.35 · ln(CO₂/C₀) + Forzamiento N₂O',
    readouts: ['CO₂ Atmosférico', 'Anomalía Térmica'],
  },
  cl_snow: {
    label: 'Nieve Alpina',
    chemicalForm: 'Deshielo + Meteorización',
    summary:
      'Las temperaturas más altas reducen los mantos de nieve alpinos, alterando el caudal estacional de los ríos y acelerando la escorrentía mineral.',
    equation: 'Calentamiento ΔT → Deshielo Glacial Rápido',
    readouts: ['Volumen de Nieve', 'Escorrentía Superficial'],
  },
  cl_forest: {
    label: 'Sumidero Forestal y Terrestre',
    chemicalForm: 'Sumidero C y Anclaje de Suelo',
    summary:
      'Los bosques absorben CO₂ simultáneamente, bombean humedad por transpiración y fijan el fósforo del suelo frente a la erosión.',
    equation: 'Bosque Intacto = Sumidero de Carbono + Escudo contra Erosión',
    readouts: ['Fotosíntesis', 'Biomasa de Carbono'],
  },
  cl_farmland: {
    label: 'Suelos de la Cuenca',
    chemicalForm: 'Carga de Nutrientes N + P',
    summary:
      'El uso intensivo de fertilizantes y la minería de fosfato se combinan con alta escorrentía para arrastrar nutrientes hacia la costa.',
    equation: 'Exceso N + P + Tormentas → Carga al Estuario',
    readouts: ['NO₃⁻ Acuático', 'PO₄³⁻ Reactivo'],
  },
  cl_estuary: {
    label: 'Océano Costero',
    chemicalForm: 'pH + Zona de Hipoxia',
    summary:
      'Absorbe CO₂ (acidificando el agua marina) mientras recibe escorrentía agrícola de N y P que desata floraciones algales que consumen el oxígeno.',
    equation: 'Agua Cálida + N + P → Floración Algal → Colapso de O₂',
    readouts: ['Oxígeno Disuelto', 'pH Oceánico'],
  },
};

export const PATHWAY_ES: Record<
  string,
  {
    processName: string;
    fromLabel: string;
    toLabel: string;
    chemicalChange: string;
    explanation: string;
  }
> = {
  c_photo: {
    processName: 'Fotosíntesis',
    fromLabel: 'Atmósfera',
    toLabel: 'Plantas',
    chemicalChange: 'CO₂(g) → C₆H₁₂O₆',
    explanation:
      'Las plantas (productores primarios) absorben gas CO₂ del aire y fijan carbono en azúcares usando luz solar.',
  },
  c_consume: {
    processName: 'Consumo',
    fromLabel: 'Plantas',
    toLabel: 'Animales',
    chemicalChange: 'C Vegetal → Tejido Animal',
    explanation:
      'El carbono pasa de los productores primarios a herbívoros y otros consumidores cuando los animales comen plantas.',
  },
  c_litter: {
    processName: 'Descomponedores',
    fromLabel: 'Materia Muerta',
    toLabel: 'Suelo y C Fósil',
    chemicalChange: 'Biomasa → Humus / Fósiles',
    explanation:
      'Detritívoros y descomponedores transforman organismos muertos en humus; el entierro profundo forma carbón, petróleo y gas.',
  },
  c_resp: {
    processName: 'Respiración',
    fromLabel: 'Seres Vivos y Suelo',
    toLabel: 'Atmósfera',
    chemicalChange: 'C Orgánico → CO₂(g)',
    explanation:
      'La respiración de plantas, animales y descomponedores—junto a incendios y tala—devuelve gas CO₂ a la atmósfera.',
  },
  c_fossil_flux: {
    processName: 'Combustión',
    fromLabel: 'Combustibles Fósiles',
    toLabel: 'Atmósfera',
    chemicalChange: 'Carbón/Petróleo/Gas → CO₂(g)',
    explanation:
      'Quemar combustibles fósiles en fábricas y vehículos inyecta rápidamente carbono subterráneo al aire como CO₂.',
  },
  c_ocean_flux: {
    processName: 'Intercambio Oceánico',
    fromLabel: 'Atmósfera',
    toLabel: 'Océano',
    chemicalChange: 'CO₂(g) ⇌ H₂CO₃(ac)',
    explanation:
      'La difusión gaseosa en dos direcciones intercambia CO₂ entre aire y mar, moderando el calentamiento pero bajando el pH.',
  },
  n_fix: {
    processName: 'Fijación de N₂',
    fromLabel: 'Atmósfera N₂',
    toLabel: 'Bacterias y Leguminosas',
    chemicalChange: 'N₂(g) → NH₄⁺',
    explanation:
      'Bacterias de nódulos radiculares, microbios del suelo y rayos rompen el enlace N≡N formando amonio utilizable.',
  },
  n_nitrify: {
    processName: 'Amonif. y Nitrif.',
    fromLabel: 'Fijadores y Desechos',
    toLabel: 'Suelo NO₃⁻',
    chemicalChange: 'Desechos → NH₄⁺ → NO₃⁻',
    explanation:
      'Descomponedores forman amonio (NH₄⁺) y bacterias nitrificantes lo convierten en nitrato (NO₃⁻) junto al fertilizante.',
  },
  n_assim: {
    processName: 'Asimilación y Dieta',
    fromLabel: 'Suelo NO₃⁻',
    toLabel: 'Plantas y Animales',
    chemicalChange: 'NO₃⁻ → Proteínas y ADN',
    explanation:
      'Las plantas asimilan nitrato en proteínas y ADN/ARN; los herbívoros comen plantas y la descomposición lo recicla.',
  },
  n_runoff_wetland: {
    processName: 'Lixiviación',
    fromLabel: 'Suelo Agrícola',
    toLabel: 'Humedal Ribereño',
    chemicalChange: 'Flujo de NO₃⁻ Disuelto',
    explanation:
      'El agua de lluvia arrastra nitrato soluble desde cultivos y estiércol hacia los humedales junto a los ríos.',
  },
  n_denit: {
    processName: 'Desnitrificación',
    fromLabel: 'Humedal',
    toLabel: 'Atmósfera N₂',
    chemicalChange: 'NO₃⁻ → N₂(g)',
    explanation:
      'Bacterias del humedal devuelven el nitrato a gas N₂ en el aire, completando el ciclo y protegiendo la costa.',
  },
  n_coastal: {
    processName: 'Descarga Costera',
    fromLabel: 'Humedal',
    toLabel: 'Estuario Costero',
    chemicalChange: 'NO₃⁻ Sin Filtrar',
    explanation:
      'El exceso de nitrato que evade los humedales llega al estuario costero, impulsando floraciones de algas.',
  },
  p_weather: {
    processName: 'Meteorización',
    fromLabel: 'Roca',
    toLabel: 'Suelo y Agua',
    chemicalChange: 'Ca₃(PO₄)₂ → PO₄³⁻',
    explanation:
      'La meteorización por lluvia y la minería liberan fosfato mineral desde los acantilados hacia suelo y agua.',
  },
  p_absorb: {
    processName: 'Absorción y Dieta',
    fromLabel: 'Suelo',
    toLabel: 'Plantas y Animales',
    chemicalChange: 'PO₄³⁻ → ADN, ATP, Huesos',
    explanation:
      'Las plantas absorben PO₄³⁻ por sus raíces; los animales incorporan fosfato al comer plantas o presas.',
  },
  p_decomp: {
    processName: 'Descomposición',
    fromLabel: 'Desechos y Restos',
    toLabel: 'Suelo y Agua',
    chemicalChange: 'P Orgánico → PO₄³⁻ Inorgánico',
    explanation:
      'Cuando plantas y animales producen desechos o mueren, los descomponedores devuelven fosfato al suelo y agua.',
  },
  p_erosion: {
    processName: 'Escorrentía al Mar',
    fromLabel: 'Suelo y Jabones',
    toLabel: 'Delta Costero',
    chemicalChange: 'PO₄³⁻ Erosionado y Disuelto',
    explanation:
      'La erosión del suelo desnudo, fertilizantes y detergentes con fosfato lavan exceso de PO₄³⁻ hacia el océano.',
  },
  p_burial: {
    processName: 'Sedimento Marino',
    fromLabel: 'Delta',
    toLabel: 'Fondo Oceánico',
    chemicalChange: 'Sedimentación → Roca Sedimentaria',
    explanation:
      'El plancton muerto y el fosfato mineral se hunden al fondo marino, quedando atrapados en sedimentos.',
  },
  p_uplift: {
    processName: 'Levantamiento',
    fromLabel: 'Sedimento',
    toLabel: 'Roca Terrestre',
    chemicalChange: 'Levantamiento Tectónico (¡Sin Gas!)',
    explanation:
      'Durante millones de años, el levantamiento geológico de placas tectónicas eleva sedimentos marinos a tierra firme.',
  },
  w_evap: {
    processName: 'Evaporación Solar',
    fromLabel: 'Océano',
    toLabel: 'Nubes',
    chemicalChange: 'Calor Solar + H₂O(l) → H₂O(g)',
    explanation:
      'La energía del Sol calienta el agua oceánica (~97% del agua terrestre), evaporando vapor hacia las nubes.',
  },
  w_precip: {
    processName: 'Precipitación',
    fromLabel: 'Nubes',
    toLabel: 'Tierra y Árboles',
    chemicalChange: 'Gravedad: H₂O(g) → Lluvia/Nieve',
    explanation:
      'La gravedad atrae gotas condensadas y hielo de vuelta a la Tierra como lluvia, aguanieve o nieve.',
  },
  w_transp: {
    processName: 'Transpiración',
    fromLabel: 'Árboles',
    toLabel: 'Atmósfera',
    chemicalChange: 'Estomas Foliares → H₂O(g)',
    explanation:
      'Los árboles y plantas absorben agua por sus raíces y devuelven vapor de agua directo a la atmósfera por las hojas.',
  },
  w_runoff: {
    processName: 'Escorrentía',
    fromLabel: 'Tierra',
    toLabel: 'Océano',
    chemicalChange: 'Flujo en Ríos y Asfalto',
    explanation:
      'Primera ruta terrestre hacia el mar: la lluvia y el deshielo fluyen por ríos y calles pavimentadas al océano.',
  },
  w_infilt: {
    processName: 'Infiltración',
    fromLabel: 'Suelo Terrestre',
    toLabel: 'Acuífero',
    chemicalChange: 'Percolación en Poros Rocosos',
    explanation:
      'Los suelos boscosos permiten que la lluvia se filtre hacia abajo por roca y arena permeable recargando acuíferos.',
  },
  w_seepage: {
    processName: 'Filtración Acuífera',
    fromLabel: 'Acuífero',
    toLabel: 'Océano',
    chemicalChange: 'Flujo Subterráneo Lento',
    explanation:
      'Segunda ruta hacia el mar: el agua almacenada en un acuífero se filtra lentamente por la roca hasta el océano.',
  },
  cl_warming: {
    processName: 'Calentamiento por C',
    fromLabel: 'Tierra y Fósiles',
    toLabel: 'Atmósfera',
    chemicalChange: 'CO₂ + N₂O Atrapan Calor',
    explanation:
      'El carbono fósil y el N₂O agrícola calientan la atmósfera, acelerando el ciclo hidrológico.',
  },
  cl_melt: {
    processName: 'Deshielo',
    fromLabel: 'Aire Cálido',
    toLabel: 'Nieve Alpina',
    chemicalChange: 'ΔT → Deshielo y Escorrentía',
    explanation:
      'Las temperaturas crecientes reducen la nieve de montaña e intensifican la escorrentía por lluvias.',
  },
  cl_nutrient_flush: {
    processName: 'Arrastre Nutrientes',
    fromLabel: 'Suelos',
    toLabel: 'Estuario',
    chemicalChange: 'NO₃⁻ + PO₄³⁻ + H₂O Cálida',
    explanation:
      'La escorrentía intensa arrastra nitrógeno y fósforo a bahías cálidas, alimentando floraciones algales.',
  },
  cl_acid: {
    processName: 'Acidificación',
    fromLabel: 'Aire CO₂',
    toLabel: 'Océano',
    chemicalChange: 'CO₂ + H₂O → H⁺ + HCO₃⁻',
    explanation:
      'El exceso de CO₂ atmosférico se disuelve en el agua de mar, bajando el pH y estresando organismos con concha.',
  },
};

export interface GuideESContent {
  mainReservoirs: string;
  biologicalNeeds: string;
  narrativeSummary: string[];
  keyTerms: { term: string; definition: string }[];
  studyQuestions: { question: string; explanation: string }[];
  keyFacts: { topic: string; detail: string }[];
  substances: { name: string; formula: string; state: string; role: string }[];
  discussionPrompts: string[];
  experiments: { label: string; description: string }[];
}

export const GUIDE_ES: Record<LearningModuleId, GuideESContent> = {
  carbon: {
    mainReservoirs:
      'Atmósfera (gas CO₂), plantas y animales vivos, humus del suelo, combustibles fósiles subterráneos y carbono disuelto en los océanos (mayor sumidero activo superficial).',
    biologicalNeeds:
      'El carbono forma la estructura molecular básica de carbohidratos (glucosa C₆H₁₂O₆), proteínas, grasas/lípidos y ADN en todas las células vivas.',
    narrativeSummary: [
      'El carbono forma la estructura molecular básica de carbohidratos (glucosa C₆H₁₂O₆), proteínas, grasas y ADN en cada célula viva, circulando entre el aire, los seres vivos, el suelo, las rocas subterráneas y los océanos. Entra en las plantas (productores primarios) desde la atmósfera cuando sus hojas absorben gas dióxido de carbono (CO₂) por los estomas durante la fotosíntesis, usando luz solar y agua para producir glucosa, madera y raíces. Luego pasa de las plantas a los animales (consumidores) cuando los herbívoros comen plantas y los carnívoros u omnívoros comen otros animales.',
      'El carbono regresa naturalmente a la atmósfera como gas CO₂ mediante la respiración celular—realizada por plantas, animales y microbios del suelo—así como por incendios naturales. Cuando mueren o producen desechos, los detritívoros (lombrices, insectos) y descomponedores (bacterias, hongos) degradan la materia orgánica muerta, devolviendo carbono al humus del suelo y respirando CO₂ al aire. Durante millones de años, plantas y organismos marinos antiguos enterrados bajo sedimentos y comprimidos bajo intenso calor y presión sin oxígeno se transformaron en combustibles fósiles subterráneos (carbón, petróleo y gas natural).',
      'Las actividades humanas alteran drásticamente este equilibrio: quemar combustibles fósiles (combustión en fábricas y vehículos) inyecta rápidamente carbono subterráneo antiguo al cielo elevando el CO₂ atmosférico, mientras talar bosques reduce la fotosíntesis y libera el carbono almacenado en la madera. Por su parte, los océanos intercambian CO₂ en ambos sentidos por difusión en la superficie marina: absorben exceso de CO₂ del aire (moderando el calentamiento) y liberan CO₂ cuando el agua se calienta, pero disolver demasiado CO₂ forma ácido carbónico (H₂CO₃), reduciendo el pH oceánico (acidificación).',
    ],
    keyTerms: [
      { term: 'Atmósfera (CO₂)', definition: 'Reserva gaseosa de dióxido de carbono; atrapa calor infrarrojo y alimenta la fotosíntesis.' },
      { term: 'Fotosíntesis', definition: 'Proceso vegetal que absorbe gas CO₂ y agua con luz solar para producir glucosa (C₆H₁₂O₆) y O₂.' },
      { term: 'Consumo', definition: 'Transferencia de carbono orgánico cuando herbívoros comen plantas y carnívoros comen consumidores.' },
      { term: 'Respiración Celular', definition: 'Proceso natural en plantas, animales y microbios que libera gas CO₂ al descomponer azúcares.' },
      { term: 'Descomponedores y Detritívoros', definition: 'Bacterias, hongos, lombrices e insectos que degradan materia muerta en humus y respiran CO₂.' },
      { term: 'Combustibles Fósiles', definition: 'Carbón, petróleo y gas formados por restos antiguos enterrados bajo calor y presión sin oxígeno.' },
      { term: 'Combustión e Intercambio Oceánico', definition: 'La combustión emite CO₂; los océanos intercambian CO₂ con el aire formando H₂CO₃ si hay exceso.' },
    ],
    studyQuestions: [
      {
        question: '¿Cómo entra el carbono a las plantas vivas desde la atmósfera?',
        explanation:
          'Las plantas (productores primarios) absorben gas CO₂ por sus hojas (estomas) durante la fotosíntesis, combinando CO₂ y agua con energía solar para producir glucosa (6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂).',
      },
      {
        question: '¿Cómo pasa el carbono de las plantas (productores) a los animales (consumidores)?',
        explanation:
          'Los animales obtienen carbono comiendo plantas (herbívoros) o comiendo otros animales (carnívoros/omnívoros), incorporando azúcares, grasas y proteínas vegetales a sus tejidos.',
      },
      {
        question: 'Menciona procesos naturales y humanos que devuelven dióxido de carbono (CO₂) a la atmósfera.',
        explanation:
          'Procesos naturales: respiración celular de plantas, animales y descomponedores, e incendios naturales. Procesos humanos: quema de combustibles fósiles (combustión) y tala/quema de bosques.',
      },
      {
        question: '¿Qué papel cumplen los descomponedores y detritívoros en el ciclo del carbono?',
        explanation:
          'Lombrices, insectos, bacterias y hongos descomponen organismos muertos y desechos, reciclando carbono al humus del suelo y liberando gas CO₂ al aire mediante la respiración.',
      },
      {
        question: '¿Qué son los combustibles fósiles y cómo se forman bajo tierra?',
        explanation:
          'El carbón, el petróleo y el gas natural son depósitos de carbono formados durante millones de años cuando restos antiguos quedaron sepultados bajo sedimentos, sometidos a calor y presión sin oxígeno.',
      },
      {
        question: '¿Cómo cambia la quema de combustibles fósiles (combustión) la atmósfera y los océanos?',
        explanation:
          'La combustión libera rápidamente carbono que estuvo enterrado millones de años, elevando el CO₂ en el aire. Parte del exceso se disuelve en el océano formando ácido carbónico (H₂CO₃) y bajando el pH marino.',
      },
    ],
    keyFacts: [
      { topic: 'Fotosíntesis y Cadenas Alimentarias', detail: 'Las plantas toman CO₂ del aire para crear azúcares; el carbono pasa a los animales al alimentarse.' },
      { topic: 'Respiración y Detritívoros', detail: 'Plantas, animales, hongos, bacterias y lombrices devuelven CO₂ al aire mediante respiración celular.' },
      { topic: 'Formación de Combustibles Fósiles', detail: 'Carbón, petróleo y gas se formaron por entierro sin oxígeno bajo calor y presión durante millones de años.' },
      { topic: 'Combustión e Intercambio Oceánico', detail: 'La quema fósil dispara el CO₂ atmosférico y el océano absorbe parte formando ácido carbónico (H₂CO₃).' },
    ],
    substances: [
      { name: 'Dióxido de Carbono', formula: 'CO₂', state: 'Gas', role: 'Atrapa calor infrarrojo; absorbido por hojas e intercambiado con océanos.' },
      { name: 'Azúcares y Madera', formula: 'C₆H₁₂O₆', state: 'Biomasa Viva', role: 'Almacenado por bosques y pastos de pradera; consumido por animales.' },
      { name: 'Carbón, Petróleo y Gas', formula: 'CₓHᵧ', state: 'Sólido / Mineral', role: 'Carbono fósil antiguo quemado en fábricas y vehículos.' },
      { name: 'Ácido Carbónico', formula: 'H₂CO₃', state: 'Líquido / Disuelto', role: 'Se forma cuando exceso de CO₂ se disuelve en agua marina, bajando el pH.' },
    ],
    discussionPrompts: [
      '¿Cómo viaja el carbono desde la atmósfera hacia plantas, animales y de vuelta por descomponedores?',
      'Si las fábricas aumentan la combustión fósil, ¿basta con plantar bosques para frenar la acidificación oceánica?',
    ],
    experiments: [
      { label: 'Prueba: Auge Fabril vs. Praderas', description: 'Fábricas altas con bosques y praderas restaurados' },
      { label: 'Prueba: Tala + Emisiones Altas', description: 'Quitar bosques y praderas manteniendo fábricas activas' },
    ],
  },
  nitrogen: {
    mainReservoirs:
      'La atmósfera terrestre contiene 78% de gas nitrógeno (N₂), siendo el aire la mayor reserva, junto a materia orgánica del suelo y nitratos disueltos.',
    biologicalNeeds:
      'Todo ser vivo necesita nitrógeno para construir Proteínas (aminoácidos) y Ácidos Nucleicos (ADN y ARN), además de ATP y clorofila vegetal.',
    narrativeSummary: [
      'El nitrógeno es vital para toda célula porque sirve para construir proteínas (aminoácidos) y ácidos nucleicos (ADN y ARN). Aunque el gas nitrógeno (N₂) forma el 78% de la atmósfera, ni plantas ni animales pueden usarlo directo del aire: sus dos átomos están unidos por un enlace covalente triple muy fuerte (N≡N) que no pueden romper.',
      'Para entrar a la vida, el N₂ requiere fijación de nitrógeno. Bacterias fijadoras en el suelo y en nódulos de raíces de leguminosas (trébol, frijol) —y los rayos— rompen el enlace del N₂ formando amonio utilizable (NH₃ / NH₄⁺). Luego bacterias nitrificantes convierten el amonio en nitratos (NO₃⁻) durante la nitrificación. Las plantas asimilan nitratos (asimilación) para hacer proteínas y ADN, y los herbívoros lo obtienen al comer plantas.',
      'Cuando organismos producen desechos o mueren, los descomponedores transforman ese nitrógeno en amonio (amonificación). Finalmente, en humedales con poco oxígeno, bacterias desnitrificantes convierten el nitrato (NO₃⁻) de vuelta en gas N₂ (desnitrificación), completando el ciclo. El exceso de fertilizante y ganado sin humedales filtra nitratos a los ríos causando floraciones algales y gas N₂O.',
    ],
    keyTerms: [
      { term: 'N₂ Atmosférico (78%)', definition: 'Forma el 78% del aire; inutilizable directamente por su enlace triple (N≡N).' },
      { term: 'Fijación de Nitrógeno', definition: 'Conversión de gas N₂ en amonio utilizable (NH₃ / NH₄⁺) por bacterias o rayos.' },
      { term: 'Bacterias Fijadoras', definition: 'Microbios del suelo y nódulos de leguminosas capaces de romper el enlace N≡N.' },
      { term: 'Amonificación', definition: 'Descomponedores transformando desechos y restos muertos en amonio (NH₄⁺).' },
      { term: 'Nitrificación', definition: 'Bacterias del suelo oxidando amonio (NH₄⁺) en nitrito (NO₂⁻) y nitrato (NO₃⁻).' },
      { term: 'Asimilación y Consumo', definition: 'Plantas absorben NO₃⁻/NH₄⁺ para proteínas y ADN; animales comen plantas.' },
      { term: 'Desnitrificación', definition: 'Bacterias de humedal que devuelven NO₃⁻ como gas N₂ al aire, completando el ciclo.' },
    ],
    studyQuestions: [
      {
        question: '¿Qué porcentaje de la atmósfera es gas nitrógeno (N₂) y por qué no podemos usarlo directo del aire?',
        explanation:
          'El gas N₂ forma el 78% del aire. Plantas y animales no pueden usarlo directamente porque sus dos átomos están unidos por un enlace covalente triple muy fuerte (N≡N) que solo bacterias fijadoras o rayos logran romper.',
      },
      {
        question: '¿Por qué necesitan nitrógeno los seres vivos (menciona al menos dos moléculas biológicas)?',
        explanation:
          'Los organismos necesitan nitrógeno para fabricar proteínas (aminoácidos) y ácidos nucleicos (ADN y ARN), además de ATP y clorofila.',
      },
      {
        question: '¿Cuál es el papel de las bacterias fijadoras de nitrógeno en el suelo y raíces?',
        explanation:
          'Las bacterias fijadoras (como Rhizobia en nódulos de trébol y frijol) convierten el gas N₂ no utilizable en amoníaco y amonio (NH₃ / NH₄⁺) aprovechable por las plantas.',
      },
      {
        question: '¿Qué ocurre durante la amonificación y la nitrificación en el suelo?',
        explanation:
          'En la amonificación, descomponedores convierten desechos y organismos muertos en amonio (NH₄⁺). En la nitrificación, bacterias nitrificantes oxidan el amonio en nitritos y nitratos (NO₃⁻).',
      },
      {
        question: '¿Cómo obtienen los herbívoros y otros animales el nitrógeno que necesitan?',
        explanation:
          'Por consumo: comiendo plantas (que asimilaron nitratos en proteínas y ADN) o alimentándose de otros animales.',
      },
      {
        question: '¿Qué pasa durante la desnitrificación para completar el ciclo del nitrógeno?',
        explanation:
          'En suelos de humedales pobres en oxígeno, bacterias desnitrificantes convierten el nitrato disuelto (NO₃⁻) de regreso en gas N₂ hacia la atmósfera.',
      },
    ],
    keyFacts: [
      { topic: 'Por qué el N₂ del aire no sirve directo', detail: 'El enlace triple N≡N impide que plantas y animales lo absorban sin bacterias o rayos.' },
      { topic: 'Fijación de Nitrógeno', detail: 'Bacterias en raíces de leguminosas y rayos transforman N₂ en amonio (NH₄⁺).' },
      { topic: 'Amonificación, Nitrificación y Asimilación', detail: 'Descomponedores crean NH₄⁺, bacterias crean NO₃⁻ y las plantas lo convierten en proteínas y ADN.' },
      { topic: 'Desnitrificación en Humedales', detail: 'Devuelve el nitrato (NO₃⁻) sobrante como gas N₂ al aire protegiendo las costas.' },
    ],
    substances: [
      { name: 'Gas Dinitrógeno', formula: 'N₂ (78% del aire)', state: 'Gas', role: 'Reserva atmosférica con enlace triple; fijado por bacterias o rayos.' },
      { name: 'Amoníaco / Amonio', formula: 'NH₃ / NH₄⁺', state: 'Líquido / Disuelto', role: 'Formado por bacterias fijadoras y descomponedores (amonificación).' },
      { name: 'Nitrato', formula: 'NO₃⁻', state: 'Líquido / Disuelto', role: 'Producido por nitrificación; asimilado por plantas o arrastrado a ríos.' },
      { name: 'Óxido Nitroso', formula: 'N₂O', state: 'Gas', role: 'Potente gas invernadero emitido por exceso de fertilizante y estiércol.' },
    ],
    discussionPrompts: [
      '¿Por qué las plantas pueden sufrir falta de nitrógeno aunque el aire sea 78% N₂?',
      'Compara amonificación, nitrificación, asimilación y desnitrificación.',
    ],
    experiments: [
      { label: 'Prueba: Fertilizante + Sin Humedales', description: 'Mucho fertilizante y ganado con pantanos drenados' },
      { label: 'Prueba: Trébol + Filtros de Humedal', description: 'Cultivos de trébol y amplios humedales ribereños' },
    ],
  },
  phosphorus: {
    mainReservoirs:
      'Formaciones de roca fosfórica sedimentaria en tierra y sedimentos marinos profundos en el fondo oceánico (SIN reserva gaseosa en la atmósfera).',
    biologicalNeeds:
      'Las células vivas requieren fósforo para ADN y ARN, ATP (energía celular), fosfolípidos de membrana y huesos y dientes.',
    narrativeSummary: [
      'A diferencia del agua, el carbono y el nitrógeno, el ciclo del fósforo NO tiene fase gaseosa atmosférica: nunca circula por el aire como gas. Su mayor reserva está atrapada en rocas fosfóricas sedimentarias en tierra y sedimentos en el fondo del mar. Los seres vivos lo necesitan para ADN, ARN, energía ATP, membranas celulares y huesos.',
      'El fósforo entra lentamente a los ecosistemas cuando la lluvia y la erosión meteorizan rocas fosfóricas disolviendo iones fosfato (PO₄³⁻) en el suelo y agua. Las plantas lo absorben por las raíces y los animales lo obtienen comiendo plantas o presas. Al producir desechos o morir, los descomponedores devuelven el PO₄³⁻ al suelo y al agua.',
      'La minería de fosfato, la tala con erosión y los detergentes con fosfatos arrastran rápidamente exceso de PO₄³⁻ a los ríos y deltas, causando floraciones de algas. Cuando el fosfato se hunde con plancton muerto al fondo marino, solo regresa a tierra firme tras millones de años mediante levantamiento geológico tectónico.',
    ],
    keyTerms: [
      { term: 'Sin Fase Gaseosa', definition: 'El fósforo nunca entra a la atmósfera como gas, a diferencia de C, N y H₂O.' },
      { term: 'Roca Fosfórica', definition: 'Rocas sedimentarias Ca₃(PO₄)₂ terrestres y sedimentos marinos que guardan casi todo el P.' },
      { term: 'Meteorización y Erosión', definition: 'Lluvia y desgaste físico que liberan PO₄³⁻ lentamente desde rocas hacia suelo y ríos.' },
      { term: 'Absorción y Consumo', definition: 'Plantas absorben PO₄³⁻; animales comen plantas/animales para ADN, ARN, ATP y huesos.' },
      { term: 'Descomposición', definition: 'Descomponedores reciclan desechos y restos muertos devolviendo PO₄³⁻ al suelo y agua.' },
      { term: 'Escorrentía y Sedimento', definition: 'Ríos llevan PO₄³⁻ al océano, donde se hunde y queda sepultado en el lecho marino.' },
      { term: 'Levantamiento Geológico', definition: 'Movimiento tectónico que eleva rocas del fondo oceánico a tierra tras millones de años.' },
    ],
    studyQuestions: [
      {
        question: '¿Dónde se encuentra la reserva principal de fósforo en la Tierra?',
        explanation:
          'En formaciones de roca fosfórica sedimentaria en tierra firme y en sedimentos marinos del fondo oceánico—no en el aire.',
      },
      {
        question: '¿Por qué el fósforo es una molécula biológica importante para células y seres vivos?',
        explanation:
          'Porque es indispensable para el ADN y ARN (información genética), el ATP (energía celular), las membranas de fosfolípidos y los huesos y dientes.',
      },
      {
        question: '¿Cómo pasa el fósforo de las rocas al suelo y agua, y luego a los seres vivos?',
        explanation:
          'La meteorización por lluvia, erosión y minería liberan PO₄³⁻ al suelo y agua; las plantas lo absorben por las raíces y los animales lo obtienen al alimentarse.',
      },
      {
        question: '¿Qué ocurre con los fosfatos cuando plantas y animales producen desechos o mueren?',
        explanation:
          'Los descomponedores degradan los restos y desechos devolviendo fosfato inorgánico (PO₄³⁻) al suelo y al agua.',
      },
      {
        question: '¿En qué se diferencia el ciclo del fósforo del de agua, carbono y nitrógeno?',
        explanation:
          'El fósforo NO tiene fase gaseosa en la atmósfera; se mueve únicamente entre rocas, suelo, agua, seres vivos y sedimentos oceánicos.',
      },
      {
        question: '¿Cómo regresa finalmente a tierra firme el fósforo atrapado en el sedimento marino?',
        explanation:
          'Mediante el levantamiento geológico de las placas tectónicas durante millones de años, elevando antiguos fondos marinos como montañas.',
      },
    ],
    keyFacts: [
      { topic: 'Sin Fase Gaseosa', detail: 'Nunca pasa a la atmósfera como gas; circula solo por roca, suelo, agua, vida y sedimento.' },
      { topic: 'Meteorización, Absorción y Consumo', detail: 'La lluvia libera PO₄³⁻ de rocas; raíces lo absorben y pasa a los animales por la dieta.' },
      { topic: 'Descomposición y Escorrentía', detail: 'Descomponedores reciclan P; erosión y detergentes lo arrastran al océano.' },
      { topic: 'Sedimento y Levantamiento Geológico', detail: 'Tarda millones de años en regresar del fondo marino por placas tectónicas.' },
    ],
    substances: [
      { name: 'Roca Mineral Fosfórica', formula: 'Ca₃(PO₄)₂', state: 'Sólido / Mineral', role: 'Principal reserva terrestre en acantilados y sedimentos marinos.' },
      { name: 'Ortofosfato', formula: 'PO₄³⁻', state: 'Líquido / Disuelto', role: 'Absorbido por plantas; el exceso por detergentes causa algas.' },
      { name: 'ATP, ADN y Fosfolípidos', formula: 'Organo-P', state: 'Biomasa Viva', role: 'Forma energía celular (ATP), genética (ADN/ARN), membranas y huesos.' },
    ],
    discussionPrompts: [
      '¿Por qué el fósforo tarda millones de años en volver del fondo marino a tierra?',
      '¿Cómo provocan floraciones algales los detergentes y suelos erosionados?',
    ],
    experiments: [
      { label: 'Prueba: Minería + Detergentes', description: 'Alta minería y aguas residuales con suelo erosionado' },
      { label: 'Prueba: Terrazas y Sin Fosfato', description: 'Barreras vegetales, bosques y detergentes libres de P' },
    ],
  },
  water: {
    mainReservoirs:
      'Los océanos guardan ~97% del agua de la Tierra. El agua dulce está en glaciares/nieve, acuíferos subterráneos, lagos, ríos y vapor atmosférico.',
    biologicalNeeds:
      'Los organismos necesitan agua para: (1) fotosíntesis y metabolismo celular, (2) transportar nutrientes y oxígeno en sangre y savia, (3) regular temperatura corporal, y (4) hábitats acuáticos.',
    narrativeSummary: [
      'El agua es esencial para toda forma de vida: las células la usan en la fotosíntesis y reacciones químicas, la sangre y savia transportan nutrientes con ella, regula la temperatura corporal y sostiene hábitats acuáticos. Cerca del 97% del agua terrestre está en los océanos. La energía solar del Sol calienta los océanos evaporando agua en vapor hacia el cielo, mientras árboles y plantas liberan vapor directo desde sus hojas mediante transpiración.',
      'En la altura, el vapor se enfría y condensa en nubes. La gravedad atrae las gotas y cristales de hielo de regreso a la Tierra como precipitación (lluvia, aguanieve o nieve). La cantidad de precipitación controla la humedad del suelo y decide qué plantas (bosques, praderas o desiertos) y qué animales pueden vivir en cada región.',
      'Al llegar a tierra, el agua regresa al océano por dos vías principales: (1) escorrentía superficial rápida por calles, valles y ríos, y (2) infiltración hacia el suelo y capas subterráneas de roca permeable, arena o grava llamadas acuíferos, desde donde se filtra lentamente hacia el mar. Pavimentar ciudades bloquea la infiltración, disparando inundaciones y vaciando acuíferos.',
    ],
    keyTerms: [
      { term: 'Océano (~97%) y Energía Solar', definition: 'Los océanos almacenan ~97% del agua; la energía del Sol impulsa la evaporación.' },
      { term: 'Transpiración', definition: 'Liberación de vapor de agua directamente desde árboles y plantas por estomas foliares.' },
      { term: 'Precipitación y Gravedad', definition: 'Agua condensada en nubes atraída por la gravedad como lluvia, aguanieve o nieve.' },
      { term: 'Escorrentía Superficial', definition: 'Agua que fluye sobre la superficie por calles, suelos y ríos de vuelta al océano.' },
      { term: 'Acuífero e Infiltración', definition: 'Capa subterránea de roca permeable, arena o grava que almacena agua recargada por lluvia.' },
      { term: 'Filtración Acuífera', definition: 'Movimiento subterráneo lento del agua a través de poros rocosos hacia ríos y océanos.' },
    ],
    studyQuestions: [
      {
        question: 'Menciona tres necesidades importantes del agua en organismos vivos y ecosistemas.',
        explanation:
          'Los seres vivos necesitan agua para: (1) fotosíntesis y metabolismo celular, (2) transportar nutrientes y oxígeno en sangre y savia, (3) regular la temperatura corporal, y (4) mantener hábitats acuáticos.',
      },
      {
        question: '¿Dónde se almacena la mayor parte del agua de la Tierra y qué fuente de energía impulsa su evaporación?',
        explanation:
          'Aproximadamente el 97% del agua terrestre está almacenada en los océanos. La energía solar del Sol impulsa su evaporación hacia la atmósfera.',
      },
      {
        question: '¿Qué fuerza atrae la precipitación a la Tierra y cómo funciona la transpiración?',
        explanation:
          'La gravedad atrae lluvia, aguanieve o nieve hacia abajo. Además, árboles y plantas absorben agua del suelo y la liberan como vapor por sus hojas mediante transpiración.',
      },
      {
        question: '¿Qué es un acuífero y cómo se mueve el agua desde él hasta el océano?',
        explanation:
          'Es una capa subterránea de roca permeable, arena o grava que guarda agua subterránea. El agua viaja lentamente al océano mediante filtración subterránea entre los poros de la roca.',
      },
      {
        question: 'Menciona dos formas en que el agua viaja de la tierra al océano.',
        explanation:
          '(1) Escorrentía superficial a través de arroyos y ríos, y (2) filtración subterránea lenta desde acuíferos.',
      },
      {
        question: '¿Cómo afecta la cantidad de precipitación a las plantas y animales de un lugar?',
        explanation:
          'Define la humedad del suelo y el agua disponible, determinando qué tipo de vegetación crece (selvas vs. praderas vs. desiertos) y qué alimento, refugio y agua encuentran los animales.',
      },
    ],
    keyFacts: [
      { topic: 'Sol y Gravedad Mueven el Ciclo', detail: 'El calor del Sol evapora agua del océano y la gravedad atrae lluvia y nieve a la Tierra.' },
      { topic: 'Transpiración de Árboles', detail: 'Las plantas devuelven vapor de agua directo a la atmósfera por sus hojas.' },
      { topic: 'Acuífero y Dos Rutas al Mar', detail: 'El agua vuelve al océano por escorrentía fluvial y por filtración lenta en acuíferos de roca permeable.' },
      { topic: 'Precipitación y Biomas', detail: 'Determina qué plantas y animales logran sobrevivir en cada ecosistema.' },
    ],
    substances: [
      { name: 'Vapor de Agua', formula: 'H₂O(g)', state: 'Gas', role: 'Evaporado por el Sol desde océanos y transpirado por árboles.' },
      { name: 'Agua Líquida y Acuífero', formula: 'H₂O(l)', state: 'Líquido / Disuelto', role: 'Fluye en lluvia, escorrentía superficial y filtración subterránea.' },
      { name: 'Hielo Glacial y Nieve', formula: 'H₂O(s)', state: 'Sólido / Mineral', role: 'Almacena nieve invernal alimentando ríos frescos en verano.' },
    ],
    discussionPrompts: [
      'Nombra dos caminos del agua desde tierra al mar y prueba cómo el pavimento altera el acuífero.',
      '¿Cómo cambia el calor solar (+°C) la nieve de montaña, la transpiración y los ríos?',
    ],
    experiments: [
      { label: 'Prueba: Ciudad Pavimentada + Bombeo', description: '80% asfalto, pocos árboles y bombeo intenso de pozos' },
      { label: 'Prueba: Cuenca Bosque Esponja', description: 'Bosques densos, suelos permeables y bombeo sostenible' },
    ],
  },
  climate: {
    mainReservoirs:
      'Sistema Terrestre Acoplado: Atmósfera (CO₂, N₂O, vapor H₂O), Bosques y Suelos, Acuíferos Dulces y Océanos Costeros.',
    biologicalNeeds:
      'Los ciclos equilibrados de carbono, nitrógeno, fósforo y agua mantienen temperaturas estables, oxígeno disuelto (>6.5 mg/L) y pH marino saludable (~8.1).',
    narrativeSummary: [
      'En la naturaleza, los ciclos del carbono, nitrógeno, fósforo y agua nunca actúan por separado: alterar uno desencadena reacciones en cadena sobre los demás. Cuando el CO₂ fósil (Carbono) y el óxido nitroso agrícola N₂O (Nitrógeno) atrapan más calor, aumenta la evaporación oceánica y se derrite antes la nieve alpina (Agua).',
      'Las lluvias más intensas sobre calles pavimentadas y suelos talados generan escorrentía acelerada que arrastra simultáneamente nitratos (NO₃⁻) y fosfatos (PO₄³⁻) hacia los estuarios.',
      'Las aguas costeras cálidas cargadas con N y P disparan enormes floraciones de algas. Al morir, los descomponedores consumen el oxígeno disuelto formando zonas muertas hipóxicas (<2.0 mg/L), mientras el exceso de CO₂ acidifica el océano. Restaurar la salud planetaria exige equilibrar los cuatro ciclos juntos.',
    ],
    keyTerms: [
      { term: 'Retroalimentación Invernadero', definition: 'CO₂ y N₂O atrapan calor, elevan la temperatura, evaporan más agua y derriten nieve.' },
      { term: 'Acidificación Oceánica', definition: 'Exceso de CO₂ atmosférico disuelto en agua marina formando ácido carbónico (H₂CO₃).' },
      { term: 'Arrastre Acoplado', definition: 'Escorrentía tormentosa llevando NO₃⁻ y PO₄³⁻ juntos hacia bahías costeras.' },
      { term: 'Eutrofización e Hipoxia', definition: 'Floraciones algales que al descomponerse agotan el oxígeno disuelto del agua.' },
    ],
    studyQuestions: [
      {
        question: '¿Cómo alteran los cambios del ciclo del Carbono al ciclo del Agua y los Océanos?',
        explanation:
          'Más CO₂ calienta el aire, acelera la evaporación, derrite nieve de montaña e intensifica tormentas, mientras el CO₂ disuelto en el mar forma ácido carbónico y reduce el pH.',
      },
      {
        question: '¿Cómo se combinan Agua, Nitrógeno y Fósforo para crear zonas muertas costeras?',
        explanation:
          'La escorrentía intensa arrastra nitratos y fosfatos hacia aguas cálidas, provocando floraciones algales cuya descomposición consume el oxígeno disuelto vital para peces.',
      },
      {
        question: '¿Qué combinación de acciones restaura mejor la Salud del Ecosistema?',
        explanation:
          'Reducir combustibles fósiles, restaurar bosques y praderas, proteger humedales y barreras de suelo, limitar pavimento y reducir fertilizantes y fosfatos residuales.',
      },
    ],
    keyFacts: [
      { topic: 'Calentamiento y Deshielo', detail: 'CO₂ y N₂O elevan el calor global, reducen nieve e intensifican escorrentías.' },
      { topic: 'Zonas Muertas por Nutrientes', detail: 'Lluvias fuertes lavan N y P a costas cálidas provocando hipoxia.' },
    ],
    substances: [
      { name: 'Gases de Efecto Invernadero', formula: 'CO₂ + N₂O + H₂O(g)', state: 'Gas', role: 'Amplifican el calentamiento, derriten nieve e intensifican tormentas.' },
      { name: 'Cóctel de Nutrientes', formula: 'NO₃⁻ + PO₄³⁻', state: 'Líquido / Disuelto', role: 'Arrastrados desde la tierra generando floraciones masivas de algas.' },
      { name: 'Oxígeno Disuelto', formula: 'O₂(ac)', state: 'Líquido / Disuelto', role: 'Agotado por algas en descomposición, creando zonas muertas.' },
    ],
    discussionPrompts: [
      'Traza la reacción en cadena: ¿cómo se unen fábricas + asfalto + fertilizantes para asfixiar peces en la costa?',
      '¿Qué combinación de cambios recupera más rápido la Salud del Ecosistema?',
    ],
    experiments: [
      { label: 'Prueba: Crisis Compuesta', description: 'Fábricas altas, mucho fertilizante, asfalto y pocos bosques' },
      { label: 'Prueba: Cero Neto y Humedales', description: 'Cortar fósiles y restaurar bosques, praderas y humedales' },
    ],
  },
};

export const CHALLENGE_ES: Record<string, { title: string; criterionText: string }> = {
  climate_cap: {
    title: 'Estabilizar Carbono Atmosférico',
    criterionText: 'CO₂ < 350 ppm y pH Océano ≥ 8.10',
  },
  hypoxia_guard: {
    title: 'Prevenir Hipoxia Costera',
    criterionText: 'O₂ Disuelto ≥ 6.8 mg/L y Algas < 30',
  },
  nutrient_steward: {
    title: 'Equilibrar Nutrientes de Cuenca',
    criterionText: 'Nitrato < 3.0 mg/L y Fosfato < 35 ug/L',
  },
  aquifer_resilience: {
    title: 'Sostener Acuífero y Nieve',
    criterionText: 'Acuífero ≥ 75% y Nieve ≥ 65%',
  },
};

export function getLiveSceneCaptionText(
  mod: LearningModuleId,
  m: SimulationMetrics,
  v: SimulationVariables,
  lang: Language
): string {
  if (lang === 'en') {
    if (mod === 'carbon') {
      const parts: string[] = [];
      if (v.fossilFuelEmissions >= 6) parts.push('Smokestack CO₂ haze');
      if (v.deforestationRate >= 35) parts.push('Forest logged');
      if (v.grasslandCover >= 60) parts.push('Prairie roots active');
      if (m.oceanPH < 8.08) parts.push(`Ocean bleaching (pH ${m.oceanPH.toFixed(2)})`);
      return parts.length > 0 ? parts.join(' · ') : 'Healthy forest & ocean sink';
    }
    if (mod === 'nitrogen') {
      const parts: string[] = [];
      parts.push(v.wetlandBuffer < 45 ? 'Wetland marshes drained' : 'Wetlands filtering NO₃⁻');
      if (m.algalBloomIndex >= 28) parts.push('Estuary algal bloom');
      if (v.syntheticFertilizer >= 90) parts.push('Soil nitrate leaching');
      return parts.join(' · ');
    }
    if (mod === 'phosphorus') {
      const parts: string[] = [];
      if (v.phosphateMining >= 15) parts.push('Open-pit quarry active');
      parts.push(v.erosionControl < 55 ? 'Hillside mud erosion' : 'Terrace buffers holding soil');
      if (m.algalBloomIndex >= 28) parts.push('Delta algal bloom');
      return parts.join(' · ');
    }
    if (mod === 'water') {
      return `Snowpack ${m.snowpackVolume.toFixed(0)}% · Aquifer ${m.groundwaterTable.toFixed(0)}%${
        v.imperviousSurface >= 35 ? ' · Paved city runoff' : ''
      }`;
    }
    return `Temp ${m.globalTempAnomaly >= 0 ? '+' : ''}${m.globalTempAnomaly.toFixed(2)}°C · Snow ${m.snowpackVolume.toFixed(0)}% · DO ${m.dissolvedOxygen.toFixed(1)} mg/L`;
  }

  // Spanish live scene captions
  if (mod === 'carbon') {
    const parts: string[] = [];
    if (v.fossilFuelEmissions >= 6) parts.push('Bruma de CO₂ industrial');
    if (v.deforestationRate >= 35) parts.push('Bosque talado');
    if (v.grasslandCover >= 60) parts.push('Raíces de pradera activas');
    if (m.oceanPH < 8.08) parts.push(`Blanqueamiento marino (pH ${m.oceanPH.toFixed(2)})`);
    return parts.length > 0 ? parts.join(' · ') : 'Bosque y océano en equilibrio';
  }
  if (mod === 'nitrogen') {
    const parts: string[] = [];
    parts.push(v.wetlandBuffer < 45 ? 'Humedales drenados' : 'Humedales filtrando NO₃⁻');
    if (m.algalBloomIndex >= 28) parts.push('Floración algal en estuario');
    if (v.syntheticFertilizer >= 90) parts.push('Lixiviación de nitrato');
    return parts.join(' · ');
  }
  if (mod === 'phosphorus') {
    const parts: string[] = [];
    if (v.phosphateMining >= 15) parts.push('Cantera a cielo abierto');
    parts.push(v.erosionControl < 55 ? 'Erosión de lodo en ladera' : 'Terrazas reteniendo suelo');
    if (m.algalBloomIndex >= 28) parts.push('Floración algal en delta');
    return parts.join(' · ');
  }
  if (mod === 'water') {
    return `Nieve ${m.snowpackVolume.toFixed(0)}% · Acuífero ${m.groundwaterTable.toFixed(0)}%${
      v.imperviousSurface >= 35 ? ' · Escorrentía urbana' : ''
    }`;
  }
  return `Temp ${m.globalTempAnomaly >= 0 ? '+' : ''}${m.globalTempAnomaly.toFixed(2)}°C · Nieve ${m.snowpackVolume.toFixed(0)}% · O₂ ${m.dissolvedOxygen.toFixed(1)} mg/L`;
}

export function translateRateText(rateText: string, lang: Language): string {
  if (lang === 'en') return rateText;
  return rateText
    .replace('/yr', '/año')
    .replace('pool', 'reserva')
    .replace('Clearing', 'Tala')
    .replace('Livestock', 'Ganado')
    .replace('DNA / ATP / Bones', 'ADN / ATP / Huesos')
    .replace('Recycles PO₄³⁻', 'Recicla PO₄³⁻')
    .replace('Millions of yrs', 'Millones de años')
    .replace('Table', 'Nivel')
    .replace('Snow', 'Nieve')
    .replace('Bloom', 'Algas');
}
