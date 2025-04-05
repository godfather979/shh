import streamlit as st
import easyocr
from PIL import Image
import io
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

# Set page config as the first Streamlit command
st.set_page_config(page_title="AI Form Assistant", page_icon="📝", layout="wide")

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

# Load AI Model for Guidance
@st.cache_resource
def load_model():
    model_name = "google/flan-t5-large"  # Using a larger model
    device = "cuda" if torch.cuda.is_available() else "cpu"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to(device)
    return tokenizer, model, device

tokenizer, model, device = load_model()

def extract_text_from_image(image):
    img_bytes = io.BytesIO()
    image.save(img_bytes, format='PNG')
    img_bytes = img_bytes.getvalue()
    results = reader.readtext(img_bytes)
    extracted_fields = [text for _, text, _ in results]
    return extracted_fields

def generate_guidance(field_name):
    prompt = f"""
    Provide guidance for filling out the form field: {field_name}
    Give a clear explanation of:
    What information should be entered in the provided field.
    """
    inputs = tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True)
    inputs = {k: v.to(device) for k, v in inputs.items()}
    with torch.no_grad():
        outputs = model.generate(
            inputs["input_ids"],
            max_length=200,
            num_beams=4,
            temperature=0.7,
            no_repeat_ngram_size=2
        )
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

def main():
    st.title("AI Form Assistant - Upload Form Image")
    uploaded_file = st.file_uploader("Upload an image of a form", type=["png", "jpg", "jpeg"])
    
    if uploaded_file:
        image = Image.open(uploaded_file).convert("RGB")  # Convert image mode for compatibility
        st.image(image, caption="Uploaded Form", use_column_width=True)
        
        with st.spinner("Extracting fields..."):
            fields = extract_text_from_image(image)
        
        if fields:
            st.subheader("Detected Fields")
            selected_field = st.selectbox("Select a field for guidance", fields)
            
            if st.button("Generate Guidance"):
                with st.spinner("Generating guidance..."):
                    guidance = generate_guidance(selected_field)
                st.markdown(f"**Guidance for {selected_field}:**")
                st.write(guidance)
        else:
            st.error("No fields detected. Try another image.")

if __name__ == "__main__":
    main()
