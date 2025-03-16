import { Order, ConversationEntry, PromoCode, PreferenceKey, Intent, CustomerInfo, HikingParams } from '@/types/types';
import { HikingPreferences } from '@/core/state/user-preferences';

/**
 * Main state management class for the Sierra Outfitters agent
 * Handles conversation history, customer preferences, order information, and more
 */
export class State {
  // Public properties
  public pastOrderInfo: Set<Order> = new Set();
  public orderInfo: Order | null = null;
  public conversation: ConversationEntry[] = [];
  public userId: string;
  public sessionId: string;
  public promoCode: PromoCode | null = null;
  public unresolvedIntents: Set<Intent> = new Set();
  
  // Private properties
  private customerInfo: CustomerInfo | null = null;
  private hikingPreferences: HikingPreferences;
  private followUpCount: Map<Intent, number> = new Map();
  private hikingRecommendations: Set<HikingParams> = new Set();

  /**
   * Creates a new State instance
   * @param userId The unique identifier for the user
   * @param sessionId The session identifier
   */
  constructor(userId: string, sessionId: string) {
    this.userId = userId;
    this.sessionId = sessionId;
    this.hikingPreferences = new HikingPreferences();
    this.followUpCount = new Map();
    this.hikingRecommendations = new Set();
  }

  /**
   * Follow-up count management
   * These methods track how many times we've followed up on specific intents
   */
  
  /**
   * Gets the follow-up count for a specific intent
   * @param intent The intent to check
   * @returns The number of follow-ups for this intent
   */
  getFollowUpCount(intent: Intent): number {
    return this.followUpCount.get(intent) || 0;
  }

  /**
   * Increments the follow-up count for a specific intent
   * @param intent The intent to increment
   */
  incrementFollowUpCount(intent: Intent) {
    this.followUpCount.set(intent, (this.followUpCount.get(intent) || 0) + 1);
  }

  /**
   * Resets the follow-up count for a specific intent
   * @param intent The intent to reset
   */
  resetFollowUpCount(intent: Intent) {
    this.followUpCount.set(intent, 0);
  }

  /**
   * Clears all follow-up counts
   */
  clearAllFollowUpCounts() {
    this.followUpCount.clear();
  }

  /**
   * Customer preferences management
   * These methods handle user preferences for various features
   */
  
  /**
   * Gets a specific customer preference
   * @param key The preference key to retrieve
   * @returns The preference value
   */
  getPreference(key: PreferenceKey): string {
    return this.hikingPreferences.getPreference(key);
  }

  /**
   * Sets a specific customer preference
   * @param key The preference key to set
   * @param value The preference value
   */
  setPreference(key: PreferenceKey, value: string) {
    this.hikingPreferences.setPreference(key, value);
  }

  /**
   * Clears a specific customer preference
   * @param key The preference key to clear
   */
  clearPreference(key: PreferenceKey) {
    this.hikingPreferences.clearPreference(key);
  }

  /**
   * Order information management
   * These methods handle customer order data
   */
  
  /**
   * Clears the current order information
   */
  clearOrderInfo() {
    this.orderInfo = null;
  }

  /**
   * Adds an order to the past order history
   * @param orderInfo The order to add
   */
  addPastOrderInfo(orderInfo: Order) {
    this.pastOrderInfo.add(orderInfo);
  }

  /**
   * Gets all past orders
   * @returns Array of past orders
   */
  getPastOrderInfo(): Order[] {
    return Array.from(this.pastOrderInfo);
  }

  /**
   * Intent management
   * These methods track and resolve user intents
   */
  
  /**
   * Adds an intent to the unresolved intents set
   * @param intent The intent to add
   */
  addUnresolvedIntents(intent: Intent) {
    this.unresolvedIntents.add(intent);
  }

  /**
   * Marks an intent as resolved
   * @param intent The intent to resolve
   */
  resolveIntent(intent: Intent) {
    this.unresolvedIntents.delete(intent);
  }

  /**
   * Gets all unresolved intents
   * @returns Array of unresolved intent strings
   */
  getUnresolvedIntents(): string[] {
    return Array.from(this.unresolvedIntents);
  }

  /**
   * Promo code management
   * These methods handle promotional codes
   */
  
  /**
   * Updates the current promo code
   * @param promoCode The promo code to set
   */
  updatePromoCode(promoCode: PromoCode) {
    this.promoCode = promoCode;
  }

  /**
   * Clears the current promo code
   */
  clearPromoCode() {
    this.promoCode = null;
  }
  
  /**
   * Gets the current order information
   * @returns The current order or null
   */
  getOrderInfo(): Order | null {
    return this.orderInfo;
  }

  /**
   * Gets the current promo code
   * @returns The current promo code or null
   */
  getPromoCode(): PromoCode | null {
    return this.promoCode;
  }

  /**
   * Updates the current order information
   * @param partialOrderInfo The order information to update
   */
  updateOrderInfo(partialOrderInfo: Partial<Order>) {
    if (!this.orderInfo) {
      this.orderInfo = { 
        email: "", 
        orderNumber: "", 
        status: "Processing", 
        trackingNumber: "", 
        productsOrdered: [], 
        customerName: "" 
      };
    }
  
    this.orderInfo = { ...this.orderInfo, ...partialOrderInfo };
  }
  
  /**
   * Checks if the order information is complete
   * @returns True if both email and order number are provided
   */
  hasCompleteOrderInfo(): boolean {
    return this.orderInfo?.email !== "" && this.orderInfo?.orderNumber !== "";
  }

  /**
   * Customer information management
   * These methods handle basic customer data
   */
  
  /**
   * Gets the customer information
   * @returns The customer info or null
   */
  getCustomerInfo(): CustomerInfo | null {
    return this.customerInfo;
  }

  /**
   * Updates the customer information
   * @param name The customer's name
   * @param email The customer's email
   */
  updateCustomerInfo(name: string, email: string) {
    this.customerInfo = { name, email };
  }

  /**
   * Conversation management
   * These methods handle the conversation history
   */
  
  /**
   * Adds an entry to the conversation history
   * @param role The role of the message sender
   * @param content The message content
   */
  addConversationEntry(role: 'user' | 'system' | 'assistant', content: string) {
    this.conversation.push({ role, content });
  }

  /**
   * Gets the entire conversation history
   * @returns Array of conversation entries
   */
  getConversationHistory(): ConversationEntry[] {
    return this.conversation;
  }

  /**
   * Clears the conversation history
   */
  clearConversationHistory() {
    this.conversation = [];
  }

  /**
   * Gets the last N conversation entries
   * @param n The number of entries to retrieve
   * @returns Array of the last N conversation entries
   */
  getLastNConversations(n: number): ConversationEntry[] {
    return this.conversation.slice(-n);
  }

  getHikingRecommendations(): HikingParams[] {
    return Array.from(this.hikingRecommendations);
  }

  addHikingRecommendation(hike: HikingParams) {
    this.hikingRecommendations.add(hike);
  }

  clearHikingRecommendations() {
    this.hikingRecommendations.clear();
  }
}

export { ConversationEntry };