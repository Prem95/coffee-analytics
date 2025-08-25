import React, { memo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calculator, Target } from 'lucide-react';
import { CalculationResults } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/calculations';

interface MetricsCardsProps {
  calculations: CalculationResults;
}

interface MetricCardProps {
  title: string;
  value: string;
  helpText?: string;
  delta?: string;
  deltaColor?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  helpText, 
  delta, 
  deltaColor = 'neutral',
  icon 
}) => {
  const getDeltaColorClass = () => {
    switch (deltaColor) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-600">{title}</div>
        <div className="text-gray-400">{icon}</div>
      </div>
      
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      
      {delta && (
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDeltaColorClass()}`}>
          {deltaColor === 'positive' ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : deltaColor === 'negative' ? (
            <TrendingDown className="w-3 h-3 mr-1" />
          ) : null}
          {delta}
        </div>
      )}
      
      {helpText && (
        <div className="text-xs text-gray-500 mt-2 leading-tight">{helpText}</div>
      )}
    </div>
  );
};

const MetricsCards: React.FC<MetricsCardsProps> = ({ calculations }) => {
  const renovationBenefitDelta = calculations.monthlyRenovationBenefit > 0 
    ? `+${formatCurrency(calculations.monthlyRenovationBenefit)} renovation benefit`
    : null;
    
  const marginDelta = calculations.monthlyRenovationBenefit > 0
    ? `+${formatPercentage(calculations.adjustedMargin - calculations.profitMargin)}`
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard
        title="Monthly Revenue"
        value={formatCurrency(calculations.monthlySales)}
        helpText="Total sales before expenses. Formula: Daily Transactions × Avg Transaction × Operating Days"
        icon={<DollarSign className="w-5 h-5" />}
      />
      
      <MetricCard
        title="Total Costs"
        value={formatCurrency(calculations.totalFixedCosts)}
        helpText="Sum of all monthly expenses: Rent + Salaries + Utilities + Tech Fees + Royalties"
        icon={<Calculator className="w-5 h-5" />}
      />
      
      <MetricCard
        title="Net Profit"
        value={formatCurrency(calculations.netProfit)}
        helpText="Money left after all expenses. Formula: Monthly Revenue - Total Costs"
        deltaColor={calculations.netProfit >= 0 ? 'positive' : 'negative'}
        icon={<Target className="w-5 h-5" />}
      />
      
      <MetricCard
        title="Adjusted Profit"
        value={formatCurrency(calculations.adjustedProfit)}
        helpText={`Net profit including ${calculations.monthlyRenovationBenefit > 0 ? '3' : '0'}-month rent-free benefit spread over 12 months`}
        delta={renovationBenefitDelta}
        deltaColor={calculations.monthlyRenovationBenefit > 0 ? 'positive' : 'neutral'}
        icon={<TrendingUp className="w-5 h-5" />}
      />
      
      <MetricCard
        title="Adjusted Margin"
        value={formatPercentage(calculations.adjustedMargin)}
        helpText="Profit margin including renovation savings benefit"
        delta={marginDelta}
        deltaColor={calculations.adjustedMargin >= 0 ? 'positive' : 'negative'}
        icon={<Target className="w-5 h-5" />}
      />
    </div>
  );
};

export default memo(MetricsCards); 