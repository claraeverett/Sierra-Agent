import { PromoCode } from '../types/earlyRisers';

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