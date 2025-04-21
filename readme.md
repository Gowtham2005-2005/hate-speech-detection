# 🛡️ Hate Speech Detection Web App

A full-stack web application for detecting and analyzing hate speech in user inputs. It features a real-time chat interface, a graphical dashboard, report generation, and an in-depth analysis page.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Gowtham2005-2005/hate-speech-detection.git
cd hate-speech-detection
```

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The frontend will be live at: http://localhost:3000

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd ../backend
```

Set up a virtual environment:

```bash
python -m venv venv
```

Activate the environment:

On macOS/Linux:

```bash
source venv/bin/activate
```

On Windows:

```bash
venv\Scripts\activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Run the FastAPI server:

```bash
python run.py
```

The backend API will be live at: http://localhost:8000

API documentation is available at: http://localhost:8000/docs

## Features

### Real-Time Hate Speech Detection

Chat window sends messages to the backend API and receives analysis instantly.

### Dashboard with Graphical Insights

Visualize trends, severity, frequency, and sentiment distribution.

### Downloadable Reports

Export a full report of the conversation and analysis as a downloadable file.

### Full Analysis Page

Deep dive into message patterns, toxic keywords, and classification confidence.

### Requirements

- Node.js (recommended: ≥ 16.x)
- Python (≥ 3.x)

All required dependencies are listed in the respective package.json and requirements.txt

For details about the backend, refer to the backend README.md file.
