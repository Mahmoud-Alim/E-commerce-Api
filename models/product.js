import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  richDescription: {
    type: String,
    default: '',
  },
  // Primary thumbnail — single string
  image: {
    type: String,
    default: '',
  },
  // Gallery images
  images: [{
    type: String,
  }],
  brand: {
    type: String,
    default: '',
    trim: true,
  },
  price: {
    type: Number,
    default: 0,
    min: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 10000,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for frequently queried fields
productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 'text', description: 'text' }); // Full-text search

productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productSchema.set('toJSON', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;