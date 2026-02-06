import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import type { Athlete } from '../../types';

interface AgeGroupBarChartProps {
  athletes: Athlete[];
  darkMode: boolean;
}

export function AgeGroupBarChart({ athletes, darkMode }: AgeGroupBarChartProps) {
  const chartOptions = useMemo(() => {
    const ageGroups = ['10대', '20대', '30대', '40대'];
    const disciplines = Array.from(new Set(athletes.map(a => a.종목)));

    const series = disciplines.map(discipline => {
      const data = ageGroups.map(ageGroup => {
        return athletes.filter(
          a => a.종목 === discipline && a.연령대 === ageGroup
        ).length;
      });

      return {
        name: discipline,
        data: data
      };
    });

    return {
      chart: {
        type: 'column',
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
                  rotation: 0,
                  style: { fontSize: '11px' }
                }
              }
            }
          }]
        }
      },
      colors: ['#34D399', '#FBBF24', '#A78BFA', '#F472B6', '#22D3EE'],
      title: {
        text: '연령대별 종목 분포',
        style: {
          color: darkMode ? '#F9FAFB' : '#1A1A1A',
          fontSize: '18px',
          fontWeight: 'bold'
        }
      },
      subtitle: {
        text: '종목별 연령대 선수 수',
        style: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
          fontSize: '14px'
        }
      },
      xAxis: {
        categories: ageGroups,
        labels: {
          style: {
            color: darkMode ? '#9CA3AF' : '#6B7280'
          }
        },
        gridLineColor: darkMode ? '#252836' : '#E5E7EB',
        lineColor: darkMode ? '#4B5563' : '#D1D5DB'
      },
      yAxis: {
        min: 0,
        title: {
          text: '선수 수',
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
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: darkMode ? '#F9FAFB' : '#1A1A1A'
          }
        }
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}명<br/>전체: {point.stackTotal}명',
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
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            color: darkMode ? '#F9FAFB' : '#1A1A1A',
            style: {
              textOutline: 'none'
            }
          }
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
