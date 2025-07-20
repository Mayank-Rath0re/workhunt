import { runTerminalCommand } from './terminalUtils';

export const chat = async (message: string) => {
  // Prepare the input data for the Python script
  const inputData = JSON.stringify({
    message: message,
  });

  // Run the Python script and capture its output
  const command = `python src/ai/generate_gemini_response.py`;
  
  try {
    const result = await runTerminalCommand(command, inputData);

    // Parse the JSON output from the Python script
    const output = JSON.parse(result.stdout);

    // Return the response from the Python script
    return output.response;
  } catch (error) {
    console.error('Error running Python script:', error);
    throw new Error('Failed to get response from AI model.');
  }
};
