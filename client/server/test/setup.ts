import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signin():Promise<string[]>;
    }
  }
}

let mongo:any;

beforeAll(async () => {

  process.env.JWT_KEY = 'asdfasdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = new MongoMemoryServer();
  let mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

});

beforeEach(async () => {
  let collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  let email = 'test@mail.com';
  let password = 'password';
  let response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);
  let cookie = response.get('Set-Cookie');
  return cookie;
}

