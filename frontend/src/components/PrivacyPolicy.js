import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="section">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy for E_commerce_Website_CNTHNC</h1>
        <p><strong>Last Updated:</strong> 06/04/2025</p>

        <h2 className="text-2xl font-semibold mt-6">Introduction</h2>
        <p>
          Welcome to E_commerce_Website_CNTHNC! We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Information We Collect</h2>
        <p>We may collect the following types of information when you use our application:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Personal Information</strong>: When you log in using Facebook or Google, we may collect your name, email address, and profile information provided by these services.
          </li>
          <li>
            <strong>Account Information</strong>: If you create an account directly with us, we collect your name, email address, and any other details you provide (e.g., phone number, company name, address).
          </li>
          <li>
            <strong>Usage Data</strong>: We may collect information about how you interact with our application, such as your IP address, browser type, and pages visited.
          </li>
          <li>
            <strong>Order Information</strong>: If you make purchases, we collect details such as billing and shipping addresses, payment information, and order history.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">How We Use Your Information</h2>
        <p>We use the information we collect for the following purposes:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>To provide and maintain our services, including user authentication via social login (Facebook, Google).</li>
          <li>To process orders, payments, and deliver products to you.</li>
          <li>To communicate with you, including sending order confirmations, updates, and promotional messages (if you opt-in).</li>
          <li>To improve our application and personalize your experience.</li>
          <li>To comply with legal obligations and protect the security of our application.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">How We Share Your Information</h2>
        <p>We do not sell or rent your personal information to third parties. We may share your information in the following cases:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>With Service Providers</strong>: We may share your information with third-party services that help us operate our application (e.g., payment processors, shipping providers).
          </li>
          <li>
            <strong>With Social Login Providers</strong>: When you log in using Facebook or Google, we receive data from these providers as per their policies.
          </li>
          <li>
            <strong>For Legal Reasons</strong>: We may disclose your information if required by law or to protect our rights, safety, or property.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">How We Protect Your Information</h2>
        <p>
          We implement reasonable security measures to protect your personal information, including encryption during transmission (HTTPS) and secure storage. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Your Rights</h2>
        <p>Depending on your location, you may have the following rights regarding your personal information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Access</strong>: You can request a copy of the data we have about you.</li>
          <li><strong>Correction</strong>: You can request corrections to inaccurate data.</li>
          <li><strong>Deletion</strong>: You can request the deletion of your data.</li>
          <li><strong>Opt-Out</strong>: You can opt-out of promotional emails at any time.</li>
        </ul>
        <p>
          To exercise these rights, please contact us at <a href="mailto:completeyet@gmail.com" className="text-blue-600 hover:underline">completeyet@gmail.com</a>.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Third-Party Services</h2>
        <p>Our application integrates with third-party services like Facebook and Google for authentication. These services have their own privacy policies:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><a href="https://www.facebook.com/privacy/policy/" className="text-blue-600 hover:underline">Facebook Privacy Policy</a></li>
          <li><a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline">Google Privacy Policy</a></li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">Cookies</h2>
        <p>
          We use cookies to enhance your experience, such as maintaining your session after login. You can manage cookie preferences in your browser settings.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of changes by updating the "Last Updated" date at the top of this page. You are encouraged to review this policy periodically.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Email</strong>: <a href="mailto:completeyet@gmail.com" className="text-blue-600 hover:underline">completeyet@gmail.com</a></li>
        </ul>

        <hr className="my-6" />
        <p className="text-center text-gray-600">© 2025 E_commerce_Website_CNTHNC. All rights reserved.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;