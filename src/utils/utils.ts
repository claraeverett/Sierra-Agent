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