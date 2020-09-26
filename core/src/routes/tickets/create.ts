import { Request, Response } from 'express';
import { Ticket } from '../../models/ticket';

const createNew = async (req:Request, res:Response) => {
  let { title, price } = req.body;
  let ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
  });
  await ticket.save();
  res.sendStatus(200).send(ticket);
}

export { createNew }