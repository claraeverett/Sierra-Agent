/**
 * Response templates for the human handoff tool
 * Contains various messages for different scenarios in the human handoff flow
 */
export const HUMAN_HELP_RESPONSE = {
    /**
     * Response when the customer hasn't provided a location
     * Asks for a specific location or defaults to HQ location
     */
    EMAIL_SENT: "Tell the customer that we've notified our customer service team about their request. A human agent will contact them shortly to provide personalized assistance. Ask if there is anything else you can help them with.",
    EMAIL_FAILED: "Tell the customer that we are experiencing some technical difficulties. They should try again in a few moments or call our customer service line directly at 1-800-SIERRA-HELP.",
    ERROR: "Tell the customer that we are experiencing some technical difficulties. They should try again in a few moments or call our customer service line directly at 1-800-SIERRA-HELP."
}
  