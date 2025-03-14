import { ToolResponse } from '@/services/tools/toolExport';
import { Tool, ProductInventoryParams } from '@/types/types';
import { State } from '@/core/state/state';
import { productsMap } from '@/data/mockData/data';
import { Product } from '@/types/types';
import { PRODUCT_INVENTORY_PROMPT } from '@/prompts/product-prompts';
import { Intent } from '@/types/types';

/**
 * Get inventory by SKU
 * @param sku - The SKU of the product
 * @returns The product if found, otherwise null
 */

function getInventoryBySKU(sku: string): Product | null {
    console.log("Getting inventory by SKU", sku);
    const product = productsMap[sku.toUpperCase()];
    console.log("Product", product);
    if (product) {
      return product;
    }
    return null;
}

/**
 * Find closest product matches
 * @param query - The query to find closest matches for
 * @returns The closest matches
 */
function findClosestProductMatches(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
  
    // Find products that partially match the query
    const matches = Object.values(productsMap).filter(product =>
      product.productName.toLowerCase().includes(lowerQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  
    return matches;
}
  
/**
 * Product Inventory Tool
 * @param params - The parameters for the tool
 * @param state - The state of the application
 * @returns The tool response
 */
export const productInventoryTool: Tool = {
  name: 'productInventory',
  description: 'Check inventory of a specific product',
  execute: async (params: ProductInventoryParams, state: State): Promise<ToolResponse> => {    
    console.log("Product Inventory Tool", params, state);
    console.log(" ---------------------------------------------------------------")
    
    // Extract parameters from request
    state.addUnresolvedIntents(Intent.ProductInventory);
    console.log("Params", params);
    let sku = params.productSku;
    console.log("SKU", sku);
    let productName = params.productName;
    let productInfo: Product | null = null;
    let closestMatches: Product[] = [];

    if (sku) {
        console.log("SKU", sku);
        productInfo = getInventoryBySKU(sku);
        if (productInfo) {
            state.resolveIntent(Intent.ProductInventory);
            return {
                success: true,
                promptTemplate: PRODUCT_INVENTORY_PROMPT.PRODUCT_FOUND(productInfo),
            };
        } else {
            return {
                success: false,
                promptTemplate: PRODUCT_INVENTORY_PROMPT.NO_PRODUCT_FOUND(sku),
            };
        }
    } else if (productName) {
        closestMatches = findClosestProductMatches(productName);
        if (closestMatches.length > 0) {
            state.resolveIntent(Intent.ProductInventory);

            return {
                success: true,
                promptTemplate: PRODUCT_INVENTORY_PROMPT.PRODUCTS_SUGGESTIONS(closestMatches),
            };
        }
    } 

    return {
        success: false,
        promptTemplate: PRODUCT_INVENTORY_PROMPT.NO_INFORMATION,
    };
  }
};  
