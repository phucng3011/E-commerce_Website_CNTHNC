import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const [productRes, orderRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/orders', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setProducts(productRes.data);
        setOrders(orderRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/api/products/create', newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts([...products, res.data]);
      setNewProduct({ name: '', price: '', description: '' });
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(`http://localhost:5000/api/orders/${orderId}`, { paymentStatus: status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.map(o => o._id === orderId ? res.data : o));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <section>
        <h3>Add Product</h3>
        <form onSubmit={handleAddProduct}>
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="Name"
            required
          />
          <input
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            placeholder="Price"
            required
          />
          <input
            type="text"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            placeholder="Description"
          />
          <button type="submit">Add Product</button>
        </form>
      </section>
      <section>
        <h3>Products</h3>
        <ul>
          {products.map((p) => (
            <li key={p._id}>{p.name} - ${p.price}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Orders</h3>
        <ul>
          {orders.map((o) => (
            <li key={o._id}>
              Order by {o.userId.name} - Total: ${o.total} - Status: {o.paymentStatus}
              <button onClick={() => handleUpdateStatus(o._id, 'completed')}>Mark Completed</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;