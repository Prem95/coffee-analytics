try:
    import streamlit as st
    import pandas as pd
    import plotly.express as px
    import plotly.graph_objects as go
except ModuleNotFoundError as e:
    print("Missing required module:", e)
    print("Please run: pip install streamlit plotly pandas numpy")
    exit()

# Page configuration
st.set_page_config(
    page_title="PnL Analysis",
    page_icon="🍵",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for modern styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: 700;
        background: linear-gradient(90deg, #8B4513, #D2691E, #F4A460);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        margin-bottom: 1rem;
    }
    
    .metric-container {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 1rem;
        border-radius: 10px;
        border-left: 4px solid #8B4513;
        margin: 0.5rem 0;
    }
    
    .profit-positive {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }
    
    .profit-negative {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
    }
    
    .sidebar .sidebar-content {
        background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
    }
    
    .insight-box {
        background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
        padding: 1rem;
        border-radius: 10px;
        border-left: 4px solid #FF6B35;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Main title with modern styling
st.markdown('<h1 class="main-header">the coffee ザ。コーヒー</h1>', unsafe_allow_html=True)

# Location options (defined before sidebar)
location_options = {
    "LG 15 + 14 (606.40 sqft)": {
        "unit": "LG 15 + 14",
        "sqft": 606.40,
        "y1_rate": 8.50,
        "y2_rate": 9,
        "y3_rate": 9.5,
        "y1_rent": 606.40 * 8.5,
        "y2_rent": 606.40 * 9,
        "y3_rent": 606.40 * 9.5,
        "renovation_months": 3,
    }
}

# Sidebar with modern design
with st.sidebar:
    st.markdown("### Settings")
    
    # Location Selection
    with st.expander("Tenancy", expanded=True):
        # Since there's only one location, auto-select it
        selected_location = list(location_options.keys())[0]
        location_info = location_options[selected_location]
        
        # Year selection
        selected_year = st.selectbox(
            "Lease Year",
            options=["Year 1", "Year 2", "Year 3"]
        )
        
        # Signing period
        col_month, col_year = st.columns(2)
        with col_month:
            signing_month = st.selectbox(
                "Signing Month",
                options=["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                index=7  # August
            )
        with col_year:
            signing_year = st.number_input(
                "Signing Year",
                value=2025,
                min_value=2024,
                max_value=2030,
                step=1
            )
        
        renovation_months = location_info['renovation_months']
                
        # Get current year's rate and rent
        year_mapping = {"Year 1": "y1", "Year 2": "y2", "Year 3": "y3"}
        current_year = year_mapping[selected_year]
        current_rate = location_info[f"{current_year}_rate"]
        current_rent = location_info[f"{current_year}_rent"]
        
        # Show all year rates for comparison
        st.markdown("**All Years:**")
        st.markdown(f"Y1: RM {location_info['y1_rate']}/sqft (RM {location_info['y1_rent']:,.0f})")
        st.markdown(f"Y2: RM {location_info['y2_rate']}/sqft (RM {location_info['y2_rent']:,.0f})")
        st.markdown(f"Y3: RM {location_info['y3_rate']}/sqft (RM {location_info['y3_rent']:,.0f})")
    
    # Revenue Settings
    with st.expander("Sales & Revenue", expanded=True):
        col_weekday, col_weekend = st.columns(2)
        
        with col_weekday:
            weekday_daily_sales = st.number_input(
                "Sales per Day (Weekday)", 
                min_value=100, max_value=2000, value=500, step=50,
                help="Average daily sales for weekdays (Monday-Friday)"
            )
        
        with col_weekend:
            weekend_daily_sales = st.number_input(
                "Sales per Day (Weekend)", 
                min_value=200, max_value=3000, value=900, step=50,
                help="Average daily sales for weekends (Saturday-Sunday)"
            )
        
        days_open = st.slider(
            "Operating Days/Month", 
            min_value=20, max_value=31, value=30
        )
        
        # Calculate monthly sales based on operating days
        if days_open <= 28:
            # Use proportional calculation based on 28-day cycle
            weekday_ratio = 20/28  # 20 weekdays out of 28 days
            weekend_ratio = 8/28   # 8 weekends out of 28 days
            weekday_days = int(days_open * weekday_ratio)
            weekend_days = int(days_open * weekend_ratio)
        else:
            # For more than 28 days, add extra days proportionally
            extra_days = days_open - 28
            weekday_days = 20 + int(extra_days * 20/28)
            weekend_days = 8 + int(extra_days * 8/28)
        
        monthly_sales = (weekday_daily_sales * weekday_days) + (weekend_daily_sales * weekend_days)
        
        # Display summary
        st.markdown("---")
        col_summary1, col_summary2, col_summary3 = st.columns(3)
        with col_summary1:
            st.markdown(f"**Weekdays**: {weekday_days} days × RM {weekday_daily_sales:,.0f}")
        with col_summary2:
            st.markdown(f"**Weekends**: {weekend_days} days × RM {weekend_daily_sales:,.0f}")
        with col_summary3:
            st.markdown(f"**Monthly Sales**: RM {monthly_sales:,.0f}")
    
    # Cost Settings
    with st.expander("Operating Costs", expanded=True):
        
        # Full-time staff
        st.markdown("**Full-time Staff**")
        fulltime_count = st.slider(
            "Number of Full-time Staff", 
            0, 3, value=2
        )
        fulltime_salary = st.number_input(
            "Full-time Salary + Allowance (RM)", 
            value=2000, step=100, min_value=0,
            help="Monthly salary for full-time staff (8 hours/day)"
        )
        
        # Part-time staff
        st.markdown("**Part-time Staff**")
        parttime_count = st.slider(
            "Number of Part-time Staff", 
            0, 3, value=2
        )
        parttime_hourly_rate = st.number_input(
            "Part-time Hourly Rate (RM)", 
            value=9.50, step=0.50, min_value=0.0,
            help="Hourly rate for part-time staff"
        )
        parttime_hours_per_day = st.number_input(
            "Hours per Part-time Staff per Day", 
            value=4, step=1, min_value=0,
            help="Hours worked by each part-time staff member per day"
        )
        
        # Display staffing cost
        st.markdown("---")
        fulltime_cost = fulltime_count * fulltime_salary
        parttime_monthly_cost = parttime_count * parttime_hours_per_day * parttime_hourly_rate * 30
        
        st.markdown(f"**Full-time:** RM {fulltime_cost:,}")
        st.markdown(f"**Part-time:** RM {parttime_monthly_cost:,}")
        
        electricity = st.number_input(
            "Electricity (RM)", 
            value=2000, step=100, min_value=0
        )
        water = st.number_input(
            "Water (RM)", 
            value=200, step=100, min_value=0
        )
    
    # GTO Rent Settings
    with st.expander("GTO Rent Settings", expanded=False):
        use_gto = st.checkbox("Apply GTO Rent (Turnover Rent)?", value=True)
        gto_percentage = 7.5 
        st.markdown(f"**GTO Rate**: {gto_percentage}%")
    
    # Fixed Store Fees
    with st.expander("Fixed Fees", expanded=False):
        st.markdown("**Tech Fee**: $150 USD")
        st.markdown("**Royalties**: 5%")
        st.markdown("**Marketing**: 0.5%")
        
        usd_to_rm = st.number_input(
            "USD to RM Rate", 
            value=4.20, step=0.01, min_value=1.0
        )
    
    tech_fee_usd = 150.0
    royalty_percent = 5.0
    marketing_percent = 0.5

# Calculations
tech_fee_rm = tech_fee_usd * usd_to_rm
# monthly_sales is already calculated in the Revenue Settings section
royalty_fee = (royalty_percent / 100) * monthly_sales
marketing_fee = (marketing_percent / 100) * monthly_sales

# Calculate staffing costs
fulltime_total = fulltime_count * fulltime_salary
parttime_total_hours_per_day = parttime_count * parttime_hours_per_day  # Total hours for all part-time staff
parttime_total_hours_per_month = parttime_total_hours_per_day * 30  # Convert daily to monthly
parttime_total = parttime_total_hours_per_month * parttime_hourly_rate
total_salary = fulltime_total + parttime_total

# GTO Rent Logic
if use_gto:
    calculated_gto_rent = (gto_percentage / 100) * monthly_sales
    base_rent = max(current_rent, calculated_gto_rent)
else:
    base_rent = current_rent

# Apply 8% SST to rental
sst_rate = 0.08
sst_amount = base_rent * sst_rate
monthly_rent = base_rent + sst_amount

# Calculate renovation savings (only applies to Year 1)
if selected_year == "Year 1":
    renovation_savings = base_rent * renovation_months
    monthly_renovation_benefit = renovation_savings / 12  # Spread over 12 months
else:
    renovation_savings = 0
    monthly_renovation_benefit = 0

total_fixed_costs = monthly_rent + total_salary + electricity + water + tech_fee_rm + royalty_fee + marketing_fee
net_profit = monthly_sales - total_fixed_costs
profit_margin = (net_profit / monthly_sales * 100) if monthly_sales > 0 else 0

# Adjusted profit including renovation benefit (Year 1 only)
adjusted_profit = net_profit + monthly_renovation_benefit
adjusted_margin = (adjusted_profit / monthly_sales * 100) if monthly_sales > 0 else 0

# Key Metrics with modern cards
st.markdown("---")
col1, col2, col3 = st.columns(3)

with col1:
    st.metric(
        label="Monthly Revenue",
        value=f"RM {monthly_sales:,.0f}",
        help="Total sales before expenses. Formula: (Weekday Sales × 20 days) + (Weekend Sales × 8 days)"
    )

with col2:
    st.metric(
        label="Total Costs",
        value=f"RM {total_fixed_costs:,.0f}",
        help="Sum of all monthly expenses: Rent + Salaries + Utilities + Tech Fees + Royalties"
    )

with col3:
    st.metric(
        label="Net Profit",
        value=f"RM {net_profit:,.0f}",
        help="Money left after all expenses. Formula: Monthly Revenue - Total Costs"
    )

tab1, tab2 = st.tabs(["Cost Analysis", "Investment & ROI"])

with tab1:
    col1, col2 = st.columns([2, 1])

    with col1:
        # Interactive Pie Chart with Plotly
        cost_data = {
            'Category': ['Base Rent', 'SST (8%)', 'Full-time Staff', 'Part-time Staff', 'Electricity', 'Water', 'Tech Fee', 'Royalties', 'Marketing'],
            'Amount': [base_rent, sst_amount, fulltime_total, parttime_total, electricity, water, tech_fee_rm, royalty_fee, marketing_fee],
            'Percentage': [
                (base_rent/total_fixed_costs*100) if total_fixed_costs > 0 else 0,
                (sst_amount/total_fixed_costs*100) if total_fixed_costs > 0 else 0,
                (fulltime_total/total_fixed_costs*100) if total_fixed_costs > 0 else 0,
                (parttime_total/total_fixed_costs*100) if total_fixed_costs > 0 else 0,
                (electricity/total_fixed_costs*100) if total_fixed_costs > 0 else 0,
                (water/total_fixed_costs*100) if total_fixed_costs > 0 else 0,
                (tech_fee_rm/total_fixed_costs*100) if total_fixed_costs > 0 else 0,
                (royalty_fee/total_fixed_costs*100) if total_fixed_costs > 0 else 0,
                (marketing_fee/total_fixed_costs*100) if total_fixed_costs > 0 else 0
            ]
        }
        
        # Create DataFrame for proper Plotly usage
        cost_df = pd.DataFrame(cost_data)
        
        fig_pie = px.pie(
            cost_df,
            values='Amount',
            names='Category',
            title="Monthly Cost Distribution",
            color_discrete_sequence=px.colors.qualitative.Set3,
            hover_data={'Amount': ':,.0f'}
        )
        fig_pie.update_traces(
            textposition='inside', 
            textinfo='percent+label',
            hovertemplate='<b>%{label}</b><br>Amount: RM %{value:,.0f}<br>Percentage: %{percent}<extra></extra>'
        )
        fig_pie.update_layout(font_size=12, title_font_size=16)
        st.plotly_chart(fig_pie, use_container_width=True)

    with col2:
        st.markdown("#### Cost Breakdown")
        for i, category in enumerate(cost_data['Category']):
            percentage = cost_data['Percentage'][i]
            amount = cost_data['Amount'][i]
            if percentage > 0:
                st.markdown(f"**{category}**: RM {amount:,.0f} ({percentage:.0f}%)")

with tab2:
    st.markdown("#### Investment Analysis")
    
    # Investment input
    col1, col2 = st.columns(2)
    
    with col1:
        initial_investment = st.number_input(
            "Initial Investment (RM)",
            value=130000,
            step=10000,
            min_value=0,
            help="Total upfront investment including equipment, renovation, initial inventory, licensing, and working capital"
        )
    
    with col2:
        # Calculate ROI metrics
        if net_profit > 0:
            payback_months = initial_investment / net_profit
            payback_years = payback_months / 12
        else:
            payback_months = float('inf')
            payback_years = float('inf')
    
    # ROI Metrics Display
    st.markdown("---")
    st.markdown("#### ROI Metrics")
    
    roi_col1, roi_col2 = st.columns(2)
    
    with roi_col1:
        st.metric(
            "Payback Period (Months)",
            f"{payback_months:.0f} months" if payback_months != float('inf') else "Never",
            help="Time needed to recover initial investment based on current monthly profit"
        )
    
    with roi_col2:
        st.metric(
            "Payback Period (Years)",
            f"{payback_years:.0f} years" if payback_years != float('inf') else "Never",
            help="Payback period expressed in years"
        )
    
    # Investment Breakdown Visualization
    if net_profit > 0:
        st.markdown("---")
        
        # Create timeline chart
        months = list(range(1, min(int(payback_months) + 13, 61)))  # Show up to 5 years max
        cumulative_profit = [net_profit * month for month in months]
        remaining_investment = [max(0, initial_investment - profit) for profit in cumulative_profit]
        
        timeline_df = pd.DataFrame({
            'Month': months,
            'Recovered': [min(profit, initial_investment) for profit in cumulative_profit],
            'Remaining': remaining_investment
        })
        
        fig_timeline = go.Figure()
        
        fig_timeline.add_trace(go.Scatter(
            x=timeline_df['Month'],
            y=timeline_df['Recovered'],
            mode='lines',
            name='Investment Recovered',
            line=dict(color='green', width=3),
            fill='tonexty'
        ))
        
        fig_timeline.add_hline(
            y=initial_investment,
            line_dash="dash",
            line_color="red",
            annotation_text=f"Full Investment: RM {initial_investment:,.0f}"
        )
        
        fig_timeline.update_layout(
            title="Investment Recovery Over Time",
            xaxis_title="Months",
            yaxis_title="Amount Recovered (RM)",
            hovermode='x unified'
        )
        
        st.plotly_chart(fig_timeline, use_container_width=True)
    else:
        st.error("Business is not currently profitable. Focus on reducing costs or increasing revenue before considering ROI.")
        st.markdown("**Investment Recovery**: Cannot calculate - business is losing money monthly")

# Enhanced Summary Section
st.markdown("---")
st.markdown("### Summary")

# Create comprehensive summary dataframe
summary_data = {
    "Metric": [
        "Weekday Daily Sales", "Weekend Daily Sales", "Monthly Revenue", 
        "Full-time Staff Cost", "Part-time Staff Cost", "Total Staff Cost", 
        "Base Rent", "SST (8%)", "Total Rent", "Electricity", "Water", "Technology Fee", "Royalty Fees", "Marketing Fees",
        "Total Costs", "Net Profit", "Profit Margin"
    ],
    "Value": [
        f"RM {weekday_daily_sales:,.0f}", f"RM {weekend_daily_sales:,.0f}", f"RM {monthly_sales:,.0f}",
        f"RM {fulltime_total:,.0f}", f"RM {parttime_total:,.0f}", f"RM {total_salary:,.0f}",
        f"RM {base_rent:,.0f}", f"RM {sst_amount:,.0f}", f"RM {monthly_rent:,.0f}",
        f"RM {electricity:.0f}", f"RM {water:.0f}", f"RM {tech_fee_rm:.0f}", f"RM {royalty_fee:.0f}", f"RM {marketing_fee:.0f}",
        f"RM {total_fixed_costs:.0f}", f"RM {net_profit:.0f}", f"{profit_margin:.0f}%"
    ]
}

summary_df = pd.DataFrame(summary_data)
summary_df = summary_df.astype(str)
st.dataframe(summary_df, use_container_width=True, hide_index=True)
