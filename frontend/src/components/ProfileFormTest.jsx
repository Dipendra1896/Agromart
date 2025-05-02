import React, { useState } from 'react';
import ProfileEditForm from './ProfileEditForm';

const ProfileFormTest = () => {
  const [showBuyerForm, setShowBuyerForm] = useState(false);
  const [showFarmerForm, setShowFarmerForm] = useState(false);
  const [showSupplierForm, setShowSupplierForm] = useState(false);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Profile Form Test</h1>
      <p>Click the buttons below to test the profile form with different user types</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setShowBuyerForm(true)}
          style={{ padding: '0.5rem 1rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Show Buyer Form
        </button>
        <button 
          onClick={() => setShowFarmerForm(true)}
          style={{ padding: '0.5rem 1rem', background: '#15803d', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Show Farmer Form
        </button>
        <button 
          onClick={() => setShowSupplierForm(true)}
          style={{ padding: '0.5rem 1rem', background: '#0369a1', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Show Supplier Form
        </button>
      </div>
      
      {/* Buyer Form */}
      {showBuyerForm && (
        <ProfileEditForm 
          onClose={() => setShowBuyerForm(false)} 
          userType="buyer"
        />
      )}
      
      {/* Farmer Form */}
      {showFarmerForm && (
        <ProfileEditForm 
          onClose={() => setShowFarmerForm(false)} 
          userType="farmer"
        />
      )}
      
      {/* Supplier Form */}
      {showSupplierForm && (
        <ProfileEditForm 
          onClose={() => setShowSupplierForm(false)} 
          userType="supplier"
        />
      )}
    </div>
  );
};

export default ProfileFormTest; 