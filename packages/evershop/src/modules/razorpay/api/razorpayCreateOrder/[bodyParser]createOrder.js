import { select, update } from '@evershop/postgres-query-builder';
import Razorpay from 'razorpay';
import smallUnit from 'zero-decimal-currencies';
import { error } from '../../../../lib/log/logger.js';
import { pool } from '../../../../lib/postgres/connection.js';
import {
  INTERNAL_SERVER_ERROR,
  INVALID_PAYLOAD,
  OK
} from '../../../../lib/util/httpStatus.js';

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export default async (request, response, next) => {
  try {
    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return response.status(INTERNAL_SERVER_ERROR).json({
        error: {
          status: INTERNAL_SERVER_ERROR,
          message:
            'Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
        }
      });
    }

    const { order_id } = request.body;
    const order = await select()
      .from('order')
      .where('uuid', '=', order_id)
      .and('payment_method', '=', 'razorpay')
      .and('payment_status', '=', 'pending')
      .load(pool);

    if (!order) {
      return response.status(INVALID_PAYLOAD).json({
        error: {
          status: INVALID_PAYLOAD,
          message: 'Invalid order'
        }
      });
    }

    // Razorpay requires amount in the smallest currency unit.
    // `zero-decimal-currencies` returns integer in minor units for the given currency.
    const amountInMinor = Number(smallUnit(order.grand_total, order.currency));
    const currency = order.currency;

    const rpOrder = await razorpay.orders.create({
      amount: amountInMinor,
      currency,
      receipt: order.uuid,
      notes: {
        evershop_order_uuid: order.uuid
      }
    });

    // Store the Razorpay order id for later signature verification.
    await update('order')
      .given({ integration_order_id: rpOrder.id })
      .where('uuid', '=', order_id)
      .execute(pool);

    response.status(OK);
    return response.json({
      data: {
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        razorpayOrderId: rpOrder.id,
        amount: amountInMinor,
        currency
      }
    });
  } catch (err) {
    error(err);
    return next(err);
  }
};

