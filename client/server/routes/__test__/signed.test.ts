import request from 'supertest';
import { server } from '../../server';

it('responds with details about the current user', async () => {
  const cookie = await global.signin();

  const response = await request(server)
    .get('/api/users/signed')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(server)
    .get('/api/users/signed')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
