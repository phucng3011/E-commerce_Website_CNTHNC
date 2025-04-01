const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String, required: true },
  brand: { type: String },
  image: { type: String },
  inStock: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String },
      rating: { type: Number, required: true },
      comment: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
  salesCount: { type: Number, default: 0 },
  isHotDeal: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);