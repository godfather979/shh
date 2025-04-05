# main.py

from utils import *

# Load summarization model with caching
@st.cache_resource
def load_summarization_model():
    checkpoint = "google-t5/t5-small"
    tokenizer = AutoTokenizer.from_pretrained(checkpoint)
    model = AutoModelForSeq2SeqLM.from_pretrained(checkpoint)
    return tokenizer, model

tokenizer, model = load_summarization_model()

# Ollama model for legal document comparison
template = (
    "You are tasked with extracting specific information from the following text content: {dom_content}. "
    "Please follow these instructions carefully: \n\n"
    "1. **Extract Information:** Only extract the information that directly matches the provided description: {parse_description}. "
    "2. **No Extra Content:** Do not include any additional text, comments, or explanations in your response. "
    "3. **Empty Response:** If no information matches the description, return an empty string ('')."
    "4. **Direct Data Only:** Your output should contain only the data that is explicitly requested, with no other text."
)

ollama_model = OllamaLLM(model="llama3.1")

@st.cache_data
def parse_with_ollama(dom_chunks, parse_description):
    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | ollama_model

    parsed_results = []
    for i, chunk in enumerate(dom_chunks, start=1):
        response = chain.invoke(
            {"dom_content": chunk, "parse_description": parse_description}
        )
        print(f"Parsed batch: {i} of {len(dom_chunks)}")
        parsed_results.append(response)

    return "\n".join(parsed_results)

@st.cache_data
def extract_text_from_pdf(uploaded_file):
    pdf_reader = PyPDF2.PdfReader(uploaded_file)
    text = "".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])
    return text

@st.cache_data
def summarize_text(text):
    inputs = tokenizer("summarize: " + text, return_tensors="pt", max_length=512, truncation=True)
    summary_ids = model.generate(inputs.input_ids, max_length=150, min_length=50, length_penalty=2.0, num_beams=4, early_stopping=True)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

def compare_documents(summary_old, summary_new):
    prompt = f"""
    Compare the following legal documents. Highlight key differences, added and removed clauses, and explain their implications.

    Old Document Summary:
    {summary_old}

    New Document Summary:
    {summary_new}

    Provide a structured comparison with specific legal analysis.
    """
    
    # Use Ollama model to process the comparison request
    output = parse_with_ollama([summary_old, summary_new], prompt)
    print(output)
    return output

# Streamlit UI
st.title("Legal Document Comparator")
st.write("Upload two PDF documents (old and new) to compare changes.")

old_pdf = st.file_uploader("Upload Old Document", type=["pdf"])
new_pdf = st.file_uploader("Upload New Document", type=["pdf"])

if old_pdf and new_pdf:
    with st.spinner("Extracting and summarizing documents..."):
        old_text = extract_text_from_pdf(old_pdf)
        new_text = extract_text_from_pdf(new_pdf)
        old_summary = summarize_text(old_text)
        print(old_summary)
        new_summary = summarize_text(new_text)
        print(new_summary)
        comparison_result = compare_documents(old_text, new_text)
    
    st.subheader("Comparison Result")
    st.write(comparison_result)
