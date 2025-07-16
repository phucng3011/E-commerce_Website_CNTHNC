# E-commerce Website

This is a full-stack e-commerce website built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

*   User authentication (registration, login, logout) with JWT and Passport.js.
*   Product browsing, searching, and filtering.
*   Shopping cart functionality.
*   Checkout process with Stripe integration.
*   User profile management.
*   Admin panel for managing products, orders, and users.
*   Real-time chat with Socket.io.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v14 or later)
*   npm
*   MongoDB

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/phucng3011/E-commerce_Website_CNTHNC.git
    ```
2.  Install backend dependencies
    ```sh
    cd E-commerce_Website_CNTHNC
    npm install
    ```
3.  Install frontend dependencies
    ```sh
    cd frontend
    npm install
    ```

### Running the Application

1.  Start the backend server
    ```sh
    cd E-commerce_Website_CNTHNC
    npm run dev
    ```
2.  Start the frontend development server
    ```sh
    cd E-commerce_Website_CNTHNC/frontend
    npm start
    ```

### Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
STRIPE_SECRET_KEY=<your_stripe_secret_key>
```

## Built With

*   [MongoDB](https://www.mongodb.com/) - NoSQL database
*   [Express.js](https://expressjs.com/) - Web application framework for Node.js
*   [React.js](https://reactjs.org/) - JavaScript library for building user interfaces
*   [Node.js](https://nodejs.org/) - JavaScript runtime environment
*   [Stripe](https://stripe.com/) - Payment processing platform
*   [Socket.io](https://socket.io/) - Real-time communication library
*   [Passport.js](http://www.passportjs.org/) - Authentication middleware for Node.js
*   [Tailwind CSS](https://tailwindcss.com/) - CSS framework
