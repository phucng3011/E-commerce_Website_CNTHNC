import React, { useState, useContext } from 'react';
import { Link, useNavigate, Route, Routes } from 'react-router-dom';
import { FaBars, FaTimes, FaBox, FaShoppingCart, FaUsers, FaSignOutAlt, FaComment } from 'react-icons/fa';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminOrderDetails from './AdminOrderDetails';
import CreateProduct from './CreateProduct';
import EditProduct from './EditProduct';
import AdminChat from './AdminChat';
import { CartContext } from '../context/CartContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { setUser, setIsLoggingOut, fetchUser } = useContext(CartContext);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    setIsLoggingOut(true); // Báo hiệu đang đăng xuất
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    fetchUser(); // Cập nhật user ngay lập tức
    navigate('/login');
    setIsLoggingOut(false); // Reset trạng thái sau khi hoàn tất
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-16'
        } flex flex-col`}
      >
        <div className="p-4 flex justify-between items-center">
          {isSidebarOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/products"
                className="flex items-center p-4 hover:bg-gray-700 transition-colors"
              >
                <FaBox className="mr-3" />
                {isSidebarOpen && <span>Products</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className="flex items-center p-4 hover:bg-gray-700 transition-colors"
              >
                <FaShoppingCart className="mr-3" />
                {isSidebarOpen && <span>Orders</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="flex items-center p-4 hover:bg-gray-700 transition-colors"
              >
                <FaUsers className="mr-3" />
                {isSidebarOpen && <span>Users</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/chat"
                className="flex items-center p-4 hover:bg-gray-700 transition-colors"
              >
                <FaComment className="mr-3" />
                {isSidebarOpen && <span>Chat</span>}
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center p-4 w-full text-left hover:bg-gray-700 transition-colors"
              >
                <FaSignOutAlt className="mr-3" />
                {isSidebarOpen && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Routes>
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetails />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="chat" element={<AdminChat />} />
          <Route index element={<AdminProducts />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;