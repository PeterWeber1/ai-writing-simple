import os
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel

app = FastAPI()

class Payload(BaseModel):
    text: str

def verify(req: Request):
    if req.headers.get("authorization") != f"Bearer {os.getenv('API_SECRET', 'test-secret')}":
        raise HTTPException(status_code=401)

@app.post("/humanize")
async def humanize(req: Request, p: Payload):
    verify(req)
    # Simple humanization logic for testing
    humanized_text = f"Humanized version: {p.text} (This is a test response)"
    return {"humanized": humanized_text}

@app.get("/healthz")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 