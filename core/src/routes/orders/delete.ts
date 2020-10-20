import { Request, Response } from 'express';
import { NotAuthorized, NotFound } from '@ketketz/common';
import { Order, OrderStatus } from '../../models/order';

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
}
