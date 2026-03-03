const asyncHandler = require('express-async-handler');
const Product = require('../models/product.model');

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, stock } = req.body;

  const product = await Product.create({
    name,
    price,
    description,
    category,
    stock,
    user: req.user.id
  });

  res.status(201).json({
    success: true,
    data: product
  });
});

const getProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice } = req.query;
  let filter = {};

  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(filter).populate('user', 'name email');
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('user', 'name email');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.status(200).json({
    success: true,
    data: product
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: product
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this product');
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
};