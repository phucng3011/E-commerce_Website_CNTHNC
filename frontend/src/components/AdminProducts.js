import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 10; // Updated to match screenshot (10 items per page)
  const navigate = useNavigate();

  // Filter states (from ProductList.js)
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    brand: '',
    search: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const query = new URLSearchParams({
        ...filters,
        page: currentPage,
        limit,
      }).toString();
      const response = await axios.get(`http://localhost:5000/api/products?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.products || []);
      setFilteredProducts(response.data.products || []); // Initially set filtered products
      setTotalPages(response.data.totalPages || 1);
      setTotalProducts(response.data.totalProducts || 0);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const handlePriceFilterSubmit = (e) => {
    e.preventDefault();
    const min = Number(filters.minPrice);
    const max = Number(filters.maxPrice);

    if (min && max && min > max) {
      alert('Minimum price must be less than or equal to maximum price.');
      return;
    }
    applyFilters();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleClearFilters = () => {
    const newFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      search: '',
    };
    setFilters(newFilters);
    setCurrentPage(1);
    fetchProducts();
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const query = new URLSearchParams({
        ...filters,
        page: 1,
        limit,
      }).toString();
      const response = await axios.get(`http://localhost:5000/api/products?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFilteredProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalProducts(response.data.totalProducts || 0);
      setCurrentPage(1);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      setLoading(false);
    }
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
      setError(err.response?.data?.message || 'Failed to delete product');
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
    <div className="p-6 flex space-x-6">
      {/* Filter Sidebar (Layout from screenshot, content from ProductList.js) */}
      <div className="w-64 space-y-6">
        <h3 className="text-lg font-semibold mb-2">Filters</h3>

        {/* Search Filter */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h4 className="text-sm font-semibold mb-2">Search</h4>
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by product name..."
              className="border border-gray-300 rounded p-2 w-full"
              aria-label="Search products"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>

        {/* Categories Filter */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h4 className="text-sm font-semibold mb-2">Categories</h4>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded p-2 w-full"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            <option value="Laptops">Laptops</option>
            <option value="Accessories">Accessories</option>
            <option value="Peripherals">Peripherals</option>
            <option value="Smartphones">Smartphones</option>
            <option value="Cameras">Cameras</option>
          </select>
        </div>

        {/* Price Filter */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h4 className="text-sm font-semibold mb-2">Price</h4>
          <form onSubmit={handlePriceFilterSubmit} className="space-y-2">
            <div>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                placeholder="Min"
                className="border border-gray-300 rounded p-2 w-full"
                aria-label="Minimum price"
              />
            </div>
            <div>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                placeholder="Max"
                className="border border-gray-300 rounded p-2 w-full"
                aria-label="Maximum price"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Brand Filter */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h4 className="text-sm font-semibold mb-2">Brand</h4>
          <select
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded p-2 w-full"
            aria-label="Filter by brand"
          >
            <option value="">All Brands</option>
            <option value="Dell">Dell</option>
            <option value="HP">HP</option>
            <option value="Lenovo">Lenovo</option>
            <option value="Apple">Apple</option>
            <option value="ASUS">ASUS</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="bg-white p-4 rounded shadow-sm">
          <button
            onClick={handleClearFilters}
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 w-full"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Product List (Layout from screenshot, content from AdminProducts.js) */}
      <div className="flex-1">
        {/* Header with Add Product Button and Tabs */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded mr-2">
              Filters
            </button>
            <button onClick={handleClearFilters} className="text-blue-600 hover:underline">
              Clear All
            </button>
          </div>
          <button
            onClick={() => navigate('/admin/products/create')}
            className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 transition-colors"
          >
            + Add Product
          </button>
        </div>

        {/* Tabs for All, Published, Draft */}
        <div className="flex space-x-4 mb-4">
          <button className="text-gray-700 font-semibold">
            All ({filteredProducts.length})
          </button>
          <button className="text-gray-500">
            Published ({filteredProducts.filter((p) => p.inStock).length})
          </button>
          <button className="text-gray-500">
            Draft ({filteredProducts.filter((p) => !p.inStock).length})
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">
                  <input type="checkbox" />
                </th>
                <th className="p-3">Product</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Price</th>
                <th className="p-3">Orders</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Published</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-3 text-center text-gray-600">
                    No products available.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="border-t">
                    <td className="p-3">
                      <input type="checkbox" />
                    </td>
                    <td className="p-3 flex items-center">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 object-cover mr-3 rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 mr-3 rounded" />
                      )}
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-gray-500 text-sm">
                          Category: {product.category || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="p-3">{product.inStock ? 'Yes' : 'No'}</td>
                    <td className="p-3">{product.price.toLocaleString()}₫</td>
                    <td className="p-3">{product.salesCount || 0}</td>
                    <td className="p-3 flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      {product.rating || 'N/A'}
                    </td>
                    <td className="p-3">
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleString()
                        : 'N/A'}
                    </td>
                    <td className="p-3 flex space-x-2">
                      <button
                        onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                      >
                        <FaEdit className="text-blue-500 hover:text-blue-700" />
                      </button>
                      <button onClick={() => handleDelete(product._id)}>
                        <FaTrash className="text-red-500 hover:text-red-700" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {totalProducts}
          </p>
          <div className="flex space-x-2">
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
                    ? 'bg-blue-600 text-white'
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
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;