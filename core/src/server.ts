import cookieSession from 'cookie-session';
import express from 'express';
import { json } from 'body-parser';
import { CurrentUser, ErrorHandler, NotFound } from '@ketketz/common';
// ---
import { orderRoute } from './routes/orders';
import { ticketRoute } from './routes/tickets';

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

server.use(orderRoute);
server.use(ticketRoute);

server.all('*', (req, res) => {
  throw new NotFound();
});

server.use(ErrorHandler);

export { server };