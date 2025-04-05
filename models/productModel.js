// backend/models/productModel.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, 
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String },
  category: { type: String, required: true },
  brand: { type: String },
  images: [{ type: String }],
  inStock: { type: Boolean, default: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: [reviewSchema], default: [] },
  salesCount: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);