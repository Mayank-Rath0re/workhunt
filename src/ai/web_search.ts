import { google } from 'googleapis';

export const webSearch = async (query: string, apiKey: string) => {
  try {
    const customsearch = google.customsearch('v1');
    const cx = "435175dbbb9934e53"; // Default Custom Search Engine ID

    if (!apiKey) {
      throw new Error('Google Search API Key is not provided.');
    }

    const res = await customsearch.cse.list({
      auth: apiKey,
      cx: cx,
      q: query,
    });

    if (res.data.items) {
      return res.data.items.map(item => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      }));
    } else {
      return [];
    }
  } catch (error: any) {
    console.error('Error performing web search:', error);
    throw new Error(`Failed to perform web search: ${error.message}`);
  }
};
