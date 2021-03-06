import mongoose from 'mongoose';
import { natsWrapper } from './nats';
import { server } from './server';
import { OrderCreatedListener, OrderCancelledListener } from './events/listeners';

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
    new OrderCancelledListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
     });
    server.listen(9997, () => console.log('cadence at port 9997'))
  }
  catch (err) {
    console.error(err);
  }
})();

