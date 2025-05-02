import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  items: {
    type: Array,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Processing', 'Shipping', 'Delivered'],
    default: 'Pending',
  },
  buyerEmail: {
    type: String,
    required: true,
  },
  // Store seller information
  sellerEmail: {
    type: String,
    required: true,
  },
  // Order type to determine if it's a product or agri-input
  orderType: {
    type: String,
    required: true,
    enum: ['product', 'agriinput'],
  },
  // Transaction ID for online payments
  transactionId: {
    type: String,
    required: false
  }
}, { timestamps: true });

const Order = mongoose.models.order || mongoose.model('order', orderSchema);

export default Order; 