import { State } from '../state/state';
import { ToolResponse } from '../services/tools/tools';
  
  export interface Product {
    productName: string;
    sku: string;
    inventory: number;
    description: string;
    tags: string[];
  }
  
  export type Intent = 
    | 'OrderStatus' 
    | 'EarlyRisers' 
    | 'ProductAvailability'
    | 'ProductRecommendation' 
    | 'HikingRecommendation' 
    | 'General' 
    | 'ProvideOrderInformation';

    export type ConversationEntry = {
    role: 'user' | 'system' | 'assistant';
    content: string;
  };

  export interface IntentClassification {
    intents: string[];
    params: Record<string, any>;
  }

  export interface Tool {
    name: string;
    description: string;
    execute: (params: any, state: State) => Promise<ToolResponse>;
  }

  export interface Order {
    customerName: string;
    email: string;
    orderNumber: string;
    productsOrdered: string[];
    status: string;
    trackingNumber: string | null;
  }

  export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Error' | 'In-Transit';
