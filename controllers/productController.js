const Product = require('../models/productModel');

// Helper function to validate query parameters
const validateQueryParams = (page, limit, minPrice, maxPrice) => {
  const errors = [];

  if (isNaN(page) || page < 1) errors.push('Page must be a positive integer');
  if (isNaN(limit) || limit < 1) errors.push('Limit must be a positive integer');
  if (minPrice && (isNaN(minPrice) || minPrice < 0)) errors.push('minPrice must be a non-negative number');
  if (maxPrice && (isNaN(maxPrice) || maxPrice < 0)) errors.push('maxPrice must be a non-negative number');
  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    errors.push('minPrice cannot be greater than maxPrice');
  }

  return errors;
};

const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '',
      category = '',
      minPrice = '',
      maxPrice = '',
      brand = '',
      search = '',
      new: isNew = false,
      topSelling = false,
    } = req.query;

    const validationErrors = validateQueryParams(page, limit, minPrice, maxPrice);
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors.join(', ') });
    }

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (brand) {
      query.brand = brand;
    }

    if (isNew === 'true') {
      query.createdAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    }

    if (topSelling === 'true') {
      query.salesCount = { $exists: true };
    }

    const sortOptions = {};
    if (sort) {
      const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      sortOptions[sortField] = sortOrder;
    } else if (topSelling === 'true') {
      sortOptions.salesCount = -1;
    } else if (isNew === 'true') {
      sortOptions.createdAt = -1;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      products,
      currentPage: pageNum,
      totalPages: Math.ceil(totalProducts / limitNum),
      totalProducts,
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ message: 'Server error: Unable to fetch products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.userId', 'name')
      .lean();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ message: 'Server error: Unable to fetch product' });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(400).json({ message: 'Invalid product data', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    res.status(400).json({ message: 'Invalid update data', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ message: 'Server error: Unable to delete product' });
  }
};

const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;
  const userId = req.user._id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }
  if (!comment || comment.trim() === '') {
    return res.status(400).json({ message: 'Comment is required' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.reviews) {
      product.reviews = [];
    }

    const existingReview = product.reviews.find(
      (review) => review.userId.toString() === userId.toString()
    );
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = {
      userId: userId,
      name: req.user.name,
      rating: Number(rating),
      comment,
      date: new Date(),
    };

    product.reviews.push(review);

    const totalRating = product.reviews.reduce((acc, item) => acc + item.rating, 0);
    product.rating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

    await product.save();
    const updatedProduct = await Product.findById(productId)
      .populate('reviews.userId', 'name')
      .lean();
    res.status(201).json({ message: 'Review added successfully', product: updatedProduct });
  } catch (err) {
    console.error('Error in addReview:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
};