import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import type { Athlete } from '../../types';

interface SeasonTrendChartProps {
  athletes: Athlete[];
  darkMode: boolean;
}

export function SeasonTrendChart({ athletes, darkMode }: SeasonTrendChartProps) {
  const chartOptions = useMemo(() => {
    const disciplines = Array.from(new Set(athletes.map(a => a.종목)));
    const seasons = Array.from(new Set(athletes.map(a => a.시즌))).sort();

    const series = disciplines.map(discipline => {
      const data = seasons.map(season => {
        const athletesInSeasonDiscipline = athletes.filter(
          a => a.종목 === discipline && a.시즌 === season
        );

        if (athletesInSeasonDiscipline.length === 0) return null;

        const avgPoints = athletesInSeasonDiscipline.reduce(
          (sum, a) => sum + (a.평균포인트 || 0), 0
        ) / athletesInSeasonDiscipline.length;

        return avgPoints;
      });

      return {
        name: discipline,
        data: data
      };
    });

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
        text: '시즌별 종목 개선도',
        style: {
          color: darkMode ? '#F9FAFB' : '#1A1A1A',
          fontSize: '18px',
          fontWeight: 'bold'
        }
      },
      subtitle: {
        text: '평균 FIS 포인트 추이 (낮을수록 개선)',
        style: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
          fontSize: '14px'
        }
      },
      xAxis: {
        categories: seasons,
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
          text: '평균 FIS 포인트',
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
        reversed: true
      },
      tooltip: {
        shared: true,
        valueSuffix: ' pts',
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
          marker: {
            enabled: true,
            radius: 5,
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
  }, [athletes, darkMode]);

  return (
    <div className="card">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
}
