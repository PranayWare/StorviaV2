import { Card } from '@components/admin/Card.js';
import { InputField } from '@components/common/form/InputField.js';
import { RadioGroupField } from '@components/common/form/RadioGroupField.js';
import { ToggleField } from '@components/common/form/ToggleField.js';
import React from 'react';

interface RazorpayPaymentProps {
  setting: {
    razorpayPaymentStatus: true | false | 0 | 1;
    razorpayDisplayName: string;
    razorpayKeyId: string;
    razorpayEnvironment: string;
  };
}

export default function RazorpayPayment({
  setting: {
    razorpayPaymentStatus,
    razorpayDisplayName,
    razorpayKeyId,
    razorpayEnvironment
  }
}: RazorpayPaymentProps) {
  return (
    <Card title="Razorpay Payment">
      <Card.Session>
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 items-center flex">
            <h4>Enable?</h4>
          </div>
          <div className="col-span-2">
            <ToggleField
              name="razorpayPaymentStatus"
              defaultValue={razorpayPaymentStatus}
              trueValue={1}
              falseValue={0}
            />
          </div>
        </div>
      </Card.Session>

      <Card.Session>
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 items-center flex">
            <h4>Display Name</h4>
          </div>
          <div className="col-span-2">
            <InputField
              label="Display Name"
              name="razorpayDisplayName"
              placeholder="Display Name"
              defaultValue={razorpayDisplayName}
            />
          </div>
        </div>
      </Card.Session>

      <Card.Session>
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 items-center flex">
            <h4>Key ID</h4>
          </div>
          <div className="col-span-2">
            <InputField
              label="Razorpay Key ID"
              name="razorpayKeyId"
              placeholder="rzp_test_xxxxxxxxx"
              defaultValue={razorpayKeyId}
              helperText="Only the public key ID is stored here. Keep the secret key in environment variables."
            />
          </div>
        </div>
      </Card.Session>

      <Card.Session>
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 items-center flex">
            <h4>Environment</h4>
          </div>
          <div className="col-span-2">
            <RadioGroupField
              label="Environment"
              name="razorpayEnvironment"
              defaultValue={razorpayEnvironment}
              options={[
                { label: 'Test', value: 'test' },
                { label: 'Live', value: 'live' }
              ]}
            />
          </div>
        </div>
      </Card.Session>
    </Card>
  );
}

export const layout = {
  areaId: 'paymentSetting',
  sortOrder: 20
};

export const query = `
  query Query {
    setting {
      razorpayPaymentStatus
      razorpayDisplayName
      razorpayKeyId
      razorpayEnvironment
    }
  }
`;

