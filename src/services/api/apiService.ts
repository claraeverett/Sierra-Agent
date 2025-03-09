import axios from 'axios'
import { ENDPOINTS } from './endpoints'

/**
 * Formats weather data into a user-friendly string
 * @param weatherData The weather data from OpenWeatherMap API
 * @returns Formatted weather information string
 */
export const formatWeatherData = (weatherData: any): string => {
  if (!weatherData || !weatherData.main || !weatherData.weather) {
    return "";
  }

  try {
    const temp = Math.round(weatherData.main.temp);
    const feelsLike = Math.round(weatherData.main.feels_like);
    const description = weatherData.weather[0].description;
    
    return `
**Current Weather:** ${temp}°F, ${description}
**Feels Like:** ${feelsLike}°F
`;
  } catch (error) {
    console.error("Error formatting weather data:", error);
    return "";
  }
};



export const apiService = {
  getCoordinates: async (zipcode: string, countrycode: string) => {
    try {
      console.log("zipcode", zipcode);
      console.log("countrycode", countrycode);
      console.log("ENDPOINTS.COORDINATES(zipcode, countrycode)", ENDPOINTS.COORDINATES(zipcode, countrycode));
      const response = await axios.get(ENDPOINTS.COORDINATES(zipcode, countrycode));
      
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  },

  getWeather: async (lat: string, lon: string) => {
    try {
      const response = await axios.get(ENDPOINTS.WEATHER(lat, lon));
      console.log("response.data", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      console.log("error", error);
      return null;
    }
  }
}