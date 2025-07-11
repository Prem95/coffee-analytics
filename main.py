try:
    import streamlit as st
    import pandas as pd
    import plotly.express as px
    import plotly.graph_objects as go
    import numpy as np
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
    "LG 15 + 14 (666 sqft)": {
        "unit": "LG 15 + 14",
        "sqft": 666,
        "y1_rate": 9,
        "y2_rate": 10,
        "y3_rate": 11,
        "y1_rent": 666 * 9,
        "y2_rent": 666 * 10,
        "y3_rent": 666 * 11,
        "renovation_months": 3,
    }
}

# Sidebar with modern design
with st.sidebar:
    st.markdown("### Settings")
    
    # Location Selection
    with st.expander("📍 Location", expanded=True):
        # Since there's only one location, auto-select it
        selected_location = list(location_options.keys())[0]
        location_info = location_options[selected_location]
        
        st.markdown(f"**Selected Unit**: {location_info['unit']}")
        st.markdown(f"**Size**: {location_info['sqft']} sqft")
        
        # Year selection
        selected_year = st.selectbox(
            "Lease Year",
            options=["Year 1", "Year 2", "Year 3"],
            help="Select which year of the lease to analyze. Rental rates may vary by year."
        )
        
        # Signing period
        col_month, col_year = st.columns(2)
        with col_month:
            signing_month = st.selectbox(
                "Signing Month",
                options=["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                index=7,  # August
                help="Month when lease agreement is signed"
            )
        with col_year:
            signing_year = st.number_input(
                "Signing Year",
                value=2025,
                min_value=2024,
                max_value=2030,
                step=1,
                help="Year when lease agreement is signed"
            )
        
        renovation_months = location_info['renovation_months']
        st.info(f"**Renovation Period**: {renovation_months} months rent-free from {signing_month} {signing_year}")
        
        # Get current year's rate and rent
        year_mapping = {"Year 1": "y1", "Year 2": "y2", "Year 3": "y3"}
        current_year = year_mapping[selected_year]
        current_rate = location_info[f"{current_year}_rate"]
        current_rent = location_info[f"{current_year}_rent"]
        
        # Show all year rates for comparison
        st.markdown("**All Years:**")
        st.markdown(f"Y1: RM {location_info['y1_rate']}/sqft (RM {location_info['y1_rent']:,})")
        st.markdown(f"Y2: RM {location_info['y2_rate']}/sqft (RM {location_info['y2_rent']:,})")
        st.markdown(f"Y3: RM {location_info['y3_rate']}/sqft (RM {location_info['y3_rent']:,})")
    
    # Revenue Settings
    with st.expander("Revenue", expanded=True):
        transactions_per_day = st.number_input(
            "Daily Transactions", 
            min_value=10, max_value=50, value=20, step=1,
            help="Average number of customers served per day. This directly affects your total revenue: Daily Transactions × Avg Transaction × Operating Days = Monthly Sales"
        )
        avg_transaction_value = st.number_input(
            "Avg Transaction (RM)", 
            value=20.0, step=1.0, min_value=1.0,
            help="Average amount each customer spends per visit. Higher values mean more revenue per customer. Example: RM 20 means each customer spends RM 20 on average"
        )
        days_open = st.slider(
            "Operating Days/Month", 
            min_value=20, max_value=31, value=30,
            help="Number of days your coffee shop operates per month. More operating days = more potential revenue, but also higher variable costs"
        )
    
    # Cost Settings
    with st.expander("Operating Costs", expanded=True):
        # Use selected location and year rent (read-only display)
        st.markdown(f"**Monthly Rent**: RM {current_rent:,}")
        st.caption(f"Based on {location_info['unit']} {selected_year}: {location_info['sqft']} sqft × RM {current_rate}/sqft")
        monthly_rent = current_rent  # Set from location and year selection
        
        employee_count = st.slider(
            "Number of Employees", 
            1, 3, value=1,
            help="Total number of staff members. More employees can serve more customers but increase labor costs. Total salary cost = Number of Employees × Salary per Employee"
        )
        employee_salary = st.number_input(
            "Salary per Employee (RM)", 
            value=1800, step=100, min_value=0,
            help="Monthly salary paid to each employee. This excludes benefits, EPF, SOCSO. In Malaysia, minimum wage varies by state (~RM 1,500-1,700 as of 2025)"
        )
        
        electricity = st.number_input(
            "Electricity (RM)", 
            value=300, step=100, min_value=0,
            help="Monthly electricity bill. Coffee shops use power for espresso machines, grinders, lighting, air conditioning. Varies based on equipment and operating hours"
        )
        water = st.number_input(
            "Water (RM)", 
            value=100, step=100, min_value=0,
            help="Monthly water bill. Used for coffee brewing, cleaning, and customer consumption. Generally lower than electricity costs"
        )
        
    # Store Fees
    with st.expander("Store Fees"):
        tech_fee_usd = st.number_input(
            "Tech Fee (USD)", 
            value=150.0, step=10.0, min_value=0.0,
            help="Monthly technology costs in USD (POS systems, software subscriptions, payment processing). Will be converted to RM using the exchange rate below"
        )
        usd_to_rm = st.number_input(
            "USD to RM Rate", 
            value=4.28, step=0.01, min_value=1.0,
            help="Current USD to Malaysian Ringgit exchange rate. Used to convert tech fees from USD to RM. Check current rates online (typically 4.2-4.7 range)"
        )
        royalty_percent = st.slider(
            "Royalty (%)", 
            0.0, 15.0, value=5.5, step=0.1,
            help="Franchise royalty percentage of gross sales. If you're franchising a brand, they typically charge 3-8% of total revenue. Set to 0% if you own your brand independently"
        )
        marketing_percent = st.number_input(
            "Marketing (%)", 
            value=0.5, step=0.1, min_value=0.0, max_value=5.0,
            help="Fixed marketing expense as percentage of gross sales. Covers advertising, promotions, social media marketing, and brand building activities. Typically 0.5-2% of revenue"
        )

# Calculations
tech_fee_rm = tech_fee_usd * usd_to_rm
monthly_sales = transactions_per_day * avg_transaction_value * days_open
royalty_fee = (royalty_percent / 100) * monthly_sales
marketing_fee = (marketing_percent / 100) * monthly_sales
total_salary = employee_count * employee_salary

# Calculate renovation savings (only applies to Year 1)
if selected_year == "Year 1":
    renovation_savings = current_rent * renovation_months
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
col1, col2, col3, col4, col5 = st.columns(5)

with col1:
    st.metric(
        label="Monthly Revenue",
        value=f"RM {monthly_sales:,.0f}",
        help="Total sales before expenses. Formula: Daily Transactions × Avg Transaction × Operating Days"
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

with col4:
    renovation_benefit_color = "normal" if monthly_renovation_benefit > 0 else "inverse"
    st.metric(
        label="Adjusted Profit",
        value=f"RM {adjusted_profit:,.0f}",
        delta=f"+RM {monthly_renovation_benefit:,.0f} renovation benefit",
        delta_color=renovation_benefit_color,
        help=f"Net profit including {renovation_months}-month rent-free benefit spread over 12 months"
    )

with col5:
    margin_color = "normal" if adjusted_margin >= 0 else "inverse"
    st.metric(
        label="Adjusted Margin",
        value=f"{adjusted_margin:.1f}%",
        delta=f"+{adjusted_margin - profit_margin:.1f}%",
        delta_color=margin_color,
        help="Profit margin including renovation savings benefit"
    )

# Renovation Benefit Summary
if selected_year == "Year 1" and monthly_renovation_benefit > 0:
    st.success(f"💰 **Year 1 Renovation Savings**: RM {renovation_savings:,} total ({renovation_months} months × RM {current_rent:,}) = +RM {monthly_renovation_benefit:,.0f} monthly benefit")
elif selected_year == "Year 1":
    st.info("ℹ️ No renovation benefit calculated")
else:
    st.info(f"ℹ️ **{selected_year}**: No renovation benefit (rent-free period was in Year 1 only)")

tab1, tab2 = st.tabs(["Cost Analysis", "Investment & ROI"])

with tab1:
    col1, col2 = st.columns([2, 1])

    with col1:
        # Interactive Pie Chart with Plotly
        cost_data = {
            'Category': ['Rent', 'Salaries', 'Electricity', 'Water', 'Tech Fee', 'Royalties', 'Marketing'],
            'Amount': [monthly_rent, total_salary, electricity, water, tech_fee_rm, royalty_fee, marketing_fee],
            'Percentage': [
                (monthly_rent/total_fixed_costs*100) if total_fixed_costs > 0 else 0,
                (total_salary/total_fixed_costs*100) if total_fixed_costs > 0 else 0,
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
                st.markdown(f"**{category}**: RM {amount:,.0f} ({percentage:.1f}%)")

with tab2:
    st.markdown("#### Investment Analysis")
    
    # Investment input
    col1, col2 = st.columns(2)
    
    with col1:
        initial_investment = st.number_input(
            "Initial Investment (RM)",
            value=150000,
            step=10000,
            min_value=0,
            help="Total upfront investment including equipment, renovation, initial inventory, licensing, and working capital"
        )
    
    with col2:
        # Calculate ROI metrics
        if net_profit > 0:
            payback_months = initial_investment / net_profit
            payback_years = payback_months / 12
            annual_roi = (net_profit * 12 / initial_investment) * 100
        else:
            payback_months = float('inf')
            payback_years = float('inf')
            annual_roi = 0
    
    # ROI Metrics Display
    st.markdown("---")
    st.markdown("#### ROI Metrics")
    
    roi_col1, roi_col2, roi_col3, roi_col4 = st.columns(4)
    
    with roi_col1:
        st.metric(
            "Payback Period",
            f"{payback_months:.1f} months" if payback_months != float('inf') else "Never",
            help="Time needed to recover initial investment based on current monthly profit"
        )
    
    with roi_col2:
        st.metric(
            "Payback in Years",
            f"{payback_years:.1f} years" if payback_years != float('inf') else "Never",
            help="Payback period expressed in years"
        )
    
    with roi_col3:
        st.metric(
            "Annual ROI",
            f"{annual_roi:.1f}%" if annual_roi > 0 else "0.0%",
            help="Return on Investment per year as percentage of initial investment"
        )
    
    with roi_col4:
        break_even_point = "Month 1" if net_profit > 0 else "Not Profitable"
        st.metric(
            "Monthly Break-even",
            break_even_point,
            help="When monthly operations become profitable (excluding initial investment recovery)"
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
        "Daily Transactions", "Avg Transaction Value", "Operating Days", 
        "Monthly Revenue", "Staff Salaries", "Rent",
        "Electricity", "Water", "Technology Fee", "Royalty Fees", "Marketing Fees",
        "Total Costs", "Net Profit", "Profit Margin"
    ],
    "Value": [
        f"{transactions_per_day:,}", f"RM {avg_transaction_value:.2f}", f"{days_open}",
        f"RM {monthly_sales:,.2f}", f"RM {total_salary:,.2f}", f"RM {monthly_rent:,.2f}",
        f"RM {electricity:.2f}", f"RM {water:.2f}", f"RM {tech_fee_rm:.2f}", f"RM {royalty_fee:.2f}", f"RM {marketing_fee:.2f}",
        f"RM {total_fixed_costs:.2f}", f"RM {net_profit:.2f}", f"{profit_margin:.2f}%"
    ]
}

summary_df = pd.DataFrame(summary_data)
summary_df = summary_df.astype(str)
st.dataframe(summary_df, use_container_width=True, hide_index=True)
