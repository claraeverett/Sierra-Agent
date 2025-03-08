export const EARLY_RISERS_RESPONSE = {
    VALID_TIME_NEW_CODE: (code: string, discount: string,) => `I've generated a new Early Risers promo code for the customer:
  Code: ${code}
  Discount: ${discount}
  Please share this with them in an enthusiastic way and mention it's valid until 10am PT today.`,
    VALID_TIME_EXISTING_CODE: (code: string, discount: string, endTime: number) => `The customer already has an active Early Risers promo code from today.
      Code: ${code}
      Discount: ${discount}
      Please inform them in a friendly way and remind them the code is valid until ${endTime}:00 AM PT today.`,
    INVALID_TIME: (currentTime: string, nextValidTime: string) => `The Early Risers promotion is only available between 8:00 - 10:00 AM PT.
  Current time: ${currentTime}
  Next available time: ${nextValidTime}
  
  Please inform the customer about the valid hours and when they can try again. Keep it short and concise.`
  };