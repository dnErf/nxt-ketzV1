import 
  { Subjects, Listener, OrderStatus, TicketCreatedEvent, TicketUpdatedEvent, ExpirationCompleteEvent } 
from '@ketketz/common';
import { OrderCreatedEvent, OrderCancelledEvent, PaymentCreatedEvent } from '@ketketz/common'
import { Message } from 'node-nats-streaming';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { Ticket as TicketOrder } from '../models/order_ticket';
import { queueOrderService, queueTicketService } from './queue_group';
import { OrderCancelledPublisher, TicketUpdatedPublisher } from './publishers';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueOrderService;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    let order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueOrderService;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    let order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueTicketService;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    
    let ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: data.id });

    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueTicketService;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    let ticket = await Ticket.findById(data.ticket.id);

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
