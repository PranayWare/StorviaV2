import crypto from 'crypto';
import { select, update } from '@evershop/postgres-query-builder';
import { emit } from '../../../../lib/event/emitter.js';
import { error } from '../../../../lib/log/logger.js';
import { pool } from '../../../../lib/postgres/connection.js';
import { buildUrl } from '../../../../lib/router/buildUrl.js';
import {
  INTERNAL_SERVER_ERROR,
  INVALID_PAYLOAD,
  OK
} from '../../../../lib/util/httpStatus.js';
import { updatePaymentStatus } from '../../../oms/services/updatePaymentStatus.js';

function computeSignature(secret, orderId, paymentId) {
  return crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
}

export default async (request, response, next) => {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return response.status(INTERNAL_SERVER_ERROR).json({
        error: {
          status: INTERNAL_SERVER_ERROR,
          message:
            'Razorpay is not configured. Please set RAZORPAY_KEY_SECRET.'
        }
      });
    }

    const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      request.body;

    const order = await select()
      .from('order')
      .where('uuid', '=', order_id)
      .and('payment_method', '=', 'razorpay')
      .and('payment_status', '=', 'pending')
      .load(pool);

    if (!order) {
      return response.status(INVALID_PAYLOAD).json({
        error: { status: INVALID_PAYLOAD, message: 'Invalid order' }
      });
    }

    // Ensure the verified Razorpay order id matches what we stored on creation.
    if (order.integration_order_id && order.integration_order_id !== razorpay_order_id) {
      return response.status(INVALID_PAYLOAD).json({
        error: { status: INVALID_PAYLOAD, message: 'Invalid Razorpay order id' }
      });
    }

    const expected = computeSignature(
      keySecret,
      razorpay_order_id,
      razorpay_payment_id
    );

    if (expected !== razorpay_signature) {
      await updatePaymentStatus(order.order_id, 'failed');
      // Reactivate cart so user can retry payment without breaking flow.
      await update('cart')
        .given({ status: true })
        .where('cart_id', '=', order.cart_id)
        .execute(pool);

      return response.status(INVALID_PAYLOAD).json({
        error: { status: INVALID_PAYLOAD, message: 'Signature verification failed' }
      });
    }

    // Mark as paid and emit order_placed (same convention as PayPal return flow).
    await updatePaymentStatus(order.order_id, 'paid');
    await emit('order_placed', { ...order });

    response.status(OK);
    return response.json({
      data: {
        verified: true,
        redirectUrl: buildUrl('checkoutSuccess', { orderId: order_id })
      }
    });
  } catch (err) {
    error(err);
    return next(err);
  }
};

