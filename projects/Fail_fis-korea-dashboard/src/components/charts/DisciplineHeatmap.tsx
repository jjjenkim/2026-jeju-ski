import Highcharts from 'highcharts';
import HighchartsHeatmap from 'highcharts/modules/heatmap';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import type { Athlete } from '../../types';

// Initialize heatmap module
// Initialize heatmap module safely handling ESM/CJS differences
if (typeof Highcharts === 'object') {
  const initHeatmap = (HighchartsHeatmap as any).default || HighchartsHeatmap;
  if (typeof initHeatmap === 'function') {
    initHeatmap(Highcharts);
  }
}

interface DisciplineHeatmapProps {
  athletes: Athlete[];
  darkMode: boolean;
}

export function DisciplineHeatmap({ athletes, darkMode }: DisciplineHeatmapProps) {
  const chartOptions = useMemo(() => {
    const disciplines = Array.from(new Set(athletes.map(a => a.종목)));
    const ageGroups = ['10대', '20대', '30대', '40대'];

    const data: [number, number, number][] = [];

    disciplines.forEach((discipline, x) => {
      ageGroups.forEach((ageGroup, y) => {
        const athletesInCell = athletes.filter(
          a => a.종목 === discipline && a.연령대 === ageGroup
        );

        if (athletesInCell.length > 0) {
          const avgRank = athletesInCell.reduce(
            (sum, a) => sum + (a.최근랭킹 || 0), 0
          ) / athletesInCell.length;

          data.push([x, y, Math.round(avgRank)]);
        }
      });
    });

    return {
      chart: {
        type: 'heatmap',
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'Pretendard, sans-serif'
        },
        responsive: {
          rules: [{
            condition: { maxWidth: 640 },
            chartOptions: {
              title: { style: { fontSize: '14px' } },
              yAxis: {
                labels: {
                  style: { fontSize: '10px' }
                }
              },
              xAxis: {
                labels: {
                  style: { fontSize: '10px' }
                }
              },
              legend: {
                align: 'center',
                verticalAlign: 'bottom',
                layout: 'horizontal',
                y: 0,
                symbolHeight: 10
              }
            }
          }]
        }
      },
      title: {
        text: '종목별 연령대 평균 랭킹',
        style: {
          color: darkMode ? '#F9FAFB' : '#1A1A1A',
          fontSize: '18px',
          fontWeight: 'bold'
        }
      },
      subtitle: {
        text: '색상이 진할수록 높은 랭킹 (우수)',
        style: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
          fontSize: '14px'
        }
      },
      xAxis: {
        categories: disciplines,
        labels: {
          style: {
            color: darkMode ? '#F9FAFB' : '#1A1A1A',
            fontSize: '11px'
          }
        }
      },
      yAxis: {
        categories: ageGroups,
        title: null,
        labels: {
          style: {
            color: darkMode ? '#F9FAFB' : '#1A1A1A'
          }
        },
        reversed: true
      },
      colorAxis: {
        min: 0,
        max: 100,
        reversed: true,
        stops: [
          [0, '#34D399'], // Mint
          [0.5, '#FBBF24'], // Gold
          [1, '#F472B6'] // Pink
        ],
        labels: {
          style: {
            color: darkMode ? '#F9FAFB' : '#1A1A1A'
          }
        }
      },
      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280,
        itemStyle: {
          color: darkMode ? '#F9FAFB' : '#1A1A1A'
        }
      },
      tooltip: {
        formatter: function (this: any) {
          return `<b>${this.series.xAxis.categories[this.point.x]}</b><br>
                  ${this.series.yAxis.categories[this.point.y]}<br>
                  평균 랭킹: <b>${this.point.value}위</b>`;
        },
        backgroundColor: darkMode ? '#252836' : '#FFFFFF',
        borderColor: darkMode ? '#34D399' : '#E5E7EB',
        borderRadius: 8,
        style: {
          color: darkMode ? '#F9FAFB' : '#1A1A1A'
        }
      },
      series: [{
        name: '평균 랭킹',
        borderWidth: 2,
        borderColor: darkMode ? '#1A1D29' : '#FFFFFF',
        data: data,
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          style: {
            textOutline: 'none',
            fontWeight: 'bold'
          }
        }
      }],
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
