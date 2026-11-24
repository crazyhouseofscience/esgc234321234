import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileJson, FileText, Copy, Check } from 'lucide-react';
import {
  SCENARIO_PRESETS,
  buildCSVReport,
  buildMarkdownLabReport,
} from '../simulation/engine';
import { SCENARIO_ES, type Language } from '../i18n/translations';
import type {
  ScenarioId,
  SimulationMetrics,
  SimulationVariables,
} from '../types/simulation';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  studentNames: string;
  roomCode: string;
  scenarioId: ScenarioId;
  variables: SimulationVariables;
  series: SimulationMetrics[];
  currentMetrics: SimulationMetrics;
  language: Language;
}

function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  groupName,
  studentNames,
  roomCode,
  scenarioId,
  variables,
  series,
  currentMetrics,
  language,
}) => {
  const [copiedMd, setCopiedMd] = useState(false);

  if (!isOpen) return null;

  const isEs = language === 'es';
  const scenario = SCENARIO_PRESETS[scenarioId];
  const scenarioName = isEs ? SCENARIO_ES[scenarioId].name : scenario.name;
  const slug = groupName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const markdownText = buildMarkdownLabReport(
    groupName,
    studentNames,
    roomCode,
    scenario,
    variables,
    currentMetrics
  );

  const handleDownloadCSV = () => {
    const csv = buildCSVReport(series, groupName, scenario.name);
    triggerDownload(`terraflux-${slug}-timeseries.csv`, csv, 'text/csv;charset=utf-8;');
  };

  const handleDownloadJSON = () => {
    const payload = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        roomCode,
        groupName,
        studentNames,
        scenario: scenario.name,
        variables,
        activeYearMetrics: currentMetrics,
        timeSeries: series,
      },
      null,
      2
    );
    triggerDownload(`terraflux-${slug}-simulation.json`, payload, 'application/json');
  };

  const handleDownloadMarkdown = () => {
    triggerDownload(`terraflux-${slug}-lab-report.md`, markdownText, 'text/markdown;charset=utf-8;');
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard?.writeText(markdownText);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 id="export-modal-title" className="text-base font-semibold text-slate-900">
              {isEs ? 'Exportar Reporte y Datos de Simulación' : 'Export Simulation Report & Data'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {groupName} · {scenarioName} · {isEs ? 'Año' : 'Year'} {currentMetrics.year}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isEs ? 'Cerrar exportación' : 'Close export modal'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="flex flex-col items-start gap-2 p-4 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {isEs ? 'Serie Temporal CSV' : 'CSV Time-Series'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {isEs
                    ? 'Datos de 100 años para Excel o Google Sheets'
                    : '100-year dataset for Excel or Google Sheets'}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 mt-1">
                <Download className="w-3.5 h-3.5" /> {isEs ? 'Descargar .csv' : 'Download .csv'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              className="flex flex-col items-start gap-2 p-4 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <FileJson className="w-5 h-5 text-amber-600" />
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {isEs ? 'Captura JSON' : 'JSON Snapshot'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {isEs
                    ? 'Parámetros completos y flujos calculados'
                    : 'Full parameter config & computed fluxes'}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 mt-1">
                <Download className="w-3.5 h-3.5" /> {isEs ? 'Descargar .json' : 'Download .json'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="flex flex-col items-start gap-2 p-4 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <FileText className="w-5 h-5 text-sky-600" />
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {isEs ? 'Reporte Lab (.md)' : 'Lab Report (.md)'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {isEs
                    ? 'Resumen estructurado y guía de análisis'
                    : 'Structured summary & analysis prompts'}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 mt-1">
                <Download className="w-3.5 h-3.5" /> {isEs ? 'Descargar .md' : 'Download .md'}
              </span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                {isEs ? 'Vista Previa del Reporte' : 'Lab Report Preview'}
              </span>
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>
                  {copiedMd
                    ? isEs
                      ? 'Copiado al Portapapeles'
                      : 'Copied to Clipboard'
                    : isEs
                      ? 'Copiar Texto del Reporte'
                      : 'Copy Report Text'}
                </span>
              </button>
            </div>
            <pre className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 max-h-56 overflow-y-auto whitespace-pre-wrap">
              {markdownText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
