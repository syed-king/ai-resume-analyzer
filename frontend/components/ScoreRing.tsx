'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export default function ScoreRing({ score, size = 180, strokeWidth = 12 }: Props) {
  const [displayed, setDisplayed] = useState(0);
  const radius    = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  const label = score >= 70 ? 'Strong' : score >= 40 ? 'Moderate' : 'Needs Work';

  useEffect(() => {
    let start = 0;
    const step = score / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= score) { setDisplayed(score); clearInterval(timer); }
      else setDisplayed(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const offset = circumference - (displayed / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size/2} cy={size/2} r={radius} fill="none"
            stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-display font-bold text-4xl"
            style={{ color }}
          >
            {displayed}%
          </motion.span>
          <span className="text-white/40 text-xs font-medium mt-1">{label}</span>
        </div>
      </div>
    </div>
  );
}
