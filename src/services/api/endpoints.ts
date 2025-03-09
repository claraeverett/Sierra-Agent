export const ENDPOINTS = {
    COORDINATES: (zipcode:string,countrycode:string) => 
     `http://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${countrycode}&appid=${process.env.OPEN_WEATHER_API_KEY}`,
    WEATHER: (lat:string,lon:string) => 
    `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`
  } as const;