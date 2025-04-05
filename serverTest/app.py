import os
import PyPDF2
import pandas as pd
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import io
from itertools import cycle
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load environment variables
load_dotenv()

# ────────────────────────────────────────────────────────────────────────────────
# 🔐 API KEY SETUP
# ────────────────────────────────────────────────────────────────────────────────
GROQ_API_KEYS = os.environ.get("GROQ_API_KEYS_CYCLE").split(",")
if not GROQ_API_KEYS or GROQ_API_KEYS == [""]:    
    raise ValueError("GROQ API key not found. Please set it in environment variables.")

api_key_cycle = cycle(GROQ_API_KEYS)
# genai.configure(os.environ.get("GOOGLE_API_KEY"))  # Replace with your real API key
# gemini_model = genai.configure(api_key=os.environ.get("GOOGLE_API_KEY")

genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))  # Replace with your real API key
gemini_model = genai.GenerativeModel("models/gemini-1.5-pro-latest")



# ────────────────────────────────────────────────────────────────────────────────
# 🤖 Initialize Groq Model
# ────────────────────────────────────────────────────────────────────────────────
groq_model = ChatGroq(
    api_key=next(api_key_cycle),
    # model_name="llama3-70b-8192"
    model_name="llama-3.3-70b-versatile"
)

# ────────────────────────────────────────────────────────────────────────────────
# 🧠 Prompt Templates
# ────────────────────────────────────────────────────────────────────────────────
legal_template = """
You are a legal AI assistant with expertise in contract analysis and risk assessment.
**Task:** Extract and analyze legal clauses from the provided contract text.

**Instructions:** 
- Extract all legal clauses.
- Categorize each clause based on its risk level (e.g., High, Medium, Low).
- Suggest changes for high-risk clauses.
- Provide the output in a concise tabular format.
- Return the response as a **markdown table only**, with **no additional explanation**.
- **DO NOT** use escaped characters like `\\\"` or `\"`. Use standard double quotes `"like this"`.
- **DO NOT** use markdown symbols inside cell content (like `*`, `**`, `_`, etc.).
- Keep your language simple, professional, and readable.
- Keep each row clear, concise, and well-formatted.
- Do not add any explanation outside the table.
- Do not repeat the contract text verbatim — rephrase each clause clearly.



**Contract Text:**
{dom_content}


**Expected Output:**
| Clause | Risk Level | Suggested Changes |
|--------|------------|-------------------|


"""



















gdpr_template = """
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

# ────────────────────────────────────────────────────────────────────────────────
# 🔄 Helper Functions
# ────────────────────────────────────────────────────────────────────────────────
def parse_legal_clauses(dom_chunks, parse_description):
    prompt = ChatPromptTemplate.from_template(legal_template)
    chain = prompt | groq_model
    combined_content = " ".join(dom_chunks)
    response = chain.invoke({"dom_content": combined_content, "parse_description": parse_description})
    return response.content if hasattr(response, "content") else str(response)

# def check_gdpr_compliance(dom_chunks, gdpr_guidelines):
#     prompt = ChatPromptTemplate.from_template(gdpr_template)
#     chain = prompt | groq_model
#     combined_content = " ".join(dom_chunks)
#     print(combined_content)
#     response = chain.invoke({"dom_content": combined_content, "gdpr_guidelines": gdpr_guidelines})
#     return response.content if hasattr(response, "content") else str(response)

def check_gdpr_compliance(dom_chunks, gdpr_guidelines):
    # Combine all contract chunks into one string
    combined_content = " ".join(dom_chunks)
    # print(combined_content)  # Optional: useful for debugging

    # Format the prompt manually (same as gdpr_template logic)
    prompt = f"""
**Task:** Analyze the provided contract text for GDPR compliance.

**Instructions:**
- Extract all GDPR-relevant clauses.
- Categorize each clause as Compliant, Partially Compliant, or Non-Compliant.
- Suggest plain-language improvements for any that are not fully compliant.

**GDPR Guidelines:**
{gdpr_guidelines}

**Expected Output:**
| Clause | GDPR Compliance | Recommendation |
|--------|------------------|----------------|

**Contract Text:**
{combined_content}
"""

    try:
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error during Gemini response: {str(e)}"











def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    return "".join([page.extract_text() or "" for page in pdf_reader.pages])

def categorize_risk(parsed_output_text):
    high_risk = {}
    medium_risk = {}
    low_risk = {}

    lines = parsed_output_text.strip().split("\n")
    rows = [line for line in lines[3:] if "|" in line]

    for row in rows:
        parts = [col.strip() for col in row.split("|")[1:-1]]
        if len(parts) < 3:
            continue
        clause, risk_level, suggestion = parts
        risk_level_lower = risk_level.lower()

        if "high" in risk_level_lower:
            high_risk[clause] = suggestion
        elif "medium" in risk_level_lower:
            medium_risk[clause] = suggestion
        elif "low" in risk_level_lower:
            low_risk[clause] = suggestion

    return {"low_risk": low_risk, "medium_risk": medium_risk, "high_risk": high_risk}

# ────────────────────────────────────────────────────────────────────────────────
# 🚀 Flask API Routes
# ────────────────────────────────────────────────────────────────────────────────
@app.route('/analyze', methods=['POST'])
def analyze_contract():
    try:
        # Check if file is present in request
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        uploaded_file = request.files['file']
        
        # Check if file is a PDF
        if not uploaded_file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Only PDF files are accepted"}), 400
        
        # Convert to bytes stream
        pdf_stream = io.BytesIO(uploaded_file.read())
        
        # Process the PDF
        contract_text = extract_text_from_pdf(pdf_stream)
        dom_chunks = [contract_text[i:i+2000] for i in range(0, len(contract_text), 2000)]
        
        # Parse legal clauses
        parse_description = "List all legal clauses in the given contract and categorize the high-risk ones, along with suggesting changes. Give output in tabular format. Keep the reply concise."
        parsed_output_text = parse_legal_clauses(dom_chunks, parse_description)
        
        # Categorize risks
        risk_categories = categorize_risk(parsed_output_text)
        
        # Load GDPR guidelines
        csv_filename = "gdpr_qa_train.csv"  # Update path as needed
        if not os.path.exists(csv_filename):
            gdpr_guidelines = "GDPR guidelines file not found."
        else:
            gdpr_guidelines = "\n".join(pd.read_csv(csv_filename).iloc[:, 0].astype(str))
        
        # Prepare response
        response = {
            "legal_analysis": parsed_output_text,
            "risk_categories": risk_categories,
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/gdpr-compliance', methods=['POST'])
def check_gdpr():
    try:
        # Check if file is present in request
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        uploaded_file = request.files['file']
        
        # Check if file is a PDF
        if not uploaded_file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Only PDF files are accepted"}), 400
        
        # Convert to bytes stream
        pdf_stream = io.BytesIO(uploaded_file.read())
        
        # Process the PDF
        contract_text = extract_text_from_pdf(pdf_stream)
        dom_chunks = [contract_text[i:i+2000] for i in range(0, len(contract_text), 2000)]
        
        # Load GDPR guidelines
        csv_filename = "./gdpr_qa_train.csv"  # Update path as needed
        if not os.path.exists(csv_filename):
            return jsonify({"error": "GDPR guidelines file not found"}), 500
        
        gdpr_guidelines = "\n".join(pd.read_csv(csv_filename).iloc[:, 0].astype(str))
        
        # Check GDPR compliance
        compliance_output = check_gdpr_compliance(dom_chunks, gdpr_guidelines)
        
        return jsonify({"gdpr_compliance": compliance_output}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

# ────────────────────────────────────────────────────────────────────────────────
# 🏁 Main Entry Point
# ────────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
