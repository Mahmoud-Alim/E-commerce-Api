const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 100
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['electronics', 'clothing', 'books', 'other']
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);