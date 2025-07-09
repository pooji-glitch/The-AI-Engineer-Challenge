# Vercel-Only Deployment Guide for AI Chat Application

This guide will help you deploy your AI Chat application entirely on Vercel, making it globally accessible.

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: For frontend and backend deployment
3. **OpenAI API Key**: For the AI functionality

## Step 1: Deploy Everything on Vercel

### Vercel Deployment (Frontend + Backend)

1. **Sign up for Vercel**: Go to [vercel.com](https://vercel.com) and create an account

2. **Import your GitHub repository**:
   - Click "New Project"
   - Import your GitHub repository
   - Set **Root Directory** to `frontend`

3. **Configure the deployment**:
   - Vercel will automatically detect it's a Next.js project
   - The Python backend functions are in `frontend/api/backend/`
   - Vercel will automatically handle both frontend and backend

4. **Deploy**:
   - Vercel will build and deploy both frontend and backend
   - You'll get a URL like `https://your-app-name.vercel.app`

## Step 2: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-app-name.vercel.app`
2. **Enter your OpenAI API key** in the settings panel
3. **Upload a PDF** to test the functionality
4. **Chat with the PDF** to test the RAG system

## How It Works

### Frontend (Next.js)
- Serves the React application
- Handles user interface and interactions
- Located in `frontend/app/`

### Backend (Python Serverless Functions)
- Handles PDF processing and AI chat
- Runs as serverless functions on Vercel
- Located in `frontend/api/backend/`
- Functions:
  - `/api/backend/chat.py` - Handles chat requests
  - `/api/backend/upload-pdf.py` - Handles PDF uploads
  - `/api/backend/documents.py` - Handles document management

## Architecture

```
Vercel Deployment
├── Frontend (Next.js)
│   ├── React UI
│   └── API Routes (TypeScript)
└── Backend (Python Serverless)
    ├── Chat Function
    ├── Upload Function
    └── Documents Function
```

## Benefits of Vercel-Only Deployment

✅ **Single Platform**: Everything runs on Vercel
✅ **Automatic Scaling**: Serverless functions scale automatically
✅ **Global CDN**: Fast loading worldwide
✅ **Free Tier**: Generous free tier available
✅ **Easy Deployment**: One-click deployment from GitHub
✅ **Automatic Updates**: Deploy on every git push

## Troubleshooting

### Common Issues:

1. **Python Import Errors**: Check that all dependencies are in `requirements.txt`
2. **Function Timeout**: Increase `maxDuration` in `vercel.json`
3. **Memory Issues**: Optimize PDF processing for serverless environment
4. **CORS Errors**: CORS is handled automatically by Vercel

### Build Errors:

- Check Vercel build logs
- Ensure all dependencies are properly listed
- Verify Python functions are in the correct location

## Security Notes

- Your app requires users to provide their own OpenAI API key
- No sensitive data is stored on your servers
- All processing happens in serverless functions
- Documents are not persisted between function calls

## Cost Considerations

- **Vercel**: Free tier available for both frontend and backend
- **OpenAI**: Users pay for their own API usage
- **Scaling**: Pay only for what you use

## Next Steps

Once deployed, your app will be globally accessible at your Vercel URL. Users can:
1. Visit your app
2. Enter their OpenAI API key
3. Upload PDFs
4. Chat with the uploaded documents

## Local Development

To test locally before deploying:

```bash
# Start the frontend
cd frontend
npm run dev

# The backend functions will be handled by Vercel in production
# For local testing, you can use the original FastAPI backend
cd ../api
PYTHONPATH=.. uvicorn app:app --host 0.0.0.0 --port 8000
```

Your app will then be globally accessible at your Vercel URL! 🚀 