from flask import Flask, request, jsonify, render_template
import easyocr
from PIL import Image
import io
import json
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

# Configure Google Gemini API
gemini_api_key = os.getenv("GOOGLE_API_KEY")
if not gemini_api_key:
    raise ValueError("Google API key not found in environment variables.")
genai.configure(api_key=gemini_api_key)
gemini_model = genai.GenerativeModel("gemini-pro")

def call_gemini_api(prompt):
    """Call the Gemini API with a given prompt."""
    try:
        response = gemini_model.generate_content(prompt)
        generated_text = response.text
        print("Raw Gemini API response:", generated_text)  # Debugging
        return generated_text
    except Exception as e:
        return {"error": "Failed to get response from Gemini", "details": str(e)}

def extract_text_from_image(image):
    """Extract text from an image using EasyOCR."""
    img_bytes = io.BytesIO()
    image.save(img_bytes, format='PNG')
    img_bytes = img_bytes.getvalue()
    results = reader.readtext(img_bytes)
    extracted_fields = [text for _, text, _ in results]
    return extracted_fields

def generate_guidance(field_name):
    """Generate guidance for a form field using Gemini API."""
    prompt = f"""
    Provide guidance for filling out the form field: {field_name}
    Give a clear explanation of:
    What information should be entered in the provided field.
    """
    response = call_gemini_api(prompt)
    return response

@app.route("/", methods=["GET", "POST"])
def index():
    """Render the main page and handle form submissions."""
    if request.method == "POST":
        # Handle file upload
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400
        
        try:
            # Open and process the image
            image = Image.open(file).convert("RGB")
            fields = extract_text_from_image(image)
            
            # Return detected fields
            return jsonify({"fields": fields})
        
        except Exception as e:
            return jsonify({"error": "Failed to process image", "details": str(e)}), 500
    
    # Render the HTML template for GET requests
    return render_template("index.html")

@app.route("/guidance", methods=["POST"])
def get_guidance():
    """Generate guidance for a selected field."""
    data = request.json
    if not data or "field" not in data:
        return jsonify({"error": "Field name is required"}), 400
    
    field_name = data["field"]
    guidance = generate_guidance(field_name)
    
    return jsonify({"field": field_name, "guidance": guidance})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=4000)