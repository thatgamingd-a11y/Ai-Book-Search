from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF for PDFs
from openai import OpenAI
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key="YOUR_OPENAI_API_KEY")

# Store chunks and embeddings
book_chunks = []
chunk_embeddings = []

# -------------------------
# Helper functions
# -------------------------

def chunk_text(text, chunk_size=500):
    """Split text into chunks of ~chunk_size words"""
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunks.append(" ".join(words[i:i+chunk_size]))
    return chunks

def embed(text):
    """Get embedding vector from OpenAI"""
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def extract_text_from_pdf(file_bytes):
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

# -------------------------
# Upload endpoint
# -------------------------

@app.post("/upload_book")
async def upload_book(file: UploadFile):
    global book_chunks, chunk_embeddings
    contents = await file.read()
    if file.filename.lower().endswith(".pdf"):
        text = extract_text_from_pdf(contents)
    else:  # assume txt
        text = contents.decode("utf-8")
    
    book_chunks = chunk_text(text)
    chunk_embeddings = [embed(c) for c in book_chunks]
    
    return {"message": f"{len(book_chunks)} chunks stored."}

# -------------------------
# Query endpoint
# -------------------------

@app.post("/query")
async def query_book(question: str = Form(...)):
    if not book_chunks:
        return {"results": ["No book uploaded yet."]}
    
    question_emb = embed(question)
    sims = cosine_similarity([question_emb], chunk_embeddings)[0]
    top_indices = np.argsort(sims)[-5:][::-1]  # top 5
    results = [book_chunks[i] for i in top_indices]
    
    return {"results": results}
