import React, { useEffect, useState } from 'react';
import { BookOpen, Info, Mountain, Eye, EyeOff, Route, Sun } from 'lucide-react';
import { LEARNING_MODULES } from '../simulation/engine';
import { MODULE_MAP_CONFIGS } from '../simulation/modulesMap';
import { DynamicSceneEffects } from './DynamicSceneEffects';
import { NodeInfoModal } from './NodeInfoModal';
import type {
  LearningModuleId,
  SimulationMetrics,
  SimulationVariables,
} from '../types/simulation';

interface WatershedStageProps {
  activeModule: LearningModuleId;
  metrics: SimulationMetrics;
  variables: SimulationVariables;
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  showDescriptors: boolean;
  onToggleDescriptors: () => void;
  onOpenGuide?: () => void;
}

interface PhotographicZoneLayer {
  id: string;
  opacity: number;
  maskImage: string;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function getPhotographicZones(
  mod: LearningModuleId,
  m: SimulationMetrics,
  v: SimulationVariables
): PhotographicZoneLayer[] {
  if (mod === 'carbon') {
    const factorySmoke = clamp01(v.fossilFuelEmissions / 15);
    const forestLoss = clamp01(
      (v.deforestationRate - v.reforestationEffort * 0.35 - v.grasslandCover * 0.2 + 25) / 85
    );
    const oceanAcid = clamp01((8.16 - m.oceanPH) / 0.32);

    return [
      {
        id: 'carbon-sky-smog',
        opacity: factorySmoke,
        // Feathered upper sky & smokestack plume zone
        maskImage:
          'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 36%, rgba(0,0,0,0) 64%)',
      },
      {
        id: 'carbon-forest-soil',
        opacity: forestLoss,
        // Left forest slope & dry cracked soil cross-section
        maskImage:
          'radial-gradient(ellipse 56% 78% at 22% 65%, rgba(0,0,0,1) 42%, rgba(0,0,0,0) 92%)',
      },
      {
        id: 'carbon-ocean-bleach',
        opacity: oceanAcid,
        // Bottom-right coastal ocean & coral reef cross-section
        maskImage:
          'radial-gradient(ellipse 46% 52% at 84% 76%, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 92%)',
      },
    ];
  }

  if (mod === 'nitrogen') {
    const soilLeach = clamp01((v.syntheticFertilizer / 170 + v.livestockDensity / 100) * 0.72);
    const wetlandLoss = clamp01((85 - v.wetlandBuffer) / 72);
    const estuaryBloom = clamp01((m.algalBloomIndex - 15) / 70);

    return [
      {
        id: 'nitrogen-soil-leach',
        opacity: soilLeach,
        // Bottom-left root-zone soil cross-section
        maskImage:
          'radial-gradient(ellipse 52% 45% at 32% 84%, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 95%)',
      },
      {
        id: 'nitrogen-wetland-drain',
        opacity: wetlandLoss,
        // Center-right marshy riverbank zone
        maskImage:
          'radial-gradient(ellipse 30% 44% at 62% 58%, rgba(0,0,0,1) 48%, rgba(0,0,0,0) 94%)',
      },
      {
        id: 'nitrogen-estuary-bloom',
        opacity: estuaryBloom,
        // Far-right coastal estuary & river mouth bloom
        maskImage:
          'radial-gradient(ellipse 32% 42% at 88% 55%, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 95%)',
      },
    ];
  }

  if (mod === 'phosphorus') {
    const quarry = clamp01((v.phosphateMining - 2) / 36);
    const erosion = clamp01((85 - v.erosionControl) / 75);
    const deltaBloom = clamp01((m.algalBloomIndex - 14) / 68 + v.wastewaterPhosphates / 180);

    return [
      {
        id: 'phosphorus-quarry',
        opacity: quarry,
        // Left stepped rock mining cliff
        maskImage:
          'radial-gradient(ellipse 34% 72% at 15% 45%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 94%)',
      },
      {
        id: 'phosphorus-erosion',
        opacity: erosion,
        // Center terraced hillside gullies
        maskImage:
          'radial-gradient(ellipse 36% 52% at 50% 42%, rgba(0,0,0,1) 48%, rgba(0,0,0,0) 94%)',
      },
      {
        id: 'phosphorus-delta-bloom',
        opacity: deltaBloom,
        // Right river delta, coastal bay & sediment layers
        maskImage:
          'radial-gradient(ellipse 42% 68% at 84% 64%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)',
      },
    ];
  }

  if (mod === 'water') {
    const snowMelt = clamp01((94 - m.snowpackVolume) / 68);
    const pavedFlood = clamp01((v.imperviousSurface - 6) / 72);
    const aquiferDrain = clamp01((92 - m.groundwaterTable) / 65);

    return [
      {
        id: 'water-snow-melt',
        opacity: snowMelt,
        // Top-left alpine glacier & snowpeaks
        maskImage:
          'radial-gradient(ellipse 46% 38% at 24% 28%, rgba(0,0,0,1) 48%, rgba(0,0,0,0) 94%)',
      },
      {
        id: 'water-urban-flood',
        opacity: pavedFlood,
        // Center valley town & flood river
        maskImage:
          'radial-gradient(ellipse 52% 36% at 44% 58%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 94%)',
      },
      {
        id: 'water-aquifer-drain',
        opacity: aquiferDrain,
        // Bottom full-width underground aquifer cross-section
        maskImage:
          'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.96) 20%, rgba(0,0,0,0) 34%)',
      },
    ];
  }

  // Climate & Coupled Impact
  const warmingHaze = clamp01(m.globalTempAnomaly / 2.6);
  const snowMelt = clamp01((94 - m.snowpackVolume) / 68);
  const forestLoss = clamp01(v.deforestationRate / 80);
  const coastalBloom = clamp01((m.algalBloomIndex - 16) / 68);
  const aquiferDrain = clamp01((92 - m.groundwaterTable) / 65);

  return [
    {
      id: 'climate-sky-haze',
      opacity: warmingHaze,
      maskImage:
        'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 28%, rgba(0,0,0,0) 52%)',
    },
    {
      id: 'climate-snow-melt',
      opacity: snowMelt,
      maskImage:
        'radial-gradient(ellipse 30% 34% at 18% 22%, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 95%)',
    },
    {
      id: 'climate-forest-clear',
      opacity: forestLoss,
      maskImage:
        'radial-gradient(ellipse 34% 42% at 32% 48%, rgba(0,0,0,1) 48%, rgba(0,0,0,0) 94%)',
    },
    {
      id: 'climate-coastal-bloom',
      opacity: coastalBloom,
      maskImage:
        'radial-gradient(ellipse 46% 52% at 80% 58%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 94%)',
    },
    {
      id: 'climate-aquifer-drain',
      opacity: aquiferDrain,
      maskImage:
        'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 18%, rgba(0,0,0,0) 30%)',
    },
  ];
}

function getLiveSceneCaption(
  mod: LearningModuleId,
  m: SimulationMetrics,
  v: SimulationVariables
): string {
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

export const WatershedStage: React.FC<WatershedStageProps> = ({
  activeModule,
  metrics,
  variables,
  selectedNodeId,
  onSelectNode,
  showDescriptors,
  onToggleDescriptors,
  onOpenGuide,
}) => {
  const [backdropError, setBackdropError] = useState(false);
  const [activePathwayId, setActivePathwayId] = useState<string | null>(null);
  const [inspectedModalNodeId, setInspectedModalNodeId] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setBackdropError(false);
    setActivePathwayId(null);
    setInspectedModalNodeId(null);
  }, [activeModule]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const moduleMeta =
    LEARNING_MODULES.find((m) => m.id === activeModule) ?? LEARNING_MODULES[0];
  const mapConfig = MODULE_MAP_CONFIGS[activeModule];

  const selectedNode =
    mapConfig.nodes.find((n) => n.id === selectedNodeId) ?? mapConfig.nodes[0];

  const inspectedModalNode =
    inspectedModalNodeId
      ? mapConfig.nodes.find((n) => n.id === inspectedModalNodeId) ?? null
      : null;

  const inspectedPathway =
    mapConfig.pathways.find((p) => p.id === activePathwayId) ?? null;

  const zoneLayers = getPhotographicZones(activeModule, metrics, variables);
  const liveSceneCaption = getLiveSceneCaption(activeModule, metrics, variables);

  const durationSeconds = (rateNorm: number) => {
    const clamped = Math.max(0.6, Math.min(5.0, 1.15 / Math.max(0.2, rateNorm)));
    return Number(clamped.toFixed(2));
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 border border-slate-200 bg-white rounded-xl overflow-hidden shadow-xs">
      {/* Slim Single-Row Stage Header */}
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-slate-200 bg-slate-50/90 shrink-0">
        <div className="min-w-0 flex-1 text-sm font-bold text-slate-950 truncate">
          {moduleMeta.step}. {moduleMeta.title}
          {showDescriptors && (
            <span className="hidden xl:inline font-medium text-xs text-slate-600">
              {' '}
              — {moduleMeta.coreQuestion}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-sky-200 bg-sky-50 text-sky-900 hover:bg-sky-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-700" />
              <span>Cycle Summary</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleDescriptors}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              showDescriptors
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {showDescriptors ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Labels: {showDescriptors ? 'On' : 'Off'}</span>
          </button>
        </div>
      </div>

      {/* Maximized Multi-Layer Photorealistic Interactive Map Canvas */}
      <div className="relative flex-1 min-h-[340px] bg-slate-900 overflow-hidden select-none">
        {!backdropError ? (
          <>
            {/* Base Equilibrium Photograph */}
            <img
              src={mapConfig.backdropSrc}
              alt={mapConfig.backdropAlt}
              referrerPolicy="no-referrer"
              onError={() => setBackdropError(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Independent Zonal Photorealistic Transformation Layers */}
            {zoneLayers.map((zone) => (
              <img
                key={zone.id}
                src={mapConfig.perturbedSrc}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
                style={{
                  opacity: zone.opacity,
                  maskImage: zone.maskImage,
                  WebkitMaskImage: zone.maskImage,
                }}
              />
            ))}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-sky-200 via-emerald-100 to-slate-800 flex items-center justify-center">
            <div className="text-center text-slate-700">
              <Mountain className="w-10 h-10 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-medium">{moduleMeta.title} Map</p>
            </div>
          </div>
        )}

        {/* Subtle Animated Motion Accents (Smokestack wisps, N2 bubbles, Rain) */}
        <DynamicSceneEffects
          activeModule={activeModule}
          metrics={metrics}
          variables={variables}
          prefersReducedMotion={prefersReducedMotion}
        />

        {/* Compact Top-Left Live Visual State Pill */}
        <div className="absolute left-2.5 top-2 px-2.5 py-1 rounded-md bg-slate-950/85 border border-white/20 text-slate-100 text-[11px] font-semibold shadow-md pointer-events-none z-20 backdrop-blur-xs">
          Visual State: <span className="text-sky-300">{liveSceneCaption}</span>
        </div>

        {/* High-Contrast SVG Directional Pathways & Traveling Molecule Beads */}
        <svg
          viewBox="0 0 1000 562"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          <defs>
            {mapConfig.pathways.map((p) => (
              <marker
                key={`marker-${p.id}`}
                id={`arrow-${p.id}`}
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="5.5"
                markerHeight="5.5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8.5 5 L 0 9 z" fill={p.color} stroke="#0f172a" strokeWidth="0.8" />
              </marker>
            ))}
          </defs>

          {mapConfig.pathways.map((p) => {
            const intensity = Math.max(0, Math.min(1.5, p.getRateNorm(metrics, variables)));
            const isDormant = intensity <= 0.035;
            const durSec = durationSeconds(intensity);
            const speedBucket = Math.round(durSec * 6);
            const isHighlighted = activePathwayId === null || activePathwayId === p.id;

            const intensityOpacity = isDormant
              ? 0.18
              : Math.min(1, 0.28 + intensity * 0.66);
            const flowOpacity = isHighlighted
              ? intensityOpacity
              : Math.max(0.08, intensityOpacity * 0.22);
            const haloOpacity = isDormant
              ? 0.18
              : Math.min(0.78, 0.22 + intensity * 0.48);
            const strokeW = isDormant
              ? 1.8
              : Math.min(7.2, Math.max(2.1, 2.0 + intensity * 3.6));

            const particleCount = isDormant
              ? 0
              : intensity < 0.4
                ? 1
                : intensity < 0.9
                  ? 2
                  : 3;
            const particleRadius = isDormant
              ? 0
              : Math.min(5.6, Math.max(3.6, 3.5 + intensity * 1.4));
            const particleOffsets = Array.from(
              { length: particleCount },
              (_, idx) => (idx * durSec) / particleCount
            );

            return (
              <g key={p.id}>
                <g
                  style={{
                    opacity: flowOpacity,
                    transition: 'opacity 180ms ease',
                  }}
                >
                  <path
                    d={p.svgPath}
                    fill="none"
                    stroke={`rgba(15, 23, 42, ${haloOpacity.toFixed(2)})`}
                    strokeWidth={strokeW + 3.0}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-width 180ms ease, stroke 180ms ease' }}
                  />

                  <path
                    d={p.svgPath}
                    fill="none"
                    stroke={p.color}
                    strokeWidth={strokeW}
                    strokeLinecap="round"
                    markerStart={p.bidirectional ? `url(#arrow-${p.id})` : undefined}
                    markerEnd={`url(#arrow-${p.id})`}
                    className={isDormant ? undefined : 'animate-flow'}
                    strokeDasharray={isDormant ? '6 8' : undefined}
                    style={
                      {
                        '--flow-duration': `${durSec}s`,
                        transition: 'stroke-width 180ms ease',
                      } as React.CSSProperties
                    }
                  />

                  {!prefersReducedMotion &&
                    particleOffsets.map((offsetSec, idx) => (
                      <circle
                        key={`${p.id}-bead-${speedBucket}-${idx}`}
                        r={particleRadius}
                        fill={p.particleColor}
                        stroke="#0f172a"
                        strokeWidth="1.2"
                      >
                        <animateMotion
                          dur={`${durSec}s`}
                          begin={`${offsetSec.toFixed(2)}s`}
                          repeatCount="indefinite"
                          path={p.svgPath}
                        />
                      </circle>
                    ))}
                </g>
              </g>
            );
          })}
        </svg>

        {/* Compact Single-Line Pathway Badges (Reveals Route + Rate on Hover/Click) */}
        {showDescriptors &&
          mapConfig.pathways.map((p) => {
            const isHighlighted = activePathwayId === null || activePathwayId === p.id;
            const isSelected = activePathwayId === p.id;
            const intensity = Math.max(0, Math.min(1.5, p.getRateNorm(metrics, variables)));
            const isDormant = intensity <= 0.035;
            const xPct = (p.labelX / 10).toFixed(1);
            const yPct = (p.labelY / 5.62).toFixed(1);

            return (
              <button
                key={`label-${p.id}`}
                type="button"
                onMouseEnter={() => setActivePathwayId(p.id)}
                onMouseLeave={() => setActivePathwayId(null)}
                onClick={() =>
                  setActivePathwayId((prev) => (prev === p.id ? null : p.id))
                }
                style={{
                  left: `clamp(78px, ${xPct}%, calc(100% - 78px))`,
                  top: `clamp(38px, ${yPct}%, calc(100% - 22px))`,
                  borderColor: isSelected ? p.particleColor : p.color,
                  opacity: isHighlighted ? (isDormant ? 0.65 : 1) : 0.28,
                }}
                className={`-translate-x-1/2 -translate-y-1/2 absolute px-2 py-0.5 rounded-md bg-slate-950/90 text-left border shadow-md transition-all cursor-pointer whitespace-nowrap ${
                  isSelected ? 'scale-105 z-30 ring-2 ring-white/80' : 'hover:scale-105 z-20'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-white leading-tight">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: p.particleColor }}
                  />
                  <span>
                    {p.stepNum}. {p.processName}
                  </span>
                </div>
                {isSelected && (
                  <div
                    className="text-[10.5px] font-mono font-semibold leading-tight mt-0.5 pl-3.5"
                    style={{ color: p.particleColor }}
                  >
                    {p.fromLabel} {p.bidirectional ? '⇌' : '→'} {p.toLabel} ·{' '}
                    {p.getRateText(metrics, variables)}
                  </div>
                )}
              </button>
            );
          })}

        {/* Crisp Edge-Safe Reservoir Nodes with Clickable Info-Hotspots */}
        {mapConfig.nodes.map((node) => {
          const isSelected = node.id === selectedNode.id;
          return (
            <div
              key={node.id}
              style={{
                left: `clamp(96px, ${node.xPercent}%, calc(100% - 96px))`,
                top: `clamp(40px, ${node.yPercent}%, calc(100% - 32px))`,
              }}
              className={`-translate-x-1/2 -translate-y-1/2 absolute flex items-center gap-1 rounded-md shadow-md border-2 transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-slate-950 text-white border-sky-300 ring-2 ring-sky-400/70 scale-105 z-30'
                  : 'bg-white/95 text-slate-950 border-slate-800/85 hover:bg-white hover:scale-105 z-20'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setInspectedModalNodeId(node.id);
                  } else {
                    onSelectNode(node.id);
                  }
                }}
                className="pl-2.5 pr-1 py-1 text-left cursor-pointer rounded-l-md"
              >
                <div className="text-xs sm:text-[13px] font-bold leading-tight">{node.label}</div>
                {showDescriptors && (
                  <div
                    className={`text-[10.5px] sm:text-[11px] font-mono font-semibold leading-tight ${
                      isSelected ? 'text-sky-300' : 'text-slate-600'
                    }`}
                  >
                    {node.chemicalForm}
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectNode(node.id);
                  setInspectedModalNodeId(node.id);
                }}
                aria-label={`Inspect biogeochemical processes at ${node.label}`}
                title={`Info hotspot: view ${node.label} processes`}
                className={`mr-1.5 w-5 h-5 rounded-full inline-flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-sky-500 text-white hover:bg-sky-400'
                    : 'bg-sky-100 text-sky-800 hover:bg-sky-600 hover:text-white'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}

        {showDescriptors && activeModule === 'phosphorus' && (
          <div className="absolute right-2.5 top-2 px-2.5 py-1 rounded-md bg-slate-950/90 border border-violet-400 text-violet-100 text-[11px] font-semibold shadow-md z-20">
            No Gas Phase — Rock → Soil → Life → Ocean → Sediment
          </div>
        )}

        {showDescriptors && activeModule === 'water' && (
          <div className="absolute right-2.5 top-2 px-2.5 py-1 rounded-md bg-slate-950/90 border border-amber-300 text-amber-100 text-[11px] font-semibold flex items-center gap-1.5 shadow-md z-20">
            <Sun className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Sun drives evaporation · Gravity pulls rain/snow</span>
          </div>
        )}

        {activeModule === 'climate' && metrics.algalBloomIndex >= 45 && (
          <div className="absolute right-2.5 top-2 px-2.5 py-1 rounded-md bg-rose-950/95 border border-rose-400 text-rose-100 text-[11px] font-semibold flex items-center gap-2 shadow-md z-20">
            <span className="font-mono font-bold text-rose-300">▲ HYPOXIA ALERT</span>
            <span className="font-mono tabular-nums">
              DO: {metrics.dissolvedOxygen.toFixed(2)} mg/L
            </span>
          </div>
        )}
      </div>

      {/* Slim Single-Row Route Strip + Compact Inspector Bar */}
      <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200 space-y-1.5 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 mr-1 shrink-0">
            <Route className="w-3.5 h-3.5 text-slate-500" />
            Routes:
          </span>
          {mapConfig.pathways.map((p) => {
            const selected = activePathwayId === p.id;
            const intensity = Math.max(0, Math.min(1.5, p.getRateNorm(metrics, variables)));
            const isDormant = intensity <= 0.035;
            return (
              <button
                key={p.id}
                type="button"
                onMouseEnter={() => setActivePathwayId(p.id)}
                onMouseLeave={() => setActivePathwayId(null)}
                onClick={() =>
                  setActivePathwayId((prev) => (prev === p.id ? null : p.id))
                }
                title={`${p.fromLabel} ${p.bidirectional ? '⇌' : '→'} ${p.toLabel} (${p.getRateText(metrics, variables)})`}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selected
                    ? 'bg-slate-900 text-white border-slate-900'
                    : isDormant
                      ? 'bg-white/75 text-slate-500 border-slate-200 hover:border-slate-300'
                      : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0 transition-opacity"
                  style={{
                    backgroundColor: p.color,
                    opacity: isDormant ? 0.25 : Math.min(1, 0.35 + intensity * 0.65),
                  }}
                />
                <span>
                  {p.stepNum}. {p.processName}
                </span>
              </button>
            );
          })}
        </div>

        {showDescriptors && (
          <div className="text-xs text-slate-800 leading-snug bg-white px-2.5 py-1.5 rounded-md border border-slate-200 flex items-center justify-between gap-2">
            {inspectedPathway ? (
              <div className="truncate sm:whitespace-normal">
                <strong className="text-slate-950">
                  {inspectedPathway.stepNum}. {inspectedPathway.processName} ({inspectedPathway.fromLabel}{' '}
                  {inspectedPathway.bidirectional ? '⇌' : '→'} {inspectedPathway.toLabel} ·{' '}
                  {inspectedPathway.getRateText(metrics, variables)}):
                </strong>{' '}
                {inspectedPathway.explanation}{' '}
                <span className="font-mono font-semibold text-slate-700">
                  [{inspectedPathway.chemicalChange}]
                </span>
              </div>
            ) : (
              <div className="truncate sm:whitespace-normal">
                <strong className="text-slate-950">
                  {selectedNode.label} ({selectedNode.chemicalForm}):
                </strong>{' '}
                {selectedNode.summary}{' '}
                <span className="font-mono font-semibold text-slate-700">
                  [{selectedNode.equation}]
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 shrink-0">
              {!inspectedPathway && (
                <button
                  type="button"
                  onClick={() => setInspectedModalNodeId(selectedNode.id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800 hover:text-sky-800 whitespace-nowrap cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-sky-700" />
                  <span>Node Details</span>
                </button>
              )}
              {onOpenGuide && (
                <button
                  type="button"
                  onClick={onOpenGuide}
                  className="text-xs font-semibold text-sky-700 hover:text-sky-900 whitespace-nowrap cursor-pointer"
                >
                  Full Summary →
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <NodeInfoModal
        isOpen={Boolean(inspectedModalNode)}
        onClose={() => setInspectedModalNodeId(null)}
        activeModule={activeModule}
        node={inspectedModalNode}
        pathways={mapConfig.pathways}
        metrics={metrics}
        variables={variables}
        onOpenCycleSummary={onOpenGuide}
      />
    </div>
  );
};
