import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SupplierCard from './SupplierCard';
import FarmerAgriInputSection from './FarmerAgriInputSection';
import authService from '../api';
import '../styles/SupplierCard.css';

const SuppliersSection = ({ onBuyClick }) => {
  const [viewingAgriInputs, setViewingAgriInputs] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [suppliersData, setSuppliersData] = useState([]);

  // Fetch real suppliers data
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await authService.getSuppliersWithAgriInputs();
        
        if (response.success) {
          console.log('Suppliers with agri-inputs:', response.data);
          setSuppliersData(response.data);
        } else {
          console.error('Failed to fetch suppliers:', response.message);
        }
      } catch (err) {
        console.error('Error fetching suppliers:', err);
      }
    };
    
    fetchSuppliers();
  }, []);
  
  // Use the fetched data or fallback to empty array if no data
  const suppliers = suppliersData.length > 0 ? suppliersData : [];

  // Add scroll detection for agri inputs section when viewing inputs
  useEffect(() => {
    if (viewingAgriInputs) {
      // Setup click handler for Agri Inputs link
      const setupAgriInputLinkHandler = () => {
        // Find the Agri Inputs link in navbar
        const agriInputLinks = document.querySelectorAll('.nav-link');
        agriInputLinks.forEach(link => {
          if (link.textContent === 'Agri Inputs') {
            const parentAnchor = link.closest('a');
            if (parentAnchor) {
              parentAnchor.onclick = function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                document.querySelectorAll('.nav-link').forEach(l => {
                  l.classList.remove('active');
                });
                
                // Set this link as active
                link.classList.add('active');
                
                // Scroll to agri-inputs section
                const agriInputsSection = document.getElementById('agri-inputs');
                if (agriInputsSection) {
                  agriInputsSection.scrollIntoView({ behavior: 'smooth' });
                }
              };
            }
          }
        });
        
        // Also handle footer link
        const footerLinks = document.querySelectorAll('.footer-center ul li a');
        footerLinks.forEach(link => {
          if (link.textContent === 'Agri Inputs') {
            link.onclick = function(e) {
              e.preventDefault();
              
              // Remove active class from all links
              document.querySelectorAll('.nav-link, .footer-center ul li a').forEach(l => {
                l.classList.remove('active');
              });
              
              // Set Agri Inputs link as active in both navbar and footer
              document.querySelectorAll('.nav-link').forEach(l => {
                if (l.textContent === 'Agri Inputs') {
                  l.classList.add('active');
                }
              });
              link.classList.add('active');
              
              // Scroll to agri-inputs section
              const agriInputsSection = document.getElementById('agri-inputs');
              if (agriInputsSection) {
                agriInputsSection.scrollIntoView({ behavior: 'smooth' });
              }
            };
          }
        });
      };
      
      // Add scroll handler to detect when scrolling away from agri-inputs section
      const handleScroll = () => {
        const agriInputsSection = document.getElementById('agri-inputs');
        if (agriInputsSection) {
          const rect = agriInputsSection.getBoundingClientRect();
          // Check if section is visible - more aggressive check to ensure deactivation when scrolling away
          const isVisible = rect.top < window.innerHeight/3 && rect.bottom > window.innerHeight/3;
          
          // Update active state based on visibility
          const navLinks = document.querySelectorAll('.nav-link');
          navLinks.forEach(link => {
            if (link.textContent === 'Agri Inputs') {
              if (isVisible) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            }
          });
          
          // Also update footer
          const footerLinks = document.querySelectorAll('.footer-center ul li a');
          footerLinks.forEach(link => {
            if (link.textContent === 'Agri Inputs') {
              if (isVisible) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            }
          });
        }
      };
      
      // Set up handlers
      setupAgriInputLinkHandler();
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Run initial check when component mounts
      
      // Clean up
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [viewingAgriInputs]);

  const handleCardClick = (supplier) => {
    setSelectedSupplier(supplier);
    setViewingAgriInputs(true);
    
    // Update the nav and footer links from "Agri Input Suppliers" to "Agri Inputs"
    // First, update navbar links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      // Remove active class from all links first
      link.classList.remove('active');
      
      if (link.textContent === 'Agri Input Suppliers') {
        // Change link text to Agri Inputs
        link.textContent = 'Agri Inputs';
        
        // Set this link as active
        link.classList.add('active');
        
        // Also update the href attribute to point to agri-inputs section
        const parentAnchor = link.closest('a');
        if (parentAnchor) {
          const onClick = parentAnchor.getAttribute('onclick');
          if (onClick && onClick.includes('suppliers')) {
            const newOnClick = onClick.replace('suppliers', 'agri-inputs');
            parentAnchor.setAttribute('onclick', newOnClick);
          }
        }
      }
    });
    
    // Then update footer quick links
    const footerLinks = document.querySelectorAll('.footer-center ul li a');
    footerLinks.forEach(link => {
      if (link.textContent === 'Agri Input Suppliers') {
        // Change link text to Agri Inputs
        link.textContent = 'Agri Inputs';
        
        // Set this link as active
        link.classList.add('active');
        
        // Also update the onClick handler
        const onClick = link.getAttribute('onclick');
        if (onClick && onClick.includes('suppliers')) {
          const newOnClick = onClick.replace('suppliers', 'agri-inputs');
          link.setAttribute('onclick', newOnClick);
        }
      } else {
        // Remove active class from other links
        link.classList.remove('active');
      }
    });
    
    // Update page title for better user experience
    document.title = `${supplier.name}'s Agri Inputs | AgroMart`;
    
    // Set timeout to check visibility and set active state after render
    setTimeout(() => {
      const agriInputsSection = document.getElementById('agri-inputs');
      if (agriInputsSection) {
        const rect = agriInputsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight/2 && rect.bottom > 200;
        
        // Only set active if agri-inputs section is visible
        if (isVisible) {
          navLinks.forEach(link => {
            if (link.textContent === 'Agri Inputs') {
              link.classList.add('active');
            }
          });
          
          footerLinks.forEach(link => {
            if (link.textContent === 'Agri Inputs') {
              link.classList.add('active');
            }
          });
        }
      }
    }, 100);
  };

  const handleBackClick = () => {
    setViewingAgriInputs(false);
    setSelectedSupplier(null);
    
    // Change the link text back from "Agri Inputs" to "Agri Input Suppliers"
    // First, update navbar links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      // Remove active class from all links first
      link.classList.remove('active');
      
      if (link.textContent === 'Agri Inputs') {
        // Change link text back to Agri Input Suppliers
        link.textContent = 'Agri Input Suppliers';
        
        // Set this link as active since we're viewing suppliers list now
        link.classList.add('active');
        
        // Also update the href attribute back to suppliers section
        const parentAnchor = link.closest('a');
        if (parentAnchor) {
          const onClick = parentAnchor.getAttribute('onclick');
          if (onClick && onClick.includes('agri-inputs')) {
            const newOnClick = onClick.replace('agri-inputs', 'suppliers');
            parentAnchor.setAttribute('onclick', newOnClick);
          }
        }
      }
    });
    
    // Then update footer quick links
    const footerLinks = document.querySelectorAll('.footer-center ul li a');
    footerLinks.forEach(link => {
      if (link.textContent === 'Agri Inputs') {
        // Change link text back to Agri Input Suppliers
        link.textContent = 'Agri Input Suppliers';
        
        // Set this link as active in footer as well
        link.classList.add('active');
        
        // Also update the onClick handler
        const onClick = link.getAttribute('onclick');
        if (onClick && onClick.includes('agri-inputs')) {
          const newOnClick = onClick.replace('agri-inputs', 'suppliers');
          link.setAttribute('onclick', newOnClick);
        }
      } else {
        // Remove active class from other links
        link.classList.remove('active');
      }
    });
    
    // Restore original document title
    document.title = 'AgroMart';
    
    // Scroll to suppliers section to ensure it's visible
    const suppliersSection = document.getElementById('suppliers');
    if (suppliersSection) {
      suppliersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (viewingAgriInputs && selectedSupplier) {
    return (
      <div id="agri-inputs" className="agri-inputs-section">
        <FarmerAgriInputSection 
          supplierName={selectedSupplier}
          onBackClick={handleBackClick}
          onBuyClick={onBuyClick}
        />
      </div>
    );
  }

  return (
    <section id="suppliers" className="suppliers-section">
      <div className="section-header">
        <h2>Agri-Input Suppliers</h2>
        <p>Browse profiles and agri-inputs from our trusted supply partners</p>
      </div>

      <div className="suppliers-container">
        {suppliers.map(supplier => (
          <SupplierCard 
            key={supplier.id} 
            supplier={supplier} 
            onClick={() => handleCardClick(supplier)} 
          />
        ))}
      </div>
    </section>
  );
};

SuppliersSection.propTypes = {
  onBuyClick: PropTypes.func
};

export default SuppliersSection; 