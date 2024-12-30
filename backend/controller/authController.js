// import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";




//user registration
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Please fill in all fields" });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = new userModel({ name, email, password: hashedPassword , verifyToken: "", verifyTokenExpiresAt: 0});
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

    
    user.verifyToken = token;
    user.verifyTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours expiration
    await user.save(); // Save the updated user with the token


    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

     
  

   // Send email verification link with welcome message
   const verificationLink = `${process.env.FRONTEND_URL}/verify-token?token=${token}&email=${email}`;
   const emailData = {
       from: '"Agro-Mart"<koiralabishal3@gmail.com>',
       to: email,
       subject: "Welcome to Agro-Mart - Verify Your Email",
       html: `
           <h1>Welcome to Agro-Mart, ${name}!</h1>
           <p>We are thrilled to have you with us. Agro-Mart is your trusted platform for agricultural solutions.</p>
           <p>Please verify your email to activate your account by clicking the link below:</p>
           <a href="${verificationLink}">Verify Your Email</a>
           <p>This link will expire in 24 hours.</p>
           <br />
           <p>If you have any questions, feel free to reach out to us at agromart@gmail.com</p>
           <p>Happy farming,</p>
           <p><strong>The Agro-Mart Team</strong></p>
       `,
   };


    res.json({ success: true, message: "Registration successfully.\n Verification link is sent to your email." });

    await transporter.sendMail(emailData);
    
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};








//user login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email or password is required",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not registered yet" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const loginToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("loginToken", loginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    if(!user.isVerified){
        return res.json({success: false, message: 'Email is not verified yet. Please verify your email.'});

    }
    res.json({ success: true, message: "Logged In successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};








//user logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("loginToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      });
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.json({ success: true, message: "Logged Out successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};







// verifying email using token
export const verifyEmail = async (req, res) => {
    try {
      const { token, email } = req.query;
  
      // Find the user with the provided email
      const user = await userModel.findOne({ email});
  
      
      // Check if the user is already verified
      if (user.isVerified) {
        return res.json({ success: false, message: 'User is already verified' });
      }
  
      // Verify the user and clear the token
      if (user.verifyToken === token && user.verifyTokenExpiresAt > Date.now()) {
        user.isVerified = true;
        user.verifyToken = '';
        user.verifyTokenExpiresAt = 0;
        await user.save();
        return res.json({ success: true, message: 'Email verified successfully' });
      } else {
        return res.json({ success: false, message: 'Invalid or expired token.' });
      }
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  };
  





//send password reset otp
export const sendPasswordResetOtp = async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({email});

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }
    try {
    // Generate a random OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000)) ; // 6-digit OTP
    user.resetOtp = otp;
    user.resetOtpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiration
    await user.save();

    // Send the OTP via email
    const emailData = {
      from: '"Agro-Mart"<koiralabishal3@gmail.com>',
      to: email,
      subject: 'Password Reset OTP',
      html:`
        <h1>Your Password Reset OTP</h1>
        <p>Your password reset OTP is <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <br />
        <p>If you did not request a password reset, please ignore this email.</p>
        <br />
        <p>Happy farming,</p>
        <p><strong>The Agro-Mart Team</strong></p>

      `
    };
    
    res.json({ success: true, message: 'Password reset OTP sent successfully' });
    await transporter.sendMail(emailData);
  }catch(error){
    res.json({ success: false, message: error.message });
  } 
};






//reset password and verify otp
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if(!email || !otp  || !newPassword){
      return res.json({success: false, message: 'Email, OTP and new password are required.'});
    }

    try {
      const user = await userModel.findOne({email});
      if (!user) {
        return res.json({ success: false, message: 'User not found' });
      }
      if (user.resetOtp !== otp) {
        return res.json({ success: false, message: 'Invalid OTP' });
      }

      if (user.resetOtpExpiresAt < Date.now()) {
        return res.json({ success: false, message: 'OTP has expired' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetOtp = '';
      user.resetOtpExpiresAt = 0;
      await user.save();
      res.json({ success: true, message: 'Password reset successfully' });

      
      
    } catch (error) {
      res.json({ success: false, message: error.message });
      
    }
    

};





