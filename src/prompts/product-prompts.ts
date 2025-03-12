import { Product } from '@/types/types';

/**
 * Prompt templates for product inventory tool
 * Contains various messages for different scenarios in the product inventory flow
 */
export const PRODUCT_INVENTORY_PROMPT = {

    NO_INFORMATION: `The customer has not provided any information. Ask them to provide a SKU or product name to check the inventory.`,

    NO_SKU: `The customer has not provided a SKU. Ask them to provide a SKU or product name to check the inventory.`,

    NO_PRODUCT_FOUND: (sku: string) => `Tell the customer that no product was found with SKU: ${sku}`,

    PRODUCTS_SUGGESTIONS: (products: Product[]) => `Tell the customer that the following products partially match their query: ${products.map(product => product.productName).join(', ')} and their inventory: ${products.map(product => `${product.productName} (SKU: ${product.sku}) has ${product.inventory} units in stock.`).join(', ')}    .`,

    PRODUCT_FOUND: (product: Product) => `Tell the user that the product **${product.productName}** (SKU: ${product.sku}) has **${product.inventory}** units in stock. Ask them if they would like to check the inventory of another product.`,

    PRODUCT_NOT_FOUND: (sku: string) => `Tell the user that no product was found with SKU: ${sku}`,
};

/**
 * Prompt templates for product recommendation tool
 * Contains various messages for different scenarios in the product recommendation flow
 */
export const PRODUCT_RECOMMENDATION_PROMPT = {
    ERROR: `Tell the customer that there was an error recommending a product.`,

    
    PRODUCTS_FOUND: (products: Product[]) => 
        `Based on the customer's preferences, recommend these products:
        ${products.map((product, index) => 
            `${index + 1}. **${product.productName}** (SKU: ${product.sku}) - ${product.inventory} units in stock`
        ).join('\n        ')}
        
        Ask if they would like to know more about any of these products or see other recommendations.`,
};
