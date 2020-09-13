import cookieSession from 'cookie-session';
import express from 'express';
import mongoose from 'mongoose';
import next from 'next';
import { json } from 'body-parser';
// ---
import { ErrorHandler } from '@ketketz/common'
// ---
import { signedRoute } from './routes/signed';
import { signinRoute } from './routes/signin';
import { signoutRoute } from './routes/signout';
import { signupRoute } from './routes/signup';

const port = parseInt(process.env.PORT, 10) || 9999;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {

  const server = express();

  server.use('trust proxy', true);
  server.use(json());
  server.use(
    cookieSession({
      signed: false,
      secure: process.env.NODE_ENV !== 'test'
    })
  );

  server.use(signedRoute);
  server.use(signinRoute);
  server.use(signoutRoute);
  server.use(signupRoute);

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.use(ErrorHandler);

  (async () => {
    try {
      await mongoose.connect('mongodb://serv-ketzv1-client-mongo:27017/auth', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      });
      server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
      });
    }
    catch (err) {
      console.error(err)
    }
  })(); 

});

