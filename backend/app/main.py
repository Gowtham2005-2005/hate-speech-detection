from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
from googletrans import Translator

app = FastAPI(title="Hate Speech Detection")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize the model and tokenizer - using the specified model
model_name = "facebook/roberta-hate-speech-dynabench-r4-target"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
classifier = pipeline("text-classification", model=model, tokenizer=tokenizer)

# Initialize the translator
translator = Translator()

class TextInput(BaseModel):
    text: str

def is_tamil_or_tanglish(text):
    # Check if text contains Tamil characters (Unicode range)
    tamil_unicode_range = range(0x0B80, 0x0BFF)
    for char in text:
        if ord(char) in tamil_unicode_range:
            return True
    
    # Basic check for Tanglish - look for common Tamil patterns in Latin script
    tanglish_patterns = ['th', 'zh', 'ng', 'aa', 'ee', 'oo', 'kk', 'pp', 'tt', 'mm', 'nn']
    text_lower = text.lower()
    for pattern in tanglish_patterns:
        if pattern in text_lower:
            # This is a simple heuristic and might have false positives
            # A more robust method would involve language detection libraries
            return True
    
    return False

def translate_to_english(text):
    try:
        translation = translator.translate(text, dest='en')
        return translation.text
    except Exception as e:
        # If translation fails, return original text
        print(f"Translation error: {e}")
        return text

def preprocess_text(text):
    # Convert common misspellings of offensive words
    text = text.lower()
    
    # Check if text is Tamil or Tanglish
    if is_tamil_or_tanglish(text):
        text = translate_to_english(text)
    
    return text

@app.post("/detect-hate-speech")
async def detect_hate_speech(input: TextInput):
    try:
        # Preprocess the text (including translation if needed)
        processed_text = preprocess_text(input.text)
        
        # Record if translation was performed
        was_translated = is_tamil_or_tanglish(input.text)
        
        # Get prediction
        result = classifier(processed_text)[0]
        
        # Convert to more readable format
        is_hate_speech = result['label'] == 'hate'
        confidence = result['score']
        
        return {
            "is_hate_speech": is_hate_speech,
            "confidence": float(confidence),
            "original_text": input.text,
            "processed_text": processed_text,
            "was_translated": was_translated
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {
        "message": "Hate Speech Detection API with Tamil/Tanglish Support",
        "status": "operational",
        "model": "roberta-hate-speech-dynabench-r4-target",
        "languages_supported": ["English", "Tamil", "Tanglish"]
    }