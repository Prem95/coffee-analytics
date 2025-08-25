import { 
  LocationInfo, 
  RevenueSettings, 
  CostSettings, 
  StoreFees, 
  CalculationResults, 
  CostBreakdown, 
  ROIMetrics,
  LeaseYear 
} from '@/types';

export const locationOptions = {
  "LG 15 + 14 (666 sqft)": {
    unit: "LG 15 + 14",
    sqft: 666,
    y1_rate: 8.50,
    y2_rate: 9,
    y3_rate: 9.5,
    y1_rent: 666 * 8.5,
    y2_rent: 666 * 9,
    y3_rent: 666 * 9.5,
    renovation_months: 3,
  }
};

export const yearMapping = { "Year 1": "y1", "Year 2": "y2", "Year 3": "y3" } as const;

export function getCurrentRent(locationInfo: LocationInfo, selectedYear: LeaseYear): number {
  const yearKey = yearMapping[selectedYear];
  return locationInfo[`${yearKey}_rent` as keyof LocationInfo] as number;
}

export function getCurrentRate(locationInfo: LocationInfo, selectedYear: LeaseYear): number {
  const yearKey = yearMapping[selectedYear];
  return locationInfo[`${yearKey}_rate` as keyof LocationInfo] as number;
}

export function calculatePnL(
  revenue: RevenueSettings,
  costs: CostSettings,
  fees: StoreFees,
  selectedYear: LeaseYear,
  locationInfo: LocationInfo
): CalculationResults {
  // Basic revenue calculation
  const monthlySales = revenue.transactionsPerDay * revenue.avgTransactionValue * revenue.daysOpen;
  
  // Fee calculations
  const techFeeRm = fees.techFeeUsd * fees.usdToRm;
  const royaltyFee = (fees.royaltyPercent / 100) * monthlySales;
  const marketingFee = (fees.marketingPercent / 100) * monthlySales;
  const totalSalary = costs.employeeCount * costs.employeeSalary;
  
  // Total costs
  const totalFixedCosts = costs.monthlyRent + totalSalary + costs.electricity + 
                         costs.water + techFeeRm + royaltyFee + marketingFee;
  
  // Basic profit calculations
  const netProfit = monthlySales - totalFixedCosts;
  const profitMargin = monthlySales > 0 ? (netProfit / monthlySales * 100) : 0;
  
  // Renovation benefit calculation (only applies to Year 1)
  let renovationSavings = 0;
  let monthlyRenovationBenefit = 0;
  
  if (selectedYear === "Year 1") {
    renovationSavings = costs.monthlyRent * locationInfo.renovation_months;
    monthlyRenovationBenefit = renovationSavings / 12; // Spread over 12 months
  }
  
  // Adjusted profit including renovation benefit
  const adjustedProfit = netProfit + monthlyRenovationBenefit;
  const adjustedMargin = monthlySales > 0 ? (adjustedProfit / monthlySales * 100) : 0;
  
  return {
    monthlySales,
    techFeeRm,
    royaltyFee,
    marketingFee,
    totalSalary,
    totalFixedCosts,
    netProfit,
    profitMargin,
    renovationSavings,
    monthlyRenovationBenefit,
    adjustedProfit,
    adjustedMargin
  };
}

export function getCostBreakdown(
  costs: CostSettings,
  techFeeRm: number,
  royaltyFee: number,
  marketingFee: number,
  totalSalary: number,
  totalFixedCosts: number
): CostBreakdown[] {
  const breakdown = [
    { category: 'Rent', amount: costs.monthlyRent },
    { category: 'Salaries', amount: totalSalary },
    { category: 'Electricity', amount: costs.electricity },
    { category: 'Water', amount: costs.water },
    { category: 'Tech Fee', amount: techFeeRm },
    { category: 'Royalties', amount: royaltyFee },
    { category: 'Marketing', amount: marketingFee }
  ];
  
  return breakdown.map(item => ({
    ...item,
    percentage: totalFixedCosts > 0 ? (item.amount / totalFixedCosts * 100) : 0
  }));
}

export function calculateROI(netProfit: number, initialInvestment: number): ROIMetrics {
  if (netProfit <= 0) {
    return {
      paybackMonths: Infinity,
      paybackYears: Infinity,
      annualROI: 0,
      breakEvenPoint: "Not Profitable"
    };
  }
  
  const paybackMonths = initialInvestment / netProfit;
  const paybackYears = paybackMonths / 12;
  const annualROI = (netProfit * 12 / initialInvestment) * 100;
  const breakEvenPoint = "Month 1";
  
  return {
    paybackMonths,
    paybackYears,
    annualROI,
    breakEvenPoint
  };
}

export function formatCurrency(amount: number): string {
  return `RM ${amount.toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(1)}%`;
} 