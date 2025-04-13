from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch


app = FastAPI(title="Hate Speech Detection API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize the model and tokenizer
model_name = "facebook/roberta-hate-speech-dynabench-r4-target"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
classifier = pipeline("text-classification", model=model, tokenizer=tokenizer)

class TextInput(BaseModel):
    text: str

def preprocess_text(text):
    # Convert common misspellings of offensive words
    text = text.lower()
    return text

@app.post("/detect-hate-speech")
async def detect_hate_speech(input: TextInput):
    try:
        # Preprocess the text
        processed_text = preprocess_text(input.text)
        
        # Get prediction
        result = classifier(processed_text)[0]
        
        # Convert to more readable format
        is_hate_speech = result['label'] == 'hate'
        confidence = result['score']
        
        return {
            "is_hate_speech": is_hate_speech,
            "confidence": float(confidence),
            "original_text": input.text,
            "processed_text": processed_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {
        "message": "Hate Speech Detection API",
        "status": "operational",
        "model": "roberta-hate-speech-dynabench-r4-target"
    } 