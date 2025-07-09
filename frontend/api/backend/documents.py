from http.server import BaseHTTPRequestHandler
import json
from typing import Dict, Any

# Global variables for document storage (in-memory for this implementation)
indexed_documents = {}

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Send response
            response_data = {
                "documents": indexed_documents,
                "total_documents": len(indexed_documents)
            }
            
            self.send_success_response(response_data)
            
        except Exception as e:
            self.send_error_response(500, str(e))
    
    def do_DELETE(self):
        try:
            # Clear all documents
            global indexed_documents
            indexed_documents = {}
            
            # Send response
            response_data = {
                "message": "All documents cleared successfully"
            }
            
            self.send_success_response(response_data)
            
        except Exception as e:
            self.send_error_response(500, str(e))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def send_success_response(self, data: Dict[str, Any]):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def send_error_response(self, status_code: int, message: str):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        error_data = {"error": message}
        self.wfile.write(json.dumps(error_data).encode()) 