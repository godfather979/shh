import streamlit as st
import easyocr
from PIL import Image
import io
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Set page config as the first Streamlit command
st.set_page_config(page_title="AI Form Assistant", page_icon="📝", layout="wide")

# Custom CSS to enhance the UI and hide the warning
st.markdown("""
    <style>
    #MainMenu {visibility: hidden;}
    header {visibility: hidden;}
    footer {visibility: hidden;}
    .stApp {
        max-width: 1000px;
        margin: 0 auto;
    }
    .upload-header {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 1rem;
    }
    .guidance-container {
        background-color: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        border: 1px solid #e9ecef;
        margin-top: 2rem;
    }
    .field-select {
        margin: 2rem 0;
    }
    .upload-section {
        background-color: #f8f9fa;
        padding: 2rem;
        border-radius: 10px;
        border: 1px solid #e9ecef;
        margin: 2rem 0;
    }
    </style>
""", unsafe_allow_html=True)

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
        return response.text
    except Exception as e:
        return {"error": "Failed to get response from Gemini", "details": str(e)}

def extract_text_from_image(image):
    img_bytes = io.BytesIO()
    image.save(img_bytes, format='PNG')
    img_bytes = img_bytes.getvalue()
    results = reader.readtext(img_bytes)
    extracted_fields = [text for _, text, _ in results]
    return extracted_fields

def generate_guidance(field_name):
    prompt = f"""
    Provide guidance for filling out the form field: {field_name}.
    Clearly explain what information should be entered in this field in detail. Also give the correct format.
    """
    return call_gemini_api(prompt)

def main():
    # Create a clean, modern header
    st.markdown(
        """
        <div style="text-align: center; padding: 2rem 0;">
            <h1 style="color: #1f77b4;">📝 AI Form Assistant</h1>
            <p style="font-size: 16px; color: #666;">Get intelligent guidance for filling out your forms</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # Upload section
    st.markdown('<p class="upload-header">📤 Upload Form Image</p>', unsafe_allow_html=True)
    uploaded_file = st.file_uploader(
        "Choose a PNG, JPG, or JPEG file",
        type=["png", "jpg", "jpeg"],
        help="Upload a clear image of your form"
    )
    st.markdown('</div>', unsafe_allow_html=True)

    if uploaded_file:
        image = Image.open(uploaded_file).convert("RGB")
        # Resize image while maintaining aspect ratio
        max_width = 800
        ratio = max_width / float(image.size[0])
        new_size = (max_width, int(float(image.size[1]) * ratio))
        resized_image = image.resize(new_size, Image.LANCZOS)
        
        # Center the image with a container
        st.markdown(
            """
            <div style="display: flex; justify-content: center; margin: 2rem 0;">
            """,
            unsafe_allow_html=True
        )
        st.image(resized_image, caption="Uploaded Form", width=max_width)
        st.markdown("</div>", unsafe_allow_html=True)

        with st.spinner("🔍 Extracting fields..."):
            fields = extract_text_from_image(image)

        if fields:
            st.markdown("### 🎯 Detected Fields")
            st.markdown('<div class="field-select">', unsafe_allow_html=True)
            selected_field = st.selectbox(
                "Select a field for guidance:",
                fields,
                help="Choose a field to get detailed guidance"
            )
            st.markdown('</div>', unsafe_allow_html=True)

            if st.button("✨ Get Smart Guidance", use_container_width=True):
                with st.spinner("💡 Generating guidance..."):
                    guidance = generate_guidance(selected_field)
                
                st.markdown(f"#### 📌 Guidance for '{selected_field}'")
                st.write(guidance)
                st.markdown('</div>', unsafe_allow_html=True)
        else:
            st.error("⚠️ No fields detected. Please upload a clearer image.")

    else:
        st.markdown(
            """
            <div style="text-align: center; padding: 4rem 2rem; color: #666; background-color: #f8f9fa; border-radius: 10px;">
                <h3>👆 Start by uploading a form image</h3>
                <p>I'll help you understand how to fill it out correctly!</p>
            </div>
            """,
            unsafe_allow_html=True
        )

if __name__ == "__main__":
    main()