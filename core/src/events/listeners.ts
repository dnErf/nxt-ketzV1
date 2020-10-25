import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@ketketz/common';
import { Ticket } from '../../models/order_ticket';
import { queueOrderService } from './queue-group';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueOrderService;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    let { id, title, price } = data;

    let ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueOrderService;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    let ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    let { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
