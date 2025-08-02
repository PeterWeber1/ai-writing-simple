import os
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Text Humanization API")

class Payload(BaseModel):
    text: str

def verify(req: Request):
    api_secret = os.getenv('API_SECRET', 'test-secret')
    if req.headers.get("authorization") != f"Bearer {api_secret}":
        raise HTTPException(status_code=401, detail="Invalid authorization")

@app.post("/humanize")
async def humanize(req: Request, p: Payload):
    verify(req)
    # Simple humanization logic for testing
    humanized_text = f"Humanized version: {p.text} (This is a test response)"
    return {"humanized": humanized_text}

@app.get("/healthz")
async def health():
    return {"status": "ok", "message": "API is running"}

@app.get("/")
async def root():
    return {"message": "Text Humanization API is running"}

if __name__ == "__main__":
    print("Starting server on port 8001...")
    uvicorn.run(app, host="127.0.0.1", port=8001, log_level="info") 