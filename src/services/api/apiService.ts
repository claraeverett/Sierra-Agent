import axios from 'axios'
import { ENDPOINTS } from './endpoints'

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