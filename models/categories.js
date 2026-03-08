import mongoose from 'mongoose';

/**
 * Category mongoose model.
 * Represents a product category in the e-commerce catalog.
 */
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
});

categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtuals: true,
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
