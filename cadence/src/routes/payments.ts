import { requireAuth, validateRequest, OrderStatus } from '@ketketz/common';
import { BadRequest, NotAuthorized, NotFound } from '@ketketz/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { stripe } from '../stripe';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers';
import { natsWrapper } from '../nats';

const router = express.Router();
const validator = [ body('token').not().isEmpty(), body('orderId').not().isEmpty() ];

router.post('/api/payments', requireAuth, validator, validateRequest, async (req: Request, res: Response) => {

    let { token, orderId } = req.body;
    let order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order');
    }

    let charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });
    let payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as paymentChargeRouter };
