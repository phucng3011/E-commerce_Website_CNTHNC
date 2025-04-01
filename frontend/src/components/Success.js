import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => (
  <div className="section text-center py-10">
    <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
    <p className="text-lg mb-6">Thank you for your order. You’ll receive a confirmation email soon.</p>
    <Link to="/" className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
      Back to Home
    </Link>
  </div>
);

export default Success;