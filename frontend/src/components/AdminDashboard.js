// frontend/src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    brand: '',
    image: '',
    inStock: true,
    rating: 0,
    salesCount: 0,
    isHotDeal: false,
    discount: 0,
  });
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data.products || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log('Token:', token);

    // Convert string values to numbers
    const formattedData = {
      ...formData,
      price: Number(formData.price),
      rating: Number(formData.rating),
      salesCount: Number(formData.salesCount),
      discount: Number(formData.discount),
    };

    try {
      if (editingProductId) {
        // Update product
        await axios.put(
          `http://localhost:5000/api/products/${editingProductId}`,
          formattedData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditingProductId(null);
      } else {
        // Create new product
        console.log('Sending POST request with data:', formattedData);
        await axios.post('http://localhost:5000/api/products/create', formattedData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({
        name: '',
        price: '',
        description: '',
        category: '',
        brand: '',
        image: '',
        inStock: true,
        rating: 0,
        salesCount: 0,
        isHotDeal: false,
        discount: 0,
      });
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' && err.response.data.includes('Cannot POST')
          ? 'Server error: POST route not found'
          : 'Failed to save product')
      );
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || '',
      category: product.category || '',
      brand: product.brand || '',
      image: product.image || '',
      inStock: product.inStock,
      rating: product.rating,
      salesCount: product.salesCount || 0,
      isHotDeal: product.isHotDeal || false,
      discount: product.discount || 0,
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="section">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

        {/* Add/Edit Product Form */}
        <div className="mb-10">
          <h3 className="text-xl font-bold mb-4">
            {editingProductId ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div className="form-group">
              <label htmlFor="name" className="block mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price" className="block mb-1">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="Enter price"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description" className="block mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="Enter description"
              />
            </div>
            <div className="form-group">
              <label htmlFor="category" className="block mb-1">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="Enter category (e.g., Laptops)"
              />
            </div>
            <div className="form-group">
              <label htmlFor="brand" className="block mb-1">
                Brand
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="Enter brand (e.g., Dell)"
              />
            </div>
            <div className="form-group">
              <label htmlFor="image" className="block mb-1">
                Image URL
              </label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="Enter image URL"
              />
            </div>
            <div className="form-group">
              <label htmlFor="inStock" className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                In Stock
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="rating" className="block mb-1">
                Rating (0-5)
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="Enter rating"
                min="0"
                max="5"
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label htmlFor="salesCount" className="block mb-1">
                Sales Count
              </label>
              <input
                type="number"
                id="salesCount"
                name="salesCount"
                value={formData.salesCount}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="Enter sales count"
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="isHotDeal" className="flex items-center">
                <input
                  type="checkbox"
                  id="isHotDeal"
                  name="isHotDeal"
                  checked={formData.isHotDeal}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Is Hot Deal
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="discount" className="block mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="Enter discount percentage"
                min="0"
                max="100"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 transition-colors"
            >
              {editingProductId ? 'Update Product' : 'Add Product'}
            </button>
            {editingProductId && (
              <button
                type="button"
                onClick={() => {
                  setEditingProductId(null);
                  setFormData({
                    name: '',
                    price: '',
                    description: '',
                    category: '',
                    brand: '',
                    image: '',
                    inStock: true,
                    rating: 0,
                    salesCount: 0,
                    isHotDeal: false,
                    discount: 0,
                  });
                }}
                className="w-full bg-gray-600 text-white py-3 rounded hover:bg-gray-700 transition-colors mt-2"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* Product List */}
        <h3 className="text-xl font-bold mb-4">Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded">
              <h4 className="text-lg font-bold">{product.name}</h4>
              <p>Price: ${product.price}</p>
              <p>Category: {product.category || 'N/A'}</p>
              <p>Brand: {product.brand || 'N/A'}</p>
              <p>In Stock: {product.inStock ? 'Yes' : 'No'}</p>
              <p>Rating: {product.rating}</p>
              <p>Sales Count: {product.salesCount || 0}</p>
              <p>Hot Deal: {product.isHotDeal ? 'Yes' : 'No'}</p>
              <p>Discount: {product.discount || 0}%</p>
              <p>Created At: {new Date(product.createdAt).toLocaleDateString()}</p>
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;