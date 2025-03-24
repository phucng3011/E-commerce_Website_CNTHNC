import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
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
        setOrders(ordersRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Your Profile</h2>
      <section>
        <h3>Account Details</h3>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </section>
      <section>
        <h3>Order History</h3>
        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order._id}>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Total: ${order.total}</p>
                <p>Status: {order.paymentStatus}</p>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.productId._id}>
                      {item.productId.name} - ${item.price} (x{item.quantity})
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Profile;