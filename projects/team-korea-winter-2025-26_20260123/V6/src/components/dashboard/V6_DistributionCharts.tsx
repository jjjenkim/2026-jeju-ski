import {
      Chart as ChartJS,
      ArcElement,
      Tooltip,
      Legend,
      CategoryScale,
      LinearScale,
      BarElement,
      PointElement,
      LineElement,
      Title,
      ScatterController
} from 'chart.js';
import { Bar, Scatter } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import type { Athlete } from '../../types';

ChartJS.register(
      ArcElement,
      Tooltip,
      Legend,
      CategoryScale,
      LinearScale,
      BarElement,
      PointElement,
      LineElement,
      Title,
      ScatterController
);

interface Props {
      stats: any;
      athletes: Athlete[];
}

export const V6_DistributionCharts = ({ stats, athletes }: Props) => {
      if (!stats) return null;

      const SPORT_DISPLAY_EN: Record<string, string> = {
            "freeski": "Freeski",
            "moguls": "Moguls",
            "snowboard_alpine": "Snowboard Alpine",
            "snowboard_cross": "Snowboard Cross",
            "snowboard_park": "Snowboard Park",
            "ski_jumping": "Ski Jumping",
            "cross_country": "Cross Country",
            "alpine_skiing": "Alpine Skiing",
      };

      const SPORT_ABBREV: Record<string, string> = {
            "freeski": "FS",
            "moguls": "MO",
            "snowboard_alpine": "SBA",
            "snowboard_cross": "SBX",
            "snowboard_park": "SB",
            "ski_jumping": "SJ",
            "cross_country": "CC",
            "alpine_skiing": "AL",
      };

      const SPORT_COLORS: Record<string, string> = {
            "freeski": '#FF929A', // Firebrick (Primary)
            "moguls": '#53728A', // Wedgewood (Secondary)
            "snowboard_alpine": '#B9CFDD', // Spindle
            "snowboard_cross": '#7691AD', // Ship Cove
            "snowboard_park": '#FFAAB1', // Firebrick Light
            "ski_jumping": '#6A8CA6', // Wedgewood Light
            "cross_country": '#3E5266', // Wedgewood Deep
            "alpine_skiing": '#EBACB1', // Muted Pink
      };

      // 1. Age vs Rank (Scatter)
      const scatterData = {
            datasets: Object.keys(SPORT_ABBREV).map(sportKey => {
                  const sportAthletes = athletes?.filter(a => a.sport === sportKey) || [];
                  return {
                        label: SPORT_ABBREV[sportKey],
                        data: sportAthletes.map(a => ({
                              x: a.age || (a.birth_year ? 2026 - a.birth_year : 0),
                              y: a.current_rank === 0 ? null : a.current_rank // Handle unranked
                        })).filter(p => p.y !== null && p.y !== undefined), // Filter out unranked for this chart
                        backgroundColor: SPORT_COLORS[sportKey] || '#999',
                        pointRadius: 6,
                        pointHoverRadius: 8,
                  };
            }).filter(ds => ds.data.length > 0)
      };

      const scatterOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                  legend: {
                        position: 'bottom' as const,
                        labels: {
                              color: '#96A3B4',
                              font: { family: 'Pretendard Variable', size: 9 },
                              usePointStyle: true,
                              boxWidth: 8,
                              padding: 10,
                        },
                  },
                  tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#ccc',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 10,
                        cornerRadius: 4,
                        callbacks: {
                              label: (context: any) => {
                                    const sportKey = Object.keys(SPORT_ABBREV).find(k => SPORT_ABBREV[k] === context.dataset.label);
                                    const point = context.raw;
                                    // Find athlete roughly matching these coords (simplified for display)
                                    const athlete = athletes?.find(a =>
                                          a.sport === sportKey &&
                                          (a.age === point.x || (2026 - (a.birth_year || 0)) === point.x) &&
                                          a.current_rank === point.y
                                    );
                                    return `${athlete?.name_ko || context.dataset.label}: Rank ${point.y}, Age ${point.x}`;
                              }
                        }
                  }
            },
            scales: {
                  x: {
                        title: { display: true, text: 'Age', color: '#53728A', font: { size: 10, weight: 'bold' } },
                        grid: { display: false, color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#96A3B4', font: { family: 'Pretendard Variable' } },
                        border: { display: false },
                        min: 15,
                        max: 50, // Extended max age to prevent clipping
                  },
                  y: {
                        reverse: true, // Rank 1 is top
                        title: { display: true, text: 'World Rank', color: '#53728A', font: { size: 10, weight: 'bold' } },
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#96A3B4', font: { family: 'Pretendard Variable' } },
                        border: { display: false },
                        type: 'linear' as const, // Explicitly cast type
                        beginAtZero: false,
                        min: 1,
                        max: 60, // Zoom out slightly to show top 50 clearly
                  }
            }
      };

      // 2. Team Size (Bar) - Calculate from athletes array for consistency
      const teamSizeData = Object.keys(SPORT_DISPLAY_EN).map(sportKey => {
            const count = athletes?.filter(a => a.sport === sportKey).length || 0;
            return {
                  label: SPORT_DISPLAY_EN[sportKey],
                  count
            };
      });

      const barData = {
            labels: teamSizeData.map(d => d.label),
            datasets: [
                  {
                        label: 'Athletes',
                        data: teamSizeData.map(d => d.count),
                        backgroundColor: (ctx: any) => {
                              return ctx.dataIndex % 2 === 0 ? '#FF929A' : '#53728A';
                        },
                        hoverBackgroundColor: '#FF929A',
                        borderRadius: 4,
                        barPercentage: 0.6,
                  },
            ],
      };

      const barOptions = {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y' as const,
            plugins: {
                  legend: { display: false },
                  tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                  }
            },
            scales: {
                  x: {
                        grid: { display: false },
                        ticks: { display: false },
                        border: { display: false },
                  },
                  y: {
                        grid: { display: false },
                        ticks: {
                              color: '#96A3B4', // Cadet Grey
                              font: { family: 'Pretendard Variable', size: 10 },
                              autoSkip: false,
                        },
                        border: { display: false },
                  },
            },
      };

      // 3. Age Distribution (Histogram-like Bar)
      const ageData = {
            labels: ['10s', '20s', '30s', '40s'],
            datasets: [
                  {
                        label: 'Athletes',
                        data: [
                              stats.age_distribution?.teens || 0,
                              stats.age_distribution?.twenties || 0,
                              stats.age_distribution?.thirties || 0,
                              stats.age_distribution?.forties || 0
                        ],
                        backgroundColor: (ctx: any) => {
                              const val = ctx.raw;
                              // Highlight the largest group
                              const max = Math.max(
                                    stats.age_distribution?.teens || 0,
                                    stats.age_distribution?.twenties || 0,
                                    stats.age_distribution?.thirties || 0,
                                    stats.age_distribution?.forties || 0
                              );
                              return val === max ? '#FF929A' : '#53728A';
                        },
                        borderRadius: 8,
                        borderSkipped: false,
                  }
            ]
      };

      const ageOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                  legend: { display: false },
                  tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  }
            },
            scales: {
                  y: { display: false },
                  x: {
                        grid: { display: false },
                        ticks: { color: '#7691AD', font: { family: 'Pretendard Variable' } },
                        border: { display: false },
                  }
            }
      };


      return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 1. Age vs Rank Analysis (Scatter) - REPLACES DISCIPLINE RATIO */}
                  <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-card p-6 min-h-[300px] flex flex-col"
                  >
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Age vs Rank Analysis</h3>
                        <div className="flex-1 relative w-full h-full min-h-[220px]">
                              {/* @ts-ignore */}
                              <Scatter data={scatterData} options={scatterOptions} />
                        </div>
                  </motion.div>

                  {/* 2. Team Composition */}
                  <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6 min-h-[300px] flex flex-col"
                  >
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">Team Composition</h3>
                        <div className="flex-1">
                              <Bar data={barData} options={barOptions} />
                        </div>
                  </motion.div>

                  {/* 3. Age Demographics */}
                  <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6 min-h-[300px] flex flex-col"
                  >
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">Age Demographics</h3>
                        <div className="flex-1 flex items-end">
                              <Bar data={ageData} options={ageOptions} />
                        </div>
                  </motion.div>
            </div>
      );
};
