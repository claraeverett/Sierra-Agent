
/**
 * Constants for the Early Risers promotion
 */
export const EARLY_RISERS = {
    START_TIME: 8,
    END_TIME: 10,
    TIMEZONE: "America/Los_Angeles",
    PROMO_CODE: "10%",
}

/**
 * Constants for the Hiking Recommendation preferences
 */
export const HIKING_RECOMMENDATION_PREFERENCES = {
    DEFAULT_LOCATION: "Denver, CO",
    DEFAULT_DIFFICULTY: "moderate",
    DEFAULT_LENGTH: "5",
    DEFAULT_PLAYLIST: "no",
}

/**
 * Constants for the email configuration
 */
export const EMAIL_CONFIG = {
    FROM: "Sierra Outfitters <support@sierraoutfitters.com>",
    TO: ["Clara Everett <sierraoutfitterscs@gmail.com>"],
    SUBJECT: "Human Help Request for Customer",
    EMAIL: "sierraoutfitters@gmail.com",
}

/**
 * Constants for the Pinecone configuration
 */
export const PINECONE_CONSTANTS = {
    INDEX_NAME: 'sierra-agent-faq',
    VECTOR_DIMENSION: 1536,
    MIN_SCORE: 0.7,
    EMBEDDING_MODEL: "text-embedding-3-small",
  } as const;