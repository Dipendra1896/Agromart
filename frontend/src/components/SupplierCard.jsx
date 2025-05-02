import '../styles/SupplierCard.css';
import PropTypes from 'prop-types';


const SupplierCard = ({ supplier, onClick }) => {
  return (
    <div className="supplier-card" onClick={onClick}>
      <div className="supplier-card-content">
        <div className="supplier-profile-pic">
          {/* <img src={supplier.profilePic } alt={supplier.name} /> */}
        </div>
        <div className="supplier-info">
          <h3 className="supplier-name">{supplier.name}</h3>
          <p className="supplier-address">{supplier.address}</p>
          <p className="supplier-company">{supplier.company}</p>
        </div>
      </div>
      <div className="view-products-btn">
        <span>View Agri-Inputs</span>
      </div>
    </div>
  );
};

SupplierCard.propTypes = {
  supplier: PropTypes.shape({
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    profilePic: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired
};

export default SupplierCard; 