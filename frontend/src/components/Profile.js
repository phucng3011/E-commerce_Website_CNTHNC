import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view your profile');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const [userRes, ordersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/users/orders', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(userRes.data);
        setOrders(ordersRes.data || []);
        console.log('Orders fetched:', ordersRes.data);
        setFormData({
          name: userRes.data.name,
          email: userRes.data.email,
          phone: userRes.data.phone || '',
          company: userRes.data.company || '',
          address: userRes.data.address?.address || '',
          city: userRes.data.address?.city || '',
          state: userRes.data.address?.state || '',
          postalCode: userRes.data.address?.postalCode || '',
          country: userRes.data.address?.country || '',
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to load profile');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        'http://localhost:5000/api/users/me',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = passwordData;

    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.put(
        'http://localhost:5000/api/users/me/password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      toast.success('Password updated successfully! Please log in with your new password.');
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="section">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`py-2 px-4 font-semibold ${
              activeTab === 'details' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Account Details
          </button>
          <button
            className={`py-2 px-4 font-semibold ${
              activeTab === 'orders' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Order History
          </button>
          <button
            className={`py-2 px-4 font-semibold ${
              activeTab === 'password' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </button>
        </div>

        {/* Account Details Tab */}
        {activeTab === 'details' && (
          <section className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Account Details</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
              <div className="form-group">
                <label htmlFor="name" className="block mb-1 font-semibold">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="block mb-1 font-semibold">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
              <div className="form-group">
                <label htmlFor="company" className="block mb-1 font-semibold">Company</label>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
              <div className="form-group">
                <label htmlFor="address" className="block mb-1 font-semibold">Address</label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="city" className="block mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state" className="block mb-1 font-semibold">State</label>
                  <input
                    type="text"
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="postalCode" className="block mb-1 font-semibold">ZIP Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country" className="block mb-1 font-semibold">Country</label>
                  <input
                    type="text"
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
              >
                Update Profile
              </button>
            </form>
          </section>
        )}

        {/* Order History Tab (unchanged) */}
        {activeTab === 'orders' && (
          <section className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Order History</h3>
            {orders.length === 0 ? (
              <p className="text-gray-600">No orders yet.</p>
            ) : (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li key={order._id} className="border p-4 rounded">
                    <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="font-semibold">Total: {order.totalPrice.toLocaleString()}₫</p>
                    <p>Status: {order.status} {order.isPaid ? '(Paid)' : '(Not Paid)'}</p>
                    <p>Shipping: {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                    <ul className="mt-2 space-y-2">
                      {order.orderItems.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name || 'Product'}
                              className="w-10 h-10 object-cover mr-2 rounded"
                            />
                          )}
                          <span>
                            {item.name || 'Unknown Product'} -{' '}
                            {(item.price || 0).toLocaleString()}₫ (x{item.quantity})
                            {item.description && (
                              <p className="text-xs text-gray-500">{item.description}</p>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Change Password Tab (unchanged) */}
        {activeTab === 'password' && (
          <section className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
              <div className="form-group">
                <label htmlFor="currentPassword" className="block mb-1 font-semibold">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword" className="block mb-1 font-semibold">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmNewPassword" className="block mb-1 font-semibold">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
              >
                Change Password
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default Profile;