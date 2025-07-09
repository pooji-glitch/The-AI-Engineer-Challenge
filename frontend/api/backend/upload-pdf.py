from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import base64
import uuid
from typing import Dict, Any

# Add the parent directory to Python path to import aimakerspace
sys.path.append(os.path.join(os.path.dirname(__file__), '../../../'))

try:
    from aimakerspace.pdf_utils import PDFIndexer, PDFLoader
    from aimakerspace.vectordatabase import VectorDatabase
    from aimakerspace.openai_utils.embedding import EmbeddingModel
except ImportError as e:
    print(f"Import error: {e}")

# Global variables for document storage (in-memory for this implementation)
document_indexer = None
indexed_documents = {}

def initialize_indexer(api_key: str = None):
    global document_indexer
    if document_indexer is None:
        embedding_model = EmbeddingModel() if api_key is None else EmbeddingModel(api_key=api_key)
        vector_db = VectorDatabase(embedding_model)
        pdf_loader = PDFLoader()
        document_indexer = PDFIndexer(vector_db, pdf_loader)
    return document_indexer

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Parse request
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            file_data = request_data.get('file')
            api_key = request_data.get('api_key')
            filename = request_data.get('filename', 'document.pdf')
            
            if not file_data or not api_key:
                self.send_error_response(400, "file and api_key are required")
                return
            
            # Validate file type
            if not filename.lower().endswith('.pdf'):
                self.send_error_response(400, "Only PDF files are supported")
                return
            
            # Decode base64 file data
            try:
                pdf_content = base64.b64decode(file_data)
            except Exception as e:
                self.send_error_response(400, "Invalid file data")
                return
            
            # Initialize indexer with API key
            indexer = initialize_indexer(api_key)
            
            # Generate unique document name
            document_name = f"{filename}_{uuid.uuid4().hex[:8]}"
            
            # Index the PDF
            result = indexer.index_pdf(pdf_content, document_name)
            
            # Store document info
            indexed_documents[document_name] = result
            
            # Send response
            response_data = {
                "message": "PDF uploaded and indexed successfully",
                "document_name": document_name,
                "chunks_created": result["chunks_created"],
                "total_text_length": result["total_text_length"]
            }
            
            self.send_success_response(response_data)
            
        except Exception as e:
            self.send_error_response(500, str(e))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def send_success_response(self, data: Dict[str, Any]):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def send_error_response(self, status_code: int, message: str):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        error_data = {"error": message}
        self.wfile.write(json.dumps(error_data).encode()) 