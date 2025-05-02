import { useState } from 'react';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import PropTypes from 'prop-types';
import authService from '../../api';


const BuyerSignupForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
   
    
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await authService.registerBuyer(formData);
      if (response.success === true) {
        setError("");
        setSuccess(response.message);

        // Reset form
        setFormData({
          name: '',
          email: '',
          password: ''
        });

        
       
      } else {
        setError(response.message);
        setSuccess("");
       
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const styles = {
    container: {
      width: '100%',
      padding: '10px',
      boxSizing: 'border-box',
      backgroundColor: '#f0f8f5', // light greenish background for agricultural feel
      borderRadius: '12px',
      boxShadow: '0 6px 12px rgba(0, 100, 0, 0.15)', // subtle green shadow
      // border: '2px solid #4caf50', // green border
      transition: 'box-shadow 0.3s ease',
    },
    containerHover: {
      boxShadow: '0 10px 20px rgba(0, 100, 0, 0.3)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 0 16px',
      position: 'relative'
    },
    backButton: {
      background: 'none',
      border: 'none',
      color: '#2e7d32',
      fontSize: '18px',
      cursor: 'pointer',
      padding: '0',
      position: 'absolute',
      left: '2rem',
      outline: 'none',
      display: 'flex',
      alignItems: 'center',
      marginLeft: '-2rem',
      transition: 'color 0.3s ease'
    },
    backButtonHover: {
      color: '#81c784'
    },
    title: {
      color: '#2e7d32',
      fontSize: '20px',
      fontWeight: 'bold',
      marginRight: '-2rem',
      fontFamily: "'Georgia', serif",
      textShadow: '1px 1px 2px #a5d6a7'
    },
    form: {
      display: 'grid',
      rowGap: '16px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '4px',
      color: '#2e7d32'
    },
    inputContainer: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      fontSize: '14px',
      border: '1px solid #a5d6a7',
      borderRadius: '6px',
      backgroundColor: '#e8f5e9',
      color: '#2e7d32',
      height: '40px',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
    },
    inputFocus: {
      borderColor: '#4caf50',
      boxShadow: '0 0 8px #81c784'
    },
    passwordInput: {
      paddingRight: '36px'
    },
    togglePassword: {
      position: 'absolute',
      right: '8px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#2e7d32',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      transition: 'color 0.3s ease'
    },
    togglePasswordHover: {
      color: '#81c784'
    },
    message: {
      margin: '0.5rem 0',
      padding: '0.5rem',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#2e7d32',
      textAlign: 'center'
    },
    error: { background: 'rgba(229, 62, 62, 0.1)', color: '#e53e3e' },
    success: { background: 'rgba(56, 161, 105, 0.1)', color: '#38a169' },
 
    submitButton: {
      background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
      boxShadow: '0 6px 12px rgba(46, 125, 50, 0.4)',
      padding: '12px 0',
      fontSize: '16px',
      color: 'white',
      outline: 'none',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '700',
      cursor: 'pointer',
      marginTop: '16px',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    submitButtonHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 10px 20px rgba(46, 125, 50, 0.6)'
    },
    submitButtonSubmitting: {
      background: 'linear-gradient(135deg, #a5d6a7, #81c784)',
      cursor: 'not-allowed'
    },
  
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button 
          style={styles.backButton}
          onClick={onBack}
          type="button"
        >
          <FaArrowLeft />
        </button>
        <h2 style={styles.title}>Buyer Registration</h2>
      </div>
      {error && <div style={{ ...styles.message, ...styles.error }}>{error}</div>}
      {success && <div style={{ ...styles.message, ...styles.success }}>{success}</div>}
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Full Name</label>
          <div style={styles.inputContainer}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your full name"
            />
           
          </div>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Email Address</label>
          <div style={styles.inputContainer}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email address"
            />
           
          </div>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <div style={styles.inputContainer}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Create a password"
            />
            <button
              type="button"
              style={styles.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
            </button>
            
          </div>
        </div>
        
        <button
          type="submit"
          style={{
            ...styles.submitButton,
            ...(isSubmitting ? styles.submitButtonSubmitting : {})
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register as Buyer'}
        </button>
        
       
      </form>
    </div>
  );
};

BuyerSignupForm.propTypes = {
  onBack: PropTypes.func.isRequired
};

export default BuyerSignupForm; 