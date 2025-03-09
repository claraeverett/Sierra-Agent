export const ENDPOINTS = {
    COORDINATES: (zipcode:string,countrycode:string) => 
     `http://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${countrycode}&appid=${process.env.OPEN_WEATHER_API_KEY}`,
    WEATHER: (lat:string,lon:string) => 
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${process.env.OPEN_WEATHER_API_KEY}`
  } as const;