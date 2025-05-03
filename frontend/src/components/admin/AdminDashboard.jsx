import { useState, useEffect } from 'react';
import BuyerManagement from './BuyerManagement';
import FarmerManagement from './FarmerManagement';
import SupplierManagement from './SupplierManagement';
import Dashboard from './Dashboard';
import '../../styles/admin/AdminDashboard.css';
import { FaUsers, FaSeedling, FaStore, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import authService from '../../api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Set document title
  useEffect(() => {
    document.title = 'AgroMart | Admin Dashboard';

    // Check if user is admin
    const checkAdminAuth = async () => {
      const response = await authService.checkAuthStatus();
      
      if (!response.success || response.userType !== 'admin') {
        console.log('Unauthorized access attempt to admin dashboard');
        navigate('/');
      }
    };
    
    checkAdminAuth();
  }, [navigate]);

  return (
    <div className="admin-container" style={{ width: '100vw', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>{!sidebarCollapsed && 'AgroMart'}</h2>
          <button 
            className="toggle-sidebar" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '»' : '«'}
          </button>
        </div>
        
        <div className="sidebar-menu">
          <div 
            className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaChartBar />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </div>
          
          <div 
            className={`sidebar-item ${activeTab === 'buyers' ? 'active' : ''}`}
            onClick={() => setActiveTab('buyers')}
          >
            <FaUsers />
            {!sidebarCollapsed && <span>Buyers</span>}
          </div>
          
          <div 
            className={`sidebar-item ${activeTab === 'farmers' ? 'active' : ''}`}
            onClick={() => setActiveTab('farmers')}
          >
            <FaSeedling />
            {!sidebarCollapsed && <span>Farmers</span>}
          </div>
          
          <div 
            className={`sidebar-item ${activeTab === 'suppliers' ? 'active' : ''}`}
            onClick={() => setActiveTab('suppliers')}
          >
            <FaStore />
            {!sidebarCollapsed && <span>Suppliers</span>}
          </div>
        </div>
        
        <div className="sidebar-footer">
          <div className="sidebar-item" onClick={handleLogout}>
            <FaSignOutAlt />
            {!sidebarCollapsed && <span>Logout</span>}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="admin-content-wrapper" style={{ width: sidebarCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 250px)', maxWidth: '100%' }}>
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-title">
            <h1>
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'buyers' && 'Buyer Management'}
              {activeTab === 'farmers' && 'Farmer Management'}
              {activeTab === 'suppliers' && 'Supplier Management'}
            </h1>
          </div>
          <div className="admin-header-user">
            <div className="admin-avatar">A</div>
            <div className="admin-user-info">
              <span className="admin-user-name">Admin</span>
              <span className="admin-user-role">System Administrator</span>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="admin-main-content" style={{ width: '100%', maxWidth: '100%' }}>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'buyers' && <BuyerManagement />}
          {activeTab === 'farmers' && <FarmerManagement />}
          {activeTab === 'suppliers' && <SupplierManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
