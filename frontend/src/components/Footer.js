import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation(); // Use useLocation to detect route changes

  // Reset email and message on route change
  useEffect(() => {
    setEmail(''); // Clear email input
    setMessage(''); // Clear message
  }, [location.pathname]); // Trigger when the pathname changes

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/newsletter', { email });
      setMessage('Thank you for subscribing!');
      setEmail(''); // Clear input after successful submission
    } catch (error) {
      setMessage('Failed to subscribe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="bg-gray-100 py-8 text-gray-900">
        <div className="container mx-auto px-4">
          {/* Newsletter Section */}
          <div className="newsletter mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">Sign Up for the Newsletter</h3>
                <p>
                  Subscribe to our newsletter to get the latest updates on new
                  products and exclusive offers.
                </p>
              </div>
              <div>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Your Email"
                      className="w-full p-2 border border-gray-300 rounded-l text-gray-900"
                      required
                      aria-label="Email for newsletter"
                    />
                    <button
                      type="submit"
                      className="bg-red-600 text-white py-2 px-4 rounded-r hover:bg-red-700 transition-colors"
                      disabled={submitting}
                    >
                      {submitting ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </div>
                  {message && (
                    <p
                      className={`text-sm ${
                        message.includes('Thank') ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {message}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.
            </p>
            <ul className="space-y-2">
              <li>
                <i className="fa fa-map-marker mr-2"></i> 123 Tech Street, City, Country
              </li>
              <li>
                <i className="fa fa-phone mr-2"></i> +123-456-7890
              </li>
              <li>
                <i className="fa fa-envelope mr-2"></i> support@techstore.com
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=Laptops" className="hover:text-red-600">
                  Laptops
                </Link>
              </li>
              <li>
                <Link to="/products?category=Accessories" className="hover:text-red-600">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/products?category=Peripherals" className="hover:text-red-600">
                  Peripherals
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-red-600">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-red-600">Contact Us</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-red-600">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-red-600">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <ul className="flex space-x-4">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600"
                  aria-label="Facebook"
                >
                  <i className="fa fa-facebook"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400"
                  aria-label="Twitter"
                >
                  <i className="fa fa-twitter"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-600"
                  aria-label="Instagram"
                >
                  <i className="fa fa-instagram"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-700"
                  aria-label="LinkedIn"
                >
                  <i className="fa fa-linkedin"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-700 pt-4 text-center">
          <p>&copy; {new Date().getFullYear()} Tech Store. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;