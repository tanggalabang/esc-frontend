'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Element } from 'react-scroll';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import FormFooter from '@/components/form-footer';
import FormSenderInfo from '@/app/shared/logistics/shipment/create/form-sender-info';
import FormPackageInfo from '@/app/shared/logistics/shipment/create/form-package-info';
import FormShippingInfo from '@/app/shared/logistics/shipment/create/form-shipping-info';
import FormRecipientInfo from '@/app/shared/logistics/shipment/create/form-recipient-info';
import FormPaymentMethodInfo from '@/app/shared/logistics/shipment/create/form-payment-method-info';
import FormNav, {
  FormParts,
} from '@/app/shared/logistics/shipment/create/form-nav';
import {
  defaultValues,
  shipmentFormSchema,
  ShipmentFormTypes,
} from '@/app/shared/logistics/shipment/create/form-utils';
import cn from '@/utils/class-names';

const MAP_STEP_TO_COMPONENT = {
  [FormParts.ShippingInfo]: FormShippingInfo,
  [FormParts.SenderInfo]: FormSenderInfo,
  [FormParts.RecipientsInfo]: FormRecipientInfo,
  [FormParts.PaymentMethod]: FormPaymentMethodInfo,
  [FormParts.PackageInformation]: FormPackageInfo,
};

interface IndexProps {
  id?: string;
  shipment?: ShipmentFormTypes;
  className?: string;
}

export default function CreateShipment({
  id,
  shipment,
  className,
}: IndexProps) {
  const [isLoading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: defaultValues(shipment),
    resolver: zodResolver(shipmentFormSchema),
  });

  const onSubmit: SubmitHandler<ShipmentFormTypes> = (data) => {
    // set timeout ony required to display loading state of the create product button
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('create_shipping_data', data);
      toast.success('Shipment Created Successfully');
      // methods.reset();
    }, 600);
  };

  console.log('errors', methods.formState.errors);

  return (
    <div className="@container">
      <FormNav />
      <FormProvider {...methods}>
        <form
          className={cn('mt-6', className)}
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
            {Object.entries(MAP_STEP_TO_COMPONENT).map(([key, Component]) => (
              <Element
                key={key}
                name={FormParts[key as keyof typeof FormParts]}
              >
                {<Component className="pt-7 @2xl:pt-9 @3xl:pt-11" />}
              </Element>
            ))}
          </div>
          <FormFooter
            isLoading={isLoading}
            submitBtnText={id ? 'Update Shipment' : 'Create Shipment'}
          />
        </form>
      </FormProvider>
    </div>
  );
}
