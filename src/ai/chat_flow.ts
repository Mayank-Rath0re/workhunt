import { generateGeminiResponse } from './gemini';
// import { webSearch } from './web_search'; // Disconnected for now

export const chat = async (message: string, apiKey: string) => {
  console.log(`Calling generateGeminiResponse with message: ${message}`);

  try {
    const prompt = `Generate exactly 10 Google dorking queries to find job opportunities based on the following domain/keywords: ${message}

Please provide only the list of 10 dorking queries, one per line, without any additional text or explanations.`;

    const response = await generateGeminiResponse([], prompt, apiKey);
    console.log(`Response from generateGeminiResponse in chat_flow: ${response}`);

    const dorkingQueries = response.split('\n').filter(query => query.trim() !== '');

    console.log('Dorking queries array:', dorkingQueries);

    // Disconnected web search for now
    // const searchResults = await Promise.all(dorkingQueries.map(query => webSearch(query, apiKey)));
    // console.log('Search results:', searchResults);
    // return searchResults.flat().map(result => result.snippet);

    return dorkingQueries; // Return the dorking queries directly

  } catch (error: any) {
    console.error('Error generating Gemini response:', error);
    throw new Error(`Failed to get response from AI model: ${error.message}`);
  }
};
