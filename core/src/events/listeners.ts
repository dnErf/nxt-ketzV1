import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent, OrderCreatedEvent, OrderCancelledEvent } from '@ketketz/common';
import { Ticket } from '../models/ticket';
import { Ticket as TicketOrder } from '../models/order_ticket';
import { queueOrderService, queueTicketService } from './queue_group';
import { TicketUpdatedPublisher } from './publishers';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueTicketService;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    // ack the message
    msg.ack();
  }
}

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: undefined });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    });

    msg.ack();
  }
}

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueOrderService;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    let { id, title, price } = data;

    let ticket = TicketOrder.build({
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
    let ticket = await TicketOrder.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    let { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
