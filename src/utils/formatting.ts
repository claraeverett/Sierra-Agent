/**
 * Utility functions for consistent data formatting across the application
 */

// Time formatting
export const formatTime = (date: Date, timezone = 'America/Los_Angeles'): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: timezone,
      timeZoneName: 'short'
    });
  };
  
  // Currency formatting
  export const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Order ID formatting
  export const formatOrderId = (id: string): string => {
    return id.startsWith('SO-') ? id : `SO-${id}`;
  };
  
  // Product list formatting
  export const formatProductList = (items: string[]): string => {
    if (items.length === 0) return 'no items';
    if (items.length === 1) return items[0];
    
    const lastItem = items[items.length - 1];
    const otherItems = items.slice(0, -1);
    return `${otherItems.join(', ')} and ${lastItem}`;
  };
  
  // Date formatting
  export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Promo code formatting
  export const formatPromoCode = (code: string): string => {
    return code.toUpperCase().trim();
  };