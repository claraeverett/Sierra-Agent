import { ordersMap, productsMap } from "./mockData/data";
import { Order, Product } from "../types/types";

/**
 * Retrieves an order by order number and email.
 * @param orderId Order number to search
 * @param email Email associated with the order
 */
export function getOrderStatus(orderId: string, email: string): Order | null {
if (!orderId.startsWith("#")) {
    orderId = "#" + orderId;
}
  const order = ordersMap[orderId];
  if (!order || order.email !== email) {
    return null;
  }
  return order;
}

/**
 * Retrieves a product by SKU.
 * @param sku Product SKU to search
 */
export function getProductDetails(sku: string): Product | null {
  return productsMap[sku] || null;
}
