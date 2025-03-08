export const GENERAL_RESPONSE = "I'm not sure how to help with that specific request. Could you please rephrase or provide more details?";

export const EARLY_RISERS_RESPONSE = {
  VALID_TIME_NEW_CODE: (code: string, discount: string,) => `I've generated a new Early Risers promo code for the customer:
Code: ${code}
Discount: ${discount}
Please share this with them in an enthusiastic way and mention it's valid until 10am PT today.`,
  VALID_TIME_EXISTING_CODE: (code: string, discount: string, endTime: number) => `The customer already has an active Early Risers promo code from today.
    Code: ${code}
    Discount: ${discount}
    Please inform them in a friendly way and remind them the code is valid until ${endTime}:00 AM PT today.`,
  INVALID_TIME: (currentTime: string, nextValidTime: string) => `The Early Risers promotion is only available between 8:00 - 10:00 AM PT.
Current time: ${currentTime}
Next available time: ${nextValidTime}

Please inform the customer about the valid hours and when they can try again. Keep it short and concise.`
};

export const ORDER_STATUS_RESPONSE = {
  /** The customer has not provided an order ID or email */
  NO_ID_NO_EMAIL: () => `The customer has not provided an order number or an email address. Ask them to provide both in order to check their order status.`,

  /** The customer provided only an order number but not an email */
  NO_EMAIL: (details: { orderId: string }) => `The customer provided the order number (${details.orderId}) but has not provided an email address. Ask them to provide the email associated with the order for verification.`,

  /** The customer provided only an email but not an order number */
  NO_ID: (details: { email: string }) => `The customer provided the email (${details.email}) but has not provided an order number. Ask them to provide their order number to look up their order details.`,

  /** The provided order number does not exist in the system */
  INVALID_ORDER: (details: { orderId: string, email: string }) => `No order was found with Order Id (${details.orderId}) and email (${details.email}). Ask the customer to double-check the order number and email.`,

  /** The provided email does not match any orders in the system */
  INVALID_EMAIL: (details: { email: string }) => `The email address (${details.email}) is not associated with any orders in the system. Ask the customer to confirm the email they used when placing the order.`,

  /** The customer successfully provided valid order details */
  SUCCESS: (details: { 
    orderNumber: string, 
    status: string, 
    items: string, 
    trackingNumber: string 
  }) => `The customer's order (ID: ${details.orderNumber}) is ${details.status}. The order contains: ${details.items}.
    ${details.trackingNumber ? `Tracking link: https://tools.usps.com/go/TrackConfirmAction?tLabels=${details.trackingNumber}` : ''}
    Provide this information in a friendly, conversational way and ask if they need anything else.`
};
