import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateProduct = () => {
  const navigate = useNavigate();
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
    shortDescription: '',
    visibility: 'Public',
    status: 'Published',
    publishDate: '',
    tags: '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => {
      if (name === 'images') {
        return {
          ...prevState,
          images: value.split(',').map((img) => img.trim()).filter((img) => img),
        };
      } else if (name === 'tags') {
        return {
          ...prevState,
          tags: value.split(',').map((tag) => tag.trim()).filter((tag) => tag),
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
    setFormData((prevState) => {
      const newImages = [...prevState.images];
      newImages[index] = value;
      return { ...prevState, images: newImages };
    });
  };

  const addImageField = () => {
    setFormData((prevState) => ({
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
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag),
    };

    try {
      await axios.post('http://localhost:5000/api/products/create', formattedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Product created successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Create Product</h2>
        <button
          onClick={() => navigate('/admin/products')}
          className="text-blue-600 hover:underline"
        >
          Back to Products
        </button>
      </div>

      <div className="flex space-x-6">
        {/* Left Section: Product Details */}
        <div className="flex-1 space-y-6">
          {/* Product Title */}
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Product Title</h3>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="Enter product title"
              required
            />
          </div>

          {/* Product Description */}
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Product Description</h3>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded"
              rows="5"
              placeholder="Enter product description"
            />
          </div>

          {/* Product Gallery */}
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Product Gallery</h3>
            <div className="border-2 border-dashed border-gray-300 p-6 text-center">
              <p className="text-gray-500">Drop files here or click to upload</p>
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
          </div>

          {/* General Info */}
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-2">General Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Manufacturer Name</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  placeholder="Enter brand"
                />
              </div>
              <div>
                <label className="block mb-1">Manufacturer Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  placeholder="Enter brand"
                />
              </div>
              <div>
                <label className="block mb-1">Stocks</label>
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                In Stock
              </div>
              <div>
                <label className="block mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  placeholder="Enter price"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  placeholder="Enter discount percentage"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block mb-1">Orders</label>
                <input
                  type="number"
                  name="salesCount"
                  value={formData.salesCount}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  placeholder="Enter sales count"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Publish, Categories, Tags, Short Description */}
        <div className="w-80 space-y-6">
          {/* Publish Section */}
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Publish</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Visibility</label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded"
                >
                  <option value="Public">Public</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Publish Date & Time</label>
                <input
                  type="datetime-local"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Product Categories */}
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Product Categories</h3>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded"
            >
              <option value="">Select Category</option>
              <option value="Appliances">Appliances</option>
              <option value="Laptops">Laptops</option>
              <option value="Smartphones">Smartphones</option>
              <option value="Cameras">Cameras</option>
              <option value="Accessories">Accessories</option>
            </select>
            <button className="text-blue-600 hover:underline mt-2">Add New</button>
          </div>

          {/* Product Tags */}
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Product Tags</h3>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="Enter tags (comma-separated)"
            />
          </div>

          {/* Product Short Description */}
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Product Short Description</h3>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded"
              rows="3"
              placeholder="Enter short description (min 120 characters)"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="bg-teal-500 text-white py-3 px-6 rounded hover:bg-teal-600 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CreateProduct;