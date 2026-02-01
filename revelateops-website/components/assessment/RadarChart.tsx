'use client';

import { motion } from 'framer-motion';
import type { DimensionScore } from '@/types/assessment';

interface RadarChartProps {
  scores: DimensionScore[];
}

export default function RadarChart({ scores }: RadarChartProps) {
  const size = 300;
  const center = size / 2;
  const radius = 120;
  const levels = 5;
  const n = scores.length;

  // Calculate angle for each dimension (starting from top, going clockwise)
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2; // Start from top

  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate grid lines
  const gridLines = Array.from({ length: levels }, (_, i) => {
    const levelRadius = ((i + 1) / levels) * radius;
    const points = Array.from({ length: n }, (_, j) => {
      const angle = startAngle + j * angleStep;
      return `${center + levelRadius * Math.cos(angle)},${center + levelRadius * Math.sin(angle)}`;
    }).join(' ');
    return points;
  });

  // Generate data polygon
  const dataPoints = scores.map((s, i) => getPoint(i, s.score));
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Generate axis lines
  const axisLines = scores.map((_, i) => {
    const angle = startAngle + i * angleStep;
    return {
      x2: center + radius * Math.cos(angle),
      y2: center + radius * Math.sin(angle),
    };
  });

  // Generate label positions (slightly outside the chart)
  const labelPositions = scores.map((s, i) => {
    const angle = startAngle + i * angleStep;
    const labelRadius = radius + 32;
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
      label: s.label,
      score: s.score,
    };
  });

  return (
    <div className="flex items-center justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[340px]">
        {/* Grid levels */}
        {gridLines.map((points, i) => (
          <polygon
            key={`grid-${i}`}
            points={points}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={`axis-${i}`}
            x1={center}
            y1={center}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}

        {/* Data polygon fill */}
        <motion.polygon
          points={dataPath}
          fill="rgba(34, 211, 238, 0.15)"
          stroke="#22d3ee"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <motion.circle
            key={`point-${i}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#22d3ee"
            stroke="#09090b"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
          />
        ))}

        {/* Labels */}
        {labelPositions.map((pos, i) => (
          <motion.g
            key={`label-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
          >
            <text
              x={pos.x}
              y={pos.y - 6}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-text-secondary text-[10px] font-medium"
            >
              {pos.label}
            </text>
            <text
              x={pos.x}
              y={pos.y + 8}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-accent-primary text-[11px] font-bold"
            >
              {pos.score}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
