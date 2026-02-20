import Spinner from '@components/admin/Spinner.js';
import Area from '@components/common/Area.js';
import Button from '@components/common/Button.js';
import { useCheckout } from '@components/common/context/checkout.js';
import { useCheckoutStepsDispatch } from '@components/common/context/checkoutSteps.js';
import { Form } from '@components/common/form/Form.js';
import { InputField } from '@components/common/form/InputField.js';
import { BillingAddress } from '@components/frontStore/checkout/checkout/payment/paymentStep/BillingAddress.js';
import CustomerAddressForm from '@components/frontStore/customer/address/addressForm/Index.js';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useQuery } from 'urql';
import { _ } from '../../../../../../lib/locale/translate/_.js';

const QUERY = `
  query Query($cartId: String) {
    cart(id: $cartId) {
      shippingAddress {
        id: cartAddressId
        fullName
        postcode
        telephone
        country {
          code
          name
        }
        province {
          code
          name
        }
        city
        address1
        address2
      }
    }
  }
`;

function PaymentMethodFields({ selectedMethod }) {
  const { setValue, register } = useFormContext();

  // Register the fields
  React.useEffect(() => {
    register('method.method_code', {
      validate: (value) => {
        if (!value || value === '') {
          return _('Please select a payment method');
        }
        return true;
      }
    });
    register('method.method_name');
  }, [register]);

  // Update field values when selectedMethod changes
  React.useEffect(() => {
    setValue('method.method_code', selectedMethod?.code || '', {
      shouldValidate: false
    });
    setValue('method.method_name', selectedMethod?.name || '', {
      shouldValidate: false
    });
  }, [selectedMethod, setValue]);

  return null;
}

interface StepContentProps {
  cart: {
    billingAddress: {
      id: number;
      fullName: string;
      postcode: string;
      telephone: string;
      country: {
        code: string;
        name: string;
      };
      province: {
        code: string;
        name: string;
      };
      city: string;
      address1: string;
      address2: string;
    };
    addBillingAddressApi: string;
    addPaymentMethodApi: string;
  };
}

export function StepContent({
  cart: { billingAddress, addBillingAddressApi, addPaymentMethodApi }
}: StepContentProps) {
  const { completeStep } = useCheckoutStepsDispatch();
  const [useShippingAddress, setUseShippingAddress] = useState(!billingAddress);
  const { cartId, error, paymentMethods, getPaymentMethods } = useCheckout();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = React.useState(null);

  // Update selected method when paymentMethods changes
  React.useEffect(() => {
    const selected = paymentMethods?.find((e) => e.selected === true);
    setSelectedMethod(selected || null);
  }, [paymentMethods]);

  const onSuccess = async (response) => {
    try {
      if (!response.error) {
        const selectedMethd = paymentMethods.find((e) => e.selected === true);
        const result = await fetch(addPaymentMethodApi, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            method_code: selectedMethd.code,
            method_name: selectedMethd.name
          })
        });
        const data = await result.json();
        if (!data.error) {
          await completeStep('payment');
        }
      } else {
        setLoading(false);
        toast.error(response.error.message);
      }
    } catch (e) {
      setLoading(false);
      toast.error(e.message);
    }
  };

  useEffect(() => {
    getPaymentMethods();
  }, []);

  useEffect(() => {
    if (error) {
      setLoading(false);
      toast.error(error);
    }
  }, [error]);

  const [result] = useQuery({
    query: QUERY,
    variables: {
      cartId
    }
  });
  const { data, fetching, error: queryError } = result;

  if (fetching) {
    return (
      <div className="flex justify-center items-center p-2">
        <Spinner width={25} height={25} />
      </div>
    );
  }
  if (queryError) {
    return <div className="p-5 text-critical">{error.message}</div>;
  }
  return (
    <div>
      <Form
        method="POST"
        action={addBillingAddressApi}
        onSuccess={onSuccess}
        onInvalid={() => setLoading(false)}
        id="checkoutPaymentForm"
        submitBtn={false}
      >
        <h4 className="mb-2 mt-7">{_('Billing Address')}</h4>
        <BillingAddress
          useShippingAddress={useShippingAddress}
          setUseShippingAddress={setUseShippingAddress}
        />
        {useShippingAddress === false && (
          <div style={{ display: 'block' }}>
            <CustomerAddressForm
              areaId="checkoutBillingAddressForm"
              address={billingAddress || data.cart.shippingAddress}
            />
          </div>
        )}

        {useShippingAddress === true && (
          <div style={{ display: 'none' }}>
            <CustomerAddressForm
              areaId="checkoutBillingAddressForm"
              address={data.cart.shippingAddress}
            />
          </div>
        )}

        <h4 className="mb-2 mt-7">{_('Payment Method')}</h4>
        {paymentMethods && paymentMethods.length > 0 && (
          <>
            <div className="divide-y border rounded border-divider px-5 mb-5">
              {paymentMethods.map((method) => (
                <div
                  key={method.code}
                  className="border-divider payment-method-list"
                >
                  <div className="py-5">
                    <Area id={`checkoutPaymentMethod${method.code}`} />
                  </div>
                </div>
              ))}
            </div>
            <PaymentMethodFields selectedMethod={selectedMethod} />
            <InputField type="hidden" name="type" value="billing" required />
          </>
        )}
        {(!paymentMethods || paymentMethods.length === 0) && (
          <div className="alert alert-warning">
            {_('No payment method available')}
          </div>
        )}
        <Area id="beforePlaceOrderButton" noOuter />
        <div className="form-submit-button">
          <Button
            onAction={() => {
              (
                document.getElementById(
                  'checkoutPaymentForm'
                ) as HTMLFormElement
              ).dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true })
              );
            }}
            title={_('Place Order')}
            isLoading={loading}
          />
        </div>
      </Form>
    </div>
  );
}
