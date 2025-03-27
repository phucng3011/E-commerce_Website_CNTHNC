import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const handleNavClick = (path, query) => {
    const newPath = `${path}${query ? `?${query}` : ''}`;
    if (location.pathname === path) {
      navigate(newPath, { replace: true });
    } else {
      navigate(newPath);
    }
  };

  const isActive = (queryKey, queryValue) => {
    return searchParams.get(queryKey) === queryValue || (queryKey === 'sort' && queryValue === '-rating' && searchParams.get('sort') === '-rating');
  };

  return (
    <nav className="bg-white shadow py-4">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-6">
          <li>
            <button
              onClick={() => navigate('/')}
              className={`text-gray-600 hover:text-red-600 ${location.pathname === '/' ? 'text-red-600 font-bold' : ''}`}
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick('/products', 'sort=-rating')}
              className={`text-gray-600 hover:text-red-600 ${isActive('sort', '-rating') ? 'text-red-600 font-bold' : ''}`}
            >
              Hot Deals
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick('/products', 'category=Laptops')}
              className={`text-gray-600 hover:text-red-600 ${isActive('category', 'Laptops') ? 'text-red-600 font-bold' : ''}`}
            >
              Laptops
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick('/products', 'category=Smartphones')}
              className={`text-gray-600 hover:text-red-600 ${isActive('category', 'Smartphones') ? 'text-red-600 font-bold' : ''}`}
            >
              Smartphones
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick('/products', 'category=Cameras')}
              className={`text-gray-600 hover:text-red-600 ${isActive('category', 'Cameras') ? 'text-red-600 font-bold' : ''}`}
            >
              Cameras
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick('/products', 'category=Accessories')}
              className={`text-gray-600 hover:text-red-600 ${isActive('category', 'Accessories') ? 'text-red-600 font-bold' : ''}`}
            >
              Accessories
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;