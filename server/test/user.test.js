const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');

const userOneID = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneID,
  name: 'Alex',
  email: 'alex@test.com',
  role: "user",
  password: 'Myl1ttl3p0ny!',
  tokens: [{
    token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET),
    role: 'user'
  }]
}

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test('Should signup a new user', async () => {
  const response = await request(app)
  .post('/users/singup')
  .send({
    name: 'Andrew',
    email: 'andreq@test.com',
    role: "user",
    password: 'Myl1ttl3p0ny!'
  }).expect(201);
  // Assert that the database was changed correctly
  const user =  await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'Andrew',
      email: 'andreq@test.com',
      role: 'user'
    },
    token: user.tokens[0].token
  });
  expect(user.password).not.toBe('Myl1ttl3p0ny!');
});

test('Should login existing user', async () => {
  const response = await request(app)
  .post('/users/login')
  .send({
    email: userOne.email,
    password: userOne.password
  }).expect(200);
  const user = await User.findById(userOne._id);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexisting user', async () => {
  await request(app)
  .post('/users/login')
  .send({
    email: userOne.email,
    password: 'thisIsNotMyPassword'
  }).expect(400);
});

test('Should get profile for user', async () => {
  await request(app)
  .get('/users/me')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
  .get('/users/me')
  .send()
  .expect(401);
});

test('Should delete account for user', async () => {
  await request(app)
  .delete('/users/me')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200);
  const user = await User.findById(userOneID);
  expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
  .delete('/users/me')
  .send()
  .expect(401);
});
