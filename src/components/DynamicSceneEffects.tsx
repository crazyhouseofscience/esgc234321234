import React from 'react';
import type {
  LearningModuleId,
  SimulationMetrics,
  SimulationVariables,
} from '../types/simulation';

interface DynamicSceneEffectsProps {
  activeModule: LearningModuleId;
  metrics: SimulationMetrics;
  variables: SimulationVariables;
  prefersReducedMotion: boolean;
}

/**
 * Renders subtle motion accents (rising smokestack plumes, N2 bubbles, rain streaks)
 * on top of the multi-layer photorealistic zonal image blend.
 */
export const DynamicSceneEffects: React.FC<DynamicSceneEffectsProps> = ({
  activeModule,
  metrics,
  variables,
  prefersReducedMotion,
}) => {
  if (prefersReducedMotion) return null;

  const factoryNorm = Math.min(1, variables.fossilFuelEmissions / 18);
  const wetlandNorm = Math.min(1, variables.wetlandBuffer / 100);
  const precipNorm = Math.min(1, Math.max(0, (metrics.precipitationRate - 700) / 600));

  return (
    <svg
      viewBox="0 0 1000 562"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
    >
      {/* Carbon: animated smokestack wisps rising above factory */}
      {activeModule === 'carbon' && factoryNorm > 0.1 && (
        <g opacity={0.2 + factoryNorm * 0.55}>
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={522 + i * 8}
              cy={205 - i * 18}
              r={8 + factoryNorm * 16 + i * 4}
              fill="#57534e"
              className="animate-smoke"
              style={
                {
                  '--smoke-dur': `${Math.max(1.3, 3.2 - factoryNorm * 1.6)}s`,
                  animationDelay: `${i * 0.7}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </g>
      )}

      {/* Nitrogen: N2 gas bubbles venting cleanly from healthy wetland */}
      {activeModule === 'nitrogen' && wetlandNorm >= 0.45 && (
        <g opacity={wetlandNorm * 0.75}>
          {[600, 635, 670].map((bx, idx) => (
            <circle
              key={bx}
              cx={bx}
              cy={290}
              r="3.8"
              fill="#99f6e4"
              className="animate-smoke"
              style={{ animationDelay: `${idx * 0.65}s` }}
            />
          ))}
        </g>
      )}

      {/* Water: falling rain streaks when precipitation increases */}
      {activeModule === 'water' && precipNorm > 0.2 && (
        <g opacity={precipNorm * 0.85}>
          {[95, 155, 215, 275, 335, 395, 455].map((rx, idx) => (
            <line
              key={rx}
              x1={rx}
              y1={92 + (idx % 2) * 18}
              x2={rx - 8}
              y2={132 + (idx % 2) * 18}
              stroke="#e0f2fe"
              strokeWidth="2"
              className="animate-rain"
              style={{ animationDelay: `${idx * 0.14}s` }}
            />
          ))}
        </g>
      )}
    </svg>
  );
};
