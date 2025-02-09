const app = require('../../app');
const request = require('supertest');
const fs = require('fs');
const path = require('path');
require('../mongodb_helper');
const User = require('../../models/user');

describe('/users', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST, when email and password are provided', () => {
    test('the response code is 201', async () => {
      let response = await request(app)
        .post('/users')
        .send({ email: 'poppy@email.com', password: '1234' });
      expect(response.statusCode).toBe(201);
    });

    test('a user is created', async () => {
      await request(app)
        .post('/users')
        .send({ email: 'scarlett@email.com', password: '1234' });
      let users = await User.find();
      let newUser = users[users.length - 1];
      expect(newUser.email).toEqual('scarlett@email.com');
    });
  });

  describe('POST, when password is missing', () => {
    test('response code is 400', async () => {
      let response = await request(app)
        .post('/users')
        .send({ email: 'skye@email.com' });
      expect(response.statusCode).toBe(400);
    });

    test('does not create a user', async () => {
      await request(app).post('/users').send({ email: 'skye@email.com' });
      let users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe('POST, when email is missing', () => {
    test('response code is 400', async () => {
      let response = await request(app)
        .post('/users')
        .send({ password: '1234' });
      expect(response.statusCode).toBe(400);
    });

    test('does not create a user', async () => {
      await request(app).post('/users').send({ password: '1234' });
      let users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe('Image upload tests', () => {
    test('It should upload an image', async () => {
      const filePath = path.resolve(__dirname, '../test-image.png');
      const image = fs.readFileSync(filePath);
      let response = await request(app)
        .post('/users')
        .field('email', 'test@example.com')
        .field('password', 'password')
        .attach('image', image, 'test-image.png');
      expect(response.statusCode).toBe(201);
    });
  });

  describe('POST with a display_name included', () => {
    it('should create a user with a display name', async () => {
      let response = await request(app).post('/users').send({
        email: 'poppy@email.com',
        password: '1234',
        display_name: 'Poppy Smith',
      });
      let users = await User.find();
      let newUser = users[users.length - 1];
      console.log(newUser);
      expect(newUser.display_name).toBe('Poppy Smith');
      expect(response.statusCode).toBe(201);
    });
  });
});
