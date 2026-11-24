import React, { useEffect, useMemo, useState } from 'react';
import {
  LEARNING_MODULES,
  SCENARIO_PRESETS,
  simulateTimeSeries,
} from '../simulation/engine';
import { MODULE_ES, type Language } from '../i18n/translations';
import type { LearningModuleId, SimulationMetrics } from '../types/simulation';

interface TrendAnalyticsProps {
  activeModule: LearningModuleId;
  onSelectModule: (id: LearningModuleId) => void;
  series: SimulationMetrics[];
  currentYear: number;
  onSelectYear: (year: number) => void;
  language: Language;
}

interface ChannelDef {
  id: string;
  module: LearningModuleId;
  label: string;
  labelEs: string;
  unit: string;
  color: string;
  minDomain: number;
  maxDomain: number;
  getValue: (m: SimulationMetrics) => number;
}

const CHANNELS: ChannelDef[] = [
  {
    id: 'co2',
    module: 'carbon',
    label: 'Atmospheric CO₂',
    labelEs: 'CO₂ Atmosférico',
    unit: 'ppm',
    color: '#d97706',
    minDomain: 250,
    maxDomain: 850,
    getValue: (m) => m.atmosphericCO2,
  },
  {
    id: 'oceanPH',
    module: 'carbon',
    label: 'Ocean Surface pH',
    labelEs: 'pH Superficial Mar',
    unit: 'pH',
    color: '#b45309',
    minDomain: 7.7,
    maxDomain: 8.26,
    getValue: (m) => m.oceanPH,
  },
  {
    id: 'nitrate',
    module: 'nitrogen',
    label: 'Aquatic Nitrate',
    labelEs: 'Nitrato Acuático',
    unit: 'mg/L',
    color: '#059669',
    minDomain: 0,
    maxDomain: 20,
    getValue: (m) => m.aquaticNitrateLoad,
  },
  {
    id: 'n2o',
    module: 'nitrogen',
    label: 'Nitrous Oxide Flux',
    labelEs: 'Flujo Óxido Nitroso',
    unit: 'Mt/yr',
    color: '#10b981',
    minDomain: 0,
    maxDomain: 10,
    getValue: (m) => m.nitrousOxideFlux,
  },
  {
    id: 'phosphate',
    module: 'phosphorus',
    label: 'Reactive PO₄³⁻',
    labelEs: 'PO₄³⁻ Reactivo',
    unit: 'ug/L',
    color: '#7c3aed',
    minDomain: 0,
    maxDomain: 200,
    getValue: (m) => m.reactivePhosphate,
  },
  {
    id: 'bloom',
    module: 'climate',
    label: 'Algal Bloom Index',
    labelEs: 'Índice Algal',
    unit: '/100',
    color: '#9333ea',
    minDomain: 0,
    maxDomain: 100,
    getValue: (m) => m.algalBloomIndex,
  },
  {
    id: 'oxygen',
    module: 'climate',
    label: 'Dissolved O₂',
    labelEs: 'O₂ Disuelto',
    unit: 'mg/L',
    color: '#0284c7',
    minDomain: 0,
    maxDomain: 11,
    getValue: (m) => m.dissolvedOxygen,
  },
  {
    id: 'groundwater',
    module: 'water',
    label: 'Aquifer Capacity',
    labelEs: 'Capacidad Acuífero',
    unit: '%',
    color: '#0369a1',
    minDomain: 0,
    maxDomain: 100,
    getValue: (m) => m.groundwaterTable,
  },
  {
    id: 'snowpack',
    module: 'water',
    label: 'Snowpack Volume',
    labelEs: 'Volumen de Nieve',
    unit: '%',
    color: '#38bdf8',
    minDomain: 0,
    maxDomain: 100,
    getValue: (m) => m.snowpackVolume,
  },
];

function getDefaultChannelsForModule(mod: LearningModuleId): Record<string, boolean> {
  if (mod === 'carbon') return { co2: true, oceanPH: true };
  if (mod === 'nitrogen') return { nitrate: true, n2o: true };
  if (mod === 'phosphorus') return { phosphate: true, bloom: true };
  if (mod === 'water') return { groundwater: true, snowpack: true };
  return { co2: true, nitrate: true, bloom: true, oxygen: true, groundwater: true };
}

export const TrendAnalytics: React.FC<TrendAnalyticsProps> = ({
  activeModule,
  onSelectModule,
  series,
  currentYear,
  onSelectYear,
  language,
}) => {
  const [visibleChannels, setVisibleChannels] = useState<Record<string, boolean>>(() =>
    getDefaultChannelsForModule(activeModule)
  );
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    setVisibleChannels(getDefaultChannelsForModule(activeModule));
  }, [activeModule]);

  const isEs = language === 'es';

  const baselineSeries = useMemo(
    () => simulateTimeSeries(SCENARIO_PRESETS.preindustrial.variables, 100, 5),
    []
  );

  const activeIdx = Math.min(series.length - 1, Math.max(0, Math.round(currentYear / 5)));
  const inspectedIdx = hoveredIdx !== null ? hoveredIdx : activeIdx;
  const inspectedMetrics = series[inspectedIdx] ?? series[0];
  const baselineMetrics = baselineSeries[inspectedIdx] ?? baselineSeries[0];

  const moduleMeta =
    LEARNING_MODULES.find((m) => m.id === activeModule) ?? LEARNING_MODULES[0];
  const modTitle = isEs ? MODULE_ES[activeModule].title : moduleMeta.title;

  const moduleChannels =
    activeModule === 'climate'
      ? CHANNELS
      : CHANNELS.filter(
          (ch) => ch.module === activeModule || (activeModule === 'phosphorus' && ch.id === 'bloom')
        );

  const toggleChannel = (id: string) => {
    setVisibleChannels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Chart dimensions
  const width = 760;
  const height = 270;
  const padL = 44;
  const padR = 20;
  const padT = 20;
  const padB = 34;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;

  const xForIndex = (idx: number) =>
    padL + (idx / Math.max(1, series.length - 1)) * innerW;

  const yForNormalized = (norm: number) =>
    padT + (1 - Math.max(0, Math.min(1, norm))) * innerH;

  // Radar Chart math (primarily for Climate Impact)
  const radarAxes = [
    { label: isEs ? 'Estab. Climática' : 'Climate Stability', get: (m: SimulationMetrics) => m.climateStability },
    { label: isEs ? 'Calidad de Agua' : 'Water Quality', get: (m: SimulationMetrics) => m.waterQualityIndex },
    { label: isEs ? 'Balance Nutrientes' : 'Nutrient Balance', get: (m: SimulationMetrics) => m.nutrientBalance },
    { label: isEs ? 'Biodiversidad' : 'Biodiversity', get: (m: SimulationMetrics) => m.biodiversityHealth },
  ];

  const radarPoint = (axisIdx: number, pct: number, radius = 92) => {
    const angle = (axisIdx * Math.PI * 2) / radarAxes.length - Math.PI / 2;
    const r = (pct / 100) * radius;
    return {
      x: 140 + r * Math.cos(angle),
      y: 135 + r * Math.sin(angle),
    };
  };

  const buildPolygon = (m: SimulationMetrics) =>
    radarAxes
      .map((a, idx) => {
        const pt = radarPoint(idx, a.get(m));
        return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
      })
      .join(' ');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {moduleMeta.step}. {modTitle} —{' '}
            {isEs ? 'Análisis de Tendencias' : 'Trend Analytics'}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {isEs
              ? 'Inspecciona trayectorias a 100 años para este módulo o cambia de módulo para comparar ciclos individuales.'
              : 'Inspect 100-year trajectories for this module or switch modules to compare individual cycles.'}
          </p>
        </div>

        {/* Module Focus Switcher */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {LEARNING_MODULES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectModule(m.id)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeModule === m.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEs ? MODULE_ES[m.id].shortTitle : m.shortTitle}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Time-Series SVG Chart */}
        <div className="xl:col-span-8 border border-slate-200 bg-white rounded-xl p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">
              {isEs
                ? `Trayectoria a 100 Años (Año ${inspectedMetrics.year} Seleccionado)`
                : `100-Year Trajectory (Year ${inspectedMetrics.year} Selected)`}
            </h3>

            <div className="flex flex-wrap items-center gap-1.5">
              {moduleChannels.map((ch) => {
                const active = !!visibleChannels[ch.id];
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => toggleChannel(ch.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: ch.color }}
                    />
                    <span>{isEs ? ch.labelEs : ch.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto cursor-crosshair select-none"
            onMouseLeave={() => setHoveredIdx(null)}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const relX = ((e.clientX - rect.left) / rect.width) * width;
              const clampedX = Math.max(padL, Math.min(width - padR, relX));
              const ratio = (clampedX - padL) / innerW;
              const idx = Math.round(ratio * (series.length - 1));
              setHoveredIdx(idx);
            }}
            onClick={() => {
              if (hoveredIdx !== null && series[hoveredIdx]) {
                onSelectYear(series[hoveredIdx].year);
              }
            }}
          >
            {[0, 25, 50, 75, 100].map((pct) => {
              const y = yForNormalized(pct / 100);
              return (
                <g key={pct}>
                  <line
                    x1={padL}
                    y1={y}
                    x2={width - padR}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray={pct === 0 ? undefined : '3 3'}
                  />
                  <text
                    x={padL - 8}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="10"
                    fontFamily="IBM Plex Mono, monospace"
                    fill="#64748b"
                  >
                    {pct}%
                  </text>
                </g>
              );
            })}

            {[0, 20, 40, 60, 80, 100].map((yr) => {
              const idx = Math.round(yr / 5);
              return (
                <text
                  key={yr}
                  x={xForIndex(idx)}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="IBM Plex Mono, monospace"
                  fill="#64748b"
                >
                  Yr {yr}
                </text>
              );
            })}

            {moduleChannels.map((ch) => {
              if (!visibleChannels[ch.id]) return null;
              const pts = series
                .map((m, idx) => {
                  const norm =
                    (ch.getValue(m) - ch.minDomain) / (ch.maxDomain - ch.minDomain);
                  return `${xForIndex(idx).toFixed(1)},${yForNormalized(norm).toFixed(1)}`;
                })
                .join(' ');

              const activePt = series[inspectedIdx];
              const activeNorm =
                (ch.getValue(activePt) - ch.minDomain) / (ch.maxDomain - ch.minDomain);

              return (
                <g key={ch.id}>
                  <polyline
                    fill="none"
                    stroke={ch.color}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    points={pts}
                  />
                  <circle
                    cx={xForIndex(inspectedIdx)}
                    cy={yForNormalized(activeNorm)}
                    r="4"
                    fill={ch.color}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}

            <line
              x1={xForIndex(inspectedIdx)}
              y1={padT}
              x2={xForIndex(inspectedIdx)}
              y2={height - padB}
              stroke="#0f172a"
              strokeWidth="1"
              strokeDasharray="4 3"
            />
          </svg>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            {moduleChannels
              .filter((ch) => visibleChannels[ch.id])
              .map((ch) => (
                <div key={ch.id} className="px-3 py-2 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: ch.color }}
                    />
                    <span className="truncate">{isEs ? ch.labelEs : ch.label}</span>
                  </div>
                  <div className="mt-0.5 flex items-baseline gap-1">
                    <span className="text-sm font-semibold font-mono tabular-nums text-slate-900">
                      {ch.getValue(inspectedMetrics).toFixed(
                        ch.id === 'oceanPH' ? 3 : ch.id === 'oxygen' || ch.id === 'nitrate' ? 2 : 1
                      )}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {isEs ? ch.unit.replace('/yr', '/año') : ch.unit}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Ecosystem Stability Radar */}
        <div className="xl:col-span-4 border border-slate-200 bg-white rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              {isEs ? 'Radar de Estabilidad del Ecosistema' : 'Ecosystem Stability Radar'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEs
                ? `Estado actual (Año ${inspectedMetrics.year}) vs. Base 1750`
                : `Current state (Yr ${inspectedMetrics.year}) vs. 1750 Baseline`}
            </p>
          </div>

          <svg viewBox="0 0 280 270" className="w-full max-w-[280px] mx-auto my-2">
            {[25, 50, 75, 100].map((ring) => {
              const pts = radarAxes
                .map((_, idx) => {
                  const pt = radarPoint(idx, ring);
                  return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
                })
                .join(' ');
              return (
                <polygon
                  key={ring}
                  points={pts}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              );
            })}

            {radarAxes.map((axis, idx) => {
              const outer = radarPoint(idx, 100);
              const labelPt = radarPoint(idx, 122);
              return (
                <g key={axis.label}>
                  <line
                    x1={140}
                    y1={135}
                    x2={outer.x}
                    y2={outer.y}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                  />
                  <text
                    x={labelPt.x}
                    y={labelPt.y + 3}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="#334155"
                  >
                    {axis.label}
                  </text>
                </g>
              );
            })}

            <polygon
              points={buildPolygon(baselineMetrics)}
              fill="rgba(100, 116, 139, 0.08)"
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <polygon
              points={buildPolygon(inspectedMetrics)}
              fill="rgba(2, 132, 199, 0.22)"
              stroke="#0284c7"
              strokeWidth="2.2"
            />
          </svg>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="px-2.5 py-2 rounded-lg bg-slate-50">
              <div className="text-[11px] text-slate-500">
                {isEs ? 'Salud Compuesta' : 'Composite Health'}
              </div>
              <div className="font-mono font-semibold tabular-nums text-base text-slate-900">
                {inspectedMetrics.ecosystemHealth.toFixed(1)}%
              </div>
            </div>
            <div className="px-2.5 py-2 rounded-lg bg-slate-50">
              <div className="text-[11px] text-slate-500">
                {isEs ? 'Estado del Sistema' : 'System State'}
              </div>
              <div
                className={`font-mono font-semibold text-xs mt-1 ${
                  inspectedMetrics.status === 'NOMINAL'
                    ? 'text-emerald-700'
                    : inspectedMetrics.status === 'STRESSED'
                      ? 'text-amber-700'
                      : 'text-rose-700'
                }`}
              >
                {inspectedMetrics.status === 'NOMINAL'
                  ? isEs
                    ? '● ÓPTIMO'
                    : '● NOMINAL'
                  : inspectedMetrics.status === 'STRESSED'
                    ? isEs
                      ? '▲ ESTRESADO'
                      : '▲ STRESSED'
                    : isEs
                      ? '✖ CRÍTICO'
                      : '✖ CRITICAL'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
