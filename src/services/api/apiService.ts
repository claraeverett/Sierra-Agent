import axios from 'axios'
import { ENDPOINTS } from './endpoints'
import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // 
import { EMAIL_CONFIG } from '../../config/constants';

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
  },

  sendEmail: async (body: string, customerId: string) => {
    try {
      console.log("Attempting to send email with body:", body);
      console.log("Using Mailgun API key:", process.env.MAILGUN_API_KEY ? "API key exists" : "API key missing");
      console.log("Using Mailgun domain:", process.env.MAILGUN_DOMAIN);
      
      const mailgun = new Mailgun(FormData);
      const mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY || ''
      });

      const result = await mg.messages.create(
        process.env.MAILGUN_DOMAIN || '',
        {
          from: EMAIL_CONFIG.FROM,
          to: EMAIL_CONFIG.TO,
          subject: `${EMAIL_CONFIG.SUBJECT} [${customerId}]`,
          text: body
        }
      );

      console.log("Email sent successfully:", result);
      return result;
    } catch (error) {
      console.error("Error sending email:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
      return null;
    }
  }
}

