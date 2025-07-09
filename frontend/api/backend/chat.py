from http.server import BaseHTTPRequestHandler
import json
import os
import sys
from typing import Dict, Any

# Add the parent directory to Python path to import aimakerspace
sys.path.append(os.path.join(os.path.dirname(__file__), '../../../'))

try:
    from aimakerspace.pdf_utils import PDFIndexer, PDFLoader
    from aimakerspace.vectordatabase import VectorDatabase
    from aimakerspace.openai_utils.embedding import EmbeddingModel
    from openai import OpenAI
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
            
            user_message = request_data.get('user_message')
            api_key = request_data.get('api_key')
            model = request_data.get('model', 'gpt-4o-mini')
            
            if not user_message or not api_key:
                self.send_error_response(400, "user_message and api_key are required")
                return
            
            # Initialize OpenAI client
            client = OpenAI(api_key=api_key)
            
            # Get relevant context from indexed documents
            context = ""
            if document_indexer and indexed_documents:
                relevant_chunks = document_indexer.search_documents(user_message, k=3)
                if relevant_chunks:
                    context = "\n\n".join([chunk[0] for chunk in relevant_chunks])
            
            # Create system message with context
            system_message = "You are a helpful AI assistant. "
            if context:
                system_message += f"Use the following context to answer the user's question:\n\n{context}\n\n"
            system_message += "Provide clear, concise, and accurate responses based on the available information."
            
            # Create chat completion
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                stream=False
            )
            
            # Send response
            response_data = {
                "response": response.choices[0].message.content
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