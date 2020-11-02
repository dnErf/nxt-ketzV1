import mongoose from 'mongoose';
import { natsWrapper } from './nats';
import { server } from './server';
import { ExpirationCompleteListener } from './events/listeners';
import { OrderCancelledListener, OrderCreatedListener, PaymentCreatedListener } from './events/listeners';
import { TicketCreatedListener, TicketUpdatedListener } from './events/listeners';

(async () => {
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('nats is closing');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
     });
    server.listen(9998, () => console.log('core at port 9998'))
  }
  catch (err) {
    console.error(err);
  }
})();

