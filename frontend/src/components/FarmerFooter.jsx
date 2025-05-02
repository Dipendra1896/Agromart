import logo from '../assets/Logo AgroMart.png';
import '../styles/Footer.css';

const FarmerFooter = () => {
  const handleScrollTo = (event, id) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Update active links in the navigation
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (
          (link.textContent === 'Products' && id === 'products') ||
          (link.textContent === 'Agri Input Suppliers' && id === 'suppliers') ||
          (link.textContent === 'Home' && id === 'hero') ||
          (link.textContent === 'About' && id === 'experience') ||
          (link.textContent === 'Contact' && id === 'contact')
        ) {
          link.classList.add('active');
        }
      });
    }
  };

  return (
    <footer id="contact" className="farmer-footer-section">
      <div className="footer-content">
        <div className="footer-left">
          <img src={logo} alt="AgroMart Logo" className="footer-logo" />
          <p className="footer-description">
            Empowering Nepali farmers through technology, AgroMart revolutionizes
            traditional markets into digital success stories. We&apos;re creating a future where
            farming meets innovation, and prosperity grows from every digital
            transaction.
          </p>
        </div>

        <div className="footer-center">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#" onClick={(e) => handleScrollTo(e, 'hero')}>Home</a></li>
            <li><a href="#" onClick={(e) => handleScrollTo(e, 'products')}>Products</a></li>
            <li><a href="#" onClick={(e) => handleScrollTo(e, 'suppliers')}>Agri Input Suppliers</a></li>
            <li><a href="#" onClick={(e) => handleScrollTo(e, 'experience')}>About</a></li>
            <li><a href="#" onClick={(e) => handleScrollTo(e, 'contact')}>Contact</a></li>
          </ul>
        </div>

        <div className="footer-right">
          <h3>Contacts</h3>
          <ul>
            <li>
              <span>Address:</span> Pokhara, Kaski, Nepal
            </li>
            <li>
              <span>Phone Numbers:</span> 9848260732
            </li>
            <li>
              <span>Email:</span> agromart@gmail.com
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} AgroMart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default FarmerFooter;
