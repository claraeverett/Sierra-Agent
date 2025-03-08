import { Order, ConversationEntry } from '../types/types';
import { PromoCode } from '../types/earlyRisers';


interface CustomerInfo {
  name: string;
  email: string;
}

export class State {
  public pastOrderInfo: Set<Order> = new Set();
  public orderInfo: Order | null = null;
  public conversation: ConversationEntry[] = [];
  public userId: string;
  public sessionId: string;
  public promoCode: PromoCode | null = null;
  public extractedParams: Record<string, any> = {};
  private customerInfo: CustomerInfo | null = null;

  public unresolvedIntents: Set<string> = new Set();
  public currentIntent?: string;

  constructor(userId: string, sessionId: string) {
    this.userId = userId;
    this.sessionId = sessionId;
  }

  clearOrderInfo() {
    this.orderInfo = null;
  }

  addPastOrderInfo(orderInfo: Order) {
    this.pastOrderInfo.add(orderInfo);
  }

  getPastOrderInfo(): Order[] {
    return Array.from(this.pastOrderInfo);
  }

  resolveIntent(intent: string) {
    this.unresolvedIntents.delete(intent);
  }

  getUnresolvedIntents(): string[] {
    return Array.from(this.unresolvedIntents);
  }

  updatePromoCode(promoCode: PromoCode) {
    this.promoCode = promoCode;
  }

  clearPromoCode() {
    this.promoCode = null;
  }
  
  getOrderInfo(): Order | null {
    return this.orderInfo;
  }

  getPromoCode(): PromoCode | null {
    return this.promoCode;
  }

  updateOrderInfo(partialOrderInfo: Partial<Order>) {
    if (!this.orderInfo) {
      this.orderInfo = { email: "", orderNumber: "", status: "Processing", trackingNumber: "", productsOrdered: [], customerName: "" };
    }
  
    this.orderInfo = { ...this.orderInfo, ...partialOrderInfo };
  }
  
  hasCompleteOrderInfo(): boolean {
    return this.orderInfo?.email !== "" && this.orderInfo?.orderNumber !== "";
  }

  getCustomerInfo(): CustomerInfo | null {
    return this.customerInfo;
  }

  updateCustomerInfo(name: string, email: string) {
    this.customerInfo = { name, email };
  }

  addConversationEntry(role: 'user' | 'system' | 'assistant', content: string) {
    this.conversation.push({ role, content });
  }

  getConversationHistory(): ConversationEntry[] {
    return this.conversation;
  }

  clearConversationHistory() {
    this.conversation = [];
  }

  getLastNConversations(n: number): ConversationEntry[] {
    return this.conversation.slice(-n);
  }
}

export { ConversationEntry };