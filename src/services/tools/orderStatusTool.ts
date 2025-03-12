import { ToolResponse } from '@/services/tools/toolExport';
import { Tool, OrderStatusParams } from '@/types/types';
import { State } from '@/core/state/state';
import { ORDER_STATUS_RESPONSE } from '@/prompts/order-status-prompts';
import { getOrderStatus, getProductDetails } from '@/data/store';
import { Intent } from '@/types/types';

export const orderStatusTool: Tool = {
  name: 'orderStatus',
  description: 'Check status of orders and order history',
  execute: async (params: OrderStatusParams, state: State): Promise<ToolResponse> => {  
    
    console.log("Order Status Tool", params, state);
    console.log(" ---------------------------------------------------------------")
    // Extract parameters from request
    state.addUnresolvedIntents(Intent.OrderStatus);
    let orderId = params.orderId?.toUpperCase().trim();
    let email = params.email?.toLowerCase().trim();

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

    
    state.resolveIntent(Intent.OrderStatus);
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
