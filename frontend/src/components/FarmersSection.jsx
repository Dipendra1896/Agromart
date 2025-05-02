import { useState, useEffect, useCallback } from 'react';
import FarmerCard from './FarmerCard';
import BuyerProductSection from './BuyerProductSection';
import authService from '../api';
import '../styles/FarmerCard.css';
import PropTypes from 'prop-types';

const FarmersSection = ({ onBuyClick }) => {
  const [viewingProducts, setViewingProducts] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [farmersData, setFarmersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const POLLING_INTERVAL = 1000; // Check for updates every 1 seconds

  // Function to fetch farmers data without showing loading state
  const refreshFarmersData = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      const response = await authService.getFarmersWithProducts();
      
      if (response.success) {
        console.log('Farmers data refreshed:', response.data);
        // Check if we have new farmers by comparing the data
        const currentCount = farmersData.length;
        const newCount = response.data.length;
        
        if (newCount !== currentCount) {
          console.log(`Farmers count changed: ${currentCount} → ${newCount}`);
        }
        
        setFarmersData(response.data);
      } else {
        console.error('Failed to refresh farmers:', response.message);
        if (showLoading) {
          setError(response.message || 'Failed to fetch farmers');
        }
      }
    } catch (err) {
      console.error('Error refreshing farmers:', err);
      if (showLoading) {
        setError('Error loading farmers data');
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [farmersData.length]);

  // Initial data fetch
  useEffect(() => {
    refreshFarmersData(true);
  }, [refreshFarmersData]);
  
  // Set up polling to automatically detect new farmers
  useEffect(() => {
    if (viewingProducts) {
      return; // Don't poll when viewing products
    }
    
    // Poll for new farmers
    const pollingInterval = setInterval(() => {
      refreshFarmersData(false);
    }, POLLING_INTERVAL);
    
    // Clean up on unmount or when switching to product view
    return () => clearInterval(pollingInterval);
  }, [viewingProducts, farmersData.length, refreshFarmersData]);
  
  // Setup scroll handler for products section when viewing products
  useEffect(() => {
    if (viewingProducts) {
      // Add scroll detection to deactivate Products link when scrolling away
      const handleScroll = () => {
        const productsSection = document.getElementById('products');
        if (productsSection) {
          const rect = productsSection.getBoundingClientRect();
          // Check if products section is visible in viewport - more aggressive check
          const isVisible = rect.top < window.innerHeight/3 && rect.bottom > window.innerHeight/3;
          
          // Get the Products link
          const productsLinks = document.querySelectorAll('.nav-link');
          productsLinks.forEach(link => {
            if (link.textContent === 'Products') {
              if (isVisible) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            }
          });
          
          // Also update in footer
          const footerLinks = document.querySelectorAll('.footer-center ul li a');
          footerLinks.forEach(link => {
            if (link.textContent === 'Products') {
              if (isVisible) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            }
          });
        }
      };
      
      // Add click handler for Products link to navigate to products section
      const setupProductsNavigation = () => {
        // Get Products link in navbar
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
          if (link.textContent === 'Products') {
            const parentAnchor = link.closest('a');
            if (parentAnchor) {
              parentAnchor.onclick = function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                document.querySelectorAll('.nav-link').forEach(l => {
                  l.classList.remove('active');
                });
                
                // Set Products link as active
                link.classList.add('active');
                
                // Scroll to products section
                const productsSection = document.getElementById('products');
                if (productsSection) {
                  productsSection.scrollIntoView({ behavior: 'smooth' });
                }
              };
            }
          }
        });
        
        // Also handle Products link in footer
        const footerLinks = document.querySelectorAll('.footer-center ul li a');
        footerLinks.forEach(link => {
          if (link.textContent === 'Products') {
            link.onclick = function(e) {
              e.preventDefault();
              
              // Remove active class from all links
              document.querySelectorAll('.nav-link, .footer-center ul li a').forEach(l => {
                l.classList.remove('active');
              });
              
              // Set Products link as active in both navbar and footer
              document.querySelectorAll('.nav-link').forEach(l => {
                if (l.textContent === 'Products') {
                  l.classList.add('active');
                }
              });
              link.classList.add('active');
              
              // Scroll to products section
              const productsSection = document.getElementById('products');
              if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
              }
            };
          }
        });
      };
      
      // Initialize scroll handler and Products navigation
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Run initial check immediately
      setupProductsNavigation();
      
      // Directly fix the About and Contact links
      setTimeout(() => {
        // Fix About link
        const aboutLinks = document.querySelectorAll('.nav-link');
        aboutLinks.forEach(link => {
          if (link.textContent === 'About') {
            const parentAnchor = link.closest('a');
            if (parentAnchor) {
              // Replace with new handler
              parentAnchor.onclick = function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                document.querySelectorAll('.nav-link').forEach(l => {
                  l.classList.remove('active');
                });
                
                // Set About link as active
                link.classList.add('active');
                
                // Scroll to experience section
                const experienceSection = document.getElementById('experience');
                if (experienceSection) {
                  experienceSection.scrollIntoView({ behavior: 'smooth' });
                }
              };
            }
          }
          
          // Fix Contact link
          if (link.textContent === 'Contact') {
            const parentAnchor = link.closest('a');
            if (parentAnchor) {
              // Replace with new handler
              parentAnchor.onclick = function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                document.querySelectorAll('.nav-link').forEach(l => {
                  l.classList.remove('active');
                });
                
                // Set Contact link as active
                link.classList.add('active');
                
                // Scroll to contact section
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              };
            }
          }
        });
        
        // Fix footer links too
        const footerLinks = document.querySelectorAll('.footer-center ul li a');
        footerLinks.forEach(link => {
          // Fix About link in footer
          if (link.textContent === 'About') {
            link.onclick = function(e) {
              e.preventDefault();
              
              // Remove active class from all links
              document.querySelectorAll('.nav-link, .footer-center ul li a').forEach(l => {
                l.classList.remove('active');
              });
              
              // Set About link as active in navbar
              document.querySelectorAll('.nav-link').forEach(l => {
                if (l.textContent === 'About') {
                  l.classList.add('active');
                }
              });
              
              // Also set active in footer
              link.classList.add('active');
              
              // Scroll to experience section
              const experienceSection = document.getElementById('experience');
              if (experienceSection) {
                experienceSection.scrollIntoView({ behavior: 'smooth' });
              }
            };
          }
          
          // Fix Contact link in footer
          if (link.textContent === 'Contact') {
            link.onclick = function(e) {
              e.preventDefault();
              
              // Remove active class from all links
              document.querySelectorAll('.nav-link, .footer-center ul li a').forEach(l => {
                l.classList.remove('active');
              });
              
              // Set Contact link as active in navbar
              document.querySelectorAll('.nav-link').forEach(l => {
                if (l.textContent === 'Contact') {
                  l.classList.add('active');
                }
              });
              
              // Also set active in footer
              link.classList.add('active');
              
              // Scroll to contact section
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            };
          }
        });
      }, 500); // Wait for other scripts to initialize
      
      // Clean up on unmount
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [viewingProducts]);

  const handleCardClick = (farmer) => {
    setSelectedFarmer(farmer);
    setViewingProducts(true);
    
    // Update the nav and footer links from "Farmers" to "Products"
    // First, update navbar links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      // Remove active class from all links first
      link.classList.remove('active');
      
      if (link.textContent === 'Farmers') {
        // Change link text to Products
        link.textContent = 'Products';
        
        // Set this link as active
        link.classList.add('active');
        
        // Also update the href attribute to point to products section
        const parentAnchor = link.closest('a');
        if (parentAnchor) {
          const onClick = parentAnchor.getAttribute('onclick');
          if (onClick && onClick.includes('farmers')) {
            const newOnClick = onClick.replace('farmers', 'products');
            parentAnchor.setAttribute('onclick', newOnClick);
          }
        }
      }
      
      // Make sure Home is not active
      if (link.textContent === 'Home') {
        link.classList.remove('active');
      }
    });
    
    // Then update footer quick links
    const footerLinks = document.querySelectorAll('.footer-center ul li a');
    footerLinks.forEach(link => {
      if (link.textContent === 'Farmers') {
        // Change link text to Products
        link.textContent = 'Products';
        
        // Set this link as active
        link.classList.add('active');
        
        // Also update the onClick handler
        const onClick = link.getAttribute('onclick');
        if (onClick && onClick.includes('farmers')) {
          const newOnClick = onClick.replace('farmers', 'products');
          link.setAttribute('onclick', newOnClick);
        }
      } else {
        // Remove active class from other links
        link.classList.remove('active');
      }
    });
    
    // Update page title for better user experience
    document.title = `${farmer.name}'s Products | AgroMart`;
    
    // Set timeout to check visibility and set active state after render
    setTimeout(() => {
      const productsSection = document.getElementById('products');
      if (productsSection) {
        const rect = productsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight/2 && rect.bottom > 200;
        
        // Only set active if products section is visible
        if (isVisible) {
          navLinks.forEach(link => {
            if (link.textContent === 'Products') {
              link.classList.add('active');
            }
          });
          
          footerLinks.forEach(link => {
            if (link.textContent === 'Products') {
              link.classList.add('active');
            }
          });
        }
      }
    }, 100);
  };

  const handleBackClick = () => {
    setViewingProducts(false);
    setSelectedFarmer(null);
    
    // Change the link text back from "Products" to "Farmers"
    // First, update navbar links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      // Remove active class from all links first
      link.classList.remove('active');
      
      if (link.textContent === 'Products') {
        // Change link text back to Farmers
        link.textContent = 'Farmers';
        
        // Set this link as active since we're viewing farmers list now
        link.classList.add('active');
        
        // Also update the href attribute back to farmers section
        const parentAnchor = link.closest('a');
        if (parentAnchor) {
          const onClick = parentAnchor.getAttribute('onclick');
          if (onClick && onClick.includes('products')) {
            const newOnClick = onClick.replace('products', 'farmers');
            parentAnchor.setAttribute('onclick', newOnClick);
          }
        }
      }
      
      // Make sure Home is not active
      if (link.textContent === 'Home') {
        link.classList.remove('active');
      }
    });
    
    // Then update footer quick links
    const footerLinks = document.querySelectorAll('.footer-center ul li a');
    footerLinks.forEach(link => {
      if (link.textContent === 'Products') {
        // Change link text back to Farmers
        link.textContent = 'Farmers';
        
        // Set this link as active in footer as well
        link.classList.add('active');
        
        // Also update the onClick handler
        const onClick = link.getAttribute('onclick');
        if (onClick && onClick.includes('products')) {
          const newOnClick = onClick.replace('products', 'farmers');
          link.setAttribute('onclick', newOnClick);
        }
      } else {
        // Remove active class from other links
        link.classList.remove('active');
      }
    });
    
    // Restore original document title
    document.title = 'AgroMart';
    
    // Scroll to farmers section
    const farmersSection = document.getElementById('farmers');
    if (farmersSection) {
      farmersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If viewing a specific farmer's products, show the product section
  if (viewingProducts && selectedFarmer) {
    return (
      <BuyerProductSection 
        dashboardType="buyer"
        farmerName={selectedFarmer}  
        onBackClick={handleBackClick}
        onBuyClick={onBuyClick}
      />
    );
  }

  return (
    <section id="farmers" className="farmers-section">
      <div className="section-header">
        <h2>Our Featured Farmers</h2>
        <p className="section-subtitle">
          Browse our network of trusted farmers and explore their fresh produce
        </p>
        
        {loading ? (
          <div className="loading-message">Loading farmers...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : farmersData.length === 0 ? (
          <div className="no-farmers-message">
            <p>No farmers with products found at the moment.</p>
          </div>
        ) : (
          <div className="farmers-container">
            {farmersData.map(farmer => (
              <FarmerCard
                key={farmer.email}
                farmer={farmer}
                onClick={() => handleCardClick(farmer)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

FarmersSection.propTypes = {
  onBuyClick: PropTypes.func
};

export default FarmersSection;