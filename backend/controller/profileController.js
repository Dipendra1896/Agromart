import User from '../models/userModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


// Get current file and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { email } = req.params; // Get email from URL params
    
    console.log("Get profile request received for email:", email);
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
    
    // Find user in the User model
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Initialize profile with user data
    const userProfile = {
      name: user.name,
      email: user.email,
      userType: user.userType,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      profilePic: user.profilePic,
      // Include user type specific fields
      farmName: user.farmName,
      farmLocation: user.farmLocation,
      businessName: user.businessName,
      businessAddress: user.businessAddress
    };
    
    console.log("Retrieved user profile:", userProfile);
    
    return res.status(200).json({
      success: true,
      data: userProfile
    });
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    console.log("===============================================");
    console.log("Update profile request received with body:", JSON.stringify(req.body, null, 2));
    console.log("Update profile file:", req.file ? req.file.filename : "No file");
    console.log("Update profile query params:", req.query);
    console.log("Content type:", req.headers['content-type']);
    
    // Extract email more safely, trying multiple potential sources
    let email = req.body.email || req.body.email_backup || req.query.email || '';
    
    // If email is an array (happens sometimes with FormData), get the first value
    if (Array.isArray(email)) {
      email = email[0];
    }
    
    // If email is still missing, return error
    if (!email || !email.trim()) {
      console.error("Email is missing in update request. Request body:", req.body);
      console.error("Request query params:", req.query);
      return res.status(400).json({
        success: false,
        message: "Email is required to update profile"
      });
    }
    
    // Trim the email to remove any whitespace
    email = email.trim();
    console.log("Looking up user with email:", email);
    
    const { name, gender, phoneNumber, userType } = req.body;
    console.log("Extracted fields from request body:");
    console.log("- name:", name);
    console.log("- gender:", gender);
    console.log("- phoneNumber:", phoneNumber);
    console.log("- userType:", userType);
    
    // Additional fields based on user type
    const { farmName, farmLocation, businessName, businessAddress } = req.body;
    console.log("- farmName:", farmName);
    console.log("- farmLocation:", farmLocation);
    console.log("- businessName:", businessName);
    console.log("- businessAddress:", businessAddress);
    
    // Find the user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error("User not found for email:", email);
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    console.log("Found user in database:", user.email);
    console.log("Current user data:");
    console.log("- name:", user.name);
    console.log("- farmName:", user.farmName);
    
    // Handle profile picture upload
    let profilePicObj = user.profilePic; // Keep existing profilePic if no new upload
    
    // Handle file upload with multer
    if (req.file) {
      console.log("Processing uploaded profile picture:", req.file);
      
      // Delete the old profile pic file if it exists
      if (user.profilePic && user.profilePic.path) {
        try {
          const oldPath = user.profilePic.path;
          const absoluteOldPath = oldPath.startsWith('/') 
            ? path.join(__dirname, '..', '..', oldPath.substring(1)) 
            : path.join(__dirname, '..', '..', oldPath);
          
          console.log("Checking for old profile picture at:", absoluteOldPath);
          if (fs.existsSync(absoluteOldPath)) {
            fs.unlinkSync(absoluteOldPath);
            console.log("Deleted old profile picture:", absoluteOldPath);
          }
        } catch (deleteError) {
          console.warn("Error deleting old profile picture:", deleteError);
          // Continue anyway - non-critical error
        }
      }
      
      // Create relative path for the database
      const relativePath = `/uploads/profiles/${req.file.filename}`;
      
      // Create profile pic object for database
      profilePicObj = {
        name: req.file.originalname,
        path: relativePath,
        type: req.file.mimetype,
        size: req.file.size
      };
      
      console.log("New profile image object:", profilePicObj);
    }
    
    // Update basic user information
    user.name = name || user.name;
    user.gender = gender || user.gender;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    if (profilePicObj) user.profilePic = profilePicObj;
    
    // Update user type specific information
    if (userType === 'farmer') {
      user.farmName = farmName || user.farmName;
      user.farmLocation = farmLocation || user.farmLocation;
    } else if (userType === 'supplier') {
      user.businessName = businessName || user.businessName;
      user.businessAddress = businessAddress || user.businessAddress;
    }
    
    console.log("Updated user data before saving:");
    console.log("- name:", user.name);
    console.log("- farmName:", user.farmName);
    
    // Save the updated user
    await user.save();
    console.log("User updated successfully:", user.name, user.email);
    
    // Return updated profile with correct field names for frontend
    const updatedProfile = {
      name: user.name,
      email: user.email,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      userType: user.userType,
      profilePic: user.profilePic,
      // Include user type specific fields
      farmName: user.farmName,
      farmLocation: user.farmLocation,
      businessName: user.businessName,
      businessAddress: user.businessAddress
    };
    
    console.log("Sending back updated profile to client");
    console.log("===============================================");
    
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile
    });
    
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};