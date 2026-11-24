import React, { useState } from 'react';
import {
  Users,
  BookmarkCheck,
  Copy,
  Check,
  Trash2,
  Award,
  Radio,
} from 'lucide-react';
import { CHALLENGE_GOALS, SCENARIO_PRESETS } from '../simulation/engine';
import { CHALLENGE_ES, SCENARIO_ES, type Language } from '../i18n/translations';
import type { ClassroomRoomState, GroupSnapshot } from '../types/simulation';

interface ClassroomDashboardProps {
  roomState: ClassroomRoomState | null;
  wsStatus: 'connecting' | 'connected' | 'reconnecting';
  roomCode: string;
  onChangeRoomCode: (nextCode: string) => void;
  groupId: string;
  groupName: string;
  onChangeGroupName: (name: string) => void;
  studentNames: string;
  onChangeStudentNames: (names: string) => void;
  localSnapshot: GroupSnapshot;
  onSaveMilestone: () => void;
  onDeleteMilestone: (milestoneId: string) => void;
  onLoadGroupVariables: (snapshot: GroupSnapshot) => void;
  language: Language;
}

export const ClassroomDashboard: React.FC<ClassroomDashboardProps> = ({
  roomState,
  wsStatus,
  roomCode,
  onChangeRoomCode,
  groupId,
  groupName,
  onChangeGroupName,
  studentNames,
  onChangeStudentNames,
  localSnapshot,
  onSaveMilestone,
  onDeleteMilestone,
  onLoadGroupVariables,
  language,
}) => {
  const [roomInput, setRoomInput] = useState(roomCode);
  const [copiedLink, setCopiedLink] = useState(false);
  const isEs = language === 'es';

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = roomInput.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (cleaned) {
      onChangeRoomCode(cleaned);
      setRoomInput(cleaned);
    }
  };

  const handleCopyInvite = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('room', roomCode);
    navigator.clipboard?.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1800);
  };

  const groups = roomState?.groups ?? [];
  const milestones = roomState?.milestones ?? [];

  // Combine active groups with latest local snapshot if not yet echoed
  const displayedGroups = groups.length > 0 ? groups : [localSnapshot];

  const challengeStats = CHALLENGE_GOALS.map((goal) => {
    const passingGroups = displayedGroups.filter((g) =>
      g.completedChallenges.includes(goal.id)
    ).length;
    return {
      ...goal,
      passingGroups,
      localPassed: localSnapshot.completedChallenges.includes(goal.id),
    };
  });

  return (
    <div className="space-y-6">
      {/* Classroom Session Header & Group Identity */}
      <div className="border border-slate-200 bg-white rounded-xl p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
        <form onSubmit={handleJoinRoom} className="lg:col-span-4 space-y-1.5">
          <label htmlFor="classroom-code" className="block text-xs font-semibold text-slate-700">
            {isEs ? 'Código de Sala de Clase' : 'Classroom Room Code'}
          </label>
          <div className="flex items-center gap-2">
            <input
              id="classroom-code"
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
              placeholder="EARTH-101"
              maxLength={24}
              className="flex-1 px-3 py-2 text-sm font-mono uppercase rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {isEs ? 'Unirse' : 'Join Room'}
            </button>
          </div>
        </form>

        <div className="lg:col-span-3 space-y-1.5">
          <label htmlFor="group-name" className="block text-xs font-semibold text-slate-700">
            {isEs ? 'Nombre de Tu Grupo' : 'Your Lab Group Name'}
          </label>
          <input
            id="group-name"
            type="text"
            value={groupName}
            onChange={(e) => onChangeGroupName(e.target.value)}
            maxLength={48}
            placeholder={isEs ? 'Grupo A — Cuenca' : 'Group A — Watershed'}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="lg:col-span-3 space-y-1.5">
          <label htmlFor="student-names" className="block text-xs font-semibold text-slate-700">
            {isEs ? 'Estudiantes del Grupo' : 'Student Members'}
          </label>
          <input
            id="student-names"
            type="text"
            value={studentNames}
            onChange={(e) => onChangeStudentNames(e.target.value)}
            maxLength={96}
            placeholder="Maya, Jordan, Priya"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-mono text-slate-600">
              <Radio
                className={`w-3.5 h-3.5 ${
                  wsStatus === 'connected'
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }`}
              />
              {wsStatus === 'connected'
                ? isEs
                  ? 'En Vivo'
                  : 'Live Sync'
                : wsStatus === 'connecting'
                  ? isEs
                    ? 'Conectando'
                    : 'Connecting'
                  : isEs
                    ? 'Reconectando'
                    : 'Reconnecting'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyInvite}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>
              {copiedLink
                ? isEs
                  ? 'Enlace Copiado'
                  : 'Link Copied'
                : isEs
                  ? 'Copiar Invitación'
                  : 'Copy Invite URL'}
            </span>
          </button>
        </div>
      </div>

      {/* Classroom Challenge Progress Tracker */}
      <div className="border border-slate-200 bg-white rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              {isEs
                ? `Retos de Escenario en Clase (${localSnapshot.completedChallenges.length}/${CHALLENGE_GOALS.length} logrados por tu grupo)`
                : `Classroom Scenario Challenges (${localSnapshot.completedChallenges.length}/${CHALLENGE_GOALS.length} met by your group)`}
            </h3>
          </div>

          <button
            type="button"
            onClick={onSaveMilestone}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>{isEs ? 'Publicar Captura de Escenario' : 'Publish Scenario Snapshot'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {challengeStats.map((goal) => {
            const gTr = isEs ? CHALLENGE_ES[goal.id] : undefined;
            return (
              <div
                key={goal.id}
                className={`p-3.5 rounded-lg border ${
                  goal.localPassed
                    ? 'border-emerald-300 bg-emerald-50/50'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                  <span className="text-slate-900">{gTr?.title ?? goal.title}</span>
                  <span
                    className={`font-mono shrink-0 ${
                      goal.localPassed ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {goal.localPassed
                      ? isEs
                        ? '✓ LOGRADO'
                        : '✓ PASS'
                      : isEs
                        ? 'ABIERTO'
                        : 'OPEN'}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-mono text-slate-600">
                  {gTr?.criterionText ?? goal.criterionText}
                </p>
                <p className="mt-2 text-[11px] text-slate-500">
                  <strong className="font-mono tabular-nums text-slate-800">{goal.passingGroups}</strong>{' '}
                  {isEs ? 'de' : 'of'}{' '}
                  <span className="font-mono tabular-nums">{displayedGroups.length}</span>{' '}
                  {isEs ? 'grupos activos logrando meta' : 'active groups passing'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Multi-Group Comparison Table & Bar Visual */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 border border-slate-200 bg-white rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900">
                {isEs
                  ? `Comparación en Vivo — Sala ${roomCode}`
                  : `Live Classroom Workspace Comparison — Room ${roomCode}`}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {displayedGroups.filter((g) => g.isLive).length}{' '}
              {isEs ? 'en línea' : 'online'} · {displayedGroups.length}{' '}
              {isEs ? 'total' : 'total'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">{isEs ? 'Grupo' : 'Group'}</th>
                  <th className="py-2.5 px-3 font-semibold">{isEs ? 'Escenario' : 'Scenario'}</th>
                  <th className="py-2.5 px-3 font-semibold text-right">{isEs ? 'Año' : 'Year'}</th>
                  <th className="py-2.5 px-3 font-semibold text-right">CO₂ (ppm)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">{isEs ? 'O₂ (mg/L)' : 'DO (mg/L)'}</th>
                  <th className="py-2.5 px-3 font-semibold text-right">{isEs ? 'Salud' : 'Health'}</th>
                  <th className="py-2.5 px-3 font-semibold">{isEs ? 'Metas' : 'Goals'}</th>
                  <th className="py-2.5 px-4 font-semibold text-right">{isEs ? 'Acción' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedGroups.map((grp) => {
                  const isSelf = grp.id === groupId;
                  return (
                    <tr
                      key={grp.id}
                      className={isSelf ? 'bg-sky-50/40' : 'hover:bg-slate-50/70'}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">
                          {grp.groupName} {isSelf ? (isEs ? '(Tú)' : '(You)') : ''}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {grp.studentNames || (isEs ? 'Sin integrantes' : 'No members listed')} ·{' '}
                          <span className={grp.isLive ? 'text-emerald-700 font-medium' : 'text-slate-400'}>
                            {grp.isLive ? (isEs ? 'En Vivo' : 'Live') : isEs ? 'Desconectado' : 'Offline'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {(isEs ? SCENARIO_ES[grp.scenarioId]?.shortName : undefined) ??
                          SCENARIO_PRESETS[grp.scenarioId]?.shortName ??
                          grp.scenarioId}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700">
                        {grp.year}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-medium text-slate-900">
                        {grp.metrics.atmosphericCO2.toFixed(0)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-medium text-slate-900">
                        {grp.metrics.dissolvedOxygen.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                        {grp.metrics.ecosystemHealth.toFixed(0)}%
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums text-slate-700">
                        {grp.completedChallenges.length}/{CHALLENGE_GOALS.length}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!isSelf && (
                          <button
                            type="button"
                            onClick={() => onLoadGroupVariables(grp)}
                            className="px-2.5 py-1 text-[11px] font-medium rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
                          >
                            {isEs ? 'Cargar Modelo' : 'Load Model'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual Bar Comparison across Groups */}
        <div className="xl:col-span-4 border border-slate-200 bg-white rounded-xl p-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              {isEs ? 'Comparación de Salud del Ecosistema' : 'Ecosystem Health Comparison'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEs
                ? 'Puntuaciones de grupos en tiempo real durante la clase'
                : 'Real-time group scores across active classroom runs'}
            </p>
          </div>

          <div className="space-y-3">
            {displayedGroups.map((grp) => {
              const health = grp.metrics.ecosystemHealth;
              const barColor =
                grp.metrics.status === 'NOMINAL'
                  ? 'bg-emerald-600'
                  : grp.metrics.status === 'STRESSED'
                    ? 'bg-amber-500'
                    : 'bg-rose-600';

              return (
                <div key={grp.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 truncate pr-2">
                      {grp.groupName}
                    </span>
                    <span className="font-mono tabular-nums text-slate-700 shrink-0">
                      {health.toFixed(1)}% ·{' '}
                      {isEs
                        ? grp.metrics.status === 'NOMINAL'
                          ? 'ÓPTIMO'
                          : grp.metrics.status === 'STRESSED'
                            ? 'ESTRESADO'
                            : 'CRÍTICO'
                        : grp.metrics.status}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                      style={{ width: `${Math.min(100, Math.max(4, health))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Published Scenario Milestones Log */}
      <div className="border border-slate-200 bg-white rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              {isEs ? 'Capturas de Escenarios Publicadas' : 'Published Classroom Scenario Snapshots'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEs
                ? 'Los grupos pueden publicar capturas guardadas en distintos escenarios para comparar hipótesis.'
                : 'Groups can publish locked snapshots across different environmental scenarios to compare hypotheses side-by-side.'}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {milestones.length} {isEs ? 'guardadas' : 'saved'}
          </span>
        </div>

        {milestones.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            {isEs ? (
              <>
                Aún no hay capturas publicadas en la sala{' '}
                <span className="font-mono text-slate-700">{roomCode}</span>. Ajusta las variables y
                haz clic en <strong className="text-slate-700">Publicar Captura de Escenario</strong>.
              </>
            ) : (
              <>
                No scenario snapshots published in room{' '}
                <span className="font-mono text-slate-700">{roomCode}</span> yet. Adjust your
                simulation variables and click{' '}
                <strong className="text-slate-700">Publish Scenario Snapshot</strong> to share a
                benchmark with the class.
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">{isEs ? 'Grupo' : 'Group'}</th>
                  <th className="py-2.5 px-3 font-semibold">{isEs ? 'Escenario' : 'Scenario'}</th>
                  <th className="py-2.5 px-3 font-semibold text-right">{isEs ? 'Año' : 'Year'}</th>
                  <th className="py-2.5 px-3 font-semibold text-right">CO₂ (ppm)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">NO₃⁻ (mg/L)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">PO₄³⁻ (ug/L)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">{isEs ? 'O₂ (mg/L)' : 'DO (mg/L)'}</th>
                  <th className="py-2.5 px-3 font-semibold text-right">{isEs ? 'Salud' : 'Health'}</th>
                  <th className="py-2.5 px-4 font-semibold text-right">{isEs ? 'Acciones' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {milestones.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-slate-900">{m.groupName}</div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(m.updatedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {(isEs ? SCENARIO_ES[m.scenarioId]?.shortName : undefined) ??
                        SCENARIO_PRESETS[m.scenarioId]?.shortName ??
                        m.scenarioId}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">{m.year}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      {m.metrics.atmosphericCO2.toFixed(0)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      {m.metrics.aquaticNitrateLoad.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      {m.metrics.reactivePhosphate.toFixed(0)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      {m.metrics.dissolvedOxygen.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                      {m.metrics.ecosystemHealth.toFixed(0)}%
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onLoadGroupVariables(m)}
                          className="px-2 py-1 text-[11px] font-medium rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          {isEs ? 'Restaurar' : 'Restore'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteMilestone(m.id)}
                          aria-label={isEs ? 'Eliminar captura' : 'Delete snapshot'}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
