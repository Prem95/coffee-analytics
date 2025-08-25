# Coffee P&L Analytics Dashboard

A modern, fast, and interactive P&L (Profit & Loss) analysis dashboard for **the coffee ザ。コーヒー** business, built with Next.js, TypeScript, and TailwindCSS.

## Features

### 🏢 Location Management
- **LG 15+14 (666 sqft)** location analysis
- Dynamic yearly rent calculation (Y1: RM 8.50/sqft, Y2: RM 9/sqft, Y3: RM 9.5/sqft)
- 3-month renovation period with rent-free benefits (Year 1 only)

### 💰 Financial Analysis
- **Real-time P&L calculations** with instant updates
- **5 Key Metrics**: Revenue, Costs, Net Profit, Adjusted Profit, Adjusted Margin
- **Renovation Benefits**: Year 1 rent-free savings spread over 12 months
- **Interactive Cost Breakdown** with pie chart visualization
- **ROI Analysis** with investment recovery timeline

### 📊 Interactive Charts
- **Cost Distribution Pie Chart** with hover details
- **Investment Recovery Timeline** with Chart.js
- **Real-time updates** as you adjust inputs

### ⚡ Performance Optimized
- **React.memo** for component optimization
- **useMemo** and **useCallback** for calculation efficiency
- **Instant calculations** with no delays
- **Responsive design** for all devices

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom animations
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **State Management**: React Hooks with performance optimization

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coffee-pnl
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Input Parameters

### Location Settings
- **Lease Year**: Y1, Y2, Y3 with different rates
- **Signing Date**: Month/Year for lease commencement
- **Renovation Period**: 3 months rent-free (Year 1 only)

### Revenue Settings
- **Daily Transactions**: 10-50 customers per day
- **Average Transaction**: RM amount per customer
- **Operating Days**: 20-31 days per month

### Operating Costs
- **Monthly Rent**: Auto-calculated based on location and year
- **Employees**: 1-3 staff members
- **Salary**: RM per employee per month
- **Utilities**: Electricity and water bills

### Store Fees
- **Tech Fees**: USD converted to RM
- **Exchange Rate**: USD to RM conversion
- **Royalty**: Percentage of gross sales
- **Marketing**: Fixed percentage for advertising

## Key Calculations

### Basic P&L
```
Monthly Sales = Daily Transactions × Avg Transaction × Operating Days
Total Costs = Rent + Salaries + Utilities + Tech Fees + Royalties + Marketing
Net Profit = Monthly Sales - Total Costs
Profit Margin = (Net Profit / Monthly Sales) × 100
```

### Renovation Benefits (Year 1 Only)
```
Renovation Savings = Monthly Rent × 3 months
Monthly Benefit = Renovation Savings ÷ 12 months
Adjusted Profit = Net Profit + Monthly Benefit
Adjusted Margin = (Adjusted Profit / Monthly Sales) × 100
```

### ROI Analysis
```
Payback Period = Initial Investment ÷ Monthly Net Profit
Annual ROI = (Monthly Net Profit × 12 ÷ Initial Investment) × 100
```

## Features Overview

### 📱 Responsive Design
- **Mobile-first** approach
- **Adaptive layout** for tablets and desktops
- **Touch-friendly** controls

### 🎨 Modern UI/UX
- **Coffee-themed** gradients and colors
- **Smooth animations** and transitions
- **Interactive tooltips** with detailed explanations
- **Glass morphism** effects

### 🔧 Performance Features
- **Instant calculations** with no loading delays
- **Optimized re-renders** with React.memo
- **Memoized computations** for complex calculations
- **Lazy loading** for chart components

## Project Structure

```
coffee-pnl/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles and animations
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Main dashboard page
│   ├── components/
│   │   ├── Sidebar.tsx          # Input controls sidebar
│   │   ├── MetricsCards.tsx     # Key metrics display
│   │   ├── TabsSection.tsx      # Cost analysis and ROI tabs
│   │   ├── CostPieChart.tsx     # Interactive pie chart
│   │   ├── InvestmentROI.tsx    # ROI analysis with timeline
│   │   ├── RenovationBenefit.tsx # Renovation savings display
│   │   └── SummaryTable.tsx     # Comprehensive summary table
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   └── utils/
│       └── calculations.ts      # All calculation logic
```

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software for **the coffee ザ。コーヒー** business analysis.

---

**Built with ❤️ for the coffee ザ。コーヒー business**
