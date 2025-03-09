/**
 * Response templates for the Early Risers promotion tool
 * Contains various messages for different scenarios in the Early Risers promotion flow
 */
export const EARLY_RISERS_RESPONSE = {
    /**
     * Response when a new promo code is generated during valid hours
     * Provides the code and discount information
     * @param code The generated promo code
     * @param discount The discount percentage or amount
     */
    VALID_TIME_NEW_CODE: (code: string, discount: string,) => `I've generated a new Early Risers promo code for the customer:
  Code: ${code}
  Discount: ${discount}
  Please share this with them in an enthusiastic way and mention it's valid until 10am PT today.`,
    /**
     * Response when the customer already has an active promo code
     * Reminds them of their existing code and its validity
     * @param code The existing promo code
     * @param discount The discount percentage or amount
     * @param endTime The hour when the code expires
     */
    VALID_TIME_EXISTING_CODE: (code: string, discount: string, endTime: number) => `The customer already has an active Early Risers promo code from today.
      Code: ${code}
      Discount: ${discount}
      Please inform them in a friendly way and remind them the code is valid until ${endTime}:00 AM PT today.`,
    /**
     * Response when the request is made outside valid promotion hours
     * Informs the customer when they can try again
     * @param currentTime The current time in the relevant timezone
     * @param nextValidTime The next time when the promotion will be available
     */
    INVALID_TIME: (currentTime: string, nextValidTime: string) => `The Early Risers promotion is only available between 8:00 - 10:00 AM PT.
  Current time: ${currentTime}
  Next available time: ${nextValidTime}
  
  Please inform the customer about the valid hours and when they can try again. Keep it short and concise. DO NOT provide a promo code.`
  };