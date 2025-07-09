# 🚀 Deployment Guide for AI Chat Application

This guide will help you deploy your AI Chat application with RAG capabilities to production.

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free) or Render account
- OpenAI API key

## 🏗️ Architecture

- **Frontend**: Next.js → Vercel
- **Backend**: FastAPI → Railway/Render
- **Database**: In-memory (for demo) or Redis/PostgreSQL for production

## 🎯 Step 1: Deploy Backend to Railway

### 1.1 Prepare Backend for Deployment

The backend is already configured with:
- `requirements.txt` - Python dependencies
- `Procfile` - Railway deployment command
- `runtime.txt` - Python version
- CORS configuration for production

### 1.2 Deploy to Railway

1. **Go to [Railway](https://railway.app)** and sign up/login
2. **Create a new project** → "Deploy from GitHub repo"
3. **Connect your GitHub repository**
4. **Set the source directory** to `api/`
5. **Deploy** - Railway will automatically detect it's a Python app

### 1.3 Get Your Backend URL

After deployment, Railway will give you a URL like:
```
https://your-app-name.railway.app
```

**Save this URL** - you'll need it for the frontend configuration.

## 🎯 Step 2: Deploy Frontend to Vercel

### 2.1 Update Frontend Configuration

1. **Update `vercel.json`** with your backend URL:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-app-name.railway.app/api/$1"
    }
  ]
}
```

2. **Update CORS in backend** (`api/app.py`):
```python
allow_origins=[
    "http://localhost:3000",
    "https://your-frontend-domain.vercel.app",
    "https://*.vercel.app"
]
```

### 2.2 Deploy to Vercel

1. **Go to [Vercel](https://vercel.com)** and sign up/login
2. **Import your GitHub repository**
3. **Configure the project**:
   - Framework Preset: Next.js
   - Root Directory: `frontend/`
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. **Deploy**

### 2.3 Environment Variables (Optional)

If you want to use environment variables instead of user input:

1. **In Vercel dashboard** → Your project → Settings → Environment Variables
2. **Add**:
   - `NEXT_PUBLIC_BACKEND_URL`: `https://your-app-name.railway.app`

## 🎯 Step 3: Test Your Deployment

### 3.1 Test Backend
```bash
curl https://your-app-name.railway.app/api/health
```
Should return: `{"status":"ok"}`

### 3.2 Test Frontend
1. Visit your Vercel URL
2. Enter your OpenAI API key
3. Upload a PDF
4. Start chatting!

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Check that your backend URL is correctly added to CORS origins
   - Ensure the frontend is making requests to the correct backend URL

2. **API Key Issues**
   - Make sure users enter their OpenAI API key in the frontend
   - The backend doesn't store API keys - they're passed per request

3. **PDF Upload Fails**
   - Check that the backend is receiving the API key
   - Verify the file is a valid PDF

4. **Chat Not Working**
   - Ensure the backend is running and accessible
   - Check that documents are being indexed properly

## 🚀 Production Considerations

### For Production Use:

1. **Database**: Replace in-memory storage with Redis or PostgreSQL
2. **File Storage**: Use AWS S3 or similar for PDF storage
3. **Authentication**: Add user authentication
4. **Rate Limiting**: Implement API rate limiting
5. **Monitoring**: Add logging and monitoring

### Environment Variables for Production:

**Backend (Railway)**:
- `OPENAI_API_KEY` (optional - for default key)
- `DATABASE_URL` (if using external database)
- `REDIS_URL` (if using Redis)

**Frontend (Vercel)**:
- `NEXT_PUBLIC_BACKEND_URL`: Your Railway backend URL

## 📝 Next Steps

After successful deployment:

1. **Custom Domain**: Add a custom domain to your Vercel deployment
2. **SSL**: Ensure HTTPS is enabled (automatic with Vercel)
3. **Monitoring**: Set up error tracking with Sentry
4. **Analytics**: Add Google Analytics or similar
5. **SEO**: Optimize for search engines

## 🎉 Success!

Your AI Chat application is now live and accessible to users worldwide! Users can:
- Upload PDF documents
- Chat with AI about the document content
- Get intelligent responses based on the uploaded material

The application uses RAG (Retrieval-Augmented Generation) to provide accurate, context-aware responses based on the uploaded documents. 