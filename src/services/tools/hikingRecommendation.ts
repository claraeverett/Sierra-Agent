import { ToolResponse } from "./tools";
import { State } from "../../state/state";
import { Tool } from "../../types/types";
import { HIKING_RECOMMENDATION_PROMPT } from "../../prompts/systemPrompts";
import { COLLECT_HIKING_PREFERENCES_RESPONSE } from "../../prompts/hikingRecommendation";
import { PreferenceKey } from "../../state/customerPreferences";
import { modelResponse } from "../ai/aiService";
import { HIKING_RECOMMENDATION_PREFERENCES } from "../../config/constants";
import { apiService } from "../api/apiService";

interface HikingParams {
  location: string;
  difficulty?: "easy" | "moderate" | "hard";
  length?: number; // in miles
  playlist?: string;
}

interface HikingResponse {
    region: RegionInfo;
    trails: HikingTrail[];
  }

  interface RegionInfo {
    name: string;
    zipcode: string;
    country_code: string;
    latitude: number;
    longitude: number;
  }
  
  interface HikingTrail {
    name: string;
    location: string;
    difficulty: string;
    length: string;
    elevation_gain: string;
    latitude: number;
    longitude: number;
    considerations: string;
  }

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
        if (
          !data.region ||
          !data.region.zipcode ||
          !data.region.country_code ||
          !data.trails ||
          data.trails.length !== 3
        ) {
          console.error("Invalid response structure:", data);
          return null;
        }
    
        return data;
      } catch (error) {
        console.error("Error parsing GPT JSON response:", error);
        return null;
      }
}

export const getHikingRecommendations = async (params: HikingParams, state: State): Promise<ToolResponse> => {      
  try {

    // Only ask for playlist once

    state.addUnresolvedIntents("HikingRecommendation");

    const location = params.location;
    const difficulty = params.difficulty || "moderate";
    const playlist = params.playlist;
    const length = params.length || 5;

    // Update preferences for each parameter
    const preferenceMapping: Record<string, PreferenceKey> = {
      'location': PreferenceKey.location,
      'difficulty': PreferenceKey.difficulty,
      'length': PreferenceKey.length,
      'playlist': PreferenceKey.playlist
    };

    
    // Update Preferences 
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        // Use the mapping to get the correct preference key
        const preferenceKey = preferenceMapping[key];
        if (preferenceKey) {
          state.setPreference(preferenceKey, String(value));
        }
      }
    });

    // Log the current state of preferences
    console.log("Current preferences:", {
      location: state.getPreference(PreferenceKey.location),
      difficulty: state.getPreference(PreferenceKey.difficulty),
      length: state.getPreference(PreferenceKey.length),
      playlist: state.getPreference(PreferenceKey.playlist)
    });

    console.log("state", state);

    if(state.getFollowUpCount("HikingRecommendation") == 0) {

        if (!params.location) {
            state.incrementFollowUpCount("HikingRecommendation");
            return {
            success: false,
            promptTemplate: COLLECT_HIKING_PREFERENCES_RESPONSE.NO_LOCATION(),
            missingParams: ["location"]
            };
        } else if (!params.difficulty) {
            state.incrementFollowUpCount("HikingRecommendation");
            return {
            success: false,
            promptTemplate: COLLECT_HIKING_PREFERENCES_RESPONSE.NO_DIFFICULTY(),
            missingParams: ["difficulty"]
            };
        } else if (!params.length) {
            state.incrementFollowUpCount("HikingRecommendation");
            return {
            success: false,
            promptTemplate: COLLECT_HIKING_PREFERENCES_RESPONSE.NO_LENGTH(),
            missingParams: ["length"]
            };
        }

        
    } 

    // TO DO: Clean Up! 

    if (!state.getPreference(PreferenceKey.location)) {
        state.setPreference(PreferenceKey.location, HIKING_RECOMMENDATION_PREFERENCES.LOCATION);
    }

    if (!state.getPreference(PreferenceKey.difficulty)) {
        state.setPreference(PreferenceKey.difficulty, HIKING_RECOMMENDATION_PREFERENCES.DIFFICULTY);
    }

    if (!state.getPreference(PreferenceKey.length)) {
        state.setPreference(PreferenceKey.length, HIKING_RECOMMENDATION_PREFERENCES.LENGTH);
    }

    if (!state.getPreference(PreferenceKey.playlist)) {
        state.setPreference(PreferenceKey.playlist, HIKING_RECOMMENDATION_PREFERENCES.PLAYLIST);
    }
    


    console.log("playlist", playlist);

    // Fetch Hiking Trails from GPT 
    const response = await modelResponse(
      state.getConversationHistory(),
      HIKING_RECOMMENDATION_PROMPT(location, difficulty, length),
      false
    );

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
    const coordinates = await apiService.getCoordinates(hikes.region.zipcode, hikes.region.country_code);
    if (coordinates) {
        console.log("We have coordinates");
      const weather = await apiService.getWeather(coordinates.lat, coordinates.lon);
      console.log("weather", weather);
    }
    // Create a formatted description of each trail
    const trailsDescription = hikes.trails.map((trail, index) => {
      return `**${index + 1}. ${trail.name}**
• **Location:** ${trail.location}
• **Difficulty:** ${trail.difficulty}
• **Length:** ${trail.length}
• **Elevation Gain:** ${trail.elevation_gain}
• **Special Considerations:** ${trail.considerations || "None"}`;
    }).join("\n\n");

    // Create a dynamic prompt template with the hiking data
    
    state.resolveIntent("HikingRecommendation");
    return {
      success: true,
      details: {
        hikes,
        location: location,
        difficulty: difficulty,
        length: length
      },
      promptTemplate: COLLECT_HIKING_PREFERENCES_RESPONSE.SUCCESS({hikes: trailsDescription})
    };
  } catch (error) {
    console.error("Error fetching hiking trails:", error);
    return {
      success: false,
      promptTemplate: COLLECT_HIKING_PREFERENCES_RESPONSE.ERROR(params.location || 'your area')
    };
  }
}

export const hikingRecommendationTool: Tool = {
  name: "hiking",
  description: "Get hiking trail recommendations based on location and preferences",
  execute: getHikingRecommendations
};
