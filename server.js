require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { passport: passportConfig } = require('./config/passport');
const bodyParser = require('body-parser');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from frontend
  credentials: true,
}));
app.use(express.json());
// Raw body parser for Stripe webhook
app.use('/api/payment/webhook', bodyParser.raw({ type: 'application/json' }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));