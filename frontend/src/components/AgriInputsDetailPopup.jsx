import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaShoppingCart, FaArrowUp, FaArrowDown, FaCheck, FaUser } from 'react-icons/fa';
import '../styles/ProductDetailPopup.css';

const AgriInputsDetailPopup = ({ product, onAddToCart, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const incrementQuantity = () => {
    // Don't allow incrementing beyond available quantity
    if (quantity < product.quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    // Add to cart
    onAddToCart(product, quantity);
    
    // Show success message
    setShowSuccess(true);
    
    // Auto-hide success message after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };

  // Function to format price with unit
  const formatPrice = (price, unit) => {
    return `NRs. ${price} per ${unit}`;
  };

  // Function to get category-specific title
  const getCategoryTitle = () => {
    switch (product.category) {
      case 'seeds':
        return 'Seed Details';
      case 'fertilizers':
        return 'Fertilizer Details';
      case 'tools':
        return 'Tool Details';
      default:
        return 'Agri-Input Details';
    }
  };

  // Helper to get supplier name
  const getSupplierName = () => {
    if (!product.supplierEmail) return 'Unknown Supplier';
    
    // If supplier is an object
    if (product.supplier && typeof product.supplier === 'object') {
      return product.supplier.name || product.supplier.company || product.supplierEmail;
    }
    
    return product.supplierEmail;
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        {showSuccess && (
          <div className="success-popup-message">
            <div className="success-popup-icon">
              <FaCheck />
            </div>
            <div className="success-popup-text">
              <p>Added Successfully!</p>
              <p className="success-product-name">{product.name}</p>
            </div>
          </div>
        )}
        
        <div className="popup-header">
          <h2>{getCategoryTitle()}</h2>
          <button className="btn-close-popup" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="popup-content">
          <div className="product-image">
            {product.image && product.image.name ? (
              <img 
                src={`http://localhost:500/uploads/products/${product.image.name}`}
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.png';
                }}
              />
            ) : (
              <div className="no-image">No image</div>
            )}
          </div>
          
          <div className="product-details">
            <h2>{product.name}</h2>
            <p className="price">{formatPrice(product.price, product.unit)}</p>
            
            {/* Display supplier information */}
            <div className="supplier-info">
              <FaUser /> <span>From: {getSupplierName()}</span>
            </div>
            
            {/* Display available quantity */}
            <p className="available-quantity">Available: {product.quantity} {product.unit}</p>
            
            <div className="quantity-section">
              <h3>Quantity</h3>
              <div className="quantity-controls">
                <div className="quantity-input">
                  <input 
                    type="text" 
                    value={quantity} 
                    readOnly 
                  />
                  <div className="quantity-arrows">
                    <button 
                      onClick={incrementQuantity}
                      disabled={quantity >= product.quantity}
                    >
                      <FaArrowUp />
                    </button>
                    <button onClick={decrementQuantity}>
                      <FaArrowDown />
                    </button>
                  </div>
                </div>
                <div className="total-price">
                  NRs. {product.price * quantity}
                </div>
              </div>
            </div>
            
            <button 
              className="add-to-cart-btn" 
              onClick={handleAddToCart}
              disabled={product.quantity <= 0}
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

AgriInputsDetailPopup.propTypes = {
  product: PropTypes.object.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AgriInputsDetailPopup; 
