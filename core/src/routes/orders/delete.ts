import { Request, Response } from 'express';
import { NotAuthorized, NotFound } from '@ketketz/common';
// ---
import { natsWrapper } from '../../nats';
import { Order, OrderStatus } from '../../models/order';
import { OrderCancelledPublisher } from '../../events/publishers';

export const deleteById = async (req:Request, res:Response) => {
  let { orderId } = req.params;

  let order = await Order.findById(orderId).populate('ticket');

  if (!order) {
    throw new NotFound();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorized();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
  });

  res.status(204).send(order);

}
