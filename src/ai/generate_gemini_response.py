import json
import sys
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API key
API_KEY = os.getenv("GEMINI_API_KEY")

# Check if the API key is set
if not API_KEY:
    print("Error: GEMINI_API_KEY environment variable not set.", file=sys.stderr)
    sys.exit(1)

genai.configure(api_key=API_KEY)

def generate_gemini_response(history, message):
    """Generates a response based on the message and chat history using the Gemini API."""
    print("Generating Gemini response using API...")

    try:
        # Create a GenerativeModel instance
        model = genai.GenerativeModel('gemini-pro')

        # Start a chat session
        chat_session = model.start_chat(history=history)

        # Send the message and get the response
        response = chat_session.send_message(message)

        # Return the response text
        return {"response": response.text}

    except Exception as e:
        print(f"Error generating response: {e}", file=sys.stderr)
        return {"response": "Error generating response."}

if __name__ == "__main__":
    # Read input from stdin
    input_data = json.load(sys.stdin)

    history = input_data.get('history', [])
    message = input_data.get('message', '')

    # Generate the response
    output = generate_gemini_response(history, message)

    # Print the output as JSON to stdout
    print(json.dumps(output))
