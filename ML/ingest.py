import os
from PyPDF2 import PdfReader
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer

# --- Configuration ---
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
INDEX_NAME = os.getenv('INDEX_NAME') # Ek hi index rahega

pc = Pinecone(api_key=PINECONE_API_KEY)
model = SentenceTransformer('all-MiniLM-L6-v2')

# 1. Index create karein agar nahi hai

if INDEX_NAME in pc.list_indexes().names():
    print(f"🗑️ Deleting old index with wrong dimensions...")
    pc.delete_index(INDEX_NAME)

print(f"🏗️ Creating new index with 384 dimensions...")
pc.create_index(
    name=INDEX_NAME,
    dimension=384, # Match MiniLM dimensions
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1")
)

index = pc.Index(INDEX_NAME)

def process_and_upload(file_path, disorder_name):
    if not os.path.exists(file_path):
        print(f"⚠️ File missing: {file_path}")
        return

    print(f"📂 Processing {disorder_name} into Namespace: '{disorder_name.lower()}'")
    
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        content = page.extract_text()
        if content: text += content

    # 2. Chunking Logic
    chunk_size = 600 # Thoda bada chunk for better context
    overlap = 100
    chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size - overlap)]
    
    vectors = []
    for i, chunk in enumerate(chunks):
        embedding = model.encode(chunk).tolist()
        
        vectors.append({
            "id": f"{disorder_name}_{i}",
            "values": embedding,
            "metadata": {
                "text": chunk,
                "source": file_path
            }
        })

    # 3. Upload to Specific Namespace
    # Yahan magic ho raha hai: har disorder ka apna alag section
    index.upsert(
        vectors=vectors, 
        namespace=disorder_name.lower() 
    )
    
    print(f"✅ Successfully loaded {len(vectors)} vectors into namespace: {disorder_name.lower()}\n")

# --- 🚀 RUN: 5 Disorders, 5 PDFs, 5 Namespaces ---
if __name__ == "__main__":
    # In files ko apne project folder mein rakhna
    disorder_map = {
        "ADHD": "adhd_guide.pdf",
        "PTSD": "ptsd_guide.pdf",
        "Autism": "autism_guide.pdf",
        "Anxiety": "anxiety_guide.pdf",
        "OCD": "ocd_guide.pdf"
    }

    for disorder, file in disorder_map.items():
        process_and_upload(file, disorder)
        
    print("🔥 MISSION ACCOMPLISHED: All namespaces are ready!")