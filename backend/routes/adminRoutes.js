import express from 'express';
import { getUsersByType, approveDocument, deleteUser, getDashboardStats } from '../controller/adminController.js';

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

// Get users by type (buyer, farmer, supplier)
router.get('/users/:userType', getUsersByType);

// Approve or reject document
router.put('/user/:userId/approve-document', approveDocument);

// Delete user and related data
router.delete('/user/:userId', deleteUser);

export default router; 