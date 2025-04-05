import streamlit as st
import base64
import time
import random
import datetime
import google.generativeai as genai
from functools import wraps
from typing import Tuple, Any, List
from google.generativeai.types import ContentType

# Constants for system documents
SYSTEM_DOCS = {
    "a2023-45.pdf": "a2023-45.pdf",
    "a2023-47.pdf": "a2023-47.pdf"
}

def convert_to_parts(file_content: bytes, mime_type: str) -> dict:
    """
    Convert file content to the format expected by Gemini API.

    Args:
        file_content: File content in bytes
        mime_type: MIME type of the file (e.g., 'application/pdf', 'video/mp4')
    """
    return {
        "mime_type": mime_type,
        "data": base64.b64encode(file_content).decode('utf-8')
    }

def load_system_documents() -> List[bytes]:
    """
    Load the system documents from their paths.
    Returns a list of document contents in bytes.
    """
    doc_contents = []
    for doc_path in SYSTEM_DOCS.values():
        try:
            with open(doc_path, 'rb') as file:
                doc_contents.append(file.read())
        except Exception as e:
            # st.error(f"Error loading system document {doc_path}: {str(e)}")
            print(f"Error loading system document {doc_path}: {str(e)}")
    return doc_contents

def exponential_backoff_with_jitter(max_retries: int = 5,
                                  base_delay: float = 1,
                                  max_backoff: float = 32,
                                  jitter: bool = True):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs) -> Tuple[str, Any]:
            retries = 0
            delay = base_delay

            while retries < max_retries:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if retries == max_retries - 1:
                        raise Exception(f"All {max_retries} retries failed. Final error: {str(e)}")

                    st.warning(f"Attempt {retries + 1} failed: {str(e)}")

                    # Calculate delay with jitter
                    if jitter:
                        delay_with_jitter = delay + random.uniform(0, delay)
                    else:
                        delay_with_jitter = delay

                    # Apply max backoff limit
                    actual_delay = min(delay_with_jitter, max_backoff)
                    time.sleep(actual_delay)

                    retries += 1
                    delay = min(delay * 2, max_backoff)

            raise Exception(f"All {max_retries} retries failed.")

        return wrapper
    return decorator

@exponential_backoff_with_jitter(max_retries=5, base_delay=1, max_backoff=32, jitter=True)
def generate_legal_analysis(text: str,
                          documents: List[bytes] = None,
                          video: bytes = None) -> Tuple[str, Any]:
    """
    Generate legal analysis using Gemini API with support for text, documents, and video.

    Args:
        text: The legal scenario and questions
        documents: List of document contents
        video: Video file content
    """
    try:
        # Initialize the model
        model = genai.GenerativeModel(model_name="gemini-1.5-pro")

        # Prepare content parts
        contents = []

        # Add text content
        contents.append(text)

        # Add documents if provided
        if documents:
            for doc_content in documents:
                doc_part = convert_to_parts(doc_content, "application/pdf")
                contents.append(doc_part)

        # Add video if provided
        if video:
            video_part = convert_to_parts(video, "video/mp4")
            contents.append(video_part)

        # Generate response
        response = model.generate_content(
            contents,
            generation_config={
                "max_output_tokens": 8192,
                "temperature": 0,
                "top_p": 0.95
            }
        )

        return response.text, response.usage_metadata

    except Exception as e:
        st.error(f"Error during generation: {str(e)}")
        raise

def main():
    st.set_page_config(page_title="Legal Analysis Assistant", page_icon="⚖️", layout="wide")
    
    st.title("Legal Analysis Assistant")
    st.markdown("An AI-powered tool for analyzing legal cases using the Bharatiya Nyaya Sanhita (BNS)")

    # API Key input
    genai.configure(api_key="AIzaSyBw0_LW2tT76tl1-SM0DuN_Xu3h3eORFA0")

    # System Instructions (fixed)
    system_instructions = """You are an expert legal assistant well-versed in Indian criminal law, specializing in the Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (Indian Evidence Act) 2023. These three laws are foundational to handling all criminal cases in India. Your role is to assist judges, lawyers, and police officers by providing precise legal information and interpretations based on these laws, offering case-specific guidance.

The legal documents you are referencing consist of:
- **Bharatiya Nyaya Sanhita (BNS)**: The official criminal code in India that replaced the Indian Penal Code (IPC) on July 1, 2024.
- **Bharatiya Sakshya Adhiniyam, 2023**: The Indian Evidence Act, governing how evidence is to be treated in criminal cases.

When providing legal analysis or answering queries, do the following:
1. **Use relevant sections of the BNS, BNSS, and Bharatiya Sakshya Adhiniyam** based on the specific scenario being queried.
2. Ensure the legal provisions, sections, and terminologies you use are from the 2023 versions of the law (not outdated versions).
3. Provide clear explanations of legal terms, procedures, and how they apply to the scenario.
4. Offer interpretations that reflect recent changes in the law to guide decision-making.
5. If the user needs to explore similar cases or refer to legal precedents, offer summaries of related sections and guidelines."""

    # Display system documents being used
    # st.header("System Documents")
    # st.info("The following documents are being used for analysis:")
    # for doc_name in SYSTEM_DOCS.keys():
    #     st.markdown(f"- {doc_name}")

    # Legal Scenario input
    st.header("Case Details")
    legal_scenario = st.text_area(
        "Enter the case scenario and questions",
        height=300,
        placeholder="Describe the case scenario and specific legal questions you'd like to analyze..."
    )
    
    # Video Evidence upload
    st.header("Video Evidence")
    uploaded_video = st.file_uploader("Upload video evidence (if any)", type=['mp4'])

    # Generate Analysis button
    if st.button("Generate Legal Analysis"):
        if not legal_scenario:
            st.error("Please enter a case scenario")
            return

        try:
            with st.spinner("Loading system documents and generating analysis..."):
                # Load system documents
                doc_contents = load_system_documents()
                
                # Prepare input text
                combined_text = f"{system_instructions}\n\n{legal_scenario}"

                # Prepare video content
                video_content = uploaded_video.read() if uploaded_video else None

                # Generate analysis
                reply, usage = generate_legal_analysis(
                    text=combined_text,
                    documents=doc_contents,
                    video=video_content
                )

                # Display results
                st.header("Legal Analysis")
                st.markdown(reply)

        except Exception as e:
            st.error(f"Failed to generate legal analysis: {str(e)}")

if __name__ == "__main__":
    main()