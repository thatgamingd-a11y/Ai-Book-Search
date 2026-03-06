from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = FastAPI()

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key="YOUR_OPENAI_API_KEY")

# Store book chunks & embeddings
book_chunks = []
chunk_embeddings = []

def chunk_text(text, chunk_size=500):
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

def embed(text):
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

@app.post("/upload_book")
async def upload_book(file: UploadFile):
    global book_chunks, chunk_embeddings
    text = await file.read()
    text = text.decode("utf-8")
    book_chunks = chunk_text(text)
    chunk_embeddings = [embed(c) for c in book_chunks]
    return {"message": f"{len(book_chunks)} chunks stored."}

@app.post("/query")
async def query_book(query: str = Form(...)):
    if not book_chunks:
        return {"results": ["No book uploaded yet."]}
    
    query_emb = embed(query)
    sims = cosine_similarity([query_emb], chunk_embeddings)[0]
    top_indices = np.argsort(sims)[-5:][::-1]
    results = [book_chunks[i] for i in top_indices]
    return {"results": results}
