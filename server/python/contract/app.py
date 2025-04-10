import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import PyPDF2
import pandas as pd
import os
from groq import Groq
from dotenv import load_dotenv
import google.generativeai as genai
from flask_cors import CORS
import re

load_dotenv()


# Template for the Llama model
template = (
    """
    **Task:** Review and analyze the provided legal document for key points and potential risks.
    
    **Instructions:** 
    - Identify important terms, conditions, or responsibilities mentioned in the document.
    - Determine the type of legal document (e.g., contract, agreement, notice, policy, etc.).
    - Categorize each key point based on its risk level (High, Medium, Low).
    - Suggest simple and safer wording for high-risk points.
    - Present the findings in a clear markdown format (not a table).
    - STRICTLY NOTHING ELSE NO UNWANTED TEXT ANYTHING OTHER THAN THE MARKDOWN FORMAT TEXT. 

    **Legal Document:**
    {dom_content}

    **Expected Output (in Markdown ( TEXT WITH APPROPRIATE MARKDOWN FORMATING SYMBOLS ONLY)):**
    ```
    **Type of Document:** [Type here]

    **Key Points Identified:**

    1. **Point:** [Describe the important term or condition]
       - **Risk Level:** High / Medium / Low
       - **Suggested Changes (if High Risk):** [Suggest improvement]

    2. **Point:** [Next important point...]
       - **Risk Level:** ...
       - **Suggested Changes (if any):** ...

    [...continue for each important point...]

    **Note:** This summary is intended to simplify the understanding of legal documents. For official interpretation or action, consult a legal professional.
    ```
    """
)


genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
print(os.getenv("GOOGLE_API_KEY"))

# Initialize Gemini model
gemini_model = genai.GenerativeModel("gemini-2.0-flash")

def parse_with_gemini(dom_chunks, parse_description):
    # Combine DOM chunks
    combined_content = " ".join(dom_chunks)

    # Format your prompt
    prompt_text = template.format(dom_content=combined_content, parse_description=parse_description)

    # Call Gemini model
    response = gemini_model.generate_content(prompt_text)

    return response.text



def extract_text_from_pdf(uploaded_pdf):
    pdf_reader = PyPDF2.PdfReader(uploaded_pdf)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
CORS(app)

def extract_markdown_from_response(response: str) -> str:
    """
    Extracts and cleans markdown content from a string response.
    Works whether or not the response is valid JSON.
    Removes 'parsed_clauses', 'markdown', and any outer quotes/brackets.
    """
    # Step 1: Remove 'parsed_clauses' key if present
    cleaned = re.sub(r'"?parsed_clauses"?\s*:\s*', '', response, flags=re.IGNORECASE)

    # Step 2: Remove "markdown" word (case insensitive) at the beginning
    cleaned = re.sub(r'^\s*["\']?markdown\\?n?', '', cleaned, flags=re.IGNORECASE)

    # Step 3: Remove outer JSON-like brackets/braces/quotes if present
    cleaned = cleaned.strip()
    if cleaned.startswith('{') and cleaned.endswith('}'):
        cleaned = cleaned[1:-1].strip()
    if cleaned.startswith('"') and cleaned.endswith('"'):
        cleaned = cleaned[1:-1].strip()

    # Step 4: Decode escaped newlines and quotes
    cleaned = cleaned.encode().decode('unicode_escape')

    return cleaned.strip()


@app.route('/analyze', methods=['POST'])
def analyze_contract():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if file and file.filename.lower().endswith('.pdf'):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Step 1: Extract contract text
        contract_text = extract_text_from_pdf(filepath)
        dom_chunks = [contract_text[i:i+2000] for i in range(0, len(contract_text), 2000)]

        # Step 2: Parse legal clauses
        parse_description = "List all legal clauses in the given contract and categorize the high-risk ones, along with suggesting changes. Give output in tabular format. Keep the reply concise."
        parsed_output = parse_with_gemini(dom_chunks, parse_description)
        parsed_output = extract_markdown_from_response(parsed_output)

        

        return jsonify({
            'parsed_clauses': parsed_output,
        })

    return jsonify({'error': 'Invalid file type. Only PDFs are allowed.'}), 400


if __name__ == '__main__':
    app.run(debug=True, port=7000)