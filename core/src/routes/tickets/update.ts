import { Request, Response } from 'express';
import { BadRequest, NotAuthorized, NotFound } from '@ketketz/common';
// ---
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../../events/publishers';
import { natsWrapper } from '../../nats';

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

  new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version,
  });

  res.send(ticket);
  
}

export { updateById }