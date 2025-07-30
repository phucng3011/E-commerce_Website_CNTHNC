import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';
import { toast } from 'react-toastify';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    brand: '',
    search: '',
  });
  const [sort, setSort] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const fetchProducts = useCallback(async (params) => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({
        ...params,
        page: params.page || 1,
        limit: 9,
      }).toString();
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products?${query}`);

      const fetchedProducts = Array.isArray(response.data.products)
        ? response.data.products
        : [];

      setProducts(fetchedProducts);
      setPagination({
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        totalProducts: response.data.totalProducts || 0,
      });
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to fetch products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const brand = searchParams.get('brand') || '';
    const search = searchParams.get('search') || '';
    const sortParam = searchParams.get('sort') || '';

    setFilters({
      category,
      minPrice,
      maxPrice,
      brand,
      search,
    });
    setSort(sortParam);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));

    fetchProducts({
      category,
      minPrice,
      maxPrice,
      brand,
      search,
      sort: sortParam,
      page: 1,
    });
  }, [fetchProducts, searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newFilters = { ...filters };
    setFilters(newFilters);
    setPagination({ ...pagination, currentPage: 1 });

    const newParams = new URLSearchParams();
    if (newFilters.category) newParams.set('category', newFilters.category);
    if (newFilters.minPrice) newParams.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) newParams.set('maxPrice', newFilters.maxPrice);
    if (newFilters.brand) newParams.set('brand', newFilters.brand);
    if (newFilters.search) newParams.set('search', newFilters.search);
    if (sort) newParams.set('sort', sort);
    setSearchParams(newParams);

    fetchProducts({ ...newFilters, sort, page: 1 });
  };

  const handlePriceFilterSubmit = (e) => {
    e.preventDefault();
    const min = Number(filters.minPrice);
    const max = Number(filters.maxPrice);

    if (min && max && min > max) {
      toast.error('Minimum price must be less than or equal to maximum price.');
      return;
    }

    const newFilters = { ...filters };
    setFilters(newFilters);
    setPagination({ ...pagination, currentPage: 1 });

    const newParams = new URLSearchParams();
    if (newFilters.category) newParams.set('category', newFilters.category);
    if (newFilters.minPrice) newParams.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) newParams.set('maxPrice', newFilters.maxPrice);
    if (newFilters.brand) newParams.set('brand', newFilters.brand);
    if (newFilters.search) newParams.set('search', newFilters.search);
    if (sort) newParams.set('sort', sort);
    setSearchParams(newParams);

    fetchProducts({ ...newFilters, sort, page: 1 });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    setPagination({ ...pagination, currentPage: 1 });

    const newParams = new URLSearchParams();
    if (newFilters.category) newParams.set('category', newFilters.category);
    if (newFilters.minPrice) newParams.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) newParams.set('maxPrice', newFilters.maxPrice);
    if (newFilters.brand) newParams.set('brand', newFilters.brand);
    if (newFilters.search) newParams.set('search', newFilters.search);
    if (sort) newParams.set('sort', sort);
    setSearchParams(newParams);

    fetchProducts({ ...newFilters, sort, page: 1 });
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSort(newSort);
    setPagination({ ...pagination, currentPage: 1 });

    const newParams = new URLSearchParams();
    if (filters.category) newParams.set('category', filters.category);
    if (filters.minPrice) newParams.set('minPrice', filters.minPrice);
    if (filters.maxPrice) newParams.set('maxPrice', filters.maxPrice);
    if (filters.brand) newParams.set('brand', filters.brand);
    if (filters.search) newParams.set('search', filters.search);
    if (newSort) newParams.set('sort', newSort);
    setSearchParams(newParams);

    fetchProducts({ ...filters, sort: newSort, page: 1 });
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
    setSort('');
    setPagination({ ...pagination, currentPage: 1 });

    const newParams = new URLSearchParams();
    setSearchParams(newParams);

    fetchProducts({ ...newFilters, sort: '', page: 1 });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination({ ...pagination, currentPage: page });
      fetchProducts({ ...filters, sort, page });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container mx-auto px-4">
        <div className="row flex flex-col lg:flex-row gap-6">
          <div className="col-md-3 order-2 lg:order-1">
            <div id="aside" className="space-y-6">
              <div className="aside">
                <h3 className="aside-title text-xl font-bold mb-4">Search</h3>
                <form onSubmit={handleSearchSubmit} className="search-filter flex items-center space-x-2">
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
                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                  >
                    Search
                  </button>
                </form>
              </div>

              <div className="aside">
                <h3 className="aside-title text-xl font-bold mb-4">Categories</h3>
                <div className="checkbox-filter">
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
              </div>

              <div className="aside">
                <h3 className="aside-title text-xl font-bold mb-4">Price</h3>
                <form onSubmit={handlePriceFilterSubmit} className="price-filter space-y-2">
                  <div className="input-number price-min">
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
                  <div className="input-number price-max">
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
                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 w-full"
                  >
                    Filter
                  </button>
                </form>
              </div>

              <div className="aside">
                <h3 className="aside-title text-xl font-bold mb-4">Brand</h3>
                <div className="checkbox-filter">
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
                    <option value="Asus">Asus</option>
                  </select>
                </div>
              </div>

              <div className="aside">
                <button
                  onClick={handleClearFilters}
                  className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-9 order-1 lg:order-2">
            <div className="row">
              <div className="store-filter clearfix flex justify-between mb-4">
                <div className="store-sort">
                  <label className="mr-2">
                    Sort By:
                    <select
                      value={sort}
                      onChange={handleSortChange}
                      className="input-select border border-gray-300 rounded p-1 ml-2"
                      aria-label="Sort products"
                    >
                      <option value="">Default</option>
                      <option value="price">Price: Low to High</option>
                      <option value="-price">Price: High to Low</option>
                      <option value="-rating">Rating: High to Low</option>
                      <option value="-createdAt">Newest First</option>
                    </select>
                  </label>
                </div>
                <div className="store-qty text-gray-600">
                  Showing {products.length} of {pagination.totalProducts} products
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.length === 0 ? (
                  <div className="col-span-3 text-center py-10">
                    {JSON.parse(localStorage.getItem('user'))?.isAdmin ? (
                      <div>
                        No products found.{' '}
                        <Link to="/admin" className="text-red-600 hover:underline">
                          Add some products in the admin dashboard.
                        </Link>
                      </div>
                    ) : (
                      'No products found matching your criteria.'
                    )}
                  </div>
                ) : (
                  products
                    .filter((product) => product && product._id) // Ensure product exists
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                )}
              </div>

              <div className="store-pagination mt-6 flex justify-between items-center">
                <div className="store-pages flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    aria-label="Previous page"
                  >
                    Prev
                  </button>
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-4 py-2 rounded ${
                        pagination.currentPage === index + 1
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      aria-label={`Page ${index + 1}`}
                      aria-current={pagination.currentPage === index + 1 ? 'page' : undefined}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;