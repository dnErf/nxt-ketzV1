import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { server } from '../server';

declare global {
  namespace NodeJS {
    interface Global {
      signin():string[];
    }
  }
}

jest.mock('./mocks');

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

global.signin = () => {
  // Build a JWT payload.  { id, email }
  let payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  // Create the JWT!
  let token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build session Object. { jwt: MY_JWT }
  let session = { jwt: token };
  // Turn that session into JSON
  let sessionJSON = JSON.stringify(session);
  // Take JSON and encode it as base64
  let base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};

