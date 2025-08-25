'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { 
  LocationInfo, 
  RevenueSettings, 
  CostSettings, 
  StoreFees, 
  LeaseYear, 
  Month 
} from '@/types';
import { 
  locationOptions, 
  getCurrentRent, 
  getCurrentRate, 
  calculatePnL, 
  getCostBreakdown, 
  calculateROI,
  formatCurrency,
  formatPercentage 
} from '@/utils/calculations';
import Sidebar from '@/components/Sidebar';
import MetricsCards from '@/components/MetricsCards';
import TabsSection from '@/components/TabsSection';
import RenovationBenefit from '@/components/RenovationBenefit';
import SummaryTable from '@/components/SummaryTable';

export default function Home() {
  // State for all inputs
  const [selectedYear, setSelectedYear] = useState<LeaseYear>("Year 1");
  const [signingMonth, setSigningMonth] = useState<Month>("Aug");
  const [signingYear, setSigningYear] = useState<number>(2025);
  
  const [revenue, setRevenue] = useState<RevenueSettings>({
    transactionsPerDay: 20,
    avgTransactionValue: 15.0,
    daysOpen: 30
  });
  
  const [costs, setCosts] = useState<CostSettings>({
    monthlyRent: 0, // Will be calculated from location
    employeeCount: 1,
    employeeSalary: 1800,
    electricity: 300,
    water: 100
  });
  
  const [fees, setFees] = useState<StoreFees>({
    techFeeUsd: 150.0,
    usdToRm: 4.28,
    royaltyPercent: 5.5,
    marketingPercent: 0.5
  });
  
  const [initialInvestment, setInitialInvestment] = useState<number>(150000);
  
  // Location info (only one option available) - memoized for performance
  const locationInfo = useMemo(() => {
    const selectedLocationKey = Object.keys(locationOptions)[0];
    return locationOptions[selectedLocationKey];
  }, []);
  
  // Calculate current rent based on selected year - memoized
  const currentRent = useMemo(() => getCurrentRent(locationInfo, selectedYear), [locationInfo, selectedYear]);
  const currentRate = useMemo(() => getCurrentRate(locationInfo, selectedYear), [locationInfo, selectedYear]);
  
  // Update costs with current rent - memoized
  const updatedCosts = useMemo(() => ({ ...costs, monthlyRent: currentRent }), [costs, currentRent]);
  
  // Perform all calculations
  const calculations = useMemo(() => 
    calculatePnL(revenue, updatedCosts, fees, selectedYear, locationInfo),
    [revenue, updatedCosts, fees, selectedYear, locationInfo]
  );
  
  const costBreakdown = useMemo(() => 
    getCostBreakdown(
      updatedCosts, 
      calculations.techFeeRm, 
      calculations.royaltyFee, 
      calculations.marketingFee, 
      calculations.totalSalary, 
      calculations.totalFixedCosts
    ),
    [updatedCosts, calculations]
  );
  
  const roiMetrics = useMemo(() => 
    calculateROI(calculations.netProfit, initialInvestment),
    [calculations.netProfit, initialInvestment]
  );

  // Memoized callback functions for better performance
  const handleYearChange = useCallback((year: LeaseYear) => setSelectedYear(year), []);
  const handleMonthChange = useCallback((month: Month) => setSigningMonth(month), []);
  const handleYearValueChange = useCallback((year: number) => setSigningYear(year), []);
  const handleRevenueChange = useCallback((newRevenue: RevenueSettings) => setRevenue(newRevenue), []);
  const handleCostsChange = useCallback((newCosts: CostSettings) => setCosts(newCosts), []);
  const handleFeesChange = useCallback((newFees: StoreFees) => setFees(newFees), []);
  const handleInvestmentChange = useCallback((investment: number) => setInitialInvestment(investment), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-800 via-orange-600 to-yellow-600 bg-clip-text text-transparent text-center">
            the coffee ザ。コーヒー
          </h1>
          <p className="text-center text-gray-600 mt-2">P&L Analysis Dashboard</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar
              selectedYear={selectedYear}
              setSelectedYear={handleYearChange}
              signingMonth={signingMonth}
              setSigningMonth={handleMonthChange}
              signingYear={signingYear}
              setSigningYear={handleYearValueChange}
              revenue={revenue}
              setRevenue={handleRevenueChange}
              costs={costs}
              setCosts={handleCostsChange}
              fees={fees}
              setFees={handleFeesChange}
              locationInfo={locationInfo}
              currentRate={currentRate}
              currentRent={currentRent}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Key Metrics */}
            <MetricsCards calculations={calculations} />
            
            {/* Renovation Benefit Summary */}
            <RenovationBenefit 
              selectedYear={selectedYear}
              calculations={calculations}
              locationInfo={locationInfo}
              currentRent={currentRent}
            />
            
            {/* Tabs Section */}
            <TabsSection
              costBreakdown={costBreakdown}
              calculations={calculations}
              roiMetrics={roiMetrics}
              initialInvestment={initialInvestment}
              setInitialInvestment={handleInvestmentChange}
              revenue={revenue}
            />
            
            {/* Summary Table */}
            <SummaryTable
              revenue={revenue}
              costs={updatedCosts}
              calculations={calculations}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
