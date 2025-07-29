# Full-Stack E-commerce Website (MERN Stack)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

This is a complete e-commerce website project built with the MERN stack, featuring a full range of functionalities from the user interface to an admin dashboard, including payment integration and real-time chat.

## Table of Contents

- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Folder Structure](#folder-structure)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)

## Key Features

- **User Authentication:** Register, log in, and log out using JWT and Passport.js (with support for Google login).
- **Product Management:** View, search, and filter products by category.
- **Shopping Cart:** Add, remove, and update the quantity of products in the cart.
- **Payment Integration:** Integrated with Stripe for secure transaction processing.
- **Order Management:** Users can review their order history.
- **Admin Dashboard:**
  - Manage Products (Add/Edit/Delete).
  - Manage Users.
  - Manage Orders.
- **Real-time Chat:** Admins and users can chat directly via Socket.io.
- **Responsive Design:** The interface is built with Tailwind CSS, ensuring compatibility across various devices.

## Technology Stack

| Component  | Technology                                                                                                                                                                                                                         |
| :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | React.js, React Router, Tailwind CSS, Axios, Socket.io Client, Stripe.js, Font Awesome                                                                                                                                            |
| **Backend**  | Node.js, Express.js, MongoDB (with Mongoose), Passport.js (JWT, Google OAuth 2.0), Socket.io, Stripe, bcryptjs, dotenv                                                                                                                |
| **DevTools** | Nodemon, React Scripts, Git, VS Code                                                                                                                                                                                               |

## Folder Structure

```
E-commerce_Website_CNTHNC/
├── config/         # DB, Passport.js configuration
├── controllers/    # Request handling logic (MVC)
├── frontend/       # All React.js code
│   ├── public/
│   └── src/
│       ├── components/ # UI components
│       ├── context/    # State management (CartContext)
│       └── ...
├── middleware/     # Authentication middleware
├── models/         # Schemas for MongoDB
├── routes/         # API routing for Express
├── .env.example    # Sample environment variables file for backend
└── server.js       # Main server initialization file
```

## Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (install locally or use a cloud service like MongoDB Atlas)

### Steps

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/phucng3011/E-commerce_Website_CNTHNC.git
    cd E-commerce_Website_CNTHNC
    ```

2.  **Install Backend dependencies:**
    ```sh
    npm install
    ```

3.  **Install Frontend dependencies:**
    ```sh
    cd frontend
    npm install
    cd ..
    ```

4.  **Configure environment variables:**

    See the [Environment Variables](#environment-variables) section below for details.

5.  **Run the project:**

    The project requires running both the backend server and the frontend client concurrently.

    - **Run the Backend (from the root directory `E-commerce_Website_CNTHNC`):**
      ```sh
      npm run dev
      ```
      The server will run at `http://localhost:5000` (or the port you configure in the `.env` file).

    - **Run the Frontend (open a new terminal, from the `E-commerce_Website_CNTHNC/frontend` directory):**
      ```sh
      cd frontend
      npm start
      ```
      The React application will open at `http://localhost:3000`.

## Environment Variables

The project requires two separate `.env` files to function.

1.  **Backend (`/E-commerce_Website_CNTHNC/.env`):**
    Create a `.env` file in the root directory and copy the content from `.env.example`.
    ```env
    # MongoDB Connection String
    MONGO_URI=your_mongodb_connection_string

    # Google OAuth Credentials
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret

    # JSON Web Token
    JWT_SECRET=your_jwt_secret

    # Express Session
    SESSION_SECRET=your_session_secret

    # Server Port
    PORT=5000

    # Stripe API Keys
    STRIPE_SECRET_KEY=your_stripe_secret_key
    STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
    ```

2.  **Frontend (`/E-commerce_Website_CNTHNC/frontend/.env`):**
    Create a `.env` file in the `frontend` directory.
    ```env
    # Stripe Publishable Key for React App
    REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
    ```

## API Endpoints

Here are the main API groups built in the project:

- `GET /api/products`: Get a list of all products (supports search and filtering).
- `GET /api/products/:id`: Get details of a single product.
- `POST /api/users/register`: Register a new user.
- `POST /api/users/login`: Log in.
- `GET /api/cart`: Get the user's shopping cart information.
- `POST /api/cart`: Add a product to the cart.
- `POST /api/orders`: Create a new order.
- `GET /api/orders/myorders`: Get the user's order history.
- `POST /api/payment/create-payment-intent`: Create a payment session with Stripe.
- `POST /api/chat`: Send a message (uses Socket.io).
- `GET /api/chat/:userId`: Get chat history.

---
<br>

# Website Thương mại điện tử Full-Stack (MERN Stack)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Đây là một dự án website thương mại điện tử hoàn chỉnh được xây dựng bằng MERN stack, bao gồm đầy đủ các chức năng từ giao diện người dùng đến trang quản trị viên, tích hợp thanh toán và trò chuyện thời gian thực.

## Mục lục

- [Tính năng nổi bật](#tính-năng-nổi-bật)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Hướng dẫn cài đặt và khởi chạy](#hướng-dẫn-cài-đặt-và-khởi-chạy)
- [Biến môi trường](#biến-môi-trường)
- [API Endpoints](#api-endpoints)

## Tính năng nổi bật

- **Xác thực người dùng:** Đăng ký, đăng nhập, đăng xuất sử dụng JWT và Passport.js (hỗ trợ đăng nhập bằng Google).
- **Quản lý sản phẩm:** Xem, tìm kiếm, lọc sản phẩm theo danh mục.
- **Giỏ hàng:** Thêm, xóa, cập nhật số lượng sản phẩm trong giỏ hàng.
- **Thanh toán:** Tích hợp cổng thanh toán Stripe để xử lý giao dịch an toàn.
- **Quản lý đơn hàng:** Người dùng có thể xem lại lịch sử đặt hàng.
- **Trang quản trị (Admin):**
  - Quản lý sản phẩm (Thêm/Sửa/Xóa).
  - Quản lý người dùng.
  - Quản lý đơn hàng.
- **Trò chuyện thời gian thực:** Admin và người dùng có thể trò chuyện trực tiếp qua Socket.io.
- **Thiết kế Responsive:** Giao diện được xây dựng với Tailwind CSS, tương thích trên nhiều thiết bị.

## Công nghệ sử dụng

| Phần      | Công nghệ                                                                                                                                                                                                                         |
| :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | React.js, React Router, Tailwind CSS, Axios, Socket.io Client, Stripe.js, Font Awesome                                                                                                                                            |
| **Backend**  | Node.js, Express.js, MongoDB (với Mongoose), Passport.js (JWT, Google OAuth 2.0), Socket.io, Stripe, bcryptjs, dotenv                                                                                                                |
| **DevTools** | Nodemon, React Scripts, Git, VS Code                                                                                                                                                                                               |

## Cấu trúc thư mục

```
E-commerce_Website_CNTHNC/
├── config/         # Cấu hình DB, Passport.js
├── controllers/    # Logic xử lý request (MVC)
├── frontend/       # Toàn bộ code React.js
│   ├── public/
│   └── src/
│       ├── components/ # Các thành phần UI
│       ├── context/    # Quản lý state (CartContext)
│       └── ...
├── middleware/     # Middleware xác thực
├── models/         # Schemas cho MongoDB
├── routes/         # Định tuyến API cho Express
├── .env.example    # File biến môi trường mẫu cho backend
└── server.js       # File khởi tạo server chính
```

## Hướng dẫn cài đặt và khởi chạy

### Yêu cầu hệ thống

- [Node.js](https://nodejs.org/) (phiên bản 14.x trở lên)
- [npm](https://www.npmjs.com/) (thường đi kèm với Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (cài đặt local hoặc sử dụng dịch vụ cloud như MongoDB Atlas)

### Các bước cài đặt

1.  **Clone repository về máy:**
    ```sh
    git clone https://github.com/phucng3011/E-commerce_Website_CNTHNC.git
    cd E-commerce_Website_CNTHNC
    ```

2.  **Cài đặt dependencies cho Backend:**
    ```sh
    npm install
    ```

3.  **Cài đặt dependencies cho Frontend:**
    ```sh
    cd frontend
    npm install
    cd ..
    ```

4.  **Cấu hình biến môi trường:**

    Xem chi tiết ở mục [Biến môi trường](#biến-môi-trường) bên dưới.

5.  **Khởi chạy dự án:**

    Dự án cần chạy song song cả server backend và client frontend.

    - **Chạy Backend (từ thư mục gốc `E-commerce_Website_CNTHNC`):**
      ```sh
      npm run dev
      ```
      Server sẽ chạy tại `http://localhost:5000` (hoặc cổng bạn cấu hình trong file `.env`).

    - **Chạy Frontend (mở một terminal mới, từ thư mục `E-commerce_Website_CNTHNC/frontend`):**
      ```sh
      cd frontend
      npm start
      ```
      Ứng dụng React sẽ mở tại `http://localhost:3000`.

## Biến môi trường

Dự án yêu cầu hai file `.env` riêng biệt để hoạt động.

1.  **Backend (`/E-commerce_Website_CNTHNC/.env`):**
    Tạo file `.env` ở thư mục gốc và sao chép nội dung từ `.env.example`.
    ```env
    # MongoDB Connection String
    MONGO_URI=your_mongodb_connection_string

    # Google OAuth Credentials
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret

    # JSON Web Token
    JWT_SECRET=your_jwt_secret

    # Express Session
    SESSION_SECRET=your_session_secret

    # Server Port
    PORT=5000

    # Stripe API Keys
    STRIPE_SECRET_KEY=your_stripe_secret_key
    STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
    ```

2.  **Frontend (`/E-commerce_Website_CNTHNC/frontend/.env`):**
    Tạo file `.env` trong thư mục `frontend`.
    ```env
    # Stripe Publishable Key for React App
    REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
    ```

## API Endpoints

Đây là các nhóm API chính được xây dựng trong dự án:

- `GET /api/products`: Lấy danh sách tất cả sản phẩm (hỗ trợ tìm kiếm và lọc).
- `GET /api/products/:id`: Lấy chi tiết một sản phẩm.
- `POST /api/users/register`: Đăng ký người dùng mới.
- `POST /api/users/login`: Đăng nhập.
- `GET /api/cart`: Lấy thông tin giỏ hàng của người dùng.
- `POST /api/cart`: Thêm sản phẩm vào giỏ hàng.
- `POST /api/orders`: Tạo đơn hàng mới.
- `GET /api/orders/myorders`: Lấy lịch sử đơn hàng của người dùng.
- `POST /api/payment/create-payment-intent`: Tạo phiên thanh toán với Stripe.
- `POST /api/chat`: Gửi tin nhắn (sử dụng Socket.io).
- `GET /api/chat/:userId`: Lấy lịch sử trò chuyện.

---