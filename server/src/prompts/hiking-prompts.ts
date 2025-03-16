import { HIKING_RECOMMENDATION_PREFERENCES } from '@/config/constants';

/**
 * Response templates for the hiking recommendation tool
 * Contains various messages for different scenarios in the hiking recommendation flow
 */
export const COLLECT_HIKING_PREFERENCES_RESPONSE = {
  /**
   * Response when the customer hasn't provided a location
   * Asks for a specific location or defaults to HQ location
   */
  NO_LOCATION: () => `The customer has not provided a location for hiking recommendations. Ask them if they have a specific location in mind, otherwise we will assume they want a recommendation near Sierra Outfitters HQ, ${HIKING_RECOMMENDATION_PREFERENCES.DEFAULT_LOCATION}.`,

  /**
   * Response when the customer hasn't specified a difficulty level
   * Prompts for this optional parameter
   */
  NO_DIFFICULTY: () => `The customer has not provided the difficulty. Ask them to provide a difficulty level if they have one.`,

  /**
   * Response when the customer hasn't specified a trail length
   * Prompts for this optional parameter
   */
  NO_LENGTH: () => `The customer has not provided the hiking trail length. Ask them to provide a length if they have one.`,

  /**
   * Error response when unable to find hiking trails
   * Explains possible reasons and offers alternative actions
   * @param location The location where the search failed
   */
  ERROR: (location: string) => `I'm sorry, I encountered an issue while searching for hiking trails near ${location}. 

    This could be due to:
    • A temporary service disruption
    • Limited data for this specific location
    • An issue with how the location was specified

    Would you like to:
    1. Try a different location?
    2. Provide more details about the area you're interested in?
    3. Specify a different difficulty level or trail length?`,

  /**
   * Response when no hiking trails were found for the location
   * Suggests trying a different location or providing more details
   * @param location The location where no trails were found
   */
  NO_HIKES_FOUND: (location: string) => `I'm sorry, I couldn't find hiking trails near ${location}. Could you try a different location or provide more specific details?`,
  
  /**
   * Success response with hiking recommendations
   * Presents the hiking information in a conversational way
   * @param details Object containing the hiking recommendations
   */
  SUCCESS: (details: { 
    hikes: string
  }) => `Here are hiking recommendations: ${details.hikes}. If the hiking trails include formatting such as **, please remove it.
    Present this information in a friendly, conversational way. Mention the trails, difficulty, and weather if available. Tell them we have plenty of products to help them prepare for their hike.`,
};