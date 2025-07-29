require('dotenv').config();
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'];
const express = require('express');
const { connectDB } = require('./config/db');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/messageModel');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Connect to MongoDB
// connectDB();

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
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
app.use('/api/chat', require('./routes/chatRoutes'));

// Socket.IO logic
io.on('connection', (socket) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('User connected:', socket.id);
  }

  socket.on('join_chat', (userId) => {
    socket.join(userId);
  });

  socket.on('send_message', async ({ senderId, receiverId, content }) => {
    try {
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        content,
      });
      await message.save();

      const messageData = {
        sender: message.sender.toString(),
        receiver: message.receiver.toString(),
        content: message.content,
        createdAt: message.createdAt,
      };

      io.to(receiverId).emit('receive_message', messageData);
      io.to(senderId).emit('receive_message', messageData);
    } catch (error) {
      socket.emit('message_error', { message: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('User disconnected:', socket.id);
    }
  });
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

module.exports = { app, server };
