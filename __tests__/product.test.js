const request = require('supertest');
const { app, server } = require('../server');
const { connectDB, disconnectDB } = require('../config/db');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

let adminToken;

beforeAll(async () => {
  await connectDB();
  
  // Create a mock admin user and generate a token
  const adminUser = new User({ 
    name: 'Admin User', 
    email: 'admin@test.com', 
    password: 'password123', 
    role: 'admin' 
  });
  await adminUser.save();
  
  adminToken = jwt.sign({ id: adminUser._id, role: adminUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await disconnectDB();
  server.close();
});

beforeEach(async () => {
  // We clear only the products collection before each test in this suite
  // The user collection is set up once for all tests
  await mongoose.connection.collections.products.deleteMany({});
});

describe('Product API', () => {
  it('should get all products and return the correct structure', async () => {
    const res = await request(app).get('/api/products');
    
    expect(res.statusCode).toEqual(200);
    expect(typeof res.body).toBe('object');
    expect(res.body).toHaveProperty('products');
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBe(0);
  });

  it('should create a new product when authenticated as admin', async () => {
    const newProductData = {
      name: 'Test Product',
      price: 99.99,
      description: 'A product for testing purposes.',
      category: 'Testing',
      brand: 'TestBrand',
      countInStock: 10,
    };

    const res = await request(app)
      .post('/api/products/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newProductData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe(newProductData.name);
    expect(res.body.price).toBe(newProductData.price);

    // Verify the product was actually saved to the database
    const productsInDb = await mongoose.connection.collections.products.find().toArray();
    expect(productsInDb.length).toBe(1);
    expect(productsInDb[0].name).toBe(newProductData.name);
  });

  it('should not create a new product if not authenticated', async () => {
    const newProductData = { name: 'Test Product', price: 99.99 };

    const res = await request(app)
      .post('/api/products/create')
      .send(newProductData);

    expect(res.statusCode).toEqual(401); 
  });
});
