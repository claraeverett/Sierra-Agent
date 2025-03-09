export const getTime = () => {
    return new Date();
};

export const getPromoCode = () => {
    return `EARLY${Math.random().toString(36).substring(2, 7).toUpperCase()}`
};

export const timeIsToday = (time: Date, timeZone: string,timeNow:Date) => {
    return new Date(time).toLocaleString('en-US', { timeZone: timeZone}).split(',')[0] === 
                           new Date(timeNow).toLocaleString('en-US', { timeZone: timeZone }).split(',')[0];
};

/**
 * Generates a short, readable customer ID
 * Format: SI-XXXX (where X is alphanumeric)
 * @returns A formatted customer ID string
 */
export const generateCustomerId = (): string => {
  // Generate a 4-character alphanumeric code
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar-looking characters
  let id = 'SI-';
  
  // Add 4 random characters from the chars string
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return id;
};