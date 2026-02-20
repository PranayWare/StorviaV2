// MethodForm.tsx
import { Card } from '@components/admin/Card.js';
import Button from '@components/common/Button.js';
import { InputField } from '@components/common/form/InputField.js';
import { ReactSelectField } from '@components/common/form/ReactSelectField.js';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ShippingMethod } from './Method.js';

async function createShippingMethod(name: string) {
  const res = await fetch('/api/shippingMethods', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name })
  });
  
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Invalid response: expected JSON but got ${contentType}`);
  }

  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(json.error?.message || `HTTP ${res.status}`);
  }
  return json.data;
}

export interface MethodFormProps {
  formMethod?: 'POST' | 'PATCH';
  saveMethodApi: string;
  onSuccess: () => void;
  reload: () => void;
  method?: ShippingMethod;
}

export function MethodForm({
  formMethod,
  saveMethodApi,
  onSuccess,
  reload,
  method
}: MethodFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm({
    defaultValues: {
      name: method?.name ?? '',
      cost: method?.cost?.value ?? '',
      calculation_type: 'flat_rate',
      condition_type: 'none'
    }
  });

  const calculationOptions = [
    { value: 'flat_rate', label: 'Fixed Cost' },
    { value: 'price_based_rate', label: 'Price Based' },
    { value: 'weight_based_rate', label: 'Weight Based' }
  ];

  const handleSave = async () => {
    const data = form.getValues();

    try {
      setIsSubmitting(true);

      let methodId: string | null = null;

      // If creating new method, create it first
      if (!method) {
        const created = await createShippingMethod(data.name);
        methodId = String(
          created?.shipping_method_id || created?.method_id || created?.id
        );

        if (!methodId) {
          throw new Error('Missing method_id from createShippingMethod response');
        }
      } else {
        methodId = String(method.methodId);
      }

      const payload: any = {
        method_id: methodId,
        calculation_type: String(data.calculation_type || 'flat_rate'),
        condition_type: String(data.condition_type || 'none'),
        cost: String(data.cost),
        is_enabled: true
      };

      // Call the save API
      const res = await fetch(saveMethodApi, {
        method: formMethod || 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error?.message || `HTTP ${res.status}`);
      }

      const json = await res.json();
      toast.success('Shipping method saved');
      await reload();
      onSuccess();
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-5">
      <FormProvider {...form}>
        <Card.Session title="Method name">
          <InputField
            name="name"
            placeholder="Enter method name"
            required
            validation={{ required: 'Method name is required' }}
          />
        </Card.Session>

        <Card.Session title="Calculation Type">
          <ReactSelectField
            name="calculation_type"
            options={calculationOptions}
            isMulti={false}
            hideSelectedOptions={false}
            aria-label="Select calculation type"
            placeholder="Select calculation type"
          />
        </Card.Session>

        <Card.Session title="Cost">
          <InputField
            name="cost"
            type="number"
            placeholder="Enter shipping cost"
            required
            validation={{ required: 'Cost is required' }}
          />
        </Card.Session>

        <Card.Session>
          <div className="flex justify-end gap-2">
            <Button
              title={isSubmitting ? 'Saving...' : 'Save'}
              variant="primary"
              onAction={handleSave}
            />
          </div>
        </Card.Session>
      </FormProvider>
    </div>
  );
}
