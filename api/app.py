# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic for data validation and settings management
from pydantic import BaseModel
# Import OpenAI client for interacting with OpenAI's API
from openai import OpenAI
import os
from typing import Optional, List
import uuid
from aimakerspace.pdf_utils import PDFIndexer, PDFLoader
from aimakerspace.vectordatabase import VectorDatabase
from aimakerspace.openai_utils.embedding import EmbeddingModel

# Initialize FastAPI application with a title
app = FastAPI(title="AI Chat API with RAG")

# Configure CORS (Cross-Origin Resource Sharing) middleware
# This allows the API to be accessed from different domains/origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",
        "https://*.railway.app",
        "https://*.render.com"
    ],  # Allows requests from specific origins
    allow_credentials=True,  # Allows cookies to be included in requests
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers in requests
)

# Global variables for document storage (in-memory for this implementation)
document_indexer = None
indexed_documents = {}

# Define the data models using Pydantic
class ChatRequest(BaseModel):
    user_message: str      # Message from the user
    model: Optional[str] = "gpt-4o-mini"  # Optional model selection with default
    api_key: str          # OpenAI API key for authentication

class DocumentInfo(BaseModel):
    document_name: str
    chunks_created: int
    total_text_length: int
    status: str

# Initialize the document indexer
def initialize_indexer(api_key: str = None):
    global document_indexer
    if document_indexer is None:
        from aimakerspace.openai_utils.embedding import EmbeddingModel
        embedding_model = EmbeddingModel() if api_key is None else EmbeddingModel(api_key=api_key)
        vector_db = VectorDatabase(embedding_model)
        pdf_loader = PDFLoader()
        document_indexer = PDFIndexer(vector_db, pdf_loader)
    return document_indexer

# Define the PDF upload endpoint
@app.post("/api/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    api_key: str = Form(...)
):
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        # Read file content
        pdf_content = await file.read()
        
        # Initialize indexer with API key
        indexer = initialize_indexer(api_key)
        
        # Generate unique document name
        document_name = f"{file.filename}_{uuid.uuid4().hex[:8]}"
        
        # Index the PDF
        result = await indexer.index_pdf(pdf_content, document_name)
        
        # Store document info
        indexed_documents[document_name] = result
        
        return {
            "message": "PDF uploaded and indexed successfully",
            "document_name": document_name,
            "chunks_created": result["chunks_created"],
            "total_text_length": result["total_text_length"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Define the chat endpoint with RAG functionality
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Initialize OpenAI client with the provided API key
        client = OpenAI(api_key=request.api_key)
        
        # Get relevant context from indexed documents
        context = ""
        if document_indexer and indexed_documents:
            # Search for relevant content
            relevant_chunks = document_indexer.search_documents(request.user_message, k=3)
            
            if relevant_chunks:
                # Extract text from (text, score) tuples
                context = "\n\n".join([chunk[0] for chunk in relevant_chunks])
        
        # Create system message with context
        system_message = "You are a helpful AI assistant. "
        if context:
            system_message += f"Use the following context to answer the user's question:\n\n{context}\n\n"
        system_message += "Provide clear, concise, and accurate responses based on the available information."
        
        # Create an async generator function for streaming responses
        async def generate():
            # Create a streaming chat completion request
            stream = client.chat.completions.create(
                model=request.model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": request.user_message}
                ],
                stream=True  # Enable streaming response
            )
            
            # Yield each chunk of the response as it becomes available
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content

        # Return a streaming response to the client
        return StreamingResponse(generate(), media_type="text/plain")
    
    except Exception as e:
        # Handle any errors that occur during processing
        raise HTTPException(status_code=500, detail=str(e))

# Define endpoint to get document information
@app.get("/api/documents")
async def get_documents():
    try:
        return {
            "documents": indexed_documents,
            "total_documents": len(indexed_documents)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Define endpoint to clear all documents
@app.delete("/api/documents")
async def clear_documents():
    try:
        global document_indexer, indexed_documents
        document_indexer = None
        indexed_documents = {}
        return {"message": "All documents cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Define a health check endpoint to verify API status
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Start the server on all network interfaces (0.0.0.0) on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
