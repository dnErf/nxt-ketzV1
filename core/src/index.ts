import mongoose from 'mongoose';
import { server } from './server'

(async () => {
  try {
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

