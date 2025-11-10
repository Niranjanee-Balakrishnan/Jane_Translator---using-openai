from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import AzureOpenAI
from dotenv import load_dotenv
import traceback

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Debug environment variables
print("=== Checking Environment Variables ===")
print(f"GPT_BASE_URL: {os.getenv('GPT_BASE_URL')}")
print(f"GPT_API_KEY present: {bool(os.getenv('GPT_API_KEY'))}")
print(f"GPT_API_VERSION: {os.getenv('GPT_API_VERSION')}")
print(f"GPT_MODEL: {os.getenv('GPT_MODEL')}")

try:
    # Configure Azure OpenAI client
    client = AzureOpenAI(
        azure_endpoint=os.getenv("GPT_BASE_URL").strip() if os.getenv("GPT_BASE_URL") else None,
        api_key=os.getenv("GPT_API_KEY").strip() if os.getenv("GPT_API_KEY") else None,
        api_version=os.getenv("GPT_API_VERSION").strip() if os.getenv("GPT_API_VERSION") else None
    )
    print("✅ Azure OpenAI client configured successfully")
except Exception as e:
    print(f"❌ Error configuring Azure OpenAI: {e}")
    client = None

@app.route('/')
def index():
    return "<h3>Welcome to the Translation API</h3>"

@app.route('/translate', methods=['POST'])
def translate():
    if not client:
        return jsonify({'error': 'Azure OpenAI client not configured. Check environment variables.'}), 500
        
    try:
        data = request.get_json(force=True)
        text = data.get('text')
        language = data.get('language')

        if not text or not language:
            return jsonify({'error': 'Text and language are required.'}), 400

        deployment_name = os.getenv("GPT_MODEL")

        response = client.chat.completions.create(
            model=deployment_name,
            messages=[
                {"role": "system", "content": f"You are a translator. Translate the following text to {language}. Respond with only the translation."},
                {"role": "user", "content": text}
            ],
            temperature=0.2
        )

        translated_text = response.choices[0].message.content.strip()
        return jsonify({'translated_text': translated_text})

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)