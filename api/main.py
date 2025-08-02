import os, functools, torch
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import uvicorn

app = FastAPI(title="Text Humanization API")

class Payload(BaseModel):
    text: str

@functools.lru_cache
def get_pipe():
    repo = os.getenv("MODEL_REPO", "google/flan-t5-small")
    tok = AutoTokenizer.from_pretrained(repo)
    model = AutoModelForSeq2SeqLM.from_pretrained(
        repo,
        torch_dtype=torch.int8,
        low_cpu_mem_usage=True
    )
    return tok, model

def verify(req: Request):
    api_secret = os.getenv('API_SECRET', 'test-secret')
    if req.headers.get("authorization") != f"Bearer {api_secret}":
        raise HTTPException(status_code=401, detail="Invalid authorization")

@app.post("/humanize")
async def humanize(req: Request, p: Payload):
    verify(req)
    tok, model = get_pipe()
    ids = tok(p.text, return_tensors="pt").input_ids
    out = model.generate(ids, max_new_tokens=256, temperature=0.7, top_p=0.9)
    return {"humanized": tok.decode(out[0], skip_special_tokens=True)}

@app.get("/healthz")
async def health():
    return {"status": "ok", "message": "API is running"}

@app.get("/")
async def root():
    return {"message": "Text Humanization API is running"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 