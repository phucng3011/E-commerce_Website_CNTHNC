const request = require('supertest');
const { app, server } = require('../server');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

let token;
let userId;

beforeAll(async () => {
  await connectDB();
  const user = new User({ name: 'Test User', email: 'test@example.com', password: 'password123' });
  await user.save();
  userId = user._id;
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await disconnectDB();
  server.close();
});

describe('User API', () => {
  it('should get user profile with valid token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', userId.toString());
  });

  it('should not get user profile with invalid token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toEqual(401);
  });

  it('should update user profile with valid token', async () => {
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated User' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated User');
  });
});
