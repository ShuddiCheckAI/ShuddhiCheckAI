# from genezio import Genezio
import os
import requests
import spacy
import json
import zipfile
from flask import Flask, request, jsonify
from tensorflow import keras
from genezio import Genezio

app = Flask(__name__)


# Cloud storage URLs (Replace these with your actual URLs)
SPACY_MODEL_URL = "https://drive.google.com/uc?export=download&id=YOUR_SPACY_MODEL_ID"
KERAS_MODEL_URL = "https://drive.google.com/uc?export=download&id=YOUR_KERAS_MODEL_ID"




# --- Model Loading Functions ---
def load_spacy_model():
    model_path = os.path.join(".", "en_core_web_sm")
    if not os.path.exists(model_path):
        try:
            response = requests.get(SPACY_MODEL_URL)
            response.raise_for_status()
            with open("en_core_web_sm.zip", "wb") as f:
                f.write(response.content)
            with zipfile.ZipFile("en_core_web_sm.zip", "r") as zip_ref:
                zip_ref.extractall("./")
            os.remove("en_core_web_sm.zip")
            print("Spacy Model downloaded and extracted")
        except requests.exceptions.RequestException as e:
            print(f"Error downloading spacy model: {e}")
            return None
        except zipfile.BadZipFile as e:
            print(f"Error extracting spacy model: {e}")
            return None
    return spacy.load(model_path)


def load_keras_model():
    model_path = os.path.join(".", "shuddhicheck_ai_model.h5")
    if not os.path.exists(model_path):
        try:
            response = requests.get(KERAS_MODEL_URL)
            response.raise_for_status()
            with open(model_path, "wb") as f:
                f.write(response.content)
            print("Keras Model downloaded.")
        except requests.exceptions.RequestException as e:
            print(f"Error downloading keras model: {e}")
            return None
    return keras.models.load_model(model_path)


# --- Load Pricing from JSON ---
pricing_file_path = 'pricing.json'
services_and_pricing = {}
try:
    with open(pricing_file_path, 'r') as f:
        pricing_data = json.load(f)
        services_and_pricing = {item['name']: item for item in pricing_data.get('services', [])}
    print("Pricing data loaded successfully.")
except (json.JSONDecodeError, FileNotFoundError) as e:
    print(f"Error loading pricing data: {e}")


# --- Pricing Information Endpoint ---
@app.route('/services', methods=['GET'])
@genezio.expose()
def get_services():
    return jsonify(list(services_and_pricing.values()))


# --- Flask Routes (Compliance Check, Chatbot, etc.) ---
@app.route('/compliance', methods=['POST'])
@genezio.expose()
def compliance_check():
    nlp = load_spacy_model()
    model = load_keras_model()

    if nlp is None or model is None:
        return jsonify({"error": "Failed to load models"}), 500

    # Your compliance check logic here
    return jsonify({"result": "Compliance check result"})


@app.route('/chat', methods=['POST'])
@genezio.expose()
def chat():
    nlp = load_spacy_model()

    if nlp is None:
        return jsonify({"error": "Failed to load spacy model"}), 500

    user_input = request.json.get('message')
    response = "Chatbot response"  # Placeholder
    return jsonify({'response': response})


if __name__ == "__main__":
    app.run(debug=True)
cmd+s