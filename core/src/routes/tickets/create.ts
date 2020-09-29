import { Request, Response } from 'express';
// ---
import { Ticket } from '../../models/ticket';
import { TicketCreatedPublisher } from '../../events/publishers';
import { natsWrapper } from '../../nats';

const createNew = async (req:Request, res:Response) => {

  let { title, price } = req.body;
  let ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
  });
  await ticket.save();

  new TicketCreatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version,
  });

  res.sendStatus(200).send(ticket);

}

export { createNew }