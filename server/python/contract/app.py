import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import PyPDF2
import pandas as pd
import os
import streamlit as st
from groq import Groq
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()


# Template for the Llama model
template = (
    """
    **Task:** Extract and analyze legal clauses from the provided contract text.
    
    **Instructions:** 
    - Extract all legal clauses.
    - Categorize each clause based on its risk level (e.g., High, Medium, Low).
    - Suggest changes for high-risk clauses.
    - Provide the output in a concise tabular format.

    **Contract Text:**
    {dom_content}

    **Expected Output:**
    | Clause | Risk Level | Suggested Changes |
    |--------|------------|-------------------|
    """
)

# GDPR Compliance Check Template
gdpr_template = (
    """
    **Task:** Check GDPR compliance of the provided contract text.
    
    **Instructions:**
    - Compare the contract with GDPR guidelines.
    - Identify non-compliant clauses.
    - Suggest necessary modifications to ensure compliance.
    
    **GDPR Guidelines:**
    {gdpr_guidelines}
    
    **Contract Text:**
    {dom_content}
    
    **Expected Output:**
    - Non-compliant clauses.
    - Suggested modifications.
    """
)


genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize Gemini model
gemini_model = genai.GenerativeModel("gemini-2.0-flash")

@st.cache_data
def parse_with_gemini(dom_chunks, parse_description):
    # Combine DOM chunks
    combined_content = " ".join(dom_chunks)

    # Format your prompt
    prompt_text = template.format(dom_content=combined_content, parse_description=parse_description)

    # Call Gemini model
    response = gemini_model.generate_content(prompt_text)

    return response.text

@st.cache_data
def check_gdpr_compliance(dom_chunks, gdpr_guidelines):
    # Combine content into a single string
    combined_content = " ".join(dom_chunks)

    # Format the prompt using your GDPR template
    prompt_text = gdpr_template.format(dom_content=combined_content, gdpr_guidelines=gdpr_guidelines)

    # Generate response from Gemini
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

# Load GDPR guidelines once at startup
csv_filename = "gdpr_qa_train.csv"
if not os.path.exists(csv_filename):
    raise FileNotFoundError("GDPR guidelines CSV file not found.")
gdpr_guidelines = "\n".join(pd.read_csv(csv_filename).iloc[:, 0].astype(str))

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

        # Step 3: GDPR Compliance Check
        compliance_output = check_gdpr_compliance(dom_chunks, gdpr_guidelines)

        return jsonify({
            'parsed_clauses': parsed_output,
            'gdpr_compliance_report': compliance_output
        })

    return jsonify({'error': 'Invalid file type. Only PDFs are allowed.'}), 400


if __name__ == '__main__':
    app.run(debug=True)