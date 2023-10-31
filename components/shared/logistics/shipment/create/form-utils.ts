import { z } from 'zod';

// main product form component for create and update
// export const productCustomFields = [{ label: '', value: '' }];
// export const productVariantFields = [{ name: '', value: '' }];
// export const locationShippingFields = [{ name: '', shippingCharge: '' }];

// form zod validation schema
export const shipmentFormSchema = z.object({
  country: z
    .string({
      required_error: 'Country is required',
    })
    .min(1, { message: 'you must have to select a country' }),
  agency: z.string().optional(),
  officeOrigin: z.string().optional(),
  shippingMethod: z.string().optional(),
  packagingType: z.string().optional(),
  courierCompany: z.string().optional(),
  deliveryTime: z.string().optional(),
  shippingInfoAttachment: z.string().optional(),
  senderName: z.string().optional(),
  senderAddress: z.string().optional(),
  senderEmail: z.string().email().optional(),
  senderPhone: z.string().optional(),
  notifySenderViaSMS: z.boolean().optional(),
  recipientName: z.string().optional(),
  recipientAddress: z.string().optional(),
  recipientEmail: z.string().email().optional(),
  recipientPhone: z.string().optional(),
  notifyRecipientViaSMS: z.boolean().optional(),
  paidBy: z.string().optional(),
  paymentMethod: z.string().optional(),
  paymentType: z.string().optional(),
  payeeName: z.string().optional(),
  payeeCountry: z.string().optional(),
  payeeCity: z.string().optional(),
  payeeStreetAddress: z.string().optional(),
  packageAmount: z.string().optional(),
  packageWidth: z.string().optional(),
  packageHeight: z.string().optional(),
  packageLength: z.string().optional(),
  packageWeight: z.string().optional(),
  packageDescription: z.string().optional(),
  packageInfoAttachment: z.string().optional(),
  giftType: z.string().optional(),
  giftFrom: z.string().optional(),
  giftTo: z.string().optional(),
  giftMessage: z.string().optional(),
});

// generate form types from zod validation schema
export type ShipmentFormTypes = z.infer<typeof shipmentFormSchema>;

export function defaultValues(shipment?:ShipmentFormTypes) {
  return {
    country: shipment?.country ?? '',
    agency: shipment?.agency ?? '',
    officeOrigin: shipment?.officeOrigin ?? '',
    shippingMethod: shipment?.shippingMethod ?? '',
    packagingType: shipment?.packagingType ?? '',
    courierCompany: shipment?.courierCompany ?? '',
    deliveryTime: shipment?.deliveryTime ?? '',
    shippingInfoAttachment: shipment?.shippingInfoAttachment ?? '',
    senderName: shipment?.senderName ?? '',
    senderAddress: shipment?.senderAddress ?? '',
    senderEmail: shipment?.senderEmail ?? '',
    senderPhone: shipment?.senderPhone ?? '',
    notifySenderViaSMS: shipment?.notifySenderViaSMS ?? false,
    recipientName: shipment?.recipientName ?? '',
    recipientAddress: shipment?.recipientAddress ?? '',
    recipientEmail: shipment?.recipientEmail ?? '',
    recipientPhone: shipment?.recipientPhone ?? '',
    notifyRecipientViaSMS: shipment?.notifyRecipientViaSMS ?? false,
    paidBy: shipment?.paidBy ?? '',
    paymentMethod: shipment?.paymentMethod ?? '',
    paymentType: shipment?.paymentType ?? '',
    payeeName: shipment?.payeeName ?? '',
    payeeCountry: shipment?.payeeCountry ?? '',
    payeeCity: shipment?.payeeCity ?? '',
    payeeStreetAddress: shipment?.payeeStreetAddress ?? '',
    packageAmount: shipment?.packageAmount ?? '',
    packageWidth: shipment?.packageWidth ?? '',
    packageHeight: shipment?.packageHeight ?? '',
    packageLength: shipment?.packageLength ?? '',
    packageWeight: shipment?.packageWeight ?? '',
  };
}
