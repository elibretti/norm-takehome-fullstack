from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.utils import Output, DocumentService, QdrantService
import os

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize services
doc_service = DocumentService()
qdrant_service = QdrantService(k=3)

# Initialize the vector store on startup
@app.on_event("startup")
async def startup_event():
    try:
        docs = doc_service.create_documents()
        print(f"Created {len(docs)} documents from PDF")
        
        qdrant_service.connect()
        print("Connected to Qdrant vector store")
        
        qdrant_service.load(docs)
        print("Loaded documents into vector store")
        
    except Exception as e:
        print(f"Error during startup: {e}")
        raise e


@app.get("/laws")
async def query_laws(query: str = Query(..., description="The legal question to search for")):
    if query == "" or query is None:
        raise HTTPException(status_code=400, detail="Query is required")
    
    try:
        # Query the vector store
        result = qdrant_service.query(query)
        
        return {
            "query": result.query,
            "response": result.response,
            "citations": [
                {
                    "source": citation.source,
                    "text": citation.text
                } for citation in result.citations
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

