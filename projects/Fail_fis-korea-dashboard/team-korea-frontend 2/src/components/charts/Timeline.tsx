// src/components/charts/Timeline.tsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { Athlete } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TimelineProps {
  athletes: Athlete[];
}

export const Timeline = ({ athletes }: TimelineProps) => {
  // 더미 데이터 (실제로는 athletes의 recent_results에서 월별 집계)
  const labels = ['9월', '10월', '11월', '12월', '1월', '2월', '3월'];
  const data = [5, 12, 18, 25, 22, 20, 15];

  const chartData = {
    labels,
    datasets: [
      {
        label: '출전 경기 수',
        data,
        fill: true,
        backgroundColor: 'rgba(198, 12, 48, 0.1)',
        borderColor: 'rgba(198, 12, 48, 1)',
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: 'rgba(198, 12, 48, 1)',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `${context.parsed.y}경기`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '경기 수',
          font: { family: 'Pretendard', size: 14 },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Line data={chartData} options={options} />
    </div>
  );
};
