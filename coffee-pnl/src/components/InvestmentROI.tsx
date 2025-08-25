'use client';

import React from 'react';
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
import { Line } from 'react-chartjs-2';
import { ROIMetrics, CalculationResults, RevenueSettings } from '@/types';
import { formatCurrency } from '@/utils/calculations';
import { TrendingUp, Calendar, DollarSign, Target } from 'lucide-react';

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

interface InvestmentROIProps {
  roiMetrics: ROIMetrics;
  initialInvestment: number;
  setInitialInvestment: (investment: number) => void;
  calculations: CalculationResults;
  revenue: RevenueSettings;
}

const InvestmentROI: React.FC<InvestmentROIProps> = ({
  roiMetrics,
  initialInvestment,
  setInitialInvestment,
  calculations,
}) => {
  // Generate timeline data for chart
  const generateTimelineData = () => {
    if (calculations.netProfit <= 0) return { months: [], recovered: [], target: [] };
    
    const maxMonths = Math.min(Math.ceil(roiMetrics.paybackMonths) + 12, 60);
    const months = Array.from({ length: maxMonths }, (_, i) => i + 1);
    const recovered = months.map(month => Math.min(calculations.netProfit * month, initialInvestment));
    const target = months.map(() => initialInvestment);
    
    return { months, recovered, target };
  };

  const { months, recovered, target } = generateTimelineData();

  const chartData = {
    labels: months.map(m => `Month ${m}`),
    datasets: [
      {
        label: 'Investment Recovered',
        data: recovered,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#10B981',
        pointRadius: 2,
      },
      {
        label: 'Target Investment',
        data: target,
        borderColor: '#EF4444',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        fill: false,
        tension: 0,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Investment Recovery Over Time',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount (RM)',
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(Number(value));
          },
        },
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-800">Investment Analysis</h4>
      
      {/* Investment Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial Investment (RM)
          </label>
          <input
            type="number"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(parseInt(e.target.value) || 0)}
            step={10000}
            min={0}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            placeholder="Total upfront investment including equipment, renovation, initial inventory, licensing, and working capital"
          />
        </div>
      </div>

      {/* ROI Metrics */}
      <div>
        <h5 className="text-md font-semibold text-gray-800 mb-4">ROI Metrics</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Payback Period</span>
            </div>
            <div className="text-xl font-bold text-blue-900">
              {roiMetrics.paybackMonths === Infinity ? "Never" : `${roiMetrics.paybackMonths.toFixed(1)} months`}
            </div>
            <div className="text-xs text-blue-700 mt-1">
              Time needed to recover initial investment based on current monthly profit
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Payback in Years</span>
            </div>
            <div className="text-xl font-bold text-green-900">
              {roiMetrics.paybackYears === Infinity ? "Never" : `${roiMetrics.paybackYears.toFixed(1)} years`}
            </div>
            <div className="text-xs text-green-700 mt-1">
              Payback period expressed in years
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Annual ROI</span>
            </div>
            <div className="text-xl font-bold text-purple-900">
              {roiMetrics.annualROI > 0 ? `${roiMetrics.annualROI.toFixed(1)}%` : "0.0%"}
            </div>
            <div className="text-xs text-purple-700 mt-1">
              Return on Investment per year as percentage of initial investment
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Monthly Break-even</span>
            </div>
            <div className="text-xl font-bold text-orange-900">
              {roiMetrics.breakEvenPoint}
            </div>
            <div className="text-xs text-orange-700 mt-1">
              When monthly operations become profitable (excluding initial investment recovery)
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Chart */}
      {calculations.netProfit > 0 ? (
        <div>
          <div style={{ height: '400px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-800 font-semibold mb-2">Business is not currently profitable</div>
          <p className="text-red-700">
            Focus on reducing costs or increasing revenue before considering ROI.
          </p>
          <p className="text-red-600 mt-2 font-medium">
            Investment Recovery: Cannot calculate - business is losing money monthly
          </p>
        </div>
      )}
    </div>
  );
};

export default InvestmentROI; 