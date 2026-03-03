const express = require('express');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');
const { protect, admin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const { createProductSchema, updateProductSchema } = require('../validations/product.validation');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, validate(createProductSchema), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, validate(updateProductSchema), updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;