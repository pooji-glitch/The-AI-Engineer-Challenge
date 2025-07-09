# Deployment Guide for AI Chat Application

This guide will help you deploy your AI Chat application to make it globally accessible.

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: For frontend deployment
3. **Railway/Render Account**: For backend deployment
4. **OpenAI API Key**: For the AI functionality

## Step 1: Deploy Backend (Railway - Recommended)

### Option A: Railway Deployment

1. **Sign up for Railway**: Go to [railway.app](https://railway.app) and create an account

2. **Connect your GitHub repository**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure the deployment**:
   - Set the **Root Directory** to `api`
   - Railway will automatically detect it's a Python project

4. **Set environment variables** (if needed):
   - Go to the "Variables" tab
   - Add any environment variables your app needs

5. **Deploy**:
   - Railway will automatically build and deploy your backend
   - You'll get a URL like `https://your-app-name.railway.app`

### Option B: Render Deployment

1. **Sign up for Render**: Go to [render.com](https://render.com)

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Set **Root Directory** to `api`
   - Set **Build Command**: `pip install -r requirements.txt`
   - Set **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`

3. **Deploy**: Render will build and deploy your backend

## Step 2: Deploy Frontend (Vercel)

1. **Sign up for Vercel**: Go to [vercel.com](https://vercel.com)

2. **Import your GitHub repository**:
   - Click "New Project"
   - Import your GitHub repository
   - Set **Root Directory** to `frontend`

3. **Configure environment variables**:
   - Go to Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_BACKEND_URL` = `https://your-backend-url.railway.app` (or your backend URL)

4. **Deploy**:
   - Vercel will automatically build and deploy your frontend
   - You'll get a URL like `https://your-app-name.vercel.app`

## Step 3: Update Frontend Configuration

After deploying the backend, update your frontend environment variable:

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to Environment Variables
   - Set `NEXT_PUBLIC_BACKEND_URL` to your backend URL

2. **Redeploy the frontend**:
   - Vercel will automatically redeploy with the new environment variable

## Step 4: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-app-name.vercel.app`
2. **Upload a PDF**: Test the upload functionality
3. **Chat with the PDF**: Test the chat functionality
4. **Enter your OpenAI API key**: Users will need to provide their own API key

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your backend CORS settings include your Vercel domain
2. **Environment Variables**: Ensure `NEXT_PUBLIC_BACKEND_URL` is set correctly
3. **Build Errors**: Check that all dependencies are in `package.json` and `requirements.txt`

### Backend Issues:

- Check Railway/Render logs for Python import errors
- Ensure all dependencies are in `requirements.txt`
- Verify the `Procfile` is correct

### Frontend Issues:

- Check Vercel build logs
- Ensure environment variables are set correctly
- Verify API routes are working

## Security Notes

- Your app requires users to provide their own OpenAI API key
- No sensitive data is stored on your servers
- All processing happens in memory (documents are not persisted)

## Cost Considerations

- **Vercel**: Free tier available for frontend
- **Railway**: Free tier available for backend
- **OpenAI**: Users pay for their own API usage

## Next Steps

Once deployed, your app will be globally accessible at your Vercel URL. Users can:
1. Visit your app
2. Enter their OpenAI API key
3. Upload PDFs
4. Chat with the uploaded documents 