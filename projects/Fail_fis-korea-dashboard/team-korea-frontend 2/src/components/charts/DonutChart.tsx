// src/components/charts/DonutChart.tsx
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  data: Record<string, number>;
}

const SPORT_COLORS: Record<string, string> = {
  'alpine_skiing': '#003478',
  'ski_cross': '#0057A8',
  'ski_jumping': '#1E88E5',
  'cross_country': '#42A5F5',
  'freestyle_moguls': '#C60C30',
  'freestyle_park': '#E61B3F',
  'snowboard_park': '#FFD700',
  'snowboard_cross': '#E6C200',
  'snowboard_alpine': '#6B7280'
};

const SPORT_LABELS: Record<string, string> = {
  'alpine_skiing': 'Alpine Skiing',
  'ski_cross': 'Ski Cross',
  'ski_jumping': 'Ski Jumping',
  'cross_country': 'Cross Country',
  'freestyle_moguls': 'Freestyle - Moguls',
  'freestyle_park': 'Freestyle - Park & Pipe',
  'snowboard_park': 'Snowboard - Park & Pipe',
  'snowboard_cross': 'Snowboard Cross',
  'snowboard_alpine': 'Snowboard Alpine'
};

export const DonutChart = ({ data }: DonutChartProps) => {
  const labels = Object.keys(data).map(key => SPORT_LABELS[key] || key);
  const values = Object.values(data);
  const colors = Object.keys(data).map(key => SPORT_COLORS[key] || '#999');

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Pretendard',
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value}명 (${percentage}%)`;
          },
        },
      },
    },
    cutout: '65%',
  };

  return (
    <div className="h-80">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};
