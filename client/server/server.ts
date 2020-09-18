import cookieSession from 'cookie-session';
import express from 'express';
import { json } from 'body-parser';
// ---
import { ErrorHandler } from '@ketketz/common'
// ---
import { signedRoute } from './routes/signed';
import { signinRoute } from './routes/signin';
import { signoutRoute } from './routes/signout';
import { signupRoute } from './routes/signup';

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

export { server };