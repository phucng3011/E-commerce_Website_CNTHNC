import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './components/Home';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import { CartProvider } from './context/CartContext';
import AdminOrders from './components/AdminOrders';
import AdminOrderDetails from './components/AdminOrderDetails';
function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Navigation />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route element={<PrivateRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/success" element={<h1>Payment Successful!</h1>} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route element={<PrivateRoute isAdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
            </Route>
          </Routes>
        </div>
        <Footer />
        <ToastContainer />
      </Router>
    </CartProvider>
  );
}

export default App;