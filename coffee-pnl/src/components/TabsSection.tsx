import React, { useState } from 'react';
import { CostBreakdown, CalculationResults, ROIMetrics, RevenueSettings } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/calculations';
import CostPieChart from './CostPieChart';
import InvestmentROI from './InvestmentROI';

interface TabsSectionProps {
  costBreakdown: CostBreakdown[];
  calculations: CalculationResults;
  roiMetrics: ROIMetrics;
  initialInvestment: number;
  setInitialInvestment: (investment: number) => void;
  revenue: RevenueSettings;
}

const TabsSection: React.FC<TabsSectionProps> = ({
  costBreakdown,
  calculations,
  roiMetrics,
  initialInvestment,
  setInitialInvestment,
  revenue
}) => {
  const [activeTab, setActiveTab] = useState<'cost' | 'investment'>('cost');

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('cost')}
          className={`px-6 py-3 text-sm font-medium rounded-tl-lg ${
            activeTab === 'cost'
              ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Cost Analysis
        </button>
        <button
          onClick={() => setActiveTab('investment')}
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === 'investment'
              ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Investment & ROI
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'cost' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pie Chart */}
            <div className="lg:col-span-2">
              <CostPieChart costBreakdown={costBreakdown} />
            </div>

            {/* Cost Breakdown */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Cost Breakdown</h4>
              <div className="space-y-3">
                {costBreakdown
                  .filter(item => item.percentage > 0)
                  .map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{item.category}:</span>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(item.amount)}</div>
                        <div className="text-sm text-gray-500">({formatPercentage(item.percentage)})</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investment' && (
          <InvestmentROI
            roiMetrics={roiMetrics}
            initialInvestment={initialInvestment}
            setInitialInvestment={setInitialInvestment}
            calculations={calculations}
            revenue={revenue}
          />
        )}
      </div>
    </div>
  );
};

export default TabsSection; 