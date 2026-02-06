// src/components/charts/Histogram.tsx
import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

interface HistogramProps {
  data: {
    teens: number;
    twenties: number;
    thirties: number;
    forties?: number;
  };
}

export const Histogram = ({ data }: HistogramProps) => {
  const labels = ['10대', '20대', '30대'];
  const values = [data.teens, data.twenties, data.thirties];
  
  if (data.forties && data.forties > 0) {
    labels.push('40대');
    values.push(data.forties);
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: '선수 수',
        data: values,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
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
        callbacks: {
          label: (context) => `${context.parsed.y}명`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '인원',
          font: { family: 'Pretendard', size: 14, weight: 'bold' },
        },
        ticks: {
          stepSize: 5,
        },
      },
      x: {
        title: {
          display: true,
          text: '연령대',
          font: { family: 'Pretendard', size: 14, weight: 'bold' },
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
