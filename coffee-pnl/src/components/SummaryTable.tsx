import React, { memo } from 'react';
import { CalculationResults, RevenueSettings, CostSettings } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/calculations';

interface SummaryTableProps {
  revenue: RevenueSettings;
  costs: CostSettings;
  calculations: CalculationResults;
}

interface SummaryRow {
  metric: string;
  value: string;
}

const SummaryTable: React.FC<SummaryTableProps> = ({ revenue, costs, calculations }) => {
  const summaryData: SummaryRow[] = [
    { metric: "Daily Transactions", value: revenue.transactionsPerDay.toLocaleString() },
    { metric: "Avg Transaction Value", value: formatCurrency(revenue.avgTransactionValue) },
    { metric: "Operating Days", value: revenue.daysOpen.toString() },
    { metric: "Monthly Revenue", value: formatCurrency(calculations.monthlySales) },
    { metric: "Staff Salaries", value: formatCurrency(calculations.totalSalary) },
    { metric: "Rent", value: formatCurrency(costs.monthlyRent) },
    { metric: "Electricity", value: formatCurrency(costs.electricity) },
    { metric: "Water", value: formatCurrency(costs.water) },
    { metric: "Technology Fee", value: formatCurrency(calculations.techFeeRm) },
    { metric: "Royalty Fees", value: formatCurrency(calculations.royaltyFee) },
    { metric: "Marketing Fees", value: formatCurrency(calculations.marketingFee) },
    { metric: "Total Costs", value: formatCurrency(calculations.totalFixedCosts) },
    { metric: "Net Profit", value: formatCurrency(calculations.netProfit) },
    { metric: "Profit Margin", value: formatPercentage(calculations.profitMargin) },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Metric
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {summaryData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.metric}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(SummaryTable); 