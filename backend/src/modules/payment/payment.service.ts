import prisma from '../../config/db';
import { stripe } from '../../config/stripe';
import { PaymentStatus } from '@prisma/client';

export const createPaymentIntent = async (orderId: string, userId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.paymentStatus !== PaymentStatus.UNPAID) {
    throw new Error('Order is not eligible for payment');
  }

  if (!stripe) {
    // If Stripe is not configured, simulate payment success
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.PAID,
        paymentIntent: 'simulated_' + Date.now(),
      },
    });

    return {
      clientSecret: 'simulated_client_secret',
      paymentIntentId: 'simulated_' + Date.now(),
    };
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100), // Convert to cents
    currency: 'usd',
    metadata: {
      orderId: order.id,
      userId,
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentIntent: paymentIntent.id,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
};

export const handleWebhook = async (payload: Buffer, signature: string) => {
  if (!stripe) {
    console.log('Stripe not configured, skipping webhook');
    return;
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('Webhook secret not configured');
  }

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret
  );

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: PaymentStatus.PAID },
        });
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      const failedOrderId = failedPayment.metadata.orderId;

      if (failedOrderId) {
        await prisma.order.update({
          where: { id: failedOrderId },
          data: { paymentStatus: PaymentStatus.UNPAID },
        });
      }
      break;
  }
};

export const refundPayment = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order || !order.paymentIntent) {
    throw new Error('Order not found or no payment');
  }

  if (order.paymentStatus !== PaymentStatus.PAID) {
    throw new Error('Order is not paid');
  }

  if (!stripe) {
    // Simulate refund
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: PaymentStatus.REFUNDED },
    });
    return { success: true };
  }

  await stripe.refunds.create({
    payment_intent: order.paymentIntent,
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: PaymentStatus.REFUNDED },
  });

  return { success: true };
};