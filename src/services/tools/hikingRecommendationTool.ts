import { ToolResponse } from '@/services/tools/toolExport';
import { State } from '@/core/state/state';
import { Tool, PreferenceKey, HikingParams, HikingResponse } from '@/types/types';
import { HIKING_RECOMMENDATION_PROMPT } from '@/prompts/system-prompts';
import { COLLECT_HIKING_PREFERENCES_RESPONSE } from '@/prompts/hiking-prompts';
import { modelResponse } from '@/services/ai/openai-service';
import { HIKING_RECOMMENDATION_PREFERENCES } from '@/config/constants';
import { apiService, formatWeatherData } from '@/services/api/external-api-service';
import { Intent } from '@/types/types';

/**
 * Hiking Recommendation Tool
 * 
 * This module provides functionality to recommend hiking trails based on user preferences
 * such as location, difficulty, length, and playlist preferences. It also integrates
 * weather data to provide a comprehensive hiking recommendation.
 */

/**
 * Sets default hiking preferences in the state
 * Used when user doesn't provide specific preferences
 * 
 * @param state - The application state to update with default preferences
 */
const setDefaultPreferences = (state: State) => {
  state.setPreference(PreferenceKey.location, HIKING_RECOMMENDATION_PREFERENCES.DEFAULT_LOCATION);
  state.setPreference(PreferenceKey.difficulty, HIKING_RECOMMENDATION_PREFERENCES.DEFAULT_DIFFICULTY);
  state.setPreference(PreferenceKey.length, HIKING_RECOMMENDATION_PREFERENCES.DEFAULT_LENGTH);
  state.setPreference(PreferenceKey.playlist, HIKING_RECOMMENDATION_PREFERENCES.DEFAULT_PLAYLIST);
}

/**
 * Updates hiking preferences in the state based on user input
 * Maps parameter keys to preference keys and updates only non-empty values
 * 
 * @param params - The hiking parameters provided by the user
 * @param state - The application state to update
 */
const updateHikingPreferences = (params: HikingParams, state: State) => {
  // Map parameter names to preference keys for consistent storage
  const preferenceMapping: Record<string, PreferenceKey> = {
    'location': PreferenceKey.location,
    'difficulty': PreferenceKey.difficulty,
    'length': PreferenceKey.length,
    'playlist': PreferenceKey.playlist
  };

  // Update each preference if a valid value is provided
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      // Use the mapping to get the correct preference key
      const preferenceKey = preferenceMapping[key];
      if (preferenceKey) {
        state.setPreference(preferenceKey, String(value));  
      }
    }
  });
}

/**
 * Gets weather information for hiking trails
 * Fetches coordinates based on zipcode, then retrieves weather data
 * 
 * @param hikes The hiking response containing region information
 * @returns Weather information or an empty string if no data is available
 */
async function getWeather(hikes: HikingResponse) {
    try {
      // First get coordinates from zipcode
      const coordinates = await apiService.getCoordinates(hikes.region.zipcode, hikes.region.country_code);
      if (coordinates) {
        console.log("We have coordinates");
        // Then get weather data from coordinates
        const weather = await apiService.getWeather(coordinates.lat, coordinates.lon);
        
        // Format weather data if available
        if (weather) {
          return formatWeatherData(weather);
        }
        return "";
      }
    } catch (error) {
      console.error("Error getting weather data:", error);
      // Continue without weather data
      return "";
    }
}

/**
 * Validates the hiking response structure
 * Ensures all required fields are present and valid
 * 
 * @param data The hiking response to validate
 * @returns True if the response is valid, false otherwise
 */
const validResponse = (data: HikingResponse) => {
  return data.region && data.region.zipcode && data.region.country_code && data.trails && data.trails.length === 3;
}

/**
 * Requests follow-up information from the user when required parameters are missing
 * Increments follow-up count to track conversation state
 * 
 * @param params The hiking parameters to check
 * @param state The application state
 * @returns A tool response requesting the missing information, or undefined if all required info is present
 */
const requestFollowUpInformation = (params: HikingParams, state: State) => {
  if (!params.location) {
    console.log("No location provided");
    state.incrementFollowUpCount(Intent.HikingRecommendation);
    return {
      success: false,
      promptTemplate: COLLECT_HIKING_PREFERENCES_RESPONSE.NO_LOCATION(),
      missingParams: ["location"]
    };
  } else if (!params.difficulty) {
    state.incrementFollowUpCount(Intent.HikingRecommendation);
    return {
      success: false,
      promptTemplate: COLLECT_HIKING_PREFERENCES_RESPONSE.NO_DIFFICULTY(),
      missingParams: ["difficulty"]
    };
  } else if (!params.length) {
    state.incrementFollowUpCount(Intent.HikingRecommendation);
    return {
      success: false,
      promptTemplate: COLLECT_HIKING_PREFERENCES_RESPONSE.NO_LENGTH(),
      missingParams: ["length"]
    };
  }
}

/**
 * Parses the hiking response from the AI model
 * Cleans the response, parses JSON, and validates the structure
 * 
 * @param response The raw response string from the model
 * @returns The parsed hiking response or null if parsing fails
 */
const parseHikingResponse = (response: string) => {
    try {
        // Remove markdown code block tags if present
        const cleanResponse = response.trim().replace(/^```json|```$/g, "");
    
        // Parse JSON
        const data: HikingResponse = JSON.parse(cleanResponse);
        console.log("data", data);
        console.log("data.region", data.region);
        console.log("data.trails", data.trails);
    
        // Validate required fields
        if (!validResponse(data)) {
          console.error("Invalid response structure:", data);
          return null;
        }
    
        return data;
      } catch (error) {
        console.error("Error parsing GPT JSON response:", error);
        return null;
      }
}

/**
 * Hiking Recommendation Tool
 * Main tool implementation that handles hiking recommendation requests
 * 
 * @param params The hiking parameters from the user
 * @param state The application state
 * @returns A tool response with hiking recommendations or a request for more information
 */
export const hikingRecommendationTool: Tool = {
  name: "hiking",
  description: "Get hiking trail recommendations based on location and preferences",
  execute: async (params: HikingParams, state: State): Promise<ToolResponse> => {      
    console.log("Hiking Recommendation Tool", params, state);
    console.log(" ---------------------------------------------------------------")
    try {
    // Track this intent as unresolved until we successfully complete the recommendation
    state.addUnresolvedIntents(Intent.HikingRecommendation);

    // Extract parameters or use defaults
    const location = params.location;
    const difficulty = params.difficulty || "moderate";
    const playlist = params.playlist;
    const length = params.length || 5;

    // Update preferences for each parameter
    updateHikingPreferences(params, state);

    // Log the current state of preferences
    /*console.log("Current preferences:", {
      location: state.getPreference(PreferenceKey.location),
      difficulty: state.getPreference(PreferenceKey.difficulty),
      length: state.getPreference(PreferenceKey.length),
      playlist: state.getPreference(PreferenceKey.playlist)
    });*/

    console.log("state", state);

    if(state.getFollowUpCount(Intent.HikingRecommendation) == 0) {
        // First interaction - check if we need to request more information
        requestFollowUpInformation(params, state);
    } 

    setDefaultPreferences(state);

    
    console.log("playlist", playlist);

    // Fetch Hiking Trails from GPT 
    const response = await modelResponse(
      state.getConversationHistory(),
      HIKING_RECOMMENDATION_PROMPT(location, difficulty, length),
      false
    );

    // Parse the response into a structured format
    const hikes = parseHikingResponse(response.choices[0].message.content || '');
    
    // Check if location is provided
    console.log("state", state);
    console.log("hikes", hikes);
    
    // If no hikes were found or parsing failed
    if (!hikes) {
      return {
        success: false,
        promptTemplate: COLLECT_HIKING_PREFERENCES_RESPONSE.NO_HIKES_FOUND(location)
      };
    }
    
    console.log("hikes.region", hikes.region);
    
    // Create a formatted description of each trail
    const trailsDescription = hikes.trails.map((trail, index) => {
      return `**${index + 1}. ${trail.name}** - ${trail.difficulty}, ${trail.length}
• Located in ${trail.location}
• Elevation gain: ${trail.elevation_gain || "minimal"}
${trail.considerations ? `• Note: ${trail.considerations}` : ""}`;
    }).join("\n\n");

    // Mark the intent as resolved since we successfully generated recommendations
    state.resolveIntent(Intent.HikingRecommendation);

    // Get weather information for the hiking location
    const weatherInfo = await getWeather(hikes);
    
    // Store the hiking recommendation in state for future reference
    state.addHikingRecommendation({
      location: location,
      difficulty: difficulty,
      length: length,
      playlist: playlist,
      weather: weatherInfo,
      hikes: hikes
    });
    
    // Combine trail descriptions with weather information
    const fullDescription = `${trailsDescription}${weatherInfo}`;
    
    // Reset follow-up count since we've successfully completed the recommendation
    state.resetFollowUpCount(Intent.HikingRecommendation);
    
    return {
      success: true,
      details: {
        hikes,
        location: location,
        difficulty: difficulty,
        length: length,
        // should this be true or false?
        weather: weatherInfo?.trim() ? true : false
      },
      promptTemplate: COLLECT_HIKING_PREFERENCES_RESPONSE.SUCCESS({hikes: fullDescription})
    };
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching hiking trails:", error);
    return {
      success: false,
      promptTemplate: COLLECT_HIKING_PREFERENCES_RESPONSE.ERROR(params.location || 'your area')
    };
  }
  }
}
