// ZoneForm.tsx
import { Card } from '@components/admin/Card.js';
import Spinner from '@components/admin/Spinner.js';
import Button from '@components/common/Button.js';
import { Form } from '@components/common/form/Form.js';
import { InputField } from '@components/common/form/InputField.js';
import { ReactSelectField } from '@components/common/form/ReactSelectField.js';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'urql';
import { ShippingZone } from './Zone.js';

export interface ZoneFormProps {
  formMethod?: 'POST' | 'PATCH';
  saveZoneApi: string;
  onSuccess: () => void;
  reload: () => void;
  zone?: ShippingZone;
}

interface CountryOption {
  value: string;
  label: string;
  provinces?: ProvinceOption[];
}

interface ProvinceOption {
  value: string;
  label: string;
}

const CountriesQuery = `
  query Country {
    countries {
      value: code
      label: name
      provinces {
        value: code
        label: name
      }
    }
  }
`;

export function ZoneForm({
  formMethod,
  saveZoneApi,
  onSuccess,
  reload,
  zone
}: ZoneFormProps) {
  const form = useForm({
    defaultValues: {
      name: zone?.name ?? '',
      country: zone?.country?.code ?? '',
      provinces: zone?.provinces?.map((p) => p.code) ?? []
    }
  });

  const countryWatch = form.watch('country');

  const [{ data, fetching, error }] = useQuery({
    query: CountriesQuery
  });

  if (fetching) return <Spinner />;
  if (error) return <p className="text-critical">Error loading countries</p>;

  const countryOptions: CountryOption[] = data?.countries ?? [];
  const provinceOptions: ProvinceOption[] =
    countryOptions.find((c) => c.value === countryWatch)?.provinces ?? [];

  return (
    <Card title="Create a shipping zone">
      <Form
        form={form}
        id="createShippingZone"
        method={formMethod || 'POST'}
        action={saveZoneApi} // required
        submitBtn={false}
        onSuccess={async () => {
          await reload();
          onSuccess();
        }}
      >
        <Card.Session title="Zone name">
          <InputField
            name="name"
            placeholder="Enter zone name"
            required
            validation={{ required: 'Zone name is required' }}
            defaultValue={zone?.name ?? ''}
          />
        </Card.Session>

        <Card.Session title="Country">
          <ReactSelectField
            name="country"
            options={countryOptions}
            isMulti={false}
            hideSelectedOptions={false}
            defaultValue={zone?.country?.code ?? ''}
            aria-label="Select country"
            placeholder="Select country"
          />
        </Card.Session>

        <Card.Session title="Provinces/States">
          <ReactSelectField
            name="provinces"
            options={provinceOptions}
            isMulti
            hideSelectedOptions={false}
            defaultValue={zone?.provinces?.map((p) => p.code) ?? []}
            placeholder="Select provinces/states"
            aria-label="Select provinces or states"
          />
        </Card.Session>

        <Card.Session>
          <div className="flex justify-end gap-2">
            <Button
              title="Save"
              variant="primary"
              onAction={() => {
                const form = document.getElementById(
                  'createShippingZone'
                ) as HTMLFormElement | null;
                if (form) {
                  form.dispatchEvent(
                    new Event('submit', { cancelable: true, bubbles: true })
                  );
                }
              }}
            />
          </div>
        </Card.Session>
      </Form>
    </Card>
  );
}
