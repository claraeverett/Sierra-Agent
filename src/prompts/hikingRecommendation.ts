import { HIKING_RECOMMENDATION_PREFERENCES } from "../config/constants";

export const COLLECT_HIKING_PREFERENCES_RESPONSE = {
  /** The customer has not provided an order ID or email */
  NO_LOCATION: () => `The customer has not provided a location for hiking recommendations. Ask them if they have a specific location in mind, otherwise we will assume they want a recommendation near Sierra Outfitters HQ, ${HIKING_RECOMMENDATION_PREFERENCES.LOCATION}.`,

  /** The customer provided only an order number but not an email */
  NO_DIFFICULTY: () => `The customer has not provided the difficulty. Ask them to provide a difficulty level if they have one.`,

  PLAYLIST_CLARIFICATION: () => `The customer has not provided a preference for a playlist. Ask them if they would like a playlist with their hiking recommendations.`,
  /** The customer provided only an email but not an order number */
  
  NO_LENGTH: () => `The customer has not provided the hiking traillength. Ask them to provide a length if they have one.`,

  /** The provided order number does not exist in the system */
  ERROR: (location: string) => `I'm sorry, I encountered an issue while searching for hiking trails near ${location}. 

This could be due to:
• A temporary service disruption
• Limited data for this specific location
• An issue with how the location was specified

Would you like to:
1. Try a different location?
2. Provide more details about the area you're interested in?
3. Specify a different difficulty level or trail length?`,
 /** The customer successfully provided valid order details */

 NO_HIKES_FOUND: (location: string) => `I'm sorry, I couldn't find hiking trails near ${location}. Could you try a different location or provide more specific details?`,
  
 SUCCESS: (details: { 
    hikes: string
  }) => `The customer's hiking recommendations are: ${details.hikes}.
    Provide this information in a friendly, conversational way and ask if they need anything else.`
};