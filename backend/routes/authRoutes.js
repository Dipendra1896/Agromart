import express from 'express';
import { login, logout, register, resetPassword, sendPasswordResetOtp, verifyEmail} from '../controller/authController.js';


const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/verify-token', verifyEmail);
authRouter.post('/send-reset-otp', sendPasswordResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;




