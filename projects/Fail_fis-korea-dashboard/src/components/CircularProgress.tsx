import React from 'react';

interface CircularProgressProps {
      value: number;
      max?: number;
      size?: number;
      strokeWidth?: number;
      color?: 'cyan' | 'purple' | 'gold';
      label: string;
      sublabel?: string;
      icon?: React.ReactNode;
}

export function CircularProgress({
      value,
      max = 100,
      size = 120,
      strokeWidth = 8,
      color = 'cyan',
      label,
      sublabel,
      icon
}: CircularProgressProps) {
      const percentage = Math.round((value / max) * 100);
      const radius = (size - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (percentage / 100) * circumference;

      const colorMap = {
            cyan: {
                  stroke: '#4ECDC4',
                  glow: 'rgba(78, 205, 196, 0.3)',
                  bg: 'rgba(78, 205, 196, 0.1)'
            },
            purple: {
                  stroke: '#9D4EDD',
                  glow: 'rgba(157, 78, 221, 0.3)',
                  bg: 'rgba(157, 78, 221, 0.1)'
            },
            gold: {
                  stroke: '#F5B942',
                  glow: 'rgba(245, 185, 66, 0.3)',
                  bg: 'rgba(245, 185, 66, 0.1)'
            }
      };

      const colors = colorMap[color];

      return (
            <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-ksa-card-glass backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass hover:shadow-glow-cyan transition-all duration-300 hover:scale-105">
                  <div className="relative" style={{ width: size, height: size }}>
                        {/* Background Circle */}
                        <svg className="transform -rotate-90" width={size} height={size}>
                              <circle
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    stroke={colors.bg}
                                    strokeWidth={strokeWidth}
                                    fill="none"
                              />
                              {/* Progress Circle */}
                              <circle
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    stroke={colors.stroke}
                                    strokeWidth={strokeWidth}
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                    style={{
                                          filter: `drop-shadow(0 0 8px ${colors.glow})`,
                                          transition: 'stroke-dashoffset 1s ease-in-out'
                                    }}
                              />
                        </svg>

                        {/* Center Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                              {icon && <div className="mb-1">{icon}</div>}
                              <span className="text-3xl font-black text-gray-900 dark:text-white">
                                    {percentage}%
                              </span>
                        </div>
                  </div>

                  {/* Label */}
                  <div className="mt-4 text-center">
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              {label}
                        </p>
                        {sublabel && (
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                                    {sublabel}
                              </p>
                        )}
                  </div>
            </div>
      );
}
