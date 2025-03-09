/**
 * Response templates for the order status tool
 * Contains various messages for different scenarios in the order status flow
 */
export const ORDER_STATUS_RESPONSE = {
    /**
     * Response when the customer hasn't provided any order identification
     * Asks for both order number and email
     */
    NO_ID_NO_EMAIL: () => `The customer has not provided an order number or an email address. Ask them to provide both in order to check their order status.`,
  
    /**
     * Response when the customer provided only an order number
     * Asks for the email associated with the order
     * @param details Object containing the order ID
     */
    NO_EMAIL: (details: { orderId: string }) => `The customer provided the order number (${details.orderId}) but has not provided an email address. Ask them to provide the email associated with the order for verification.`,
  
    /**
     * Response when the customer provided only an email
     * Asks for the order number to look up details
     * @param details Object containing the email
     */
    NO_ID: (details: { email: string }) => `The customer provided the email (${details.email}) but has not provided an order number. Ask them to provide their order number to look up their order details.`,
  
    /**
     * Response when the order number doesn't exist or doesn't match the email
     * Asks the customer to double-check their information
     * @param details Object containing the order ID and email
     */
    INVALID_ORDER: (details: { orderId: string, email: string }) => `No order was found with Order Id (${details.orderId}) and email (${details.email}). Ask the customer to double-check the order number and email.`,
  
    /**
     * Response when the email doesn't match any orders
     * Asks the customer to confirm the email used for the order
     * @param details Object containing the email
     */
    INVALID_EMAIL: (details: { email: string }) => `The email address (${details.email}) is not associated with any orders in the system. Ask the customer to confirm the email they used when placing the order.`,
  
    /**
     * Success response with order details
     * Provides order status, items, and tracking information
     * @param details Object containing the order details
     */
    SUCCESS: (details: { 
      orderNumber: string, 
      status: string, 
      items: string, 
      trackingNumber: string 
    }) => `The customer's order (ID: ${details.orderNumber}) is ${details.status}. The order contains: ${details.items}.
      ${details.trackingNumber ? `Tracking link: https://tools.usps.com/go/TrackConfirmAction?tLabels=${details.trackingNumber}` : ''}
      Provide this information in a friendly, conversational way and ask if they need anything else.`
  };
  