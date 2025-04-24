import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { CartProvider, CartContext } from './context/CartContext';
import Success from './components/Success';
import ScrollToTop from './components/ScrollToTop';
import Chat from './components/Chat';
import AdminChat from './components/AdminChat';

const AppContent = () => {
  const { user, isLoggingOut } = useContext(CartContext);
  const location = useLocation();

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  if (user?.isAdmin && !isLoggingOut) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminProducts />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetails />} />
          <Route path="chat" element={<AdminChat />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  return (
    <>
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

        {/* Ngăn người dùng thường truy cập admin routes */}
        <Route path="/admin/*" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      {!isAuthRoute && <Chat />}
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <ToastContainer />
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;