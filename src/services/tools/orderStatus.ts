import { ToolResponse } from './tools';
import { Tool } from '../../types/types';
import { State } from '../../state/state';
import { ORDER_STATUS_RESPONSE } from '../../prompts/orderStatus';
import { getOrderStatus, getProductDetails } from '../../data/store';

// Parameter types for order status requests
interface OrderStatusParams {
  orderId?: string;
  email?: string;
}

export const orderStatusTool: Tool = {
  name: 'orderStatus',
  description: 'Check status of orders and order history',
  execute: async (params: OrderStatusParams, state: State): Promise<ToolResponse> => {    
    // Extract parameters from request
    state.addUnresolvedIntents('OrderStatus');
    let orderId = params.orderId;
    let email = params.email;

    // Check state for previously stored order information
    // This handles cases where the user provided info in previous messages
    if (!orderId || !email) {
      const storedOrder = state.getOrderInfo();
      if (storedOrder) {
        orderId = orderId || storedOrder.orderNumber;
        email = email || storedOrder.email;
      }
    }

    // Update state with current order info (even if incomplete)
    state.updateOrderInfo({ orderNumber: orderId || "", email: email || "" });

    // Handle missing required parameters
    if (!state.hasCompleteOrderInfo()) {
      const response = 
        !orderId && !email ? ORDER_STATUS_RESPONSE.NO_ID_NO_EMAIL() : 
        !orderId ? ORDER_STATUS_RESPONSE.NO_ID({email: email || ''}) : 
        !email ? ORDER_STATUS_RESPONSE.NO_EMAIL({orderId: orderId || ''}) : 
        ORDER_STATUS_RESPONSE.NO_ID_NO_EMAIL();

      return {
        success: false,
        promptTemplate: response
      };
    }

    // Double-check orderId exists (typescript safety)
    if (!orderId) {
      return {
        success: false,
        promptTemplate: ORDER_STATUS_RESPONSE.NO_ID_NO_EMAIL()
      };
    }

    if (!email) {
      return {
        success: false,
        promptTemplate: ORDER_STATUS_RESPONSE.NO_EMAIL({orderId: orderId || ''})
      };
    }

    // Look up order and verify email matches
    const order = getOrderStatus(orderId, email);
    const validEmail = order?.email;

    if (!order || validEmail != email) {
      return {
        success: false,
        promptTemplate:  ORDER_STATUS_RESPONSE.INVALID_ORDER({orderId: orderId || '', email: email || ''})
      };
    }

    // Order found - update state with full details
    state.updateCustomerInfo(order.customerName, order.email);

    const items = order.productsOrdered.map(sku => {
      const product = getProductDetails(sku);
      return product ? product.productName : sku;
    }) || [];

    state.resolveIntent('OrderStatus');
    state.addPastOrderInfo({
      customerName: order.customerName,
      email: order.email,
      orderNumber: order.orderNumber,
      trackingNumber: order.trackingNumber,
      productsOrdered: items,
      status: order.status
    });

    state.clearOrderInfo();

    // Return successful response with order details
    return {
      success: true,
      details: {
        customerName: order.customerName,
        orderId: order.orderNumber,
        trackingNumber: order.trackingNumber,
        status: order.status,
        items: items.join(", "),
      },
      promptTemplate: ORDER_STATUS_RESPONSE.SUCCESS({
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber || '',
        status: order.status,
        items: items.join(", "),
      })
    };
  }
};  
