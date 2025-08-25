'use client';

import React, { memo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { CostBreakdown } from '@/types';
import { formatCurrency } from '@/utils/calculations';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CostPieChartProps {
  costBreakdown: CostBreakdown[];
}

const CostPieChart: React.FC<CostPieChartProps> = ({ costBreakdown }) => {
  // Filter out zero amounts
  const filteredData = costBreakdown.filter(item => item.amount > 0);

  const data = {
    labels: filteredData.map(item => item.category),
    datasets: [
      {
        data: filteredData.map(item => item.amount),
        backgroundColor: [
          '#FF6384', // Rent - Pink/Red
          '#36A2EB', // Salaries - Blue
          '#FFCE56', // Electricity - Yellow
          '#4BC0C0', // Water - Teal
          '#9966FF', // Tech Fee - Purple
          '#FF9F40', // Royalties - Orange
          '#FF6384', // Marketing - Pink
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
        ],
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
        padding: 12,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },
  };

  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Monthly Cost Distribution</h4>
      <div style={{ height: '400px' }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default memo(CostPieChart); 