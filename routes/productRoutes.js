const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct, getProductById, addReview } = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/create', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.post('/:id/reviews', authMiddleware, addReview);

module.exports = router;