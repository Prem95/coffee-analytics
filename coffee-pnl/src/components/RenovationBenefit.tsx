import React, { memo } from 'react';
import { CheckCircle, Info } from 'lucide-react';
import { CalculationResults, LocationInfo, LeaseYear } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface RenovationBenefitProps {
  selectedYear: LeaseYear;
  calculations: CalculationResults;
  locationInfo: LocationInfo;
  currentRent: number;
}

const RenovationBenefit: React.FC<RenovationBenefitProps> = ({
  selectedYear,
  calculations,
  locationInfo,
  currentRent
}) => {
  if (selectedYear === "Year 1" && calculations.monthlyRenovationBenefit > 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">Year 1 Renovation Savings</span>
        </div>
        <p className="text-green-700 mt-1">
          {formatCurrency(calculations.renovationSavings)} total ({locationInfo.renovation_months} months × {formatCurrency(currentRent)}) = +{formatCurrency(calculations.monthlyRenovationBenefit)} monthly benefit
        </p>
      </div>
    );
  }

  if (selectedYear === "Year 1") {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-800">
          <Info className="w-5 h-5" />
          <span className="font-semibold">No renovation benefit calculated</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center gap-2 text-blue-800">
        <Info className="w-5 h-5" />
        <span className="font-semibold">{selectedYear}: No renovation benefit</span>
      </div>
      <p className="text-blue-700 mt-1">
        (rent-free period was in Year 1 only)
      </p>
    </div>
  );
};

export default memo(RenovationBenefit); 