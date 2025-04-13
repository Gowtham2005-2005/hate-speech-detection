# Hate Speech Detection API

This is a FastAPI-based hate speech detection service that uses the Facebook RoBERTa model trained on the Dynabench dataset to detect hate speech in text.

## Features

- Detects hate speech and abusive language
- Handles common misspellings of offensive words
- Provides confidence scores for predictions
- RESTful API interface

## Setup

1. Create a virtual environment (recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the API:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Detect Hate Speech

- **Endpoint**: `/detect-hate-speech`
- **Method**: POST
- **Input**: JSON with text field

```json
{
  "text": "Your text to analyze"
}
```

- **Response**:

```json
{
    "is_hate_speech": true/false,
    "confidence": 0.95,
    "original_text": "Your original text",
    "processed_text": "Processed version of your text"
}
```

### API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.

## Model Details

The API uses the `facebook/roberta-hate-speech-dynabench-r4-target` model, which is trained to detect:

- Hate speech against religions, races, and other protected groups
- Abusive language and profanity
- Various forms of offensive content

## Notes

- The model is pre-trained and does not require custom training
- It handles common misspellings of offensive words
- The API includes text preprocessing to improve detection accuracy
