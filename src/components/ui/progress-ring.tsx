"use client";

import React, { useEffect, useState } from "react";

interface ProgressRingProps {
  radius: number;
  stroke: number;
  progress: number; // 0 to 100
  color: string;
  label: string;
  icon?: React.ReactNode;
}

export default function ProgressRing({ radius, stroke, progress, color, label, icon }: ProgressRingProps) {
  const [offset, setOffset] = useState(0);
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  useEffect(() => {
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    setOffset(strokeDashoffset);
  }, [progress, circumference]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          {/* Background Circle */}
          <circle
            stroke="rgba(255, 255, 255, 0.1)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress Circle */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset: offset, transition: "stroke-dashoffset 0.8s ease-in-out" }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        {/* Inner Icon / Text */}
        <div className="absolute flex flex-col items-center justify-center text-challenge-cream">
          {icon}
          <span className="text-xs font-bold mt-1">{Math.round(progress)}%</span>
        </div>
      </div>
      <span className="text-[10px] font-extrabold uppercase mt-3 tracking-widest text-challenge-sage">
        {label}
      </span>
    </div>
  );
}