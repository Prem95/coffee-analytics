export interface LocationInfo {
  unit: string;
  sqft: number;
  y1_rate: number;
  y2_rate: number;
  y3_rate: number;
  y1_rent: number;
  y2_rent: number;
  y3_rent: number;
  renovation_months: number;
}

export interface LocationOptions {
  [key: string]: LocationInfo;
}

export interface RevenueSettings {
  transactionsPerDay: number;
  avgTransactionValue: number;
  daysOpen: number;
}

export interface CostSettings {
  monthlyRent: number;
  employeeCount: number;
  employeeSalary: number;
  electricity: number;
  water: number;
}

export interface StoreFees {
  techFeeUsd: number;
  usdToRm: number;
  royaltyPercent: number;
  marketingPercent: number;
}

export interface CalculationResults {
  monthlySales: number;
  techFeeRm: number;
  royaltyFee: number;
  marketingFee: number;
  totalSalary: number;
  totalFixedCosts: number;
  netProfit: number;
  profitMargin: number;
  renovationSavings: number;
  monthlyRenovationBenefit: number;
  adjustedProfit: number;
  adjustedMargin: number;
}

export interface CostBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface ROIMetrics {
  paybackMonths: number;
  paybackYears: number;
  annualROI: number;
  breakEvenPoint: string;
}

export type LeaseYear = "Year 1" | "Year 2" | "Year 3";

export type Month = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | 
                   "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec"; 