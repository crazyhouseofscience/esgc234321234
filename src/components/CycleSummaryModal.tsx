import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';
import {
  LEARNING_MODULES,
  MODULE_DISCUSSION_GUIDES,
} from '../simulation/engine';
import type { LearningModuleId } from '../types/simulation';

interface CycleSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: LearningModuleId;
  onSwitchModule: (moduleId: LearningModuleId) => void;
}

export const CycleSummaryModal: React.FC<CycleSummaryModalProps> = ({
  isOpen,
  onClose,
  activeModule,
  onSwitchModule,
}) => {
  const [viewingModule, setViewingModule] = useState<LearningModuleId>(activeModule);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      setViewingModule(activeModule);
      setExpandedQuestions({});
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

  const moduleMeta =
    LEARNING_MODULES.find((m) => m.id === viewingModule) ?? LEARNING_MODULES[0];
  const guide = MODULE_DISCUSSION_GUIDES[viewingModule];

  const allExpanded =
    guide.studyQuestions.length > 0 &&
    guide.studyQuestions.every((_, idx) => Boolean(expandedQuestions[idx]));

  const handleToggleQuestion = (idx: number) => {
    setExpandedQuestions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleToggleAll = () => {
    if (allExpanded) {
      setExpandedQuestions({});
    } else {
      const next: Record<number, boolean> = {};
      guide.studyQuestions.forEach((_, idx) => {
        next[idx] = true;
      });
      setExpandedQuestions(next);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cycle-summary-title"
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header + Cycle Tabs */}
        <div className="px-4 sm:px-5 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="w-4 h-4 text-sky-700 shrink-0" />
            <h2
              id="cycle-summary-title"
              className="text-sm sm:text-base font-bold text-slate-950 truncate"
            >
              Cycle Summary &amp; Study Notes
            </h2>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {LEARNING_MODULES.map((mod) => {
              const selected = mod.id === viewingModule;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => {
                    setViewingModule(mod.id);
                    setExpandedQuestions({});
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    selected
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${mod.accentDot}`} />
                  <span>{mod.shortTitle}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cycle summary"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Reading Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Hero Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4 items-center p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
            <img
              src={moduleMeta.fieldImage}
              alt={moduleMeta.fieldImageAlt}
              className="w-full h-32 sm:h-28 object-cover rounded-lg border border-slate-200"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-bold text-slate-950">
                  {moduleMeta.step}. {moduleMeta.title}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-700">
                {moduleMeta.coreQuestion}
              </p>
              <div className="px-2.5 py-1.5 rounded-md bg-white border border-slate-200 font-mono text-xs text-slate-800">
                {moduleMeta.equation}
              </div>
            </div>
          </div>

          {/* Full Text-Based Narrative Summary */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-950">
              <Sparkles className="w-4 h-4 text-sky-700" />
              <h3>How the {moduleMeta.title} Works</h3>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-slate-800 bg-white p-4 rounded-xl border border-slate-200">
              {guide.narrativeSummary.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </section>

          {/* Reservoirs + Biological Need Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 space-y-1">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-700">
                Main Earth Reservoirs
              </div>
              <p className="text-sm text-slate-800 leading-relaxed">
                {guide.mainReservoirs}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-1">
              <div className="text-xs font-bold uppercase tracking-wide text-emerald-900">
                Why Living Organisms Need It
              </div>
              <p className="text-sm text-emerald-950 leading-relaxed">
                {guide.biologicalNeeds}
              </p>
            </div>
          </section>

          {/* Key Terms & Processes Grid */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-950">
              <Layers className="w-4 h-4 text-slate-700" />
              <h3>Key Processes &amp; Vocabulary</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {guide.keyTerms.map((item) => (
                <div
                  key={item.term}
                  className="p-3 rounded-lg border border-slate-200 bg-white space-y-0.5"
                >
                  <div className="text-xs sm:text-sm font-bold text-slate-950">
                    {item.term}
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-700 leading-snug">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Clickable Study Questions & Explanations */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-950">
                <HelpCircle className="w-4 h-4 text-sky-700" />
                <h3>Check Your Understanding (Click any question to see explanation)</h3>
              </div>
              <button
                type="button"
                onClick={handleToggleAll}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 cursor-pointer shrink-0"
              >
                {allExpanded ? 'Hide All Explanations' : 'Show All Explanations'}
              </button>
            </div>

            <div className="space-y-2">
              {guide.studyQuestions.map((item, idx) => {
                const isExpanded = Boolean(expandedQuestions[idx]);
                return (
                  <div
                    key={item.question}
                    className="rounded-xl border border-slate-200 bg-white overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleQuestion(idx)}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-semibold text-slate-900">
                        {idx + 1}. {item.question}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 shrink-0">
                        <span>{isExpanded ? 'Hide' : 'Explain'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="px-3.5 py-2.5 border-t border-slate-100 bg-sky-50/50 text-xs sm:text-sm text-slate-800 leading-relaxed">
                        {item.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-5 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2 shrink-0">
          <div className="text-xs text-slate-600 hidden sm:block">
            Use the interactive map and sliders to test how human actions shift these processes in real time.
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {viewingModule !== activeModule && (
              <button
                type="button"
                onClick={() => {
                  onSwitchModule(viewingModule);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50 text-sky-900 text-xs font-semibold hover:bg-sky-100 transition-colors cursor-pointer"
              >
                Open {moduleMeta.title} Map
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Back to Simulator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
