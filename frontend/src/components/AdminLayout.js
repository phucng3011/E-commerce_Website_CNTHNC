import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom'; // Import Outlet
import { FaBars, FaTimes, FaBox, FaShoppingCart, FaUsers, FaSignOutAlt } from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-16'
        } flex flex-col`}
      >
        {/* Toggle Button */}
        <div className="p-4 flex justify-between items-center">
          {isSidebarOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Navigation Links */}
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
        <Outlet /> {/* Render child routes here */}
      </div>
    </div>
  );
};

export default AdminLayout;