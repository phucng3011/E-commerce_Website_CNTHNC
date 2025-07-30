const request = require('supertest');
const { app, server } = require('../server');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const jwt = require('jsonwebtoken');

let token;
let userId;
let productId;

beforeAll(async () => {
  await connectDB();
  const user = new User({ name: 'Test User', email: 'test@example.com', password: 'password123' });
  await user.save();
  userId = user._id;
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

  const product = new Product({ name: 'Test Product', price: 10, countInStock: 5, category: 'Test Category', brand: 'Test Brand', description: 'Test Description' });
  await product.save();
  productId = product._id;
});

afterAll(async () => {
  await disconnectDB();
  server.close();
});

beforeEach(async () => {
  await Cart.deleteMany({});
});

describe('Cart API', () => {
  it('should add a product to the cart', async () => {
    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 2 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.items[0].productId._id).toBe(productId.toString());
  });

  it('should get the user cart', async () => {
    const cart = new Cart({ userId, items: [{ productId, quantity: 1, price: 10 }] });
    await cart.save();

    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.items[0].productId._id).toBe(productId.toString());
  });

  it('should update product quantity in the cart', async () => {
    const cart = new Cart({ userId, items: [{ productId, quantity: 1, price: 10 }] });
    await cart.save();

    const res = await request(app)
      .put('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 5 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.items[0].quantity).toBe(5);
  });

  it('should remove a product from the cart', async () => {
    const cart = new Cart({ userId, items: [{ productId, quantity: 1, price: 10 }] });
    await cart.save();

    const res = await request(app)
      .delete(`/api/cart/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.items.length).toBe(0);
  });

  it('should clear the cart', async () => {
    const cart = new Cart({ userId, items: [{ productId, quantity: 1, price: 10 }] });
    await cart.save();

    const res = await request(app)
      .delete('/api/cart')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Cart cleared successfully');
  });
});