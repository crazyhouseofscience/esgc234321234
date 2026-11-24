import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  FlaskConical,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';
import {
  LEARNING_MODULES,
  MODULE_DISCUSSION_GUIDES,
} from '../simulation/engine';
import { GUIDE_ES, MODULE_ES, type Language } from '../i18n/translations';
import type { LearningModuleId, SimulationVariables } from '../types/simulation';

interface CycleSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: LearningModuleId;
  onSwitchModule: (moduleId: LearningModuleId) => void;
  onPatchVariables?: (patch: Partial<SimulationVariables>) => void;
  language: Language;
}

export const CycleSummaryModal: React.FC<CycleSummaryModalProps> = ({
  isOpen,
  onClose,
  activeModule,
  onSwitchModule,
  onPatchVariables,
  language,
}) => {
  const [viewingModule, setViewingModule] = useState<LearningModuleId>(activeModule);

  useEffect(() => {
    if (isOpen) {
      setViewingModule(activeModule);
    }
  }, [isOpen, activeModule]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isEs = language === 'es';
  const moduleMeta =
    LEARNING_MODULES.find((m) => m.id === viewingModule) ?? LEARNING_MODULES[0];
  const modEs = MODULE_ES[viewingModule];
  const guide = MODULE_DISCUSSION_GUIDES[viewingModule];
  const guideEs = GUIDE_ES[viewingModule];

  const title = isEs ? modEs.title : moduleMeta.title;
  const coreQuestion = isEs ? modEs.coreQuestion : moduleMeta.coreQuestion;
  const fieldImageAlt = isEs ? modEs.fieldImageAlt : moduleMeta.fieldImageAlt;
  const narrativeSummary = isEs ? guideEs.narrativeSummary : guide.narrativeSummary;
  const mainReservoirs = isEs ? guideEs.mainReservoirs : guide.mainReservoirs;
  const biologicalNeeds = isEs ? guideEs.biologicalNeeds : guide.biologicalNeeds;
  const keyTerms = isEs ? guideEs.keyTerms : guide.keyTerms;
  const substances = isEs ? guideEs.substances : guide.substances;
  const experiments = guide.experiments.map((exp, idx) => ({
    ...exp,
    label: isEs ? (guideEs.experiments[idx]?.label ?? exp.label) : exp.label,
    description: isEs ? (guideEs.experiments[idx]?.description ?? exp.description) : exp.description,
  }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-2 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cycle-summary-title"
    >
      <div
        className="w-[96vw] max-w-6xl h-[92vh] max-h-[92vh] flex flex-col bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header + Cycle Tabs */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="w-5 h-5 text-sky-700 shrink-0" />
            <h2
              id="cycle-summary-title"
              className="text-base sm:text-lg font-bold text-slate-950 truncate"
            >
              {isEs ? 'Guía y Resumen del Ciclo' : 'Cycle Guide & Study Summary'}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {LEARNING_MODULES.map((mod) => {
              const selected = mod.id === viewingModule;
              const label = isEs ? MODULE_ES[mod.id].shortTitle : mod.shortTitle;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setViewingModule(mod.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    selected
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${mod.accentDot}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isEs ? 'Cerrar guía del ciclo' : 'Close cycle guide'}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Enlarged Scrollable Reading Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Hero Summary Banner */}
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5 items-center p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/70">
            <img
              src={moduleMeta.fieldImage}
              alt={fieldImageAlt}
              className="w-full h-40 md:h-36 object-cover rounded-lg border border-slate-200 shadow-xs"
            />
            <div className="space-y-2">
              <div className="text-xl sm:text-2xl font-bold text-slate-950">
                {moduleMeta.step}. {title}
              </div>
              <p className="text-sm sm:text-base font-medium text-slate-700">
                {coreQuestion}
              </p>
              <div className="px-3 py-2 rounded-lg bg-white border border-slate-200 font-mono text-xs sm:text-sm text-slate-800">
                {moduleMeta.equation}
              </div>
            </div>
          </div>

          {/* Full Text-Based Narrative Summary */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-base font-bold text-slate-950">
              <Sparkles className="w-4 h-4 text-sky-700" />
              <h3>
                {isEs ? `Cómo Funciona el ${title}` : `How the ${title} Works`}
              </h3>
            </div>
            <div className="space-y-3.5 text-sm sm:text-base leading-relaxed text-slate-800 bg-white p-5 rounded-xl border border-slate-200">
              {narrativeSummary.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </section>

          {/* Reservoirs + Biological Need Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/80 space-y-1.5">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wide text-slate-700">
                {isEs ? 'Principales Reservas de la Tierra' : 'Main Earth Reservoirs'}
              </div>
              <p className="text-sm sm:text-[15px] text-slate-800 leading-relaxed">
                {mainReservoirs}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-1.5">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wide text-emerald-900">
                {isEs ? 'Por Qué lo Necesitan los Seres Vivos' : 'Why Living Organisms Need It'}
              </div>
              <p className="text-sm sm:text-[15px] text-emerald-950 leading-relaxed">
                {biologicalNeeds}
              </p>
            </div>
          </section>

          {/* Key Terms & Substances Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2 text-base font-bold text-slate-950">
                <Layers className="w-4 h-4 text-slate-700" />
                <h3>{isEs ? 'Procesos Clave y Vocabulario' : 'Key Processes & Vocabulary'}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {keyTerms.map((item) => (
                  <div
                    key={item.term}
                    className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1"
                  >
                    <div className="text-sm font-bold text-slate-950">{item.term}</div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-snug">
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <div className="text-base font-bold text-slate-950">
                {isEs ? 'Sustancias, Gases y Materiales' : 'Key Chemicals, Gases & Materials'}
              </div>
              <div className="space-y-2.5">
                {substances.map((sub) => (
                  <div
                    key={sub.name}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-bold text-slate-900">
                        {sub.name}{' '}
                        <span className="font-mono text-slate-600">({sub.formula})</span>
                      </span>
                      <span className="text-xs font-mono text-slate-500 shrink-0">
                        {sub.state}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                      {sub.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 1-Click Guided Classroom Experiments */}
          {onPatchVariables && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-base font-bold text-slate-950">
                <FlaskConical className="w-4 h-4 text-sky-700" />
                <h3>
                  {isEs
                    ? 'Experimentos Guiados en el Simulador (1 Clic)'
                    : 'Guided Classroom Experiments (1-Click Test)'}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {experiments.map((exp) => (
                  <button
                    key={exp.label}
                    type="button"
                    onClick={() => {
                      if (viewingModule !== activeModule) {
                        onSwitchModule(viewingModule);
                      }
                      onPatchVariables(exp.patch);
                      onClose();
                    }}
                    className="p-4 rounded-xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100/70 text-left transition-colors cursor-pointer"
                  >
                    <div className="text-sm font-bold text-sky-950">{exp.label}</div>
                    <div className="text-xs sm:text-sm text-slate-700 mt-0.5">
                      {exp.description}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2 shrink-0">
          <div className="text-xs sm:text-sm text-slate-600 hidden sm:block">
            {isEs
              ? 'Usa el mapa interactivo y los controles para probar cómo cambian estos procesos en tiempo real.'
              : 'Use the interactive map and sliders to test how human actions shift these processes in real time.'}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {viewingModule !== activeModule && (
              <button
                type="button"
                onClick={() => {
                  onSwitchModule(viewingModule);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-lg border border-sky-200 bg-sky-50 text-sky-900 text-xs sm:text-sm font-semibold hover:bg-sky-100 transition-colors cursor-pointer"
              >
                {isEs ? `Abrir Mapa: ${title}` : `Open ${title} Map`}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isEs ? 'Volver al Simulador' : 'Back to Simulator'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
