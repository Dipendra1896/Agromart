import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import '../styles/ProductSection.css'; // Reusing the same CSS
import authService from '../api';
import DeleteConfirmationPopup from './DeleteConfirmationPopup';

const AgriInputsSection = ({supplierName}) => {
  const [activeTab, setActiveTab] = useState('seeds');
  const [seeds, setSeeds] = useState([]);
  const [fertilizers, setFertilizers] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [inputToDelete, setInputToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Polling interval in milliseconds (1 seconds)
  const POLLING_INTERVAL = 1000;

  // Function to fetch agri-inputs wrapped in useCallback to prevent unnecessary recreations
  const fetchAgriInputs = useCallback(async (showLoading = true) => {
    // Only show loading indicator on initial load, not during polling updates
    if (showLoading) {
      setLoading(true);
    }
    
    try {
      // If supplierName is provided, use it (for when viewing specific supplier's products)
      // Otherwise, get from localStorage (for supplier viewing their own products)
      let supplierEmail = '';
      
      if (supplierName && supplierName.email) {
        // For buyer dashboard when viewing a specific supplier's inputs
        supplierEmail = supplierName.email;
        console.log("Fetching agri-inputs for supplier:", supplierName.name);
      } else {
        // For supplier dashboard viewing their own inputs
        const userDataString = localStorage.getItem('userData');
        
        if (!userDataString) {
          setError('You must be logged in to view your agri-inputs');
          setLoading(false);
          return;
        }
        
        const userData = JSON.parse(userDataString);
        supplierEmail = userData.email;
        console.log("Fetching agri-inputs for logged in supplier:", userData.name);
      }
      
      // Fetch agri-inputs
      if (supplierEmail) {
        const response = await authService.getAgriInputsBySupplierEmail(supplierEmail);
        
        if (response.success) {
          // Log a sample input to inspect its structure
          if (response.data.seeds && response.data.seeds.length > 0) {
            console.log("Sample seed:", response.data.seeds[0]);
          }
          
          setSeeds(response.data.seeds || []);
          setFertilizers(response.data.fertilizers || []);
          setTools(response.data.tools || []);
          setError('');
        } else {
          setError(response.message || 'Failed to fetch agri-inputs');
        }
      } else {
        setError('Supplier email not found');
      }
    } catch (err) {
      setError('An error occurred while fetching agri-inputs');
      console.error(err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [supplierName]);

  // Initial data fetch and set up polling
  useEffect(() => {
    // Initial data fetch with loading state
    fetchAgriInputs(true);
    
    // Set up polling for regular updates
    const pollingInterval = setInterval(() => {
      // During polling updates, don't show loading indicator
      fetchAgriInputs(false);
    }, POLLING_INTERVAL);
    
    // Cleanup function to clear the interval when component unmounts
    return () => {
      clearInterval(pollingInterval);
    };
  }, [fetchAgriInputs]); // Re-run when fetchAgriInputs changes (which depends on supplierName)

  // Determine if this is a farmer or supplier dashboard
  // const isFarmer = dashboardType === 'farmer';
  
  // Set appropriate text based on dashboard type
  // const availabilityText = isFarmer ? 'PURCHASE' : 'SALE';


 

  const handleDeleteClick = (input) => {
    setInputToDelete(input);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async (inputId) => {
    try {
      const userDataString = localStorage.getItem('userData');
      const userData = JSON.parse(userDataString);
      const supplierEmail = userData?.email;
      
      if (!supplierEmail) {
        setError('User information not found. Please login again.');
        return;
      }
      
      await authService.deleteAgriInput(inputId, supplierEmail);
      
      // Update the local state to remove the deleted agri-input
      setSeeds(prevSeeds => prevSeeds.filter(input => input._id !== inputId));
      setFertilizers(prevFertilizers => prevFertilizers.filter(input => input._id !== inputId));
      setTools(prevTools => prevTools.filter(input => input._id !== inputId));
      
      setShowDeletePopup(false);
      setSuccessMessage(`${inputToDelete.name} has been successfully deleted.`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete agri-input');
      setShowDeletePopup(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setInputToDelete(null);
  };

  // Function to format price with unit
  const formatPrice = (price, unit) => {
    return `NRs.${price} per ${unit}`;
  };

  // Function to display the correct image based on our database structure
  const renderImage = (product) => {
    // Make sure product and image exist
    if (!product || !product.image) {
      return <div className="no-image">No image</div>;
    }

    // If image is stored with path and name (our multer implementation)
    if (product.image.path && product.image.name) {
      return <img 
        src={`http://localhost:500/uploads/products/${product.image.name}`} 
        alt={product.name} 
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/placeholder-image.png'; // Fallback image
        }}
      />;
    }

    // Fallback to older image storage formats
    if (typeof product.image === 'string') {
      return <img src={product.image} alt={product.name} />;
    }

    // Fallback
    return <div className="no-image">Image format not supported</div>;
  };

  const getProducts = () => {
    switch (activeTab) {
      case 'seeds':
        return seeds;
      case 'fertilizers':
        return fertilizers;
      case 'tools':
        return tools;
      default:
        return seeds;
    }
  };

  return (
    <section id="agri-inputs" className="agri-inputs-section">
      <div className="product-container">
        <div className="product-tabs">
          <button 
            className={`tab-btn ${activeTab === 'seeds' ? 'active' : ''}`}
            onClick={() => setActiveTab('seeds')}
          >
            SEEDS
          </button>
          <button 
            className={`tab-btn ${activeTab === 'fertilizers' ? 'active' : ''}`}
            onClick={() => setActiveTab('fertilizers')}
          >
            FERTILIZERS
          </button>
          <button 
            className={`tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
            onClick={() => setActiveTab('tools')}
          >
            TOOLS
          </button>
        </div>

        {supplierName && supplierName.name && (
          <h3 className="supplier-products-heading">
            Agri-Inputs from {supplierName.name}
          </h3>
        )}

        <h2>{activeTab.toUpperCase()} AVAILABLE FOR SALE</h2>

        {loading ? (
          <div className="loading-message">Loading agri-inputs...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="product-grid">
            {getProducts().length > 0 ? (
              getProducts().map(product => (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    {renderImage(product)}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>{formatPrice(product.price, product.unit)}</p>
                    <p>Quantity: {product.quantity} {product.unit}</p>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteClick(product)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products-message">
                <p>No {activeTab} available.</p>
              </div>
            )}
          </div>
        )}

        {successMessage && (
          <div className="success-delete-message">
            {successMessage}
          </div>
        )}

        {showDeletePopup && inputToDelete && (
          <DeleteConfirmationPopup
            product={inputToDelete}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </div>
    </section>
  );
};

AgriInputsSection.propTypes = {
  // dashboardType: PropTypes.string,
  supplierName: PropTypes.object,
  onBackClick: PropTypes.func
};

export default AgriInputsSection; 