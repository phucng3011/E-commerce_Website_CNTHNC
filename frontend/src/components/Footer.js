import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setEmail('');
    setMessage('');
  }, [location.pathname]);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/newsletter`, { email });
      setMessage('Thank you for subscribing!');
      setEmail('');
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.
            </p>
            <ul className="space-y-2">
              <li>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> 123 Tech Street, City, Country
              </li>
              <li>
                <FontAwesomeIcon icon={faPhone} className="mr-2" /> +123-456-7890
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> support@techstore.com
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=Laptops" className="hover:text-red-600">
                  Laptops
                </Link>
              </li>
              <li>
                <Link to="/products?category=Smartphones" className="hover:text-red-600">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=Cameras" className="hover:text-red-600">
                  Cameras
                </Link>
              </li>
              <li>
                <Link to="/products?category=Accessories" className="hover:text-red-600">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

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
                <Link to="/privacy-policy" className="hover:text-red-600">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-red-600">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

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
                  <FontAwesomeIcon icon={faFacebook} size="2x" />
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
                  <FontAwesomeIcon icon={faTwitter} size="2x" />
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
                  <FontAwesomeIcon icon={faInstagram} size="2x" />
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
                  <FontAwesomeIcon icon={faLinkedin} size="2x" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-4 text-center">
          <p>&copy; {new Date().getFullYear()} Tech Store. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;