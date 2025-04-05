from flask import Flask, request, jsonify
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import pdfplumber
from collections import Counter
from flask_cors import CORS , cross_origin 

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load Tokenizer and Models
tokenizer = AutoTokenizer.from_pretrained("law-ai/InLegalBERT")

ILSI_CLASSES = [
    "Medical Records", "Intellectual Property", "Family Disputes/Laws", 
    "Memorandum of Understanding", "Criminal Cases", "Corporate Governance", 
    "Environmental Cases", "Agreements & Contracts"
]

ISS_TAGS = ["Other", "Facts", "Issues", "Arguments", "Precedents", 
            "Statutes", "Ruling", "Conclusion"]

ILDC_CLASSES = [
    "In Favor of Tenant", "In Favor of Landlord", "Negotiated Settlement", "Dismissed"
]

IPC_SECTIONS = [
    "IPC Section 405 - Criminal Breach of Trust", "IPC Section 415 - Cheating",
    "IPC Section 441 - Criminal Trespass", "IPC Section 442 - House Trespass",
    "IPC Section 403 - Dishonest Misappropriation of Property",
    "IPC Section 498A - Cruelty to Woman", "IPC Section 506 - Criminal Intimidation",
    "IPC Section 354 - Outraging Modesty of Woman"
]

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text.strip()

def split_into_sentences(text):
    return [s.strip() for s in text.split('\n') if s.strip()]

@app.route('/upload-pdf', methods=['POST'])
@cross_origin(origin='*')
def upload_pdf():
    file = request.files['pdf']
    text = extract_text_from_pdf(file)
    return jsonify({"text": text})

@app.route('/statute-identification', methods=['POST'])
def statute_identification():
    data = request.json
    case_description = data['text']

    model = AutoModelForSequenceClassification.from_pretrained(
        "law-ai/InLegalBERT", num_labels=len(ILSI_CLASSES)
    )
    inputs = tokenizer(case_description, return_tensors="pt", truncation=True)
    logits = model(**inputs).logits

    probs = torch.sigmoid(logits).detach().numpy()[0]
    results = {ILSI_CLASSES[i]: float(probs[i]) for i in range(len(ILSI_CLASSES))}
    return jsonify(results)

@app.route('/ipc-identification', methods=['POST'])
def ipc_identification():
    data = request.json
    case_description = data['text']

    model = AutoModelForSequenceClassification.from_pretrained(
        "law-ai/InLegalBERT", num_labels=len(IPC_SECTIONS)
    )
    inputs = tokenizer(case_description, return_tensors="pt", truncation=True)
    logits = model(**inputs).logits

    probs = torch.sigmoid(logits).detach().numpy()[0]
    results = {IPC_SECTIONS[i]: float(probs[i]) for i in range(len(IPC_SECTIONS))}
    return jsonify(results)
@app.route('/semantic-segmentation', methods=['POST'])
def semantic_segmentation():
    data = request.json
    case_description = data['text']

    # Load the model
    model = AutoModelForSequenceClassification.from_pretrained(
        "law-ai/InLegalBERT", num_labels=len(ISS_TAGS)
    )

    # Split the case description into sentences
    sentences = split_into_sentences(case_description)
    batch_size = 30
    tags_counter = Counter()

    # Process sentences in batches of 30
    for i in range(0, len(sentences), batch_size):
        batch = sentences[i:i + batch_size]
        inputs = tokenizer(batch, return_tensors="pt", truncation=True, padding=True)
        logits = model(**inputs).logits
        tags = torch.argmax(logits, dim=-1).tolist()
        tags_counter.update(tags)

    # Get the top 3 most common tags with their counts
    top_3_tags = tags_counter.most_common(3)
    response = [{"tag": ISS_TAGS[tag], "count": count} for tag, count in top_3_tags]

    return jsonify({"top_tags": response})


@app.route('/judgment-prediction', methods=['POST'])
def judgment_prediction():
    data = request.json
    case_description = data['text']

    model = AutoModelForSequenceClassification.from_pretrained(
        "law-ai/InLegalBERT", num_labels=len(ILDC_CLASSES)
    )
    inputs = tokenizer(case_description, return_tensors="pt", truncation=True)
    logits = model(**inputs).logits

    probs = torch.softmax(logits, dim=1).detach().numpy()[0]
    prediction = ILDC_CLASSES[probs.argmax()]
    return jsonify({"prediction": prediction, "probabilities": probs.tolist()})



if __name__ == '__main__':
    app.run(debug=True)
