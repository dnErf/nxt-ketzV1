import cookieSession from 'cookie-session';
import express from 'express';
import { json } from 'body-parser';
import { CurrentUser, ErrorHandler, NotFound } from '@ketketz/common';
import { paymentChargeRouter } from './routes/payments'
// ---

const server = express();

server.set('trust proxy', true);

server.use(json());
server.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);

server.use(CurrentUser);
server.use(paymentChargeRouter);

server.all('*', (req, res) => {
  throw new NotFound();
});

server.use(ErrorHandler);

export { server };