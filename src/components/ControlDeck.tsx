import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  SlidersHorizontal,
  BookOpen,
  FlaskConical,
  Sparkles,
} from 'lucide-react';
import {
  LEARNING_MODULES,
  MODULE_DISCUSSION_GUIDES,
  SCENARIO_PRESETS,
  VARIABLE_DEFINITIONS,
} from '../simulation/engine';
import type {
  LearningModuleId,
  ScenarioId,
  SimulationVariables,
} from '../types/simulation';

export type ControlDeckTab = 'controls' | 'guide';

interface ControlDeckProps {
  activeModule: LearningModuleId;
  activeTab: ControlDeckTab;
  onChangeTab: (tab: ControlDeckTab) => void;
  scenarioId: ScenarioId;
  onSelectScenario: (id: ScenarioId) => void;
  variables: SimulationVariables;
  onChangeVariable: (key: keyof SimulationVariables, value: number) => void;
  onPatchVariables: (patch: Partial<SimulationVariables>) => void;
  onApplyModuleMode: (moduleId: LearningModuleId, mode: 'baseline' | 'perturbed') => void;
  showDescriptors: boolean;
  currentYear: number;
  onScrubYear: (year: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onReset: () => void;
}

const CLIMATE_PRIMARY_KEYS: (keyof SimulationVariables)[] = [
  'fossilFuelEmissions',
  'reforestationEffort',
  'syntheticFertilizer',
  'phosphateMining',
  'imperviousSurface',
];

export const ControlDeck: React.FC<ControlDeckProps> = ({
  activeModule,
  activeTab,
  onChangeTab,
  scenarioId,
  onSelectScenario,
  variables,
  onChangeVariable,
  onPatchVariables,
  onApplyModuleMode,
  showDescriptors,
  currentYear,
  onScrubYear,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onReset,
}) => {
  const [showAllClimateVars, setShowAllClimateVars] = useState(false);

  const moduleMeta =
    LEARNING_MODULES.find((m) => m.id === activeModule) ?? LEARNING_MODULES[0];
  const discussion = MODULE_DISCUSSION_GUIDES[activeModule];

  const moduleVariables = VARIABLE_DEFINITIONS.filter(
    (d) =>
      d.cycle === activeModule ||
      (activeModule !== 'climate' && d.relatedCycles?.includes(activeModule))
  );

  const visibleDefs =
    activeModule === 'climate'
      ? showAllClimateVars
        ? VARIABLE_DEFINITIONS
        : VARIABLE_DEFINITIONS.filter((d) => CLIMATE_PRIMARY_KEYS.includes(d.key))
      : moduleVariables;

  return (
    <aside className="flex flex-col h-full border border-slate-200 bg-white rounded-xl overflow-hidden shadow-xs">
      {/* Segmented Switch: Variables vs Cycle Guide */}
      <div className="px-2.5 py-1.5 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between gap-1.5 shrink-0">
        <div className="flex items-center gap-0.5 p-0.5 bg-slate-200/80 rounded-lg flex-1">
          <button
            type="button"
            onClick={() => onChangeTab('controls')}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'controls'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Variables</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('guide')}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cycle Guide</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          title="Reset current module"
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Deck Content (bounded inside Chromebook height without page overflow) */}
      {activeTab === 'controls' ? (
        <div className="flex-1 min-h-0 flex flex-col justify-between p-2.5 gap-2 overflow-y-auto">
          <div className="space-y-2.5">
            {/* Quick Baseline vs Human Impact OR Scenario Presets */}
            {activeModule !== 'climate' ? (
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => onApplyModuleMode(activeModule, 'baseline')}
                  className="px-2 py-1.5 text-xs font-semibold rounded-md border border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-400 hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  Natural Equilibrium
                </button>
                <button
                  type="button"
                  onClick={() => onApplyModuleMode(activeModule, 'perturbed')}
                  className="px-2 py-1.5 text-xs font-semibold rounded-md border border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-400 hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  Human Impact
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="grid grid-cols-2 gap-1">
                  {(Object.keys(SCENARIO_PRESETS) as ScenarioId[]).map((id) => {
                    const preset = SCENARIO_PRESETS[id];
                    const active = scenarioId === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onSelectScenario(id)}
                        className={`px-2 py-1.5 text-left rounded-md border text-xs font-semibold transition-colors cursor-pointer truncate ${
                          active
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                        title={preset.name}
                      >
                        {preset.shortName}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">
                    {showAllClimateVars ? 'All 14 Variables' : '5 Key Coupled Drivers'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAllClimateVars((v) => !v)}
                    className="text-sky-700 hover:text-sky-900 font-semibold cursor-pointer"
                  >
                    {showAllClimateVars ? 'Show Key 5' : 'Show All 14'}
                  </button>
                </div>
              </div>
            )}

            {/* Variable Sliders */}
            <div className="space-y-2">
              {visibleDefs.map((def) => {
                const val = variables[def.key];
                return (
                  <div
                    key={def.key}
                    title={def.mechanismHint}
                    className="space-y-0.5 rounded-md px-1.5 py-1 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <label
                        htmlFor={`slider-${def.key}`}
                        className="text-[13px] font-semibold text-slate-900 leading-tight"
                      >
                        {def.label}
                      </label>
                      <span className="text-[13px] font-mono font-semibold tabular-nums text-slate-900 shrink-0">
                        {val}{' '}
                        <span className="text-[11px] text-slate-500 font-normal">{def.unit}</span>
                      </span>
                    </div>

                    <input
                      id={`slider-${def.key}`}
                      type="range"
                      min={def.min}
                      max={def.max}
                      step={def.step}
                      value={val}
                      onChange={(e) => onChangeVariable(def.key, Number(e.target.value))}
                      className="sci-slider w-full"
                    />

                    {showDescriptors && (
                      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-600 leading-tight">
                        <span className="font-mono text-slate-600">{def.substanceTag}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compact Timeline Playback Docked at Bottom of Panel */}
          <div className="pt-2 border-t border-slate-200 space-y-1.5 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Time Horizon</span>
              <span className="text-xs font-mono font-semibold tabular-nums text-slate-900">
                Year {currentYear} <span className="text-slate-400 font-normal">/ 100</span>
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={currentYear}
              onChange={(e) => onScrubYear(Number(e.target.value))}
              aria-label="Simulation Year"
              className="sci-slider w-full"
            />

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onTogglePlay}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play 100-Yr Sim'}</span>
              </button>
              <button
                type="button"
                onClick={onStepForward}
                disabled={currentYear >= 100}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 cursor-pointer whitespace-nowrap shrink-0"
              >
                <StepForward className="w-3.5 h-3.5" />
                <span>+5 yr</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Field Photo, Reservoirs, Biological Roles, Key Cycle Steps, Gases & Guided Experiments */
        <div className="flex-1 min-h-0 p-3.5 space-y-4 overflow-y-auto">
          {/* Authentic Field Specimen Image for the Active Cycle */}
          <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
            <img
              src={moduleMeta.fieldImage}
              alt={moduleMeta.fieldImageAlt}
              className="w-full h-32 object-cover"
            />
            <div className="px-3 py-2 bg-slate-900 text-slate-100 space-y-0.5">
              <div className="text-xs font-semibold">
                {moduleMeta.step}. {moduleMeta.title} — Field Study
              </div>
              <div className="text-[11px] text-slate-300 leading-snug">
                {moduleMeta.fieldImageAlt}
              </div>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-slate-700">{moduleMeta.summary}</p>

          {/* Main Reservoirs & Biological Importance */}
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/80 space-y-1">
              <div className="text-xs font-semibold text-slate-900">
                Main Earth Reservoirs
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {discussion.mainReservoirs}
              </p>
            </div>

            <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-1">
              <div className="text-xs font-semibold text-emerald-950">
                Why Living Things Need It
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {discussion.biologicalNeeds}
              </p>
            </div>
          </div>

          {/* Step-by-Step Key Processes & Core Explanations */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>How This Cycle Works (Key Processes)</span>
            </div>
            <div className="space-y-2">
              {discussion.keyFacts.map((fact) => (
                <div
                  key={fact.topic}
                  className="p-2.5 rounded-lg border border-slate-200 bg-white space-y-0.5"
                >
                  <div className="text-xs font-semibold text-slate-900">{fact.topic}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{fact.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Substances, Chemicals & Gases */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-900">
              Key Chemicals, Gases &amp; Materials
            </div>
            <div className="space-y-2">
              {discussion.substances.map((sub) => (
                <div
                  key={sub.name}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-0.5"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-slate-900">
                      {sub.name}{' '}
                      <span className="font-mono text-slate-600">({sub.formula})</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0">
                      {sub.state}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">{sub.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How Variables Change This Cycle */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-900">
              Variables You Can Test in This Cycle
            </div>
            <div className="space-y-1.5">
              {(activeModule === 'climate'
                ? VARIABLE_DEFINITIONS.filter((d) => CLIMATE_PRIMARY_KEYS.includes(d.key))
                : moduleVariables
              ).map((def) => (
                <div
                  key={def.key}
                  className="px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-xs space-y-0.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900">{def.label}</span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {def.substanceTag}
                    </span>
                  </div>
                  <div className="text-slate-600">{def.mechanismHint}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Classroom Discussion Prompts */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-900">
              Class Discussion Questions
            </div>
            <ul className="space-y-2">
              {discussion.discussionPrompts.map((q, idx) => (
                <li
                  key={q}
                  className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs leading-relaxed text-slate-700"
                >
                  <strong className="text-slate-900">Q{idx + 1}:</strong> {q}
                </li>
              ))}
            </ul>
          </div>

          {/* 1-Click Guided Experiments */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
              <FlaskConical className="w-3.5 h-3.5 text-sky-600" />
              <span>Guided Classroom Experiments</span>
            </div>
            <div className="space-y-1.5">
              {discussion.experiments.map((exp) => (
                <button
                  key={exp.label}
                  type="button"
                  onClick={() => {
                    onPatchVariables(exp.patch);
                    onChangeTab('controls');
                  }}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-sky-50/50 hover:bg-sky-50 hover:border-sky-300 text-left transition-colors cursor-pointer"
                >
                  <div className="text-xs font-semibold text-sky-900">{exp.label}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{exp.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
