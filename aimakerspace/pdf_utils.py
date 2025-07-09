import PyPDF2
import os
from typing import List, Optional
from .text_utils import CharacterTextSplitter
import io


class PDFLoader:
    """Utility class for loading and processing PDF files."""
    
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.text_splitter = CharacterTextSplitter(chunk_size, chunk_overlap)
    
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text content from a PDF file."""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                return text
        except Exception as e:
            raise ValueError(f"Error extracting text from PDF: {str(e)}")
    
    def extract_text_from_pdf_bytes(self, pdf_bytes: bytes) -> str:
        """Extract text content from PDF bytes."""
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            raise ValueError(f"Error extracting text from PDF bytes: {str(e)}")
    
    def process_pdf(self, pdf_path: str) -> List[str]:
        """Process a PDF file and return text chunks."""
        text = self.extract_text_from_pdf(pdf_path)
        return self.text_splitter.split(text)
    
    def process_pdf_bytes(self, pdf_bytes: bytes) -> List[str]:
        """Process PDF bytes and return text chunks."""
        text = self.extract_text_from_pdf_bytes(pdf_bytes)
        return self.text_splitter.split(text)


class PDFIndexer:
    """Class for indexing PDF content using the vector database."""
    
    def __init__(self, vector_db, pdf_loader: Optional[PDFLoader] = None):
        self.vector_db = vector_db
        self.pdf_loader = pdf_loader or PDFLoader()
        self.indexed_documents = {}  # Store document metadata
    
    async def index_pdf(self, pdf_bytes: bytes, document_name: str) -> dict:
        """Index a PDF document and return indexing results."""
        try:
            # Extract and chunk the PDF text
            chunks = self.pdf_loader.process_pdf_bytes(pdf_bytes)
            
            if not chunks:
                raise ValueError("No text content could be extracted from the PDF")
            
            # Create metadata for each chunk
            metadata_list = []
            for i, chunk in enumerate(chunks):
                metadata = {
                    "document_name": document_name,
                    "chunk_index": i,
                    "total_chunks": len(chunks),
                    "chunk_size": len(chunk)
                }
                metadata_list.append(metadata)
            
            # Build the vector database from chunks
            await self.vector_db.abuild_from_list(chunks, metadata_list)
            
            # Store document info
            self.indexed_documents[document_name] = {
                "chunks": len(chunks),
                "total_text_length": sum(len(chunk) for chunk in chunks)
            }
            
            return {
                "document_name": document_name,
                "chunks_created": len(chunks),
                "total_text_length": sum(len(chunk) for chunk in chunks),
                "status": "success"
            }
            
        except Exception as e:
            raise ValueError(f"Error indexing PDF: {str(e)}")
    
    def search_documents(self, query: str, k: int = 5) -> List[tuple]:
        """Search indexed documents for relevant content."""
        return self.vector_db.search_by_text(query, k)
    
    def get_document_info(self) -> dict:
        """Get information about indexed documents."""
        return self.indexed_documents 