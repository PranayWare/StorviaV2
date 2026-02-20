import {
  useCheckout,
  useCheckoutDispatch
} from '@components/common/context/checkout';
import RenderIfTrue from '@components/common/RenderIfTrue';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { _ } from '../../../../../lib/locale/translate/_.js';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayCheckout({
  createOrderAPI,
  verifyPaymentAPI,
  orderId,
  orderPlaced
}) {
  const [error, setError] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);

  const canLaunch = useMemo(() => !!orderPlaced && !!orderId, [orderPlaced, orderId]);

  useEffect(() => {
    const run = async () => {
      setError('');
      setIsLaunching(true);
      try {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          setError(_('Failed to load Razorpay checkout'));
          return;
        }

        const createResp = await fetch(createOrderAPI, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: orderId })
        });
        const createData = await createResp.json();
        if (createData.error) {
          setError(createData.error.message || _('Unable to create Razorpay order'));
          return;
        }

        const { razorpayKeyId, razorpayOrderId, amount, currency } = createData.data;

        const rz = new window.Razorpay({
          key: razorpayKeyId,
          amount,
          currency,
          name: 'Storvia',
          order_id: razorpayOrderId,
          handler: async (resp) => {
            try {
              const verifyResp = await fetch(verifyPaymentAPI, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  order_id: orderId,
                  razorpay_order_id: resp.razorpay_order_id,
                  razorpay_payment_id: resp.razorpay_payment_id,
                  razorpay_signature: resp.razorpay_signature
                })
              });
              const verifyData = await verifyResp.json();
              if (verifyData.error) {
                setError(verifyData.error.message || _('Payment verification failed'));
                return;
              }
              window.location.href = verifyData.data.redirectUrl || `/checkout/success/${orderId}`;
            } catch (e) {
              setError(_('Payment verification failed'));
            }
          }
        });

        rz.on('payment.failed', (resp) => {
          setError(
            resp?.error?.description || _('Payment failed. Please try again.')
          );
        });

        rz.open();
      } catch (e) {
        setError(_('Unable to start Razorpay checkout'));
      } finally {
        setIsLaunching(false);
      }
    };

    if (canLaunch && !isLaunching) {
      run();
    }
  }, [canLaunch, isLaunching, orderPlaced, orderId, createOrderAPI, verifyPaymentAPI]);

  return (
    <div>
      {error && <div className="text-critical mb-2">{error}</div>}
      <div className="p-5 text-center border rounded mt-2 border-divider">
        {isLaunching
          ? _('Opening Razorpay checkout…')
          : _('You will be prompted to complete payment with Razorpay')}
      </div>
    </div>
  );
}

RazorpayCheckout.propTypes = {
  createOrderAPI: PropTypes.string.isRequired,
  verifyPaymentAPI: PropTypes.string.isRequired,
  orderId: PropTypes.string,
  orderPlaced: PropTypes.bool.isRequired
};

RazorpayCheckout.defaultProps = {
  orderId: undefined
};

export default function RazorpayMethod({ createOrderAPI, verifyPaymentAPI }) {
  const checkout = useCheckout();
  const { placeOrder } = useCheckoutDispatch();
  const { steps, paymentMethods, setPaymentMethods, orderPlaced, orderId } =
    checkout;

  const selectedPaymentMethod = paymentMethods
    ? paymentMethods.find((paymentMethod) => paymentMethod.selected)
    : undefined;

  useEffect(() => {
    const selected = paymentMethods.find((paymentMethod) => paymentMethod.selected);
    if (steps.every((step) => step.isCompleted) && selected.code === 'razorpay') {
      placeOrder();
    }
  }, [steps]);

  return (
    <div>
      <div className="flex justify-start items-center gap-2">
        <RenderIfTrue
          condition={
            !selectedPaymentMethod || selectedPaymentMethod.code !== 'razorpay'
          }
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPaymentMethods((previous) =>
                previous.map((paymentMethod) => {
                  if (paymentMethod.code === 'razorpay') {
                    return { ...paymentMethod, selected: true };
                  } else {
                    return { ...paymentMethod, selected: false };
                  }
                })
              );
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          </a>
        </RenderIfTrue>
        <RenderIfTrue
          condition={
            !!selectedPaymentMethod && selectedPaymentMethod.code === 'razorpay'
          }
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2c6ecb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </RenderIfTrue>
        <div className="font-medium">{_('Razorpay')}</div>
      </div>

      <div>
        <RenderIfTrue
          condition={
            !!selectedPaymentMethod && selectedPaymentMethod.code === 'razorpay'
          }
        >
          <RazorpayCheckout
            createOrderAPI={createOrderAPI}
            verifyPaymentAPI={verifyPaymentAPI}
            orderPlaced={orderPlaced}
            orderId={orderId}
          />
        </RenderIfTrue>
      </div>
    </div>
  );
}

RazorpayMethod.propTypes = {
  createOrderAPI: PropTypes.string.isRequired,
  verifyPaymentAPI: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'checkoutPaymentMethodrazorpay',
  sortOrder: 10
};

export const query = `
  query Query {
    createOrderAPI: url(routeId: "razorpayCreateOrder")
    verifyPaymentAPI: url(routeId: "razorpayVerifyPayment")
  }
`;

