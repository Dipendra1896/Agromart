import express from 'express';
import { login, logout, registerBuyer, registerFarmer, registerSupplier, resetPassword, sendPasswordResetOtp, verifyEmail, checkUserExists} from '../controller/authController.js';
import { getUserProfile, updateUserProfile } from '../controller/profileController.js';
// import upload from '../config/upload.js';

const authRouter = express.Router();

authRouter.post('/register-buyer', registerBuyer);
authRouter.post('/register-farmer',  registerFarmer);
authRouter.post('/register-supplier', registerSupplier);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/verify-token', verifyEmail);
authRouter.post('/send-reset-otp', sendPasswordResetOtp);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/check-user-exists', checkUserExists);

// Profile routes
authRouter.get('/profile/:email', getUserProfile);
authRouter.put('/profile/update', updateUserProfile);

export default authRouter;




