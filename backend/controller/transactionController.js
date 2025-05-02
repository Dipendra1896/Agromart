import Transaction from '../models/transactionModel.js';

// Create a new transaction
export const createTransaction = async (req, res) => {
  try {
    const {
      transactionId,
      amount,
      status,
      paymentMethod,
      date,
      buyerEmail,
      sellerEmail,
      orderDetails,
    } = req.body;

    // Validate required fields
    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Transaction must have a valid amount",
      });
    }

    if (!buyerEmail) {
      return res.status(400).json({
        success: false,
        message: "Buyer email is required",
      });
    }
    
    // Handle amount conversion carefully to prevent NaN
    let validAmount = 0;
    
    if (typeof amount === 'string') {
      // Remove any non-numeric characters except decimal point
      const cleanedAmount = amount.replace(/[^0-9.]/g, '');
      validAmount = parseFloat(cleanedAmount);
    } else if (typeof amount === 'number') {
      validAmount = amount;
    } else {
      // Default value if amount is not a string or number
      validAmount = 0;
    }
    
    // If conversion results in NaN, use a default value
    if (isNaN(validAmount)) {
      console.error('Amount conversion resulted in NaN:', amount);
      validAmount = 0; // Use 0 as default
    }
    
    console.log('Original amount:', amount, 'Type:', typeof amount);
    console.log('Converted amount:', validAmount, 'Type:', typeof validAmount);

    // Create a new transaction
    const newTransaction = new Transaction({
      transactionId,
      amount: validAmount, 
      status: status || 'completed',
      paymentMethod,
      date: date || new Date(),
      buyerEmail,
      sellerEmail,
      orderDetails,
    });

    console.log('Creating transaction with amount:', validAmount);

    // Save the transaction to database 
    const savedTransaction = await newTransaction.save();

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: savedTransaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while creating the transaction",
    });
  }
};

// Get transactions by email
export const getTransactionsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const transactions = await Transaction.find({ buyerEmail: email }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while retrieving transactions",
    });
  }
};

// Get transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findOne({ transactionId });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error retrieving transaction:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while retrieving the transaction",
    });
  }
};

// Delete transaction by ID
export const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    console.log('Attempting to delete transaction with ID:', transactionId);
    
    // First try to delete by MongoDB _id
    let deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
    
    // If not found by _id, try by transactionId field
    if (!deletedTransaction) {
      console.log('Transaction not found by _id, trying by transactionId field');
      deletedTransaction = await Transaction.findOneAndDelete({ transactionId: transactionId });
    }
    
    if (!deletedTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or already deleted",
      });
    }
    
    console.log('Successfully deleted transaction:', deletedTransaction);
    
    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
      data: deletedTransaction,
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while deleting the transaction",
    });
  }
}; 