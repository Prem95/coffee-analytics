import React from 'react';
import { HelpCircle, MapPin, DollarSign, Building2, CreditCard } from 'lucide-react';
import { LocationInfo, RevenueSettings, CostSettings, StoreFees, LeaseYear, Month } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => (
  <div className="group relative inline-block">
    {children}
    <div className="invisible group-hover:visible absolute z-50 w-64 p-2 mt-1 text-sm text-white bg-gray-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      {content}
    </div>
  </div>
);

interface SidebarProps {
  selectedYear: LeaseYear;
  setSelectedYear: (year: LeaseYear) => void;
  signingMonth: Month;
  setSigningMonth: (month: Month) => void;
  signingYear: number;
  setSigningYear: (year: number) => void;
  revenue: RevenueSettings;
  setRevenue: (revenue: RevenueSettings) => void;
  costs: CostSettings;
  setCosts: (costs: CostSettings) => void;
  fees: StoreFees;
  setFees: (fees: StoreFees) => void;
  locationInfo: LocationInfo;
  currentRate: number;
  currentRent: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedYear,
  setSelectedYear,
  signingMonth,
  setSigningMonth,
  signingYear,
  setSigningYear,
  revenue,
  setRevenue,
  costs,
  setCosts,
  fees,
  setFees,
  locationInfo,
  currentRate,
  currentRent
}) => {
  const months: Month[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years: LeaseYear[] = ["Year 1", "Year 2", "Year 3"];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Settings</h2>
      
      {/* Location Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-600" />
          <h3 className="text-md font-medium text-gray-700">Location</h3>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Selected Unit:</span> {locationInfo.unit}</p>
            <p><span className="font-medium">Size:</span> {locationInfo.sqft} sqft</p>
          </div>
          
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lease Year
                <Tooltip content="Select which year of the lease to analyze. Rental rates may vary by year.">
                  <HelpCircle className="inline w-4 h-4 ml-1 text-gray-400 cursor-help" />
                </Tooltip>
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value as LeaseYear)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Signing Month
                  <Tooltip content="Month when lease agreement is signed">
                    <HelpCircle className="inline w-4 h-4 ml-1 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <select
                  value={signingMonth}
                  onChange={(e) => setSigningMonth(e.target.value as Month)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                >
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Signing Year
                  <Tooltip content="Year when lease agreement is signed">
                    <HelpCircle className="inline w-4 h-4 ml-1 text-gray-400 cursor-help" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  value={signingYear}
                  onChange={(e) => setSigningYear(parseInt(e.target.value))}
                  min={2024}
                  max={2030}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <p className="text-sm font-medium text-blue-800">Renovation Period:</p>
              <p className="text-sm text-blue-700">{locationInfo.renovation_months} months rent-free from {signingMonth} {signingYear}</p>
            </div>
            
            <div className="space-y-1 text-sm">
              <p className="font-medium text-gray-700">All Years:</p>
              <p>Y1: RM {locationInfo.y1_rate}/sqft ({formatCurrency(locationInfo.y1_rent)})</p>
              <p>Y2: RM {locationInfo.y2_rate}/sqft ({formatCurrency(locationInfo.y2_rent)})</p>
              <p>Y3: RM {locationInfo.y3_rate}/sqft ({formatCurrency(locationInfo.y3_rent)})</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Revenue Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="text-md font-medium text-gray-700">Revenue</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daily Transactions
              <Tooltip content="Average number of customers served per day. This directly affects your total revenue: Daily Transactions × Avg Transaction × Operating Days = Monthly Sales">
                <HelpCircle className="inline w-4 h-4 ml-1 text-gray-400 cursor-help" />
              </Tooltip>
            </label>
            <input
              type="number"
              value={revenue.transactionsPerDay}
              onChange={(e) => setRevenue({...revenue, transactionsPerDay: parseInt(e.target.value) || 0})}
              min={10}
              max={50}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avg Transaction (RM)
              <Tooltip content="Average amount each customer spends per visit. Higher values mean more revenue per customer. Example: RM 20 means each customer spends RM 20 on average">
                <HelpCircle className="inline w-4 h-4 ml-1 text-gray-400 cursor-help" />
              </Tooltip>
            </label>
            <input
              type="number"
              value={revenue.avgTransactionValue}
              onChange={(e) => setRevenue({...revenue, avgTransactionValue: parseFloat(e.target.value) || 0})}
              min={1}
              step={1}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Operating Days/Month
              <Tooltip content="Number of days your coffee shop operates per month. More operating days = more potential revenue, but also higher variable costs">
                <HelpCircle className="inline w-4 h-4 ml-1 text-gray-400 cursor-help" />
              </Tooltip>
            </label>
            <input
              type="range"
              value={revenue.daysOpen}
              onChange={(e) => setRevenue({...revenue, daysOpen: parseInt(e.target.value)})}
              min={20}
              max={31}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600 mt-1">{revenue.daysOpen} days</div>
          </div>
        </div>
      </div>
      
      {/* Operating Costs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-md font-medium text-gray-700">Operating Costs</h3>
        </div>
        
        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded border">
            <p className="text-sm font-medium text-gray-700">Monthly Rent: {formatCurrency(currentRent)}</p>
            <p className="text-xs text-gray-500">Based on {locationInfo.unit} {selectedYear}: {locationInfo.sqft} sqft × RM {currentRate}/sqft</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Employees
              <Tooltip content="Total number of staff members. More employees can serve more customers but increase labor costs. Total salary cost = Number of Employees × Salary per Employee">
                <HelpCircle className="inline w-4 h-4 ml-1 text-gray-400 cursor-help" />
              </Tooltip>
            </label>
            <input
              type="range"
              value={costs.employeeCount}
              onChange={(e) => setCosts({...costs, employeeCount: parseInt(e.target.value)})}
              min={1}
              max={3}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600 mt-1">{costs.employeeCount} employee{costs.employeeCount > 1 ? 's' : ''}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary per Employee (RM)
              <Tooltip content="Monthly salary paid to each employee. This excludes benefits, EPF, SOCSO. In Malaysia, minimum wage varies by state (~RM 1,500-1,700 as of 2025)">
                <HelpCircle className="inline w-4 h-4 ml-1 text-gray-400 cursor-help" />
              </Tooltip>
            </label>
            <input
              type="number"
              value={costs.employeeSalary}
              onChange={(e) => setCosts({...costs, employeeSalary: parseInt(e.target.value) || 0})}
              min={0}
              step={100}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Electricity (RM)
              <Tooltip content="Monthly electricity bill. Coffee shops use power for espresso machines, grinders, lighting, air conditioning. Varies based on equipment and operating hours">
                <HelpCircle className="inline w-4 h-4 ml-1 text-gray-400 cursor-help" />
              </Tooltip>
            </label>
            <input
              type="number"
              value={costs.electricity}
              onChange={(e) => setCosts({...costs, electricity: parseInt(e.target.value) || 0})}
              min={0}
              step={100}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Water (RM)
              <Tooltip content="Monthly water bill. Used for coffee brewing, cleaning, and customer consumption. Generally lower than electricity costs">
                <HelpCircle className="inline w-4 h-4 ml-1 text-gray-400 cursor-help" />
              </Tooltip>
            </label>
            <input
              type="number"
              value={costs.water}
              onChange={(e) => setCosts({...costs, water: parseInt(e.target.value) || 0})}
              min={0}
              step={100}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>
      
      {/* Store Fees */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-purple-600" />
          <h3 className="text-md font-medium text-gray-700">Store Fees</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tech Fee (USD)
              <Tooltip content="Monthly technology costs in USD (POS systems, software subscriptions, payment processing). Will be converted to RM using the exchange rate below">
                <HelpCircle className="inline w-4 h-4 ml-1 text-gray-400 cursor-help" />
              </Tooltip>
            </label>
            <input
              type="number"
              value={fees.techFeeUsd}
              onChange={(e) => setFees({...fees, techFeeUsd: parseFloat(e.target.value) || 0})}
              min={0}
              step={10}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              USD to RM Rate
              <Tooltip content="Current USD to Malaysian Ringgit exchange rate. Used to convert tech fees from USD to RM. Check current rates online (typically 4.2-4.7 range)">
                <HelpCircle className="inline w-4 h-4 ml-1 text-gray-400 cursor-help" />
              </Tooltip>
            </label>
            <input
              type="number"
              value={fees.usdToRm}
              onChange={(e) => setFees({...fees, usdToRm: parseFloat(e.target.value) || 0})}
              min={1}
              step={0.01}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Royalty (%)
              <Tooltip content="Franchise royalty percentage of gross sales. If you're franchising a brand, they typically charge 3-8% of total revenue. Set to 0% if you own your brand independently">
                <HelpCircle className="inline w-4 h-4 ml-1 text-gray-400 cursor-help" />
              </Tooltip>
            </label>
            <input
              type="range"
              value={fees.royaltyPercent}
              onChange={(e) => setFees({...fees, royaltyPercent: parseFloat(e.target.value)})}
              min={0}
              max={15}
              step={0.1}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600 mt-1">{fees.royaltyPercent.toFixed(1)}%</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marketing (%)
              <Tooltip content="Fixed marketing expense as percentage of gross sales. Covers advertising, promotions, social media marketing, and brand building activities. Typically 0.5-2% of revenue">
                <HelpCircle className="inline w-4 h-4 ml-1 text-gray-400 cursor-help" />
              </Tooltip>
            </label>
            <input
              type="number"
              value={fees.marketingPercent}
              onChange={(e) => setFees({...fees, marketingPercent: parseFloat(e.target.value) || 0})}
              min={0}
              max={5}
              step={0.1}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 