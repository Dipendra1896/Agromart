import { useState, useEffect } from 'react';
import { FaUsers, FaSeedling, FaStore, FaShoppingCart, FaExchangeAlt, FaChartLine, FaDollarSign } from 'react-icons/fa';
import authService from '../../api';
import '../../styles/admin/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    buyers: 0,
    farmers: 0,
    suppliers: 0,
    products: 0,
    agriInputs: 0,
    orders: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    buyers: [],
    farmers: [],
    suppliers: [],
    revenue: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('6months');
  
  // Debug layout issues
  useEffect(() => {
    const checkLayout = () => {
      const dashboardContainer = document.querySelector('.dashboard-container');
      if (dashboardContainer) {
        console.log('Dashboard container width:', dashboardContainer.offsetWidth);
        console.log('Window inner width:', window.innerWidth);
        console.log('Body width:', document.body.offsetWidth);
      }
    };
    
    // Check on mount and window resize
    checkLayout();
    window.addEventListener('resize', checkLayout);
    
    return () => window.removeEventListener('resize', checkLayout);
  }, []);

  // Fetch dashboard metrics
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      console.log(`🔄 Fetching dashboard data for timeframe: ${timeframe}`);
      
      try {
        // Pass the timeframe as a parameter to the API
        const response = await authService.getDashboardStats(timeframe);
        
        if (response.success) {
          console.log(`✅ Received data for timeframe ${timeframe}:`, response.data);
          console.log(`📊 Chart labels:`, response.data.monthlyGrowth.labels);
          
          setStats(response.data.stats);
          setRecentActivities(response.data.recentActivities);
          setChartData(response.data.monthlyGrowth);
        } else {
          console.error(`❌ Failed to fetch data for timeframe ${timeframe}:`, response.message);
          setError(response.message || 'Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error(`❌ Error fetching dashboard data for timeframe ${timeframe}:`, error);
        setError('Error fetching dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [timeframe]); // Re-fetch when timeframe changes

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate total revenue
  const calculateTotalRevenue = () => {
    if (!chartData.revenue || chartData.revenue.length === 0) return 0;
    return chartData.revenue.reduce((sum, amount) => sum + amount, 0);
  };

  // Get the month with highest growth
  const getHighestGrowthMonth = () => {
    if (!chartData.labels || chartData.labels.length === 0) return { month: 'N/A', growth: 0 };
    
    let maxGrowth = 0;
    let maxMonth = '';
    
    chartData.labels.forEach((month, index) => {
      const totalGrowth = (chartData.buyers[index] || 0) + 
                         (chartData.farmers[index] || 0) + 
                         (chartData.suppliers[index] || 0);
      
      if (totalGrowth > maxGrowth) {
        maxGrowth = totalGrowth;
        maxMonth = month;
      }
    });
    
    return { month: maxMonth, growth: maxGrowth };
  };

  // Debug chart data
  useEffect(() => {
    console.log("Current chart data:", chartData);
    console.log("Chart data buyers:", chartData.buyers);
    console.log("Chart data labels:", chartData.labels);
    console.log("Chart data revenue:", chartData.revenue);
  }, [chartData]);

  // Handle timeframe change
  const handleTimeframeChange = (e) => {
    const newTimeframe = e.target.value;
    console.log(`Changing timeframe from ${timeframe} to ${newTimeframe}`);
    
    // Clear current chart data to show loading state immediately
    setChartData({
      labels: [],
      buyers: [],
      farmers: [],
      suppliers: [],
      revenue: []
    });
    
    // Show loading indicator immediately
    setLoading(true);
    
    // Update timeframe state
    setTimeframe(newTimeframe);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  // Get highest growth month
  const highestGrowth = getHighestGrowthMonth();

  return (
    <div className="dashboard-container">
      {/* Summary Cards */}
      <div className="dashboard-summary">
        <div className="summary-card revenue">
          <div className="summary-icon">
            <FaDollarSign />
          </div>
          <div className="summary-data">
            <h3>Total Revenue</h3>
            <p className="summary-value">{formatCurrency(calculateTotalRevenue())}</p>
            <p className="summary-sub">Lifetime revenue</p>
          </div>
        </div>
        
        <div className="summary-card growth">
          <div className="summary-icon">
            <FaChartLine />
          </div>
          <div className="summary-data">
            <h3>Highest Growth</h3>
            <p className="summary-value">{highestGrowth.month}</p>
            <p className="summary-sub">{highestGrowth.growth} new users</p>
          </div>
        </div>
        
        <div className="summary-card users">
          <div className="summary-icon">
            <FaUsers />
          </div>
          <div className="summary-data">
            <h3>Total Users</h3>
            <p className="summary-value">{stats.buyers + stats.farmers + stats.suppliers}</p>
            <p className="summary-sub">Active on platform</p>
          </div>
        </div>
        
        <div className="summary-card orders">
          <div className="summary-icon">
            <FaExchangeAlt />
          </div>
          <div className="summary-data">
            <h3>Total Orders</h3>
            <p className="summary-value">{stats.orders}</p>
            <p className="summary-sub">Processed to date</p>
          </div>
        </div>
      </div>
      
      {/* Metrics Cards */}
      <div className="dashboard-metrics">
        <div className="metric-card buyers">
          <div className="metric-icon">
            <FaUsers />
          </div>
          <div className="metric-data">
            <h3>Buyers</h3>
            <p className="metric-value">{stats.buyers}</p>
          </div>
        </div>
        
        <div className="metric-card farmers">
          <div className="metric-icon">
            <FaSeedling />
          </div>
          <div className="metric-data">
            <h3>Farmers</h3>
            <p className="metric-value">{stats.farmers}</p>
          </div>
        </div>
        
        <div className="metric-card suppliers">
          <div className="metric-icon">
            <FaStore />
          </div>
          <div className="metric-data">
            <h3>Suppliers</h3>
            <p className="metric-value">{stats.suppliers}</p>
          </div>
        </div>
        
        <div className="metric-card products">
          <div className="metric-icon">
            <FaShoppingCart />
          </div>
          <div className="metric-data">
            <h3>Products</h3>
            <p className="metric-value">{stats.products}</p>
          </div>
        </div>
        
        <div className="metric-card agri-inputs">
          <div className="metric-icon">
            <FaStore />
          </div>
          <div className="metric-data">
            <h3>Agri Inputs</h3>
            <p className="metric-value">{stats.agriInputs}</p>
          </div>
        </div>
        
        <div className="metric-card orders">
          <div className="metric-icon">
            <FaExchangeAlt />
          </div>
          <div className="metric-data">
            <h3>Orders</h3>
            <p className="metric-value">{stats.orders}</p>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="dashboard-charts">
        {/* User Growth Chart */}
        <div className="chart-container user-growth">
          <div className="chart-header">
            <h3><FaChartLine /> User Growth</h3>
            <select 
              className="chart-timeframe"
              value={timeframe}
              onChange={handleTimeframeChange}
              disabled={loading}
            >
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="chart-content">
            {loading ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '180px',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div className="loading-spinner" style={{ width: '30px', height: '30px' }}></div>
                <div style={{ color: 'var(--text-medium)' }}>Loading {timeframe} data...</div>
              </div>
            ) : chartData.labels && chartData.labels.length > 0 ? (
              <>
                <div className="chart-bars">
                  {chartData.labels.map((month, index) => {
                    // Use actual values from API for bars
                    const buyerValue = chartData.buyers[index] || 0;
                    const farmerValue = chartData.farmers[index] || 0;
                    const supplierValue = chartData.suppliers[index] || 0;
                    
                    // Ensure minimum bar height for visibility when value > 0
                    const buyerHeight = buyerValue > 0 ? Math.max(buyerValue * 4, 8) : 0;
                    const farmerHeight = farmerValue > 0 ? Math.max(farmerValue * 4, 8) : 0; 
                    const supplierHeight = supplierValue > 0 ? Math.max(supplierValue * 4, 8) : 0;
                    
                    return (
                      <div className="chart-bar-group" key={month}>
                        <div 
                          className="chart-bar buyers"
                          style={{ 
                            height: `${buyerHeight}px`,
                            width: '10px',
                            marginRight: '2px'
                          }}
                          title={`Buyers: ${buyerValue}`}
                        ></div>
                        <div 
                          className="chart-bar farmers"
                          style={{ 
                            height: `${farmerHeight}px`,
                            width: '10px',
                            marginRight: '2px'
                          }}
                          title={`Farmers: ${farmerValue}`}
                        ></div>
                        <div 
                          className="chart-bar suppliers"
                          style={{ 
                            height: `${supplierHeight}px`,
                            width: '10px'
                          }}
                          title={`Suppliers: ${supplierValue}`}
                        ></div>
                      </div>
                    );
                  })}
                </div>
                <div className="chart-labels">
                  {chartData.labels.map((month) => (
                    <div className="chart-label" key={month}>{month}</div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '180px',
                color: 'var(--text-medium)',
                fontStyle: 'italic'
              }}>
                No user growth data available for {timeframe}
              </div>
            )}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color buyers"></div>
              <div>Buyers</div>
            </div>
            <div className="legend-item">
              <div className="legend-color farmers"></div>
              <div>Farmers</div>
            </div>
            <div className="legend-item">
              <div className="legend-color suppliers"></div>
              <div>Suppliers</div>
            </div>
          </div>
        </div>
        
        {/* Revenue Chart */}
        <div className="chart-container revenue-chart">
          <div className="chart-header">
            <h3><FaDollarSign /> Revenue</h3>
            <select 
              className="chart-timeframe"
              value={timeframe}
              onChange={handleTimeframeChange}
              disabled={loading}
            >
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="chart-content">
            <div className="chart-area">
              {loading ? (
                // Loading indicator for revenue chart
                <div className="chart-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading {timeframe} data...</p>
                </div>
              ) : chartData.revenue && chartData.revenue.length > 0 ? (
                <svg width="100%" height="200" className="revenue-graph">
                  {/* Background gradient */}
                  <defs>
                    <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  
                  {/* Draw the connecting lines */}
                  <g className="line-segments">
                    {chartData.revenue.map((value, index) => {
                      if (index === 0) return null; // Skip first point (no preceding point)
                      
                      const maxValue = Math.max(...chartData.revenue) || 1;
                      
                      // Previous point
                      const prevX = ((index - 1) / (chartData.revenue.length - 1)) * 100;
                      const prevY = 180 - (chartData.revenue[index - 1] / maxValue) * 160;
                      
                      // Current point
                      const x = (index / (chartData.revenue.length - 1)) * 100;
                      const y = 180 - (value / maxValue) * 160;
                      
                      return (
                        <line 
                          key={`line-${index}`}
                          x1={`${prevX}%`} 
                          y1={prevY} 
                          x2={`${x}%`} 
                          y2={y} 
                          stroke="#4CAF50" 
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </g>
                  
                  {/* Add the area fill */}
                  <path
                    d={`
                      M 0,180
                      ${chartData.revenue.map((value, index) => {
                        const maxValue = Math.max(...chartData.revenue) || 1;
                        const x = (index / (chartData.revenue.length - 1)) * 100;
                        const y = 180 - (value / maxValue) * 160;
                        return index === 0 ? `L ${x}%,${y}` : `L ${x}%,${y}`;
                      }).join(' ')}
                      L 100%,180 Z
                    `}
                    fill="url(#revenueGradient)"
                    opacity="0.5"
                  />
                  
                  {/* Draw the data points last (on top) */}
                  {chartData.revenue.map((value, index) => {
                    const maxValue = Math.max(...chartData.revenue) || 1;
                    const x = (index / (chartData.revenue.length - 1)) * 100;
                    const y = 180 - (value / maxValue) * 160;
                    return (
                      <circle
                        key={`point-${index}`}
                        cx={`${x}%`}
                        cy={y}
                        r="5"
                        fill="white"
                        stroke="#4CAF50"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>
              ) : (
                <div className="no-data-message">
                  No revenue data available for {timeframe}
                </div>
              )}
            </div>
            <div className="chart-labels">
              {chartData.labels.map((month) => (
                <div className="chart-label" key={month}>{month}</div>
              ))}
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color revenue"></div>
              <div>Monthly Revenue (NPR)</div>
            </div>
          </div>
        </div>
        
        {/* Recent Activities */}
        <div className="recent-activities">
          <h3>Recent Activities</h3>
          <div className="activities-list">
            {recentActivities.length > 0 ? (
              // Activities come from backend already sorted by newest first
              recentActivities.map(activity => (
                <div className="activity-item" key={activity.id}>
                  <div className="activity-content">
                    <div className="activity-action">{activity.action}</div>
                    <div className="activity-user">{activity.user}</div>
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              ))
            ) : (
              <div className="no-activities">No recent activities</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 