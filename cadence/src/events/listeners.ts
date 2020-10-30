import { Listener, OrderCreatedEvent, Subjects } from '@ketketz/common';
import { Message } from 'node-nats-streaming';
import { expirationService } from './queue_group';
import { expirationQueue } from '../../jobs/expiration_queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = expirationService;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to process the job:', delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
