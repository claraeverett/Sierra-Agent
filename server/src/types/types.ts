import { State } from '@/core/state/state';
import { ToolResponse } from '@/services/tools/toolExport';

/**
 * Interface for resolve order issue parameters
 */
export interface ResolveOrderIssueParams {
  orderId: string;
  email: string;
  resolution: string;
  confidenceScore: number;
  reason: string;
}
  
/**
 * Product information structure
 */
export interface Product {
  productName: string;
  sku: string;
  inventory: number;
  description: string;
  tags: string[];
}

/**
 * Supported intents for the agent
 */
export enum Intent {
  OrderStatus = 'OrderStatus',
  EarlyRisers = 'EarlyRisers',
  HikingRecommendation = 'HikingRecommendation',
  General ='General',
  HumanHelp = 'HumanHelp',
  ResolveOrderIssue = 'ResolveOrderIssue',
  ProductInventory= 'ProductInventory',
  ProductRecommendation = 'ProductRecommendation',
  SearchFAQ = 'SearchFAQ',
}

/**
 * Structure for conversation entries
 */
export type ConversationEntry = {
  role: 'user' | 'system' | 'assistant';
  content: string;
};

/**
 * Intent classification result structure
 */
export interface IntentClassification {
  intents: string[];
  params: Record<string, any>;
  language: 'en' | 'es';
}

/**
 * Tool interface for all agent tools
 */
export interface Tool {
  name: string;
  description: string;
  execute: (params: any, state: State) => Promise<ToolResponse>;
}

/**
 * Customer order information
 */
export interface Order {
  customerName: string;
  email: string;
  orderNumber: string;
  productsOrdered: string[];
  status: string;
  trackingNumber: string | null;
}

/**
 * Possible order status values
 */
export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Error' | 'In-Transit';

/**
 * Promo code information
 */
export interface PromoCode {
  code: string;
  createdAt: Date;
  productName?: string;
}

/**
 * Enum for customer preference keys
 */
export enum PreferenceKey {
  location = 'hikingLocations',
  length = 'hikingLength',
  difficulty = 'hikingDifficulty',
}

/**
 * Interface for human help parameters
 */
export interface HumanHelpParams {
  customerRequest: string;
}

/**
 * Interface for customer information
 */
export interface CustomerInfo {
  name: string;
  email: string;
}

/**
 * Interface for early risers parameters
 */
export interface EarlyRisersParams {
  productName?: string;
}

/**
 * Interface for hiking parameters
 */
export interface HikingParams {
  location: string;
  difficulty?: "easy" | "moderate" | "hard";
  length?: number; // in miles
  weather?: string;
  hikes?: HikingResponse;
}

/**
 * Interface for general parameters
 */
export interface GeneralParams {
  customerRequest: string;
}

/**
 * Interface for order status parameters
 */
export interface OrderStatusParams {
  orderId?: string;
  email?: string;
}

/**
 * Interface for FAQ parameters
 */
export interface FAQParams {
  query: string;
}

/**
 * Interface for hiking response
 */
export interface HikingResponse {
  region: RegionInfo;
  trails: HikingTrail[];
}

/**
 * Interface for region information
 */
export interface RegionInfo {
  name: string;
  zipcode: string;
  country_code: string;
  latitude: number;
  longitude: number;
}

/**
 * Interface for hiking trail information
 */
export interface HikingTrail {
  name: string;
  location: string;
  difficulty: string;
  length: string;
  elevation_gain: string;
  latitude: number;
  longitude: number;
  considerations: string;
}

/**
 * Interface for product inventory parameters
 */
export interface ProductInventoryParams {
  productSku: string;
  productName: string;
  query: string;
}