import request from 'supertest';
import { server } from '../../server';

it('returns a 201 on successful signup', async () => {
  return request(server)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(server)
    .post('/api/users/signup')
    .send({
      email: 'alskdflaskjfd',
      password: 'password'
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(server)
    .post('/api/users/signup')
    .send({
      email: 'alskdflaskjfd',
      password: 'p'
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(server)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com'
    })
    .expect(400);

  await request(server)
    .post('/api/users/signup')
    .send({
      password: 'alskjdf'
    })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(server)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  await request(server)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(server)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
