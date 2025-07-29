import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleUpdateOrder = async (updates) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/orders/${id}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder(response.data.order);
      toast.success('Order updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!order) return <div className="text-center py-10">Order not found</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Order Details</h2>
      <div className="bg-white shadow rounded p-6">
        <div className="flex justify-between mb-6">
          <div>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p>
              <strong>Customer:</strong> {order.userId?.name || 'N/A'} ({order.userId?.email || 'N/A'})
            </p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <Link to="/admin/orders" className="text-blue-600 hover:underline">
              Back to Orders
            </Link>
          </div>
        </div>

        {/* Order Status */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Order Status</h3>
          <div className="flex space-x-4">
            <div>
              <label className="block mb-1">Status</label>
              <select
                value={order.status}
                onChange={(e) => handleUpdateOrder({ status: e.target.value })}
                className="border border-gray-300 rounded p-2"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Payment Status</label>
              <select
                value={order.isPaid ? 'Paid' : 'Not Paid'}
                onChange={(e) =>
                  handleUpdateOrder({ isPaid: e.target.value === 'Paid' })
                }
                className="border border-gray-300 rounded p-2"
              >
                <option value="Not Paid">Not Paid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Delivery Status</label>
              <select
                value={order.isDelivered ? 'Delivered' : 'Not Delivered'}
                onChange={(e) =>
                  handleUpdateOrder({ isDelivered: e.target.value === 'Delivered' })
                }
                className="border border-gray-300 rounded p-2"
              >
                <option value="Not Delivered">Not Delivered</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Order Items</h3>
          <div className="space-y-4">
            {(order.orderItems || []).map((item, index) => (
              <div key={index} className="flex items-center border-b py-2">
                <img
                  src={item.image || 'https://via.placeholder.com/50'}
                  alt={item.name}
                  className="w-12 h-12 object-cover mr-4"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-600">
                    {item.quantity} x {item.price.toLocaleString()} ₫
                  </p>
                </div>
                <p className="font-semibold">
                  {(item.quantity * item.price).toLocaleString()} ₫
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <div className="space-y-2">
            <p><strong>Items Price:</strong> {order.itemsPrice.toLocaleString()} ₫</p>
            <p><strong>Shipping Price:</strong> {order.shippingPrice.toLocaleString()} ₫</p>
            <p><strong>Tax Price:</strong> {order.taxPrice.toLocaleString()} ₫</p>
            <p className="text-lg font-bold">
              <strong>Total Price:</strong> {order.totalPrice.toLocaleString()} ₫
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;