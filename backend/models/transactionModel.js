import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
    set: function(v) {
      // Convert to number and handle NaN
      const num = Number(v);
      return isNaN(num) ? 0 : num;
    },
    validate: {
      validator: function(v) {
        // Ensure amount is a valid number
        return !isNaN(v);
      },
      message: props => `${props.value} is not a valid number for amount!`
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['completed', 'failed', 'pending', 'refunded'],
    default: 'completed',
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  buyerEmail: {
    type: String,
    required: true,
  },
  sellerEmail: {
    type: String,
    required: true,
  },
  orderDetails: {
    type: Object,
    required: true,
  }
}, { timestamps: true });

// Pre-save middleware to ensure amount is a valid number
transactionSchema.pre('save', function(next) {
  if (isNaN(this.amount)) {
    console.warn('Fixing NaN amount before save');
    this.amount = 0; // Default to zero if NaN
  }
  next();
});

const Transaction = mongoose.models.transaction || mongoose.model('transaction', transactionSchema);

export default Transaction; 