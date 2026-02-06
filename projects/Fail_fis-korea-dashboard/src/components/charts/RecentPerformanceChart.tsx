import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo, useState } from 'react';
import type { Athlete } from '../../types';

interface RecentPerformanceChartProps {
  athletes: Athlete[];
  darkMode: boolean;
}

export function RecentPerformanceChart({ athletes, darkMode }: RecentPerformanceChartProps) {
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);

  // Select top 5 athletes by default (lowest average points)
  useMemo(() => {
    if (selectedAthletes.length === 0 && athletes.length > 0) {
      const top5 = [...athletes]
        .sort((a, b) => (a.평균포인트 || 999) - (b.평균포인트 || 999))
        .slice(0, 5)
        .map(a => a.선수명);
      setSelectedAthletes(top5);
    }
  }, [athletes]);

  const chartOptions = useMemo(() => {
    const series = athletes
      .filter(athlete => selectedAthletes.includes(athlete.선수명))
      .map(athlete => ({
        name: athlete.선수명,
        data: (athlete.최근10경기 || []).map(perf => perf.점수)
      }));

    const categories = athletes[0]?.최근10경기?.map((_, i) => `${i + 1}회차`) || [];

    return {
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'Pretendard, sans-serif'
        },
        responsive: {
          rules: [{
            condition: { maxWidth: 640 },
            chartOptions: {
              title: { style: { fontSize: '14px' } },
              legend: { enabled: false },
              xAxis: {
                labels: {
                  rotation: -45,
                  style: { fontSize: '10px' }
                }
              }
            }
          }]
        }
      },
      colors: ['#34D399', '#FBBF24', '#A78BFA', '#F472B6', '#22D3EE'],
      title: {
        text: '최근 10경기 성적 추이',
        style: {
          color: darkMode ? '#F9FAFB' : '#1A1A1A',
          fontSize: '18px',
          fontWeight: 'bold'
        }
      },
      subtitle: {
        text: 'FIS 포인트 기준 (낮을수록 우수)',
        style: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
          fontSize: '14px'
        }
      },
      xAxis: {
        categories: categories,
        labels: {
          style: {
            color: darkMode ? '#9CA3AF' : '#6B7280'
          }
        },
        gridLineColor: darkMode ? '#252836' : '#E5E7EB',
        lineColor: darkMode ? '#4B5563' : '#D1D5DB'
      },
      yAxis: {
        title: {
          text: 'FIS 포인트',
          style: {
            color: darkMode ? '#F9FAFB' : '#1A1A1A'
          }
        },
        labels: {
          style: {
            color: darkMode ? '#9CA3AF' : '#6B7280'
          }
        },
        gridLineColor: darkMode ? '#252836' : '#E5E7EB',
        reversed: true // Lower points = better
      },
      tooltip: {
        shared: true,
        backgroundColor: darkMode ? '#252836' : '#FFFFFF',
        borderColor: darkMode ? '#34D399' : '#E5E7EB',
        borderRadius: 8,
        style: {
          color: darkMode ? '#F9FAFB' : '#1A1A1A'
        }
      },
      legend: {
        itemStyle: {
          color: darkMode ? '#F9FAFB' : '#1A1A1A'
        },
        itemHoverStyle: {
          color: '#34D399'
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: false
          },
          enableMouseTracking: true,
          marker: {
            radius: 4,
            symbol: 'circle'
          },
          lineWidth: 3
        }
      },
      series: series,
      credits: {
        enabled: false
      }
    };
  }, [athletes, selectedAthletes, darkMode]);

  return (
    <div className="card">
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          선수 선택 (최대 5명)
        </label>
        <select
          multiple
          value={selectedAthletes}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, option => option.value);
            setSelectedAthletes(selected.slice(0, 5));
          }}
          className="w-full p-2 border border-gray-300 dark:border-ksa-dark-border rounded-md bg-white dark:bg-ksa-dark text-gray-900 dark:text-white"
          size={5}
        >
          {athletes.map(athlete => (
            <option key={athlete.FIS코드} value={athlete.선수명}>
              {athlete.선수명} ({athlete.종목})
            </option>
          ))}
        </select>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
}
