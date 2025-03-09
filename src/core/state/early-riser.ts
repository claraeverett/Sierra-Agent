import { PromoCode } from '@/types/types';

/**
 * Class for managing promo codes
 * Stores and retrieves promo code information
 */
export class PromoCodeStore {
  private code: PromoCode | null = null;

  update(code: PromoCode) {
    this.code = code;
  }

  get() {
    return this.code;
  }

  clear() {
    this.code = null;
  }
}