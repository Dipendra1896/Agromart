import express from 'express';
import { login, logout, registerBuyer, registerFarmer, registerSupplier, resetPassword, sendPasswordResetOtp, verifyEmail, checkUserExists} from '../controller/authController.js';
import { getUserProfile, updateUserProfile } from '../controller/profileController.js';
import { uploadProfilePic, uploadDocument } from '../middleware/upload.js';
const authRouter = express.Router();

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err) {
    console.error('File upload error:', err);
    return res.status(400).json({ 
      success: false, 
      message: err.message || 'Error uploading file' 
    });
  }
  next();
};

// Registration routes
authRouter.post('/register-buyer', registerBuyer);
authRouter.post('/register-farmer', uploadDocument.single('licenseDocument'), handleMulterError, registerFarmer);
authRouter.post('/register-supplier', uploadDocument.single('businessCertificate'), handleMulterError, registerSupplier);

// Auth routes
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/verify-token', verifyEmail);
authRouter.post('/send-reset-otp', sendPasswordResetOtp);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/check-user-exists', checkUserExists);

// Profile routes
authRouter.get('/profile/:email', getUserProfile);
authRouter.put('/profile/update', uploadProfilePic.single('profilePic'), handleMulterError, updateUserProfile);

export default authRouter;




