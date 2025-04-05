import streamlit as st
from PyPDF2 import PdfReader
from langchain_ollama import OllamaLLM
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Template for extracting Terms and Conditions and identifying loopholes
template = (
    """
    You are tasked with identifying the 'Terms and Conditions' section from the following document: {dom_content}.
    Please follow these instructions carefully:

    1. **Extract Terms and Conditions:** Locate and extract the entire 'Terms and Conditions' section from the text, including all clauses, without adding any extra commentary or modifications.
    2. **Identify Loopholes:** Thoroughly analyze the extracted 'Terms and Conditions' and identify any potential loopholes, ambiguities, or areas that might create confusion or be exploited. List them clearly and specifically.
    3. **Provide Context:** For each identified loophole or ambiguity, provide a brief explanation of why it could be problematic and suggest possible improvements or clarifications.
    4. **No Extra Content:** Ensure that no additional content is included beyond the 'Terms and Conditions' extraction and loophole identification. Only provide the relevant sections.
    5. **Empty Response:** If no 'Terms and Conditions' section is found, return an empty string ('').
    """
)

model = OllamaLLM(model="llama3.1")

def extract_text_from_pdf(pdf_path):
    """
    Extract text from a PDF file.
    """
    pdf = PdfReader(pdf_path)
    content = []
    for page in pdf.pages:
        content.append(page.extract_text())
    return "\n".join(content)

def analyze_pdf_content(pdf_text):
    """
    Analyze the PDF content by extracting 'Terms and Conditions' and identifying loopholes.
    """
    
    # Define the prompt with placeholders
    prompt = PromptTemplate(input_variables=["dom_content"], template="... your prompt ...")
    
    # Create the chain using the model and the prompt template
    chain = prompt | model

    # Set the context for analysis, filling the placeholders
    result = chain.invoke({"dom_content": pdf_text})


    return result

# Streamlit UI
st.title("PDF Analysis Tool")

uploaded_file = st.file_uploader("Upload a PDF file", type="pdf")

if uploaded_file is not None:
    try:
        # Extract text from the uploaded PDF
        pdf_text = extract_text_from_pdf(uploaded_file)

        if st.button("Analyze Document"):
            result = analyze_pdf_content(pdf_text)
            st.write("## Analysis Result")
            st.markdown(result)  # Display result in markdown format
    except Exception as e:
        st.error(f"An error occurred: {str(e)}")
