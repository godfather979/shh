import os
import streamlit as st
import PyPDF2
import pandas as pd
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

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

# Initialize Ollama Llama model
ollama_model = OllamaLLM(model="llama3.1")

@st.cache_data
def parse_with_ollama(dom_chunks, parse_description):
    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | ollama_model
    
    combined_content = " ".join(dom_chunks)
    response = chain.invoke({"dom_content": combined_content, "parse_description": parse_description})
    return response

@st.cache_data
def check_gdpr_compliance(dom_chunks, gdpr_guidelines):
    prompt = ChatPromptTemplate.from_template(gdpr_template)
    chain = prompt | ollama_model
    
    combined_content = " ".join(dom_chunks)
    response = chain.invoke({"dom_content": combined_content, "gdpr_guidelines": gdpr_guidelines})
    return response

def extract_text_from_pdf(uploaded_pdf):
    pdf_reader = PyPDF2.PdfReader(uploaded_pdf)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def app():
    st.title("Legal Contract Analyzer")

    # Load GDPR guidelines
    csv_filename = "gdpr_qa_train.csv"
    if not os.path.exists(csv_filename):
        st.error("GDPR guidelines CSV file not found. Please ensure it is in the same directory as app.py.")
        st.stop()
    gdpr_guidelines = "\n".join(pd.read_csv(csv_filename).iloc[:, 0].astype(str))

    # File upload for PDF contract
    uploaded_file = st.file_uploader("Upload a legal contract (PDF)", type="pdf")
    
    if uploaded_file is not None:
        st.write("File uploaded successfully!")
        contract_text = extract_text_from_pdf(uploaded_file)
        dom_chunks = [contract_text[i:i+2000] for i in range(0, len(contract_text), 2000)]
        
        # Parse clauses
        parse_description = "List all legal clauses in the given contract and categorize the high-risk ones, along with suggesting changes. Give output in tabular format. Keep the reply concise."
        parsed_output = parse_with_ollama(dom_chunks, parse_description)
        st.subheader("Generated Legal Clauses and High-Risk Categories")
        st.markdown(parsed_output)
        
        # GDPR Compliance Check
        if st.button("Check GDPR Compliance"):
            st.subheader("GDPR Compliance Report")
            compliance_output = check_gdpr_compliance(dom_chunks, gdpr_guidelines)
            st.write("Compliance Analysis", compliance_output)

if __name__ == "__main__":
    app()