# Text Humanization API

This is a FastAPI backend that uses the flan-t5-small model for text humanization.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variables:
```bash
MODEL_REPO=google/flan-t5-small
API_SECRET=your-shared-secret
HF_TOKEN=your-huggingface-token
```

3. Run locally:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

- `POST /humanize` - Humanize text
- `GET /healthz` - Health check

## Docker

Build and run with Docker:
```bash
docker build -t api .
docker run -p 8000:8000 api
```

## Environment Variables

- `MODEL_REPO`: Hugging Face model repository (default: google/flan-t5-small)
- `API_SECRET`: Secret key for API authentication
- `HF_TOKEN`: Hugging Face token (if model is private) 