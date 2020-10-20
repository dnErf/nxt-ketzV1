import { Request, Response } from 'express';
import { NotAuthorized, NotFound } from '@ketketz/common';
import { Order } from '../../models/order';

export const getAll = async (req:Request, res:Response) => {
  let orders = await Order.find({
    userId: req.currentUser!.id,
  })
  .populate('ticket');

  res.send(orders);
}

export const getById = async (req:Request, res:Response) => {
  let order = await Order.findById(req.params.orderId).populate('ticket');

  if (!order) {
    throw new NotFound();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorized();
  }

  res.send(order);
}
