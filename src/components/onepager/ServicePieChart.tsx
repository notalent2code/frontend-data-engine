import { FC } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Service } from '@prisma/client';

interface ServicePieChartProps {
  data: Service[] | null;
}

ChartJS.register(ArcElement, Tooltip, Legend);

function formatDataForChart(data: Service[] | null) {
  if (!data) return null;

  const labels = data.map((item) => item.title);
  const dataPoints = data.map((item) => item.revenue_percentage);

  return {
    labels: labels,
    datasets: [
      {
        label: ' % of Revenue Percentage',
        data: dataPoints,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
}

const ServicePieChart: FC<ServicePieChartProps> = ({ data }) => {
  const chartData = formatDataForChart(data);

  return (
    chartData && (
      <Pie
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
          },
        }}
      />
    )
  );
};

export default ServicePieChart;
