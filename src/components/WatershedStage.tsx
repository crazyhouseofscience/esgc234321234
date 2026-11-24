import React, { useEffect, useState } from 'react';
import { ArrowRight, Mountain, Eye, EyeOff, Route } from 'lucide-react';
import { LEARNING_MODULES } from '../simulation/engine';
import { MODULE_MAP_CONFIGS } from '../simulation/modulesMap';
import { DynamicSceneEffects } from './DynamicSceneEffects';
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
}) => {
  const [backdropError, setBackdropError] = useState(false);
  const [activePathwayId, setActivePathwayId] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setBackdropError(false);
    setActivePathwayId(null);
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

  const inspectedPathway =
    mapConfig.pathways.find((p) => p.id === activePathwayId) ?? null;

  const zoneLayers = getPhotographicZones(activeModule, metrics, variables);
  const liveSceneCaption = getLiveSceneCaption(activeModule, metrics, variables);

  const durationSeconds = (rateNorm: number) => {
    const clamped = Math.max(1.4, Math.min(6.5, 4.2 / Math.max(0.35, rateNorm)));
    return Number(clamped.toFixed(2));
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 border border-slate-200 bg-white rounded-xl overflow-hidden">
      {/* Compact Stage Header with Optional Descriptors Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-slate-200 bg-slate-50/80 shrink-0">
        <div className="text-sm font-semibold text-slate-900 truncate">
          {moduleMeta.step}. {moduleMeta.title}
          {showDescriptors && (
            <span className="hidden sm:inline font-normal text-slate-600">
              {' '}
              — {moduleMeta.coreQuestion}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleDescriptors}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            showDescriptors
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
        >
          {showDescriptors ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>Descriptors: {showDescriptors ? 'On' : 'Off (Quiz)'}</span>
        </button>
      </div>

      {/* Multi-Layer Photorealistic Interactive Map Canvas */}
      <div className="relative flex-1 min-h-[260px] bg-slate-900 overflow-hidden select-none">
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

        {/* Live Visual Change Status Caption */}
        <div className="absolute left-3 bottom-3 px-2.5 py-1 rounded-md bg-slate-950/85 border border-white/15 text-slate-100 text-xs font-medium shadow-sm pointer-events-none z-10">
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
            const rateNorm = p.getRateNorm(metrics, variables);
            const durSec = durationSeconds(rateNorm);
            const isHighlighted = activePathwayId === null || activePathwayId === p.id;
            const strokeW = Math.min(6.5, Math.max(2.6, 2.4 + rateNorm * 2.4));

            return (
              <g
                key={p.id}
                style={{
                  opacity: isHighlighted ? 1 : 0.22,
                  transition: 'opacity 180ms ease',
                }}
              >
                <path
                  d={p.svgPath}
                  fill="none"
                  stroke="rgba(15, 23, 42, 0.68)"
                  strokeWidth={strokeW + 3}
                  strokeLinecap="round"
                />

                <path
                  d={p.svgPath}
                  fill="none"
                  stroke={p.color}
                  strokeWidth={strokeW}
                  strokeLinecap="round"
                  markerEnd={`url(#arrow-${p.id})`}
                  className="animate-flow"
                  style={{ '--flow-duration': `${durSec}s` } as React.CSSProperties}
                />

                {!prefersReducedMotion && (
                  <>
                    <circle r="4.8" fill={p.particleColor} stroke="#0f172a" strokeWidth="1.2">
                      <animateMotion
                        dur={`${durSec}s`}
                        repeatCount="indefinite"
                        path={p.svgPath}
                      />
                    </circle>
                    <circle r="4.8" fill={p.particleColor} stroke="#0f172a" strokeWidth="1.2">
                      <animateMotion
                        dur={`${durSec}s`}
                        begin={`${(durSec / 2).toFixed(2)}s`}
                        repeatCount="indefinite"
                        path={p.svgPath}
                      />
                    </circle>
                  </>
                )}

                {showDescriptors && (
                  <g transform={`translate(${p.labelX}, ${p.labelY})`}>
                    <rect
                      x="-82"
                      y="-20"
                      width="164"
                      height="38"
                      rx="6"
                      fill="rgba(15, 23, 42, 0.9)"
                      stroke={activePathwayId === p.id ? p.color : 'rgba(255,255,255,0.24)'}
                      strokeWidth={activePathwayId === p.id ? '1.6' : '1'}
                    />
                    <text
                      x="0"
                      y="-3"
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize="11.5"
                      fontWeight="600"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      {p.stepNum}. {p.processName}
                    </text>
                    <text
                      x="0"
                      y="12"
                      textAnchor="middle"
                      fill={p.particleColor}
                      fontSize="10.5"
                      fontFamily="IBM Plex Mono, monospace"
                    >
                      {p.fromLabel} → {p.toLabel} · {p.getRateText(metrics, variables)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Reservoir Hotspot Buttons */}
        {mapConfig.nodes.map((node) => {
          const isSelected = node.id === selectedNode.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelectNode(node.id)}
              style={{ left: `${node.xPercent}%`, top: `${node.yPercent}%` }}
              className={`-translate-x-1/2 -translate-y-1/2 absolute px-3 py-1.5 rounded-lg text-left transition-all cursor-pointer whitespace-nowrap shadow-md border ${
                isSelected
                  ? 'bg-slate-900 text-white border-white ring-2 ring-sky-400 scale-105 z-20'
                  : 'bg-white/95 text-slate-900 border-slate-300 hover:bg-white hover:scale-105 z-10'
              }`}
            >
              <div className="text-xs font-semibold leading-tight">{node.label}</div>
              {showDescriptors && (
                <div
                  className={`text-[11px] font-mono leading-tight ${
                    isSelected ? 'text-sky-300' : 'text-slate-600'
                  }`}
                >
                  {node.chemicalForm}
                </div>
              )}
            </button>
          );
        })}

        {showDescriptors && activeModule === 'phosphorus' && (
          <div className="absolute left-3 top-3 px-3 py-1.5 rounded-md bg-slate-950/90 border border-violet-400/60 text-violet-100 text-xs font-medium shadow-sm">
            No Gas Phase — Travels Rock → Soil → Water → Sediment
          </div>
        )}

        {activeModule === 'climate' && metrics.algalBloomIndex >= 45 && (
          <div className="absolute right-3 top-3 px-3 py-1.5 rounded-md bg-rose-950/90 border border-rose-500/60 text-rose-100 text-xs font-medium flex items-center gap-2 shadow-sm">
            <span className="font-mono font-semibold text-rose-300">▲ HYPOXIA ALERT</span>
            <span className="font-mono tabular-nums">
              DO: {metrics.dissolvedOxygen.toFixed(2)} mg/L
            </span>
          </div>
        )}
      </div>

      {/* Compact Route & Reservoir Strip */}
      <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-200 space-y-2 shrink-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 mr-1">
            <Route className="w-3.5 h-3.5 text-slate-500" />
            Routes:
          </span>
          {mapConfig.pathways.map((p) => {
            const selected = activePathwayId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onMouseEnter={() => setActivePathwayId(p.id)}
                onMouseLeave={() => setActivePathwayId(null)}
                onClick={() =>
                  setActivePathwayId((prev) => (prev === p.id ? null : p.id))
                }
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selected
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <span>
                  {p.stepNum}. {p.fromLabel}
                </span>
                <ArrowRight className="w-3 h-3 opacity-60 shrink-0" />
                <span>{p.toLabel}</span>
              </button>
            );
          })}
        </div>

        {showDescriptors && (
          <div className="text-xs text-slate-700 leading-snug flex flex-wrap items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
            {inspectedPathway ? (
              <div>
                <strong className="text-slate-900">
                  {inspectedPathway.stepNum}. {inspectedPathway.processName} ({inspectedPathway.fromLabel} → {inspectedPathway.toLabel}):
                </strong>{' '}
                {inspectedPathway.explanation}{' '}
                <span className="font-mono text-slate-600">[{inspectedPathway.chemicalChange}]</span>
              </div>
            ) : (
              <div>
                <strong className="text-slate-900">
                  {selectedNode.label} ({selectedNode.chemicalForm}):
                </strong>{' '}
                {selectedNode.summary}{' '}
                <span className="font-mono text-slate-600">[{selectedNode.equation}]</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
