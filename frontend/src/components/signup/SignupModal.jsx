import React, { useState } from 'react';
import { FaTimes, FaUserAlt, FaLeaf, FaStore } from 'react-icons/fa';
import FarmerSignupForm from './FarmerSignupForm';
import BuyerSignupForm from './BuyerSignupForm';
import SupplierSignupForm from './SupplierSignupForm';

const SignupModal = ({ isOpen, onClose }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };
  
  const handleBack = () => {
    setSelectedRole(null);
  };
  
  // If the modal is not open, don't render anything
  if (!isOpen) return null;
  
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // backgroundColor: 'rgba(0, 0, 0, 0.6)',  // dark translucent overlay for popup effect
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1100,
      // backdropFilter: 'blur(4px)',
      // WebkitBackdropFilter: 'blur(4px)'
    },
    modal: {
      background: 'linear-gradient(135deg, #e8f5e9, #ffffff)',  // gentle green-white gradient
      borderRadius: '16px',
      padding: '24px',
      // paddingLeft: '24px',
      // paddingRight: '24px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
      width: '100%',
      maxWidth: '480px',
      height: 'auto',
      maxHeight: '90vh',
      // marginLeft: '-30px',
      position: 'relative',
      boxSizing: 'border-box',
      overflowY: 'auto',
      // border: '4px solid #4CAF50',  // green border for agricultural theme
      // boxShadow: '0 0 15px #4CAF50'
    },
    closeButton: {
      position: 'absolute',
      outline: 'none',
      top: '8px',
      right: '8px',
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#0d3c61',
      fontWeight: 'bold',
      zIndex: 10,
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px'
    },
    title: {
      textAlign: 'center',
      color: '#1b5e20',  // darker forest green
      fontSize: '22px',
      fontWeight: 'bold',
      marginBottom: '12px',
      marginTop: '0'
    },
    roleSelectionContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    roleCard: {
      borderRadius: '8px',
      border: '2px solid #A5D6A7',  // light green border
      overflow: 'hidden',
      // width: '20rem',
      cursor: 'pointer',
      // paddingLeft: '30px',    
      // paddingRight: '24px',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column'
    },
    roleHeader: {
      background: 'linear-gradient(135deg, #A5D6A7, #E6EE9C)',  // bright gradient
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    roleIcon: {
      fontSize: '18px',
      color: '#2e7d32',  // forest green icon
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    roleName: {
      margin: 0,
      fontSize: '14px',
      fontWeight: '600',
      color: '#333',
      textTransform: 'uppercase'
    },
    roleDescription: {
      backgroundColor: '#f1f8e9',  // subtle green tint
      padding: '8px',
      borderTop: '1px solid #C8E6C9',
      color: '#666',
      margin: 0,
      fontSize: '11px',
      textAlign: 'center',
      textTransform: 'uppercase'
    },
    formContainer: {
      width: '100%',
      boxSizing: 'border-box',
      maxHeight: 'calc(90vh - 40px)',
      overflow: 'visible'
    },
    roleCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
    }
  };
  
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          ×
        </button>
        
        {!selectedRole ? (
          <>
            <h2 style={styles.title}><FaLeaf style={{marginRight: '8px', color: '#4CAF50'}}/>Choose Your Role</h2>
            <div style={styles.roleSelectionContainer}>
              {/* Buyer Card */}
              <div 
                style={styles.roleCard} 
                onClick={() => handleRoleSelect('buyer')}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = '#F1F8E9';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={styles.roleHeader}>
                  <div style={styles.roleIcon}>
                    <FaUserAlt />
                  </div>
                  <h3 style={styles.roleName}>Buyer</h3>
                </div>
                <p style={styles.roleDescription}>
                  Purchase farm products directly from farmers
                </p>
              </div>
              
              {/* Farmer Card */}
              <div 
                style={styles.roleCard} 
                onClick={() => handleRoleSelect('farmer')}
                onMouseOver={e => {
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={styles.roleHeader}>
                  <div style={styles.roleIcon}>
                    <FaLeaf />
                  </div>
                  <h3 style={styles.roleName}>Farmer</h3>
                </div>
                <p style={styles.roleDescription}>
                  Sell your farm products and connect with buyers
                </p>
              </div>
              
              {/* Supplier Card */}
              <div 
                style={styles.roleCard} 
                onClick={() => handleRoleSelect('supplier')}
                onMouseOver={e => {
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={styles.roleHeader}>
                  <div style={styles.roleIcon}>
                    <FaStore />
                  </div>
                  <h3 style={styles.roleName}>Supplier</h3>
                </div>
                <p style={styles.roleDescription}>
                  Provide agricultural inputs and supplies to farmers
                </p>
              </div>
            </div>
          </>
        ) : (
          <div style={styles.formContainer}>
            {selectedRole === 'farmer' && <FarmerSignupForm onBack={handleBack} />}
            {selectedRole === 'buyer' && <BuyerSignupForm onBack={handleBack} />}
            {selectedRole === 'supplier' && <SupplierSignupForm onBack={handleBack} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupModal; 