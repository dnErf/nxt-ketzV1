import { Request, Response } from 'express';
import { BadRequest, NotAuthorized, NotFound } from '@ketketz/common';

const updateById = async (req:Request, res:Response) => {
  let ticket = await Ticket.findById(req.params.id);

  if (!ticket) 
    { throw new NotFound(); }
  if (ticket.orderId) 
    { throw new BadRequest('Cannot edit a reserved ticket'); }
  if (ticket.userId !== req.currentUser!.id) 
    { throw new NotAuthorized(); }

  ticket.set({
    title: req.body.title,
    price: req.body.price,
  });
  await ticket.save();
  res.send(ticket);
}

export { updateById }