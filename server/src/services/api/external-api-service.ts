import axios from 'axios'
import { ENDPOINTS } from '@/services/api/endpoints'
import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // 
import { EMAIL_CONFIG } from '@/config/constants';

/**
 * External API Service
 * 
 * This module provides functions for interacting with external APIs:
 * 1. OpenWeatherMap API for weather data
 * 2. Mailgun API for sending emails
 * 
 * It handles API requests, error handling, and data formatting.
 */

/**
 * Formats weather data into a user-friendly string
 * 
 * Takes raw weather data from OpenWeatherMap API and converts it into
 * a formatted string suitable for display to users, including temperature
 * and weather description.
 * 
 * @param weatherData The weather data from OpenWeatherMap API
 * @returns Formatted weather information string with markdown formatting
 */
export const formatWeatherData = (weatherData: any): string => {
  // Return empty string if weather data is missing or incomplete
  if (!weatherData || !weatherData.main || !weatherData.weather) {
    return "";
  }

  try {
    // Extract and round temperature values
    const temp = Math.round(weatherData.main.temp);
    const feelsLike = Math.round(weatherData.main.feels_like);
    const description = weatherData.weather[0].description;
    
    // Format with markdown for better display
    return `
**Current Weather:** ${temp}°F, ${description}
**Feels Like:** ${feelsLike}°F
`;
  } catch (error) {
    console.error("Error formatting weather data:", error);
    return "";
  }
};


/**
 * API Service object containing methods for external API interactions
 */
export const apiService = {
  /**
   * Gets geographic coordinates from a zipcode
   * 
   * Uses OpenWeatherMap's geocoding API to convert a zipcode to latitude/longitude
   * coordinates needed for weather data retrieval.
   * 
   * @param zipcode The postal code to get coordinates for
   * @param countrycode The ISO country code (e.g., "US")
   * @returns Coordinates object with lat and lon properties, or null if request fails
   */
  getCoordinates: async (zipcode: string, countrycode: string) => {
    try {
      const response = await axios.get(ENDPOINTS.COORDINATES(zipcode, countrycode));
      
      return response.data;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  },

  /**
   * Gets weather data for a location using coordinates
   * 
   * Fetches current weather conditions from OpenWeatherMap API
   * using latitude and longitude coordinates.
   * 
   * @param lat Latitude coordinate
   * @param lon Longitude coordinate
   * @returns Weather data object or null if request fails
   */
  getWeather: async (lat: string, lon: string) => {
    try {
      const response = await axios.get(ENDPOINTS.WEATHER(lat, lon));
      return response.data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null;
    }
  },

  /**
   * Sends an email using the Mailgun API
   * 
   * Used primarily for the human handoff feature to send customer
   * support requests to the support team.
   * 
   * @param body The email body content
   * @param customerId The customer ID to include in the subject line
   * @returns The Mailgun API response or null if sending fails
   */
  sendEmail: async (body: string, customerId: string) => {
    try {   
      // Initialize Mailgun client
      const mailgun = new Mailgun(FormData);
      const mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY || ''
      });

      // Send the email with customer ID in the subject for tracking
      const result = await mg.messages.create(
        process.env.MAILGUN_DOMAIN || '',
        {
          from: EMAIL_CONFIG.FROM,
          to: EMAIL_CONFIG.TO,
          subject: `${EMAIL_CONFIG.SUBJECT} [${customerId}]`,
          text: body
        }
      );

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

