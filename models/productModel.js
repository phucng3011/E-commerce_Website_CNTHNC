const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  brand: { type: String },
  image: { type: String },
  inStock: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviews: [{ name: String, rating: Number, comment: String, date: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);