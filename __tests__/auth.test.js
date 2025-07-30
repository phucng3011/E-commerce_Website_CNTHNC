const request = require('supertest');
const { app, server } = require('../server');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/userModel');

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
  server.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth API', () => {
  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
    });

    it('should not register a user with an existing email', async () => {
      await new User({
        name: 'Existing User',
        email: 'test@example.com',
        password: 'password123',
      }).save();

      const res = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
      await user.save();
    });

    it('should login a registered user successfully', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with incorrect credentials', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });
      expect(res.statusCode).toEqual(401);
    });
  });
});
