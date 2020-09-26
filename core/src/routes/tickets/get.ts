import { Request, Response } from 'express';
import { NotFound } from '@ketketz/common';
import { Ticket } from '../../models/ticket';

const getAll = async (req:Request, res:Response) => {
  let tickets = await Ticket.find({
    orderId: undefined,
  });
  res.send(tickets);
}

const getById = async (req:Request, res:Response) => {
  let ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFound();
  }
  res.send(ticket);
}

export { getAll, getById }