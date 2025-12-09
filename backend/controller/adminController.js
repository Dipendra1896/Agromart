import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import Transaction from '../models/transactionModel.js';
import Product from '../models/productModel.js';
import AgriInput from '../models/agriInputModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get timeframe from query parameters, default to '6months'
    const timeframe = req.query.timeframe || '6months';
    console.log(`📊 Processing dashboard stats request for timeframe: ${timeframe}`);
    
    // Count users by type
    const buyersCount = await User.countDocuments({ userType: 'buyer' });
    const farmersCount = await User.countDocuments({ userType: 'farmer' });
    const suppliersCount = await User.countDocuments({ userType: 'supplier' });
    
    // Count products and agri-inputs
    const productsCount = await Product.countDocuments();
    const agriInputsCount = await AgriInput.countDocuments();
    
    // Count orders
    const ordersCount = await Order.countDocuments();
    
    // Get recent activities (last 10)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
      
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name email userType createdAt')
      .lean();
      
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select('name farmerEmail createdAt')
      .lean();
      
    const recentInputs = await AgriInput.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select('name supplierEmail createdAt')
      .lean();
      
    // Get buyer names for order activities
    const orderBuyerEmails = recentOrders.map(order => order.buyerEmail);
    const buyerData = await User.find({ email: { $in: orderBuyerEmails } })
      .select('name email')
      .lean();
    
    // Create a map of email to name for quick lookup
    const buyerEmailToName = {};
    buyerData.forEach(buyer => {
      buyerEmailToName[buyer.email] = buyer.name;
    });
    
    // Get farmer and supplier names
    const farmerEmails = recentProducts.map(product => product.farmerEmail);
    const supplierEmails = recentInputs.map(input => input.supplierEmail);
    const sellerEmails = [...farmerEmails, ...supplierEmails];
    
    const sellerData = await User.find({ email: { $in: sellerEmails } })
      .select('name email')
      .lean();
      
    // Create maps for farmer and supplier emails to names
    const sellerEmailToName = {};
    sellerData.forEach(seller => {
      sellerEmailToName[seller.email] = seller.name;
    });
    
    // Format recent activities
    const recentActivities = [
      ...recentOrders.map(order => ({
        id: order._id,
        action: 'Order placed',
        user: buyerEmailToName[order.buyerEmail] || order.buyerEmail, // Use name if found, fallback to email
        time: formatTimeAgo(order.createdAt),
        timestamp: order.createdAt // Add original timestamp for sorting
      })),
      ...recentUsers.map(user => ({
        id: user._id,
        action: `New ${user.userType} registered`,
        user: user.name,
        time: formatTimeAgo(user.createdAt),
        timestamp: user.createdAt // Add original timestamp for sorting
      })),
      ...recentProducts.map(product => ({
        id: product._id,
        action: 'New product added',
        user: sellerEmailToName[product.farmerEmail] || product.farmerEmail, // Use name if found, fallback to email
        time: formatTimeAgo(product.createdAt),
        timestamp: product.createdAt // Add original timestamp for sorting
      })),
      ...recentInputs.map(input => ({
        id: input._id,
        action: 'New agri-input added',
        user: sellerEmailToName[input.supplierEmail] || input.supplierEmail, // Use name if found, fallback to email
        time: formatTimeAgo(input.createdAt),
        timestamp: input.createdAt // Add original timestamp for sorting
      }))
    ]
    // Sort by timestamp (newest first) instead of formatted time string
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 4); // Limited to 4 activities for better display
    
    // Determine start date based on timeframe
    let startDate = new Date();
    switch (timeframe) {
      case '12months':
        startDate.setMonth(startDate.getMonth() - 11);
        break;
      case 'year':
        startDate = new Date(startDate.getFullYear(), 0, 1); // January 1st of current year
        break;
      case '6months':
      default:
        startDate.setMonth(startDate.getMonth() - 5);
        break;
    }
    
    // Get monthly growth data based on the selected timeframe
    const monthlyGrowth = await getMonthlyGrowthData(startDate, timeframe);
    
    console.log(`💼 Sending ${timeframe} data with labels:`, monthlyGrowth.labels);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          buyers: buyersCount,
          farmers: farmersCount,
          suppliers: suppliersCount,
          products: productsCount,
          agriInputs: agriInputsCount,
          orders: ordersCount
        },
        recentActivities,
        monthlyGrowth
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};

// Helper function to get monthly growth data
const getMonthlyGrowthData = async (startDate, timeframe) => {
  const months = [];
  const labels = [];
  const buyersData = [];
  const farmersData = [];
  const suppliersData = [];
  const revenueData = [];
  
  // Determine number of months to generate based on timeframe
  let numberOfMonths = 6; // default for 6months
  
  if (timeframe === '12months') {
    numberOfMonths = 12;
  } else if (timeframe === 'year') {
    // For 'year', we need to calculate how many months from start of year to now
    const currentDate = new Date();
    numberOfMonths = (currentDate.getMonth() + 1); // +1 because months are 0-indexed
  }
  
  console.log(`📆 Generating ${numberOfMonths} months of data for timeframe: ${timeframe}`);
  
  // Generate months based on timeframe
  for (let i = 0; i < numberOfMonths; i++) {
    const month = new Date(startDate);
    month.setMonth(startDate.getMonth() + i);
    
    const monthName = month.toLocaleString('default', { month: 'short' });
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    months.push({ monthStart, monthEnd });
    labels.push(monthName);
  }
  
  console.log(`📆 Generated months:`, labels);
  
  // Get counts for each month
  for (const { monthStart, monthEnd } of months) {
    // Count buyers registered in this month
    const buyersCount = await User.countDocuments({
      userType: 'buyer',
      createdAt: { $gte: monthStart, $lte: monthEnd }
    });
    
    // Count farmers registered in this month
    const farmersCount = await User.countDocuments({
      userType: 'farmer',
      createdAt: { $gte: monthStart, $lte: monthEnd }
    });
    
    // Count suppliers registered in this month
    const suppliersCount = await User.countDocuments({
      userType: 'supplier',
      createdAt: { $gte: monthStart, $lte: monthEnd }
    });
    
    // Calculate revenue for this month
    const transactions = await Transaction.find({
      createdAt: { $gte: monthStart, $lte: monthEnd }
    });
    
    const revenue = transactions.reduce((total, transaction) => {
      return total + (transaction.amount || 0);
    }, 0);
    
    buyersData.push(buyersCount);
    farmersData.push(farmersCount);
    suppliersData.push(suppliersCount);
    revenueData.push(revenue);
  }
  
  return {
    labels,
    buyers: buyersData,
    farmers: farmersData,
    suppliers: suppliersData,
    revenue: revenueData
  };
};

// Helper function to format time ago
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return new Date(date).toLocaleDateString();
  }
};

// Get users by type
export const getUsersByType = async (req, res) => {
  try {
    const { userType } = req.params;
    
    if (!['buyer', 'farmer', 'supplier'].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user type"
      });
    }
    
    const users = await User.find({ userType });
    
    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};

// Approve or reject document
export const approveDocument = async (req, res) => {
  try {
    const { userId } = req.params;
    const { documentApproval } = req.body;
    
    if (documentApproval === undefined) {
      return res.status(400).json({
        success: false,
        message: "documentApproval field is required"
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Update document approval status
    user.documentApproval = documentApproval;
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: documentApproval ? "Document approved successfully" : "Document rejected successfully",
      data: user
    });
  } catch (error) {
    console.error('Error approving document:', error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};

// Delete user and all related data
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Store email for reference before deletion
    const userEmail = user.email;
    const userType = user.userType;
    
    // Delete user's profile picture if exists
    if (user.profilePic && user.profilePic.path) {
      const fullPath = path.join(__dirname, '..', '..', user.profilePic.path);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    
    // Delete documents based on user type
    if (userType === 'farmer' && user.licenseDocument && user.licenseDocument.path) {
      const fullPath = path.join(__dirname, '..', '..', user.licenseDocument.path);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    
    if (userType === 'supplier' && user.businessCertificate && user.businessCertificate.path) {
      const fullPath = path.join(__dirname, '..', '..', user.businessCertificate.path);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    
    // Delete related data based on user type
    if (userType === 'buyer') {
      // Delete orders placed by the buyer
      await Order.deleteMany({ buyerEmail: userEmail });
      // Delete transactions made by the buyer
      await Transaction.deleteMany({ buyerEmail: userEmail });
    } else if (userType === 'farmer') {
      // Delete products added by the farmer
      const products = await Product.find({ farmerEmail: userEmail });
      
      // Delete product images
      for (const product of products) {
        if (product.image && product.image.path) {
          const fullPath = path.join(__dirname, '..', '..', product.image.path);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      }
      
      await Product.deleteMany({ farmerEmail: userEmail });
      
      // Delete orders where farmer is seller
      await Order.deleteMany({ sellerEmail: userEmail });
      
      // Delete transactions where farmer is seller
      await Transaction.deleteMany({ sellerEmail: userEmail });
    } else if (userType === 'supplier') {
      // Delete agri-inputs added by the supplier
      const agriInputs = await AgriInput.find({ supplierEmail: userEmail });
      
      // Delete agri-input images
      for (const input of agriInputs) {
        if (input.image && input.image.path) {
          const fullPath = path.join(__dirname, '..', '..', input.image.path);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      }
      
      await AgriInput.deleteMany({ supplierEmail: userEmail });
      
      // Delete orders where supplier is seller
      await Order.deleteMany({ sellerEmail: userEmail });
      
      // Delete transactions where supplier is seller
      await Transaction.deleteMany({ sellerEmail: userEmail });
    }
    
    // Finally, delete the user
    await User.findByIdAndDelete(userId);
    
    return res.status(200).json({
      success: true,
      message: "User and related data deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
}; 
//uptodate