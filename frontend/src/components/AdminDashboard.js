import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null); // Store the authenticated user's ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    brand: '',
    images: [''],
    inStock: true,
    rating: 0,
    salesCount: 0,
    discount: 0,
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 9;
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    // Fetch the authenticated user's ID when the component mounts
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(response.data._id);
      } catch (err) {
        setError('Failed to fetch current user');
      }
    };

    fetchCurrentUser();

    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchUsers();
    }
  }, [currentPage, activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/products?page=${currentPage}&limit=${limit}`);
      setProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalProducts(response.data.totalProducts || 0);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => {
      if (name === 'images') {
        return {
          ...prevState,
          images: value.split(',').map(img => img.trim()).filter(img => img),
        };
      } else {
        return {
          ...prevState,
          [name]: type === 'checkbox' ? checked : value,
        };
      }
    });
  };

  const handleImageChange = (index, value) => {
    setFormData(prevState => {
      const newImages = [...prevState.images];
      newImages[index] = value;
      return { ...prevState, images: newImages };
    });
  };

  const addImageField = () => {
    setFormData(prevState => ({
      ...prevState,
      images: [...prevState.images, ''],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formattedData = {
      ...formData,
      price: Number(formData.price),
      rating: Number(formData.rating),
      salesCount: Number(formData.salesCount),
      discount: Number(formData.discount),
    };

    try {
      if (editingProductId) {
        await axios.put(
          `http://localhost:5000/api/products/${editingProductId}`,
          formattedData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditingProductId(null);
      } else {
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
        images: [''],
        inStock: true,
        rating: 0,
        salesCount: 0,
        discount: 0,
      });
      setCurrentPage(1);
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
      images: Array.isArray(product.images) ? product.images : [product.images || ''],
      inStock: product.inStock,
      rating: product.rating,
      salesCount: product.salesCount || 0,
      discount: product.discount || 0,
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentPage(1);
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleAdminStatusChange = async (userId, isAdmin) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/api/users/${userId}/admin`,
        { isAdmin: !isAdmin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user admin status');
    }
  };

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="section">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`py-2 px-4 font-semibold ${
              activeTab === 'products'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('products')}
          >
            Product Management
          </button>
          <button
            className={`py-2 px-4 font-semibold ${
              activeTab === 'users'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
        </div>

        {/* Product Management Tab */}
        {activeTab === 'products' && (
          <>
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
                  <label className="block mb-1">Images</label>
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded"
                        placeholder={`Image URL ${index + 1}`}
                      />
                      {index === formData.images.length - 1 && (
                        <button
                          type="button"
                          onClick={addImageField}
                          className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700"
                        >
                          Add Image
                        </button>
                      )}
                    </div>
                  ))}
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
                        images: [''],
                        inStock: true,
                        rating: 0,
                        salesCount: 0,
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
            <h3 className="text-xl font-bold mb-4">Products (Total: {totalProducts})</h3>
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="border p-4 rounded shadow bg-white">
                      <h4 className="text-lg font-bold truncate">{product.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Array.isArray(product.images) && product.images.length > 0 ? (
                          product.images.map((img, index) => (
                            <img
                              key={index}
                              src={img || 'https://via.placeholder.com/50'}
                              alt={`Product ${index + 1}`}
                              className="w-12 h-12 object-cover rounded border"
                            />
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">No images</span>
                        )}
                      </div>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Price:</span> {(product.price).toLocaleString()}₫
                      </p>
                      <p className="text-sm truncate">
                        <span className="font-semibold">Category:</span> {product.category || 'N/A'}
                      </p>
                      <p className="text-sm truncate">
                        <span className="font-semibold">Brand:</span> {product.brand || 'N/A'}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">In Stock:</span> {product.inStock ? 'Yes' : 'No'}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Rating:</span> {product.rating}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Sales Count:</span> {product.salesCount || 0}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Discount:</span> {product.discount || 0}%
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Created At:</span>{' '}
                        {new Date(product.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-3 flex space-x-2">
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

                {/* Pagination Controls */}
                <div className="mt-6 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-4 py-2 rounded ${
                        currentPage === index + 1
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <p className="text-center mt-2">
                  Page {currentPage} of {totalPages}
                </p>
              </>
            ) : (
              <p className="text-center text-gray-600">No products available.</p>
            )}
          </>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <>
            <h3 className="text-xl font-bold mb-4">Users (Total: {users.length})</h3>
            {users.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {users.map((user) => {
                  const isCurrentUser = user._id === currentUserId; // Check if this is the authenticated user
                  return (
                    <div key={user._id} className="border p-4 rounded shadow bg-white">
                      <h4 className="text-lg font-bold truncate">{user.name}</h4>
                      <p className="text-sm truncate">
                        <span className="font-semibold">Email:</span> {user.email}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Admin:</span> {user.isAdmin ? 'Yes' : 'No'}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Created At:</span>{' '}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-3 flex space-x-2">
                        {/* Admin Status Toggle */}
                        <button
                          onClick={() => handleAdminStatusChange(user._id, user.isAdmin)}
                          className={`py-1 px-3 rounded text-white ${
                            user.isAdmin
                              ? 'bg-yellow-600 hover:bg-yellow-700'
                              : 'bg-green-600 hover:bg-green-700'
                          } ${isCurrentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={isCurrentUser}
                          title={isCurrentUser ? 'Cannot modify your own admin status' : ''}
                        >
                          {user.isAdmin ? 'Demote to User' : 'Promote to Admin'}
                        </button>
                        {/* Delete User */}
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className={`bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 ${
                            isCurrentUser ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={isCurrentUser}
                          title={isCurrentUser ? 'Cannot delete your own account' : ''}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-600">No users available.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;