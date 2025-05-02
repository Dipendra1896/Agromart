import express from 'express';
import { 
  createOrder, 
  getOrdersByBuyerEmail, 
  getOrdersBySellerEmail, 
  updateOrderStatus,
  deleteOrder
} from '../controller/orderController.js';
import {
  createTransaction,
  getTransactionsByEmail,
  getTransactionById,
  deleteTransaction
} from '../controller/transactionController.js';

const orderRouter = express.Router();

// Route to create a new order
orderRouter.post('/create', createOrder);

// Route to get orders by buyer email
orderRouter.get('/buyer/:buyerEmail', getOrdersByBuyerEmail);

// Route to get orders by seller email
orderRouter.get('/seller/:sellerEmail', getOrdersBySellerEmail);

// Route to update order status
orderRouter.put('/status/:orderId', updateOrderStatus);

// Route to delete an order
orderRouter.delete('/delete/:orderId', deleteOrder);

// Transaction routes
orderRouter.post('/transactions', createTransaction);
orderRouter.get('/transactions/:email', getTransactionsByEmail);
orderRouter.get('/transaction/:transactionId', getTransactionById);
orderRouter.delete('/transactions/delete/:transactionId', deleteTransaction);

export default orderRouter; 