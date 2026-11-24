import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import {
  LEARNING_MODULES,
  SCENARIO_PRESETS,
  getActiveChallengeIds,
  simulateTimeSeries,
} from './simulation/engine';
import { WatershedStage } from './components/WatershedStage';
import { ControlDeck, type ControlDeckTab } from './components/ControlDeck';
import { TrendAnalytics } from './components/TrendAnalytics';
import { ClassroomDashboard } from './components/ClassroomDashboard';
import { ExportModal } from './components/ExportModal';
import { CycleSummaryModal } from './components/CycleSummaryModal';
import type {
  ClassroomRoomState,
  GroupSnapshot,
  LearningModuleId,
  ScenarioId,
  SimulationMetrics,
  SimulationVariables,
} from './types/simulation';

type ActiveTab = 'modules' | 'analytics' | 'classroom';

function getInitialRoomCode(): string {
  if (typeof window === 'undefined') return 'EARTH-101';
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('room')?.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  if (fromUrl) return fromUrl.slice(0, 24);
  return localStorage.getItem('terraflux_room') || 'EARTH-101';
}

function getOrCreateGroupId(): string {
  if (typeof window === 'undefined') return 'group-local';
  let id = localStorage.getItem('terraflux_group_id');
  if (!id) {
    id = `grp_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem('terraflux_group_id', id);
  }
  return id;
}

function getDefaultNodeForModule(mod: LearningModuleId): string {
  if (mod === 'carbon') return 'c_forest';
  if (mod === 'nitrogen') return 'n_legumes';
  if (mod === 'phosphorus') return 'p_rock';
  if (mod === 'water') return 'w_aquifer';
  return 'cl_estuary';
}

function getModuleKPIs(
  mod: LearningModuleId,
  m: SimulationMetrics
): { label: string; value: string; unit: string; detail: string }[] {
  switch (mod) {
    case 'carbon':
      return [
        {
          label: 'Atmospheric CO₂ Gas',
          value: m.atmosphericCO2.toFixed(1),
          unit: 'ppm',
          detail: `Net flux ${m.netCarbonFlux >= 0 ? '+' : ''}${m.netCarbonFlux.toFixed(1)} GtC/yr`,
        },
        {
          label: 'Forest & Grass Sink',
          value: m.photosynthesisFlux.toFixed(1),
          unit: 'GtC/yr',
          detail: `Soil + plant C ${(m.terrestrialBiomassC + m.soilOrganicC).toFixed(0)} GtC`,
        },
        {
          label: 'Ocean Surface pH',
          value: m.oceanPH.toFixed(3),
          unit: 'pH',
          detail: `Ocean uptake ${m.oceanCarbonUptake.toFixed(2)} GtC/yr`,
        },
      ];
    case 'nitrogen':
      return [
        {
          label: 'Biological N₂ Fixation',
          value: m.nFixationFlux.toFixed(1),
          unit: 'MtN/yr',
          detail: `Soil nitrate ${m.soilNitrate.toFixed(1)} mg/kg`,
        },
        {
          label: 'Wetland Denitrification',
          value: m.denitrificationFlux.toFixed(1),
          unit: 'MtN/yr',
          detail: `N₂O gas ${m.nitrousOxideFlux.toFixed(2)} Mt/yr`,
        },
        {
          label: 'River Nitrate (NO₃⁻)',
          value: m.aquaticNitrateLoad.toFixed(2),
          unit: 'mg/L',
          detail: m.aquaticNitrateLoad > 3.0 ? 'Elevated leaching' : 'Safe threshold',
        },
      ];
    case 'phosphorus':
      return [
        {
          label: 'Rock & Sewage Input',
          value: m.pWeatheringAndMiningFlux.toFixed(1),
          unit: 'MtP/yr',
          detail: `Runoff ${m.pRunoffFlux.toFixed(2)} MtP/yr`,
        },
        {
          label: 'Reactive PO₄³⁻',
          value: m.reactivePhosphate.toFixed(1),
          unit: 'ug/L',
          detail: m.reactivePhosphate > 35 ? 'Algal bloom risk' : 'Balanced mineral P',
        },
        {
          label: 'Seafloor Sediment Pool',
          value: m.sedimentPhosphatePool.toFixed(0),
          unit: 'MtP',
          detail: 'Geologic sink (0% gas)',
        },
      ];
    case 'water':
      return [
        {
          label: 'Precipitation',
          value: m.precipitationRate.toFixed(0),
          unit: 'mm/yr',
          detail: `Transpiration ${m.transpirationFlux.toFixed(0)} mm/yr`,
        },
        {
          label: 'Surface Runoff',
          value: m.surfaceRunoff.toFixed(0),
          unit: 'mm/yr',
          detail: `Infiltration ${m.infiltrationFlux.toFixed(0)} mm/yr`,
        },
        {
          label: 'Groundwater & Snowpack',
          value: m.groundwaterTable.toFixed(1),
          unit: '%',
          detail: `Snowpack ${m.snowpackVolume.toFixed(0)}%`,
        },
      ];
    case 'climate':
      return [
        {
          label: 'Global Temp Anomaly',
          value: `${m.globalTempAnomaly >= 0 ? '+' : ''}${m.globalTempAnomaly.toFixed(2)}`,
          unit: '°C',
          detail: `CO₂ ${m.atmosphericCO2.toFixed(0)} ppm · pH ${m.oceanPH.toFixed(2)}`,
        },
        {
          label: 'Coastal Dissolved O₂',
          value: m.dissolvedOxygen.toFixed(2),
          unit: 'mg/L',
          detail: `Bloom Index ${m.algalBloomIndex.toFixed(0)}/100`,
        },
        {
          label: 'Ecosystem Health',
          value: m.ecosystemHealth.toFixed(1),
          unit: '%',
          detail: `Snow ${m.snowpackVolume.toFixed(0)}% · Aquifer ${m.groundwaterTable.toFixed(0)}%`,
        },
      ];
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('modules');
  const [activeModule, setActiveModule] = useState<LearningModuleId>('carbon');
  const [deckTab, setDeckTab] = useState<ControlDeckTab>('controls');
  const [exploredModules, setExploredModules] = useState<LearningModuleId[]>(['carbon']);
  const [showDescriptors, setShowDescriptors] = useState<boolean>(true);

  const [scenarioId, setScenarioId] = useState<ScenarioId>('preindustrial');
  const [variables, setVariables] = useState<SimulationVariables>(() => ({
    ...SCENARIO_PRESETS.preindustrial.variables,
  }));
  const [currentYear, setCurrentYear] = useState<number>(35);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('c_forest');

  const [roomCode, setRoomCode] = useState<string>(getInitialRoomCode);
  const [groupId] = useState<string>(getOrCreateGroupId);
  const [groupName, setGroupName] = useState<string>(() => {
    if (typeof window === 'undefined') return 'Lab Group 1';
    return (
      localStorage.getItem('terraflux_group_name') ||
      `Lab Group ${groupId.slice(-3).toUpperCase()}`
    );
  });
  const [studentNames, setStudentNames] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('terraflux_students') || '';
  });

  const [roomState, setRoomState] = useState<ClassroomRoomState | null>(null);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'reconnecting'>(
    'connecting'
  );
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    localStorage.setItem('terraflux_room', roomCode);
  }, [roomCode]);

  useEffect(() => {
    localStorage.setItem('terraflux_group_name', groupName);
  }, [groupName]);

  useEffect(() => {
    localStorage.setItem('terraflux_students', studentNames);
  }, [studentNames]);

  const series = useMemo(() => simulateTimeSeries(variables, 100, 5), [variables]);
  const activeIndex = Math.min(series.length - 1, Math.max(0, Math.round(currentYear / 5)));
  const currentMetrics = series[activeIndex] ?? series[0];

  const completedChallenges = useMemo(
    () => getActiveChallengeIds(currentMetrics),
    [currentMetrics]
  );

  const localSnapshot: GroupSnapshot = useMemo(
    () => ({
      id: groupId,
      groupName: groupName.trim() || 'Lab Group',
      studentNames,
      scenarioId,
      year: currentMetrics.year,
      variables,
      metrics: currentMetrics,
      completedChallenges,
      updatedAt: Date.now(),
      isLive: wsStatus === 'connected',
    }),
    [
      groupId,
      groupName,
      studentNames,
      scenarioId,
      currentMetrics,
      variables,
      completedChallenges,
      wsStatus,
    ]
  );

  const latestSnapshotRef = useRef<GroupSnapshot>(localSnapshot);
  latestSnapshotRef.current = localSnapshot;

  useEffect(() => {
    let closedByUser = false;
    let reconnectTimer: number | null = null;
    let attempt = 0;

    const connect = () => {
      setWsStatus(attempt === 0 ? 'connecting' : 'reconnecting');
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const url = `${proto}//${window.location.host}/ws?room=${encodeURIComponent(
        roomCode
      )}&groupId=${encodeURIComponent(groupId)}`;

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        attempt = 0;
        setWsStatus('connected');
        ws.send(
          JSON.stringify({
            type: 'group:update',
            snapshot: latestSnapshotRef.current,
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as {
            type: string;
            room?: ClassroomRoomState;
          };
          if (msg.type === 'room:state' && msg.room) {
            setRoomState(msg.room);
          }
        } catch {
          // Ignore malformed frame
        }
      };

      ws.onclose = () => {
        if (closedByUser) return;
        setWsStatus('reconnecting');
        const delay = Math.min(8000, 600 * Math.pow(1.6, attempt));
        attempt += 1;
        reconnectTimer = window.setTimeout(connect, delay);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      closedByUser = true;
      if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
      wsRef.current?.close();
    };
  }, [roomCode, groupId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'group:update',
            snapshot: localSnapshot,
          })
        );
      }
    }, 220);

    return () => window.clearTimeout(timer);
  }, [localSnapshot]);

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      setCurrentYear((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return prev + 5;
      });
    }, 650);

    return () => window.clearInterval(id);
  }, [isPlaying]);

  const handleSelectModule = useCallback((mod: LearningModuleId) => {
    setActiveModule(mod);
    setSelectedNodeId(getDefaultNodeForModule(mod));
    setExploredModules((prev) => (prev.includes(mod) ? prev : [...prev, mod]));
  }, []);

  const handleSelectScenario = useCallback((id: ScenarioId) => {
    setScenarioId(id);
    setVariables({ ...SCENARIO_PRESETS[id].variables });
  }, []);

  const handleChangeVariable = useCallback(
    (key: keyof SimulationVariables, value: number) => {
      setVariables((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handlePatchVariables = useCallback((patch: Partial<SimulationVariables>) => {
    setVariables((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleApplyModuleMode = useCallback(
    (mod: LearningModuleId, mode: 'baseline' | 'perturbed') => {
      const source =
        mode === 'baseline'
          ? SCENARIO_PRESETS.preindustrial.variables
          : mod === 'nitrogen' || mod === 'phosphorus'
            ? SCENARIO_PRESETS.ag_intensification.variables
            : SCENARIO_PRESETS.industrial.variables;

      setVariables((prev) => {
        const next = { ...prev };
        if (mod === 'carbon') {
          next.fossilFuelEmissions = source.fossilFuelEmissions;
          next.deforestationRate = source.deforestationRate;
          next.reforestationEffort = source.reforestationEffort;
          next.grasslandCover = source.grasslandCover;
        } else if (mod === 'nitrogen') {
          next.syntheticFertilizer = source.syntheticFertilizer;
          next.wetlandBuffer = source.wetlandBuffer;
          next.legumeCoverCrops = source.legumeCoverCrops;
          next.livestockDensity = source.livestockDensity;
        } else if (mod === 'phosphorus') {
          next.phosphateMining = source.phosphateMining;
          next.wastewaterPhosphates = source.wastewaterPhosphates;
          next.erosionControl = source.erosionControl;
          next.deforestationRate = source.deforestationRate;
        } else if (mod === 'water') {
          next.solarForcing = source.solarForcing;
          next.reforestationEffort = source.reforestationEffort;
          next.imperviousSurface = source.imperviousSurface;
          next.groundwaterExtraction = source.groundwaterExtraction;
        }
        return next;
      });
    },
    []
  );

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    if (activeModule === 'climate') {
      setVariables({ ...SCENARIO_PRESETS[scenarioId].variables });
    } else {
      handleApplyModuleMode(activeModule, 'baseline');
    }
    setCurrentYear(35);
  }, [activeModule, scenarioId, handleApplyModuleMode]);

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentYear((prev) => Math.min(100, prev + 5));
  }, []);

  const handleSaveMilestone = useCallback(() => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'milestone:save',
          milestone: localSnapshot,
        })
      );
    }
  }, [localSnapshot]);

  const handleDeleteMilestone = useCallback((milestoneId: string) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'milestone:delete',
          groupId: milestoneId,
        })
      );
    }
  }, []);

  const handleLoadGroupVariables = useCallback((snapshot: GroupSnapshot) => {
    setScenarioId(snapshot.scenarioId);
    setVariables({ ...snapshot.variables });
    setCurrentYear(snapshot.year);
    setActiveModule('climate');
    setSelectedNodeId('cl_estuary');
    setActiveTab('modules');
  }, []);

  const currentModuleIdx = LEARNING_MODULES.findIndex((m) => m.id === activeModule);
  const nextModule =
    currentModuleIdx >= 0 && currentModuleIdx < LEARNING_MODULES.length - 1
      ? LEARNING_MODULES[currentModuleIdx + 1]
      : null;

  const moduleKPIs = getModuleKPIs(activeModule, currentMetrics);

  const navTabs: { id: ActiveTab; label: string }[] = [
    { id: 'modules', label: 'Learning Modules' },
    { id: 'analytics', label: 'Trend Analytics' },
    { id: 'classroom', label: 'Classroom Lab' },
  ];

  const isLockedDesktop = activeTab === 'modules';

  return (
    <div
      className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 ${
        isLockedDesktop ? 'lg:h-dvh lg:overflow-hidden' : ''
      }`}
    >
      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (3 Nav Links) — Zone 3 (1 Primary CTA) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shrink-0">
        <div className="max-w-[1560px] mx-auto px-3 sm:px-5 h-10 flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('modules')}
            className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            TerraFlux
          </button>

          <nav className="flex items-center gap-6 overflow-x-auto">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-900" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="px-3 py-1 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Export Report
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main
        className={`flex-1 max-w-[1560px] w-full mx-auto px-3 sm:px-5 py-2 flex flex-col gap-2 ${
          isLockedDesktop ? 'lg:min-h-0' : ''
        }`}
      >
        {activeTab === 'modules' && (
          <>
            {/* Slim Scaffolded 5-Module Stepper */}
            <div className="bg-white border border-slate-200 rounded-xl px-2 py-1 flex flex-wrap items-center justify-between gap-1.5 shrink-0">
              <div className="flex flex-wrap items-center gap-1">
                {LEARNING_MODULES.map((mod) => {
                  const isActive = activeModule === mod.id;
                  const isExplored = exploredModules.includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => handleSelectModule(mod.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs sm:text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive || isExplored ? mod.accentDot : 'bg-slate-300'
                        }`}
                      />
                      <span>{mod.shortTitle}</span>
                      {!isActive && isExplored && (
                        <Check className="w-3 h-3 text-emerald-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              {nextModule && (
                <button
                  type="button"
                  onClick={() => handleSelectModule(nextModule.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-700 hover:text-sky-900 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Next: {nextModule.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Viewport-Locked Two-Zone Workbench (Slim Controls + Maximized Image Stage) */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[295px_1fr] xl:grid-cols-[315px_1fr] gap-2.5 items-stretch">
              <div className="h-full min-h-0">
                <ControlDeck
                  activeModule={activeModule}
                  activeTab={deckTab}
                  onChangeTab={setDeckTab}
                  scenarioId={scenarioId}
                  onSelectScenario={handleSelectScenario}
                  variables={variables}
                  onChangeVariable={handleChangeVariable}
                  onPatchVariables={handlePatchVariables}
                  onApplyModuleMode={handleApplyModuleMode}
                  showDescriptors={showDescriptors}
                  currentYear={currentYear}
                  onScrubYear={(yr) => {
                    setIsPlaying(false);
                    setCurrentYear(yr);
                  }}
                  isPlaying={isPlaying}
                  onTogglePlay={() => setIsPlaying((p) => !p)}
                  onStepForward={handleStepForward}
                  onReset={handleReset}
                  onOpenSummary={() => setIsSummaryOpen(true)}
                />
              </div>

              <div className="h-full min-h-0 flex flex-col gap-2">
                <WatershedStage
                  activeModule={activeModule}
                  metrics={currentMetrics}
                  variables={variables}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={setSelectedNodeId}
                  showDescriptors={showDescriptors}
                  onToggleDescriptors={() => setShowDescriptors((prev) => !prev)}
                  onOpenGuide={() => setIsSummaryOpen(true)}
                />

                {/* Ultra-Slim Single-Row Module KPI Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0">
                  {moduleKPIs.map((kpi) => (
                    <div
                      key={kpi.label}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold text-slate-500 truncate">
                          {kpi.label}
                        </div>
                        <div className="text-[11px] text-slate-600 font-mono tabular-nums truncate">
                          {kpi.detail}
                        </div>
                      </div>
                      <div className="flex items-baseline gap-1 shrink-0">
                        <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                          {kpi.value}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {kpi.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <TrendAnalytics
            activeModule={activeModule}
            onSelectModule={handleSelectModule}
            series={series}
            currentYear={currentYear}
            onSelectYear={(yr) => {
              setIsPlaying(false);
              setCurrentYear(yr);
            }}
          />
        )}

        {activeTab === 'classroom' && (
          <ClassroomDashboard
            roomState={roomState}
            wsStatus={wsStatus}
            roomCode={roomCode}
            onChangeRoomCode={setRoomCode}
            groupId={groupId}
            groupName={groupName}
            onChangeGroupName={setGroupName}
            studentNames={studentNames}
            onChangeStudentNames={setStudentNames}
            localSnapshot={localSnapshot}
            onSaveMilestone={handleSaveMilestone}
            onDeleteMilestone={handleDeleteMilestone}
            onLoadGroupVariables={handleLoadGroupVariables}
          />
        )}
      </main>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        groupName={groupName}
        studentNames={studentNames}
        roomCode={roomCode}
        scenarioId={scenarioId}
        variables={variables}
        series={series}
        currentMetrics={currentMetrics}
      />

      <CycleSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        activeModule={activeModule}
        onSwitchModule={handleSelectModule}
      />
    </div>
  );
}
