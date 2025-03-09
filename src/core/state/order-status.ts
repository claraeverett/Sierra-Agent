import { Order } from '@/types/types';

/**
 * Class for managing order status
 * Stores and retrieves order information
 */
export class OrderStore {
  private currentOrder: Order | null = null;
  private pastOrders: Set<Order> = new Set();

  setCurrentOrder(order: Order | null) {
    this.currentOrder = order;
    if (order) {
      this.pastOrders.add(order);
    }
  }

  getCurrentOrder(): Order | null {
    return this.currentOrder;
  }

  getPastOrders(): Order[] {
    return Array.from(this.pastOrders);
  }

  clear() {
    this.currentOrder = null;
    this.pastOrders.clear();
  }
}