# Merge Instructions for RAG PDF Chat Feature

This document provides instructions for merging the RAG (Retrieval-Augmented Generation) functionality back to the main branch.

## Changes Made

### Backend Changes (`api/`)
- **`app.py`**: Completely rewritten to support RAG functionality
  - Added PDF upload endpoint (`/api/upload-pdf`)
  - Enhanced chat endpoint with document context retrieval
  - Added document management endpoints (`/api/documents`)
  - Integrated AIMakerSpace library for PDF processing and vector search
- **`requirements.txt`**: Added dependencies for PDF processing
  - `PyPDF2==3.0.1`
  - `numpy==1.24.3`

### Frontend Changes (`frontend/`)
- **`app/page.tsx`**: Complete UI redesign
  - Added settings panel with API key input
  - Added PDF upload functionality
  - Added document management interface
  - Enhanced chat interface with RAG capabilities
- **`app/api/chat/route.ts`**: Updated to support API key and streaming responses
- **`app/api/upload-pdf/route.ts`**: Updated to include API key in requests
- **`app/api/documents/route.ts`**: New file for document management

### AIMakerSpace Library
- Added complete AIMakerSpace library with PDF processing, vector database, and embedding functionality

## How to Merge

### Option 1: GitHub Pull Request (Recommended)

1. Push the feature branch to GitHub:
   ```bash
   git push origin feature/rag-pdf-chat
   ```

2. Create a Pull Request on GitHub:
   - Go to your repository on GitHub
   - Click "Compare & pull request" for the `feature/rag-pdf-chat` branch
   - Add a descriptive title: "Add RAG functionality with PDF upload and chat"
   - Add description of the changes
   - Review the changes and merge

### Option 2: GitHub CLI

1. Push the feature branch:
   ```bash
   git push origin feature/rag-pdf-chat
   ```

2. Create and merge the PR using GitHub CLI:
   ```bash
   gh pr create --title "Add RAG functionality with PDF upload and chat" --body "This PR adds complete RAG functionality allowing users to upload PDFs and chat with them using AIMakerSpace library."
   gh pr merge --merge
   ```

### Option 3: Local Merge

1. Switch to main branch:
   ```bash
   git checkout main
   ```

2. Merge the feature branch:
   ```bash
   git merge feature/rag-pdf-chat
   ```

3. Push to remote:
   ```bash
   git push origin main
   ```

## Testing After Merge

1. **Install Dependencies**:
   ```bash
   # Backend dependencies
   cd api
   pip install -r requirements.txt
   
   # Frontend dependencies
   cd ../frontend
   npm install
   ```

2. **Start the Backend**:
   ```bash
   cd api
   python app.py
   ```

3. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

4. **Test the Application**:
   - Open http://localhost:3000
   - Enter your OpenAI API key
   - Upload a PDF file
   - Start chatting with the uploaded document

## Key Features Added

- **PDF Upload**: Users can upload PDF files which are processed and indexed
- **Document Management**: View uploaded documents and clear them
- **RAG Chat**: Chat with context from uploaded PDFs
- **API Key Management**: Secure API key input for OpenAI integration
- **Streaming Responses**: Real-time chat responses
- **Vector Search**: Semantic search through document content

## Dependencies Added

- `PyPDF2`: For PDF text extraction
- `numpy`: For vector operations
- AIMakerSpace library components for embeddings and vector database

## Notes

- The implementation uses in-memory storage for simplicity
- All API keys are handled securely through user input
- The system supports multiple PDF uploads per session
- Document context is automatically retrieved based on chat queries
