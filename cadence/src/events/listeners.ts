import { Listener, OrderCreatedEvent, Subjects } from '@ketketz/common';
import { Message } from 'node-nats-streaming';
import { cadenceService } from './queue_group';
import { expirationQueue } from '../../jobs/expiration_queue';
import { Order } from '../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = cadenceService;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

    let delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    await expirationQueue.add({ orderId: data.id }, { delay });

    let order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();

    console.log('Waiting this many milliseconds to process the job:', delay);
    msg.ack();
  }
}

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = cadenceService;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    let order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
