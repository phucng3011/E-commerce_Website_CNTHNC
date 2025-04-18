import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
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
import AdminLayout from './components/AdminLayout';
import AdminProducts from './components/AdminProducts';
import AdminUsers from './components/AdminUsers';
import AdminOrders from './components/AdminOrders';
import AdminOrderDetails from './components/AdminOrderDetails';
import CreateProduct from './components/CreateProduct';
import EditProduct from './components/EditProduct';
import PrivacyPolicy from './components/PrivacyPolicy';
import PrivateRoute from './components/PrivateRoute';
import { CartProvider } from './context/CartContext';
import Success from './components/Success';

// Component để kiểm tra và hiển thị Footer
const FooterWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return !isAdminRoute ? <Footer /> : null;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Navigation />
        <Routes>
          {/* Public Routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Protected Routes (User) */}
          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin Routes with AdminLayout */}
          <Route element={<PrivateRoute isAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminProducts />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/create" element={<CreateProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetails />} />
            </Route>
          </Route>
        </Routes>
        <FooterWrapper />
        <ToastContainer />
      </Router>
    </CartProvider>
  );
}

export default App;