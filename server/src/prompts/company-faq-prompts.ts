export const COMPANY_FAQ_PROMPTS = {
  /**
   * Prompt for generating a search query based on user input
   * @param userInput - The user's input to generate a search query from
   * @returns The generated search query
   **/

    FAQ_SEARCH_RESULT_PROMPT: (query: string, matchedTexts: string) => `Answer the following question based on this FAQ:\n\n${matchedTexts}\n\nQuestion: ${query}`,

    NO_MATCH_PROMPT: `Tell the user that you couldn't find the answer to their question in the FAQ. `,
};

