import React, { useState } from 'react';
import { FaArrowLeft, FaEye, FaEyeSlash, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import authService from '../../api';

const SupplierSignupForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    businessAddress: '',
    phoneNumber: '',
    businessCertificate: null
  });
  
  // const [errors, setErrors] = useState({});
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
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
      setFormData({
        ...formData,
        businessCertificate: file ? file.name : ''
      });
      
     
    
  };
  
  // const validate = () => {
  //   const newErrors = {};
    
  //   if (!formData.name.trim()) newErrors.name = 'Name is required';
  //   if (!formData.email.trim()) newErrors.email = 'Email is required';
  //   else if (!/\S+@\S+\.\S+/.test(formData.email)) 
  //     newErrors.email = 'Email is invalid';
    
  //   if (!formData.password) newErrors.password = 'Password is required';
  //   else if (formData.password.length < 6)
  //     newErrors.password = 'Password must be at least 6 characters';
    
  //   if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
  //   if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required';
  //   if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    
  //   return newErrors;
  // };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // const validationErrors = validate();
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return;
    // }
    
    setIsSubmitting(true);
    
    try {
      const response = await authService.registerSupplier(formData);
      if (response.success === true) {
        setError("");
        setSuccess(response.message);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          businessName: '',
          businessAddress: '',
          phoneNumber: '',
          businessCertificate: null
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
      paddingLeft: '24px',
      paddingRight: '24px',
      // paddingTop: '24px',
      paddingBottom: '24px',
      // marginLeft: '24px',
      marginRight: '24px',
      // marginTop: '0px',
      // marginBottom: '0px',  
      boxSizing: 'border-box',
      backgroundColor: '#f0f8f5', // light greenish background for agricultural feel
      borderRadius: '12px',
      boxShadow: '0 6px 12px rgba(0, 100, 0, 0.15)', // subtle green shadow
      border: '2px solid #4caf50', // green border
      transition: 'box-shadow 0.3s ease',

      
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '0 0 16px'
    },
    backButton: {
      background: 'none',
      outline: 'none',
      border: 'none',
      color: '#2e7d32',
      fontSize: '18px',
      cursor: 'pointer',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      marginRight: '3.8rem',
      transition: 'color 0.3s ease'
    },
    
    title: {
      color: '#2e7d32',
      fontSize: '20px',
    
      fontWeight: 'bold',
     
      marginRight: '3rem',
      fontFamily: "'Georgia', serif",
      textShadow: '1px 1px 2px #a5d6a7'
    },
    form: {
      display: 'grid',
      rowGap: '16px',
      width: '100%',
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      columnGap: '16px'
    },
    formColumn: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
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
      position: 'relative',
      outline: 'none',
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
      color: '#555',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0'
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
 
    fileInput: {
      display: 'none'
    },
    fileInputLabel: {
      display: 'flex',
      alignItems: 'center',
      border: '1px dashed #E2E8F0',
      borderRadius: '4px',
      padding: '8px 12px',
      fontSize: '14px',
      color: '#334155',
      cursor: 'pointer',
      backgroundColor: '#F8FAFC',
      transition: 'all 0.2s',
      height: '40px'
    },
    fileInputIcon: {
      marginRight: '5px',
      color: '#888'
    },
    fileInputText: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    submitButton: {
      background: 'linear-gradient(135deg, #66BB6A, #388E3C)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      padding: '12px 0',
      fontSize: '16px',
      color: 'white',
      outline: 'none',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '24px',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    submitButtonSubmitting: {
      background: 'linear-gradient(135deg, #A5D6A7, #81C784)',
      cursor: 'not-allowed'
    },
    // successMessage: {
    //   backgroundColor: 'rgba(76, 175, 80, 0.1)',
    //   border: '1px solid #4CAF50',
    //   color: '#4CAF50',
    //   padding: '5px',
    //   borderRadius: '4px',
    //   marginTop: '5px',
    //   textAlign: 'center',
    //   fontSize: '12px'
    // },
    // errorMessage: {
    //   backgroundColor: 'rgba(211, 47, 47, 0.1)',
    //   border: '1px solid #d32f2f',
    //   color: '#d32f2f',
    //   padding: '5px',
    //   borderRadius: '4px',
    //   marginTop: '5px',
    //   textAlign: 'center',
    //   fontSize: '12px'
    // }
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
        <h2 style={styles.title}>Supplier Registration</h2>
        {/* <button style={styles.closeButton} onClick={onBack} type="button">
          <FaTimes />
        </button> */}
      </div>
      
      {error && <div style={{ ...styles.message, ...styles.error }}>{error}</div>}
      {success && <div style={{ ...styles.message, ...styles.success }}>{success}</div>}
      
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formRow}>
          <div style={styles.formColumn}>
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
          </div>
          
          <div style={styles.formColumn}>
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
          </div>
        </div>
        
        <div style={styles.formRow}>
          <div style={styles.formColumn}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...styles.passwordInput,
                    
                  }}
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
          </div>
          
          <div style={styles.formColumn}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Business Name</label>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter your business name"
                />
               
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.formRow}>
          <div style={styles.formColumn}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Business Address</label>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter your business address"
                />
               
              </div>
            </div>
          </div>
          
          <div style={styles.formColumn}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <div style={styles.inputContainer}>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter your phone number"
                />
               
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Business Certificate</label>
          <div style={styles.inputContainer}>
            <input
              type="file"
              id="businessCertificate"
              name="businessCertificate"
              onChange={handleFileChange}
              style={styles.fileInput}
              accept=".pdf,.jpg,.jpeg,.png"
              // style={{ display: 'none' }}
            />
            <label
              htmlFor="businessCertificate"
              style={{
                ...styles.input,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              {formData.businessCertificate
                ? formData.businessCertificate
                : 'Upload business certification'}
            </label>
          
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
          {isSubmitting ? 'Registering...' : 'Register as Supplier'}
        </button>
      </form>
    </div>
  );
};

export default SupplierSignupForm; 