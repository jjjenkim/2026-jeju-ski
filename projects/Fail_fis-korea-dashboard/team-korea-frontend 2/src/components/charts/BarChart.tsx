// src/components/charts/BarChart.tsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  data: Record<string, number>;
}

const TEAM_COLORS: Record<string, { bg: string; border: string }> = {
  '프리스타일': { bg: 'rgba(198, 12, 48, 0.8)', border: 'rgba(198, 12, 48, 1)' },
  '스노보드': { bg: 'rgba(0, 52, 120, 0.8)', border: 'rgba(0, 52, 120, 1)' },
  '알파인': { bg: 'rgba(255, 215, 0, 0.8)', border: 'rgba(255, 215, 0, 1)' },
  '스키점프': { bg: 'rgba(107, 114, 128, 0.8)', border: 'rgba(107, 114, 128, 1)' },
  '크로스컨트리': { bg: 'rgba(66, 165, 245, 0.8)', border: 'rgba(66, 165, 245, 1)' },
};

export const BarChart = ({ data }: BarChartProps) => {
  const labels = Object.keys(data);
  const values = Object.values(data);
  const backgroundColors = labels.map(label => TEAM_COLORS[label]?.bg || 'rgba(107, 114, 128, 0.8)');
  const borderColors = labels.map(label => TEAM_COLORS[label]?.border || 'rgba(107, 114, 128, 1)');

  const chartData = {
    labels,
    datasets: [
      {
        label: '선수 수',
        data: values,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context) => `${context.parsed.y}명`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: { family: 'Pretendard', size: 12 },
          stepSize: 5,
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
        },
      },
      x: {
        ticks: {
          font: { family: 'Pretendard', size: 14, weight: 'bold' },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
};
