import { Request, Response } from 'express';
import { BadRequest, NotFound, OrderStatus } from '@ketketz/common';
// ---
import { natsWrapper } from '../../nats';
import { Order } from '../../models/order';
import { Ticket } from '../../models/order_ticket';
import { OrderCreatedPublisher } from '../../events/publishers';

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

export const createNew = async (req:Request, res:Response) => {
  let { ticketId } = req.body;

  // Find the ticket the user is trying to order in the database
  let ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFound();
  }

    // Make sure that this ticket is not already reserved
  let isReserved = await ticket.isReserved();
  if (isReserved) {
    throw new BadRequest('Ticket is already reserved');
  }

    // Calculate an expiration date for this order
  let expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  // Build the order and save it to the database
  let order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket,
  });
  await order.save();

  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  });

  res.status(201).send(order);
}
