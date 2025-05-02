import Order from '../models/orderModel.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    console.log('Order creation request received:', JSON.stringify(req.body));
    
    const {
      orderId,
      date,
      items,
      totalAmount,
      subtotal,
      deliveryFee,
      deliveryAddress,
      phoneNumber,
      paymentMethod,
      buyerEmail,
      sellerEmail,
      orderType,
      transactionId
    } = req.body;

    // Validate required fields
    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Order must have a valid total amount",
      });
    }

    if (!buyerEmail) {
      return res.status(400).json({
        success: false,
        message: "Buyer email is required",
      });
    }

    if (!sellerEmail) {
      return res.status(400).json({
        success: false,
        message: "Seller email is required",
      });
    }

    if (!orderType || !['product', 'agriinput'].includes(orderType)) {
      return res.status(400).json({
        success: false,
        message: "Valid order type is required (product or agriinput)",
      });
    }

    // Create a new order
    const newOrder = new Order({
      orderId: orderId || `ORDER-${Date.now()}`,
      date: date || new Date(),
      items,
      totalAmount,
      subtotal,
      deliveryFee,
      deliveryAddress,
      phoneNumber,
      paymentMethod,
      status: 'Pending',
      buyerEmail,
      sellerEmail,
      orderType,
      transactionId // Optional, only for online payments
    });

    console.log('Creating new order with data:', newOrder);

    // Save the order to database
    const savedOrder = await newOrder.save();
    console.log('Order saved successfully:', savedOrder._id);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while creating the order",
      details: error.stack
    });
  }
};

// Get orders by buyer email
export const getOrdersByBuyerEmail = async (req, res) => {
  try {
    const { buyerEmail } = req.params;

    const orders = await Order.find({ buyerEmail }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while retrieving orders",
    });
  }
};

// Get orders by seller email
export const getOrdersBySellerEmail = async (req, res) => {
  try {
    const { sellerEmail } = req.params;

    const orders = await Order.find({ sellerEmail }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while retrieving orders",
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Check if status is valid
    if (!['Pending', 'Processing', 'Shipping', 'Delivered'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating order status",
    });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while deleting the order",
    });
  }
}; 