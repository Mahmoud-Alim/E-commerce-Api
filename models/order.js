import mongoose from 'mongoose';

/**
 * Order mongoose model.
 * Represents a customer order in the e-commerce system.
 */
const orderSchema = new mongoose.Schema({
  orderItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderItem',
    required: true,
  }],
  shippingAddress1: {
    type: String,
    required: true,
    trim: true,
  },
  shippingAddress2: {
    type: String,
    default: '',
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  zip: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    default: 'Pending',
    required: true,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
  },
  totalPrice: {
    type: Number,
    min: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for frequent query patterns
orderSchema.index({ user: 1 });
orderSchema.index({ dateOrdered: -1 });
orderSchema.index({ status: 1 });

orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

orderSchema.set('toJSON', { virtuals: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;