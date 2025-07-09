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
import pandas as pd
import io
from docx import Document
from aimakerspace.pdf_utils import PDFIndexer, PDFLoader
from aimakerspace.vectordatabase import VectorDatabase
from aimakerspace.openai_utils.embedding import EmbeddingModel

# Initialize FastAPI application with a title
app = FastAPI(title="Financial Document Assistant API")

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
    analysis_type: Optional[str] = "general"  # Type of financial analysis

class DocumentInfo(BaseModel):
    document_name: str
    chunks_created: int
    total_text_length: int
    status: str

class FinancialDocumentProcessor:
    """Process various financial document types"""
    
    def __init__(self):
        self.text_splitter = None  # Will be initialized with vector_db
    
    def extract_text_from_excel(self, file_bytes: bytes, filename: str) -> str:
        """Extract text from Excel files"""
        try:
            # Read Excel file
            df = pd.read_excel(io.BytesIO(file_bytes))
            
            # Convert to text representation
            text_content = []
            text_content.append(f"Excel Document: {filename}")
            text_content.append("=" * 50)
            
            # Add column headers
            text_content.append("Column Headers:")
            text_content.append(", ".join(df.columns.tolist()))
            text_content.append("")
            
            # Add data rows (limit to first 100 rows for performance)
            text_content.append("Data:")
            for index, row in df.head(100).iterrows():
                row_text = ", ".join([f"{col}: {val}" for col, val in row.items() if pd.notna(val)])
                text_content.append(f"Row {index + 1}: {row_text}")
            
            return "\n".join(text_content)
        except Exception as e:
            raise ValueError(f"Error processing Excel file: {str(e)}")
    
    def extract_text_from_csv(self, file_bytes: bytes, filename: str) -> str:
        """Extract text from CSV files"""
        try:
            # Read CSV file
            df = pd.read_csv(io.BytesIO(file_bytes))
            
            # Convert to text representation
            text_content = []
            text_content.append(f"CSV Document: {filename}")
            text_content.append("=" * 50)
            
            # Add column headers
            text_content.append("Column Headers:")
            text_content.append(", ".join(df.columns.tolist()))
            text_content.append("")
            
            # Add data rows (limit to first 100 rows for performance)
            text_content.append("Data:")
            for index, row in df.head(100).iterrows():
                row_text = ", ".join([f"{col}: {val}" for col, val in row.items() if pd.notna(val)])
                text_content.append(f"Row {index + 1}: {row_text}")
            
            return "\n".join(text_content)
        except Exception as e:
            raise ValueError(f"Error processing CSV file: {str(e)}")
    
    def extract_text_from_word(self, file_bytes: bytes, filename: str) -> str:
        """Extract text from Word documents"""
        try:
            # Read Word document
            doc = Document(io.BytesIO(file_bytes))
            
            # Extract text from paragraphs
            text_content = []
            text_content.append(f"Word Document: {filename}")
            text_content.append("=" * 50)
            
            for paragraph in doc.paragraphs:
                if paragraph.text.strip():
                    text_content.append(paragraph.text)
            
            return "\n".join(text_content)
        except Exception as e:
            raise ValueError(f"Error processing Word document: {str(e)}")
    
    def extract_text_from_txt(self, file_bytes: bytes, filename: str) -> str:
        """Extract text from plain text files"""
        try:
            text_content = file_bytes.decode('utf-8')
            return f"Text Document: {filename}\n{'=' * 50}\n{text_content}"
        except Exception as e:
            raise ValueError(f"Error processing text file: {str(e)}")

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

# Define the document upload endpoint
@app.post("/api/upload-pdf")
async def upload_document(
    file: UploadFile = File(...),
    api_key: str = Form(...)
):
    try:
        # Read file content
        file_content = await file.read()
        filename = file.filename.lower()
        
        # Initialize processor and indexer
        processor = FinancialDocumentProcessor()
        indexer = initialize_indexer(api_key)
        
        # Process different file types
        if filename.endswith('.pdf'):
            # Use existing PDF processing
            result = await indexer.index_pdf(file_content, f"{file.filename}_{uuid.uuid4().hex[:8]}")
        elif filename.endswith(('.xlsx', '.xls')):
            # Process Excel files
            text_content = processor.extract_text_from_excel(file_content, file.filename)
            document_name = f"{file.filename}_{uuid.uuid4().hex[:8]}"
            result = await indexer.index_text(text_content, document_name)
        elif filename.endswith('.csv'):
            # Process CSV files
            text_content = processor.extract_text_from_csv(file_content, file.filename)
            document_name = f"{file.filename}_{uuid.uuid4().hex[:8]}"
            result = await indexer.index_text(text_content, document_name)
        elif filename.endswith(('.docx', '.doc')):
            # Process Word documents
            text_content = processor.extract_text_from_word(file_content, file.filename)
            document_name = f"{file.filename}_{uuid.uuid4().hex[:8]}"
            result = await indexer.index_text(text_content, document_name)
        elif filename.endswith('.txt'):
            # Process text files
            text_content = processor.extract_text_from_txt(file_content, file.filename)
            document_name = f"{file.filename}_{uuid.uuid4().hex[:8]}"
            result = await indexer.index_text(text_content, document_name)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Supported: PDF, Excel, CSV, Word, TXT")
        
        # Store document info
        indexed_documents[result["document_name"]] = result
        
        return {
            "message": "Financial document uploaded and indexed successfully",
            "document_name": result["document_name"],
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
        
        # Create specialized system message based on analysis type
        system_message = _create_system_message(request.analysis_type, context)
        
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

def _create_system_message(analysis_type: str, context: str) -> str:
    """Create specialized system message based on analysis type"""
    
    base_message = "You are a specialized Financial Document Assistant for analysts and investors. "
    
    if context:
        base_message += f"Use the following financial document context to answer the user's question:\n\n{context}\n\n"
    
    # Add specialized instructions based on analysis type
    if analysis_type == "financial":
        base_message += """
        Focus on financial analysis including:
        - Revenue and profit analysis
        - Financial ratios and metrics
        - Growth trends and drivers
        - Cash flow analysis
        - Balance sheet insights
        Provide specific numbers and percentages when available.
        """
    elif analysis_type == "risk":
        base_message += """
        Focus on risk assessment including:
        - Credit and market risks
        - Operational risks
        - Regulatory risks
        - Liquidity risks
        - Industry-specific risks
        Provide risk ratings and mitigation strategies when possible.
        """
    elif analysis_type == "valuation":
        base_message += """
        Focus on valuation analysis including:
        - Company valuation estimates
        - Comparable company analysis
        - DCF (Discounted Cash Flow) metrics
        - Multiples analysis (P/E, EV/EBITDA, etc.)
        - Growth projections
        Provide valuation ranges and key assumptions.
        """
    else:  # general
        base_message += """
        Provide comprehensive financial analysis including:
        - Key financial highlights
        - Performance metrics
        - Risk factors
        - Growth opportunities
        - Investment considerations
        Be thorough but concise in your analysis.
        """
    
    base_message += "Always provide clear, actionable insights for financial analysts and investors."
    return base_message

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
        return {"message": "All financial documents cleared successfully"}
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
