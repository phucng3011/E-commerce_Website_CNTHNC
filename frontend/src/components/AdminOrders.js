import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
  });
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const query = new URLSearchParams({
        page,
        limit: 10,
        status: statusFilter,
      }).toString();
      const response = await axios.get(`http://localhost:5000/api/orders?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data.orders || []);
      setPagination({
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        totalOrders: response.data.totalOrders || 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchOrders(page);
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Order status updated successfully');
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? response.data.order : order
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Order deleted successfully');
      fetchOrders(pagination.currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete order');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Orders (Total: {pagination.totalOrders})</h2>

      {/* Filter by Status */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="border border-gray-300 rounded p-2"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-600">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="p-3">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {order._id}
                    </Link>
                  </td>
                  <td className="p-3">
                    {order.userId?.name || 'N/A'} ({order.userId?.email || 'N/A'})
                  </td>
                  <td className="p-3">
                    {order.totalPrice ? order.totalPrice.toLocaleString() : '0'}₫
                  </td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="border border-gray-300 rounded p-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex space-x-2">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-gray-600">
          Showing {orders.length} of {pagination.totalOrders} orders
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
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
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;