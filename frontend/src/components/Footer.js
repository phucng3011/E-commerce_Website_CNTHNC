import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Send email to backend for newsletter subscription
      await axios.post('http://localhost:5000/api/newsletter', { email });
      setMessage('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      setMessage('Failed to subscribe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="newsletter mb-10">
          <div className="row grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="col-md-6">
              <div className="newsletter-info">
                <h3 className="newsletter-title text-2xl font-bold mb-2">
                  Stay Updated
                </h3>
                <p>
                  Subscribe to our newsletter to get the latest updates on new
                  products and exclusive offers.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-3 border border-gray-300 rounded text-gray-900"
                    required
                    aria-label="Email for newsletter"
                  />
                  <button
                    type="submit"
                    className="bg-red-600 text-white py-3 px-6 rounded hover:bg-red-700 transition-colors"
                    disabled={submitting}
                  >
                    {submitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
                {message && (
                  <p
                    className={`mt-2 ${
                      message.includes('Thank') ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Footer Content */}
        <div className="row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Contact Info */}
          <div className="col-md-3 col-xs-6">
            <div className="footer-widget">
              <h3 className="footer-title text-xl font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li>
                  <i className="fa fa-map-marker mr-2"></i> 123 Tech Street, City,
                  Country
                </li>
                <li>
                  <i className="fa fa-phone mr-2"></i> +123-456-7890
                </li>
                <li>
                  <i className="fa fa-envelope mr-2"></i> support@techstore.com
                </li>
              </ul>
            </div>
          </div>

          {/* Categories */}
          <div className="col-md-3 col-xs-6">
            <div className="footer-widget">
              <h3 className="footer-title text-xl font-bold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/products?category=Laptops" className="hover:text-red-600">
                    Laptops
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=Accessories"
                    className="hover:text-red-600"
                  >
                    Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=Peripherals"
                    className="hover:text-red-600"
                  >
                    Peripherals
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Information */}
          <div className="col-md-3 col-xs-6">
            <div className="footer-widget">
              <h3 className="footer-title text-xl font-bold mb-4">Information</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="hover:text-red-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-red-600">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-red-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-red-600">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media */}
          <div className="col-md-3 col-xs-6">
            <div className="footer-widget">
              <h3 className="footer-title text-xl font-bold mb-4">Follow Us</h3>
              <ul className="footer-social flex space-x-4">
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
        </div>

        {/* Copyright */}
        <div className="footer-bottom mt-10 border-t border-gray-700 pt-4 text-center">
          <p>
            &copy; {new Date().getFullYear()} Tech Store. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;