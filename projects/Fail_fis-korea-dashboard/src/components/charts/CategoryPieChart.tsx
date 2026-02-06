import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import type { Athlete } from '../../types';

interface CategoryPieChartProps {
  athletes: Athlete[];
  darkMode: boolean;
}

export function CategoryPieChart({ athletes, darkMode }: CategoryPieChartProps) {
  const chartOptions = useMemo(() => {
    const categoryCounts = athletes.reduce((acc, athlete) => {
      const category = athlete.대회카테고리 || 'FIS';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryLabels: Record<string, string> = {
      'WC': 'World Cup',
      'WCH': 'World Championships',
      'OG': 'Olympic Games',
      'FIS': 'FIS Races',
      'EC': 'European Cup'
    };

    const data = Object.entries(categoryCounts).map(([category, count]) => ({
      name: categoryLabels[category] || category,
      y: count,
      color: getColorForCategory(category)
    }));

    return {
      chart: {
        type: 'pie',
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
              plotOptions: {
                pie: {
                  dataLabels: {
                    distance: -30,
                    style: { fontSize: '10px' }
                  }
                }
              }
            }
          }]
        }
      },
      colors: ['#34D399', '#FBBF24', '#A78BFA', '#F472B6', '#22D3EE'],
      title: {
        text: '대회 카테고리별 선수 분포',
        style: {
          color: darkMode ? '#F9FAFB' : '#1A1A1A',
          fontSize: '18px',
          fontWeight: 'bold'
        }
      },
      subtitle: {
        text: '주요 대회 카테고리 참가 현황',
        style: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
          fontSize: '14px'
        }
      },
      tooltip: {
        pointFormat: '<b>{point.y}명</b> ({point.percentage:.1f}%)',
        backgroundColor: darkMode ? '#252836' : '#FFFFFF',
        borderColor: darkMode ? '#34D399' : '#E5E7EB',
        borderRadius: 8,
        style: {
          color: darkMode ? '#F9FAFB' : '#1A1A1A'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
            style: {
              color: darkMode ? '#F9FAFB' : '#1A1A1A',
              fontSize: '12px',
              textOutline: 'none'
            }
          },
          showInLegend: true
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
      series: [{
        name: '선수 수',
        colorByPoint: true,
        data: data
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

function getColorForCategory(category: string): string {
  const colors: Record<string, string> = {
    'WC': '#34D399',  // Mint
    'WCH': '#FBBF24', // Gold
    'OG': '#A78BFA',  // Purple
    'FIS': '#F472B6', // Pink
    'EC': '#22D3EE'   // Cyan
  };
  return colors[category] || '#6B7280';
}
