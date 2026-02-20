import { FormButtons } from '@components/admin/FormButtons.js';
import { Form } from '@components/common/form/Form.js';
import Area from '@components/common/Area.js';
import React from 'react';
import { toast } from 'react-toastify';

export default function ProductNewForm({
  action,
  gridUrl
}: {
  action: string;
  gridUrl: string;
}) {
  return (
    <Form
      id="productNewForm"
      method="POST"
      action={action}
      submitBtn={false}
      onSuccess={(response) => {
        toast.success('Product created successfully!');
        const editUrl = response.data.links.find(
          (link) => link.rel === 'edit'
        ).href;
        window.location.href = editUrl;
        setTimeout(() => {
          window.location.href = gridUrl;
        }, 1500);
      }}
    >
    
    {/* Dynamic Areas for Admin to Customize */}
      <div className="grid grid-cols-3 gap-x-5 grid-flow-row">
        <div className="col-span-2 grid grid-cols-1 gap-5 auto-rows-max">
          <Area id="leftSide" noOuter />
        </div>
        <div className="col-span-1 grid grid-cols-1 gap-5 auto-rows-max">
          <Area id="rightSide" noOuter />
        </div>
      </div>

{/* Static Required Fields */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Enter product name"
          required
          className="form-input mt-1 block w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          SKU
        </label>
        <input
          type="text"
          name="sku"
          placeholder="Enter SKU"
          required
          className="form-input mt-1 block w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Meta Link
        </label>
        <input
          type="url"
          name="meta_link"
          placeholder="https://example.com/meta"
          required
          className="form-input mt-1 block w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          URL Link
        </label>
        <input
          type="url"
          name="url_link"
          placeholder="https://example.com/product"
          required
          className="form-input mt-1 block w-full"
        />
      </div>

      {/* Submit / Cancel Buttons */}
      <FormButtons formId="productNewForm" cancelUrl={gridUrl} />
    </Form>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 10
};

export const query = `
  query Query {
    action: url(routeId: "createProduct"),
    gridUrl: url(routeId: "productGrid")
  }
`;
