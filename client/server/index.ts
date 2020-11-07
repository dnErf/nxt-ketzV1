import mongoose from 'mongoose';
import next from 'next';
import { server } from './server'

const port = parseInt(process.env.PORT, 10) || 9999;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {

  try {
    await mongoose.connect('mongodb://serv-ketzv1-client-mongo:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    server.all('*', (req, res) => {
      return handle(req, res);
    });
    server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  }
  catch (err) {
    console.error(err)
  }

  // (async () => {
  // })(); 

});

