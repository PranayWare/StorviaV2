import { getConfig } from '../../lib/util/getConfig.js';
import { registerPaymentMethod } from '../checkout/services/getAvailablePaymentMethos.js';
import { getSetting } from '../setting/services/setting.js';

/**
 * Razorpay integration bootstrap.
 *
 * Design goals (non-breaking):
 * - Adds a NEW payment method without altering existing checkout/cart/order flows.
 * - Uses env vars for keys (no hardcoding, no DB dependency).
 * - If keys are missing, the method is still registered but can be hidden/disabled
 *   via `validator` so it won't break checkout.
 */
export default async () => {
  registerPaymentMethod({
    init: async () => {
      const displayName =
        (await getSetting('razorpayDisplayName', 'Razorpay')) || 'Razorpay';
      return {
        methodCode: 'razorpay',
        methodName: displayName
      };
    },
    validator: async () => {
      /**
       * Visibility rules (non-breaking, Stripe/PayPal-style):
       * - Check `system.razorpay.status` config first (node-config override).
       * - Fallback to `razorpayPaymentStatus` setting from Admin.
       * - Require env keys so that checkout cannot offer a method that will fail.
       */
      const razorpayConfig = getConfig('system.razorpay', {});
      let status;
      if (razorpayConfig.status) {
        status = razorpayConfig.status;
      } else {
        status = await getSetting('razorpayPaymentStatus', 0);
      }
      const enabled = parseInt(status, 10) === 1;
      const hasKeys =
        !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET;
      return enabled && hasKeys;
    }
  });
};

