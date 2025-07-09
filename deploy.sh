#!/bin/bash

echo "🚀 AI Chat Application Deployment Helper"
echo "========================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if all files are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
    echo "   git push"
    exit 1
fi

echo "✅ Repository is ready for deployment!"
echo ""
echo "📋 Next Steps:"
echo "1. Deploy backend to Railway:"
echo "   - Go to https://railway.app"
echo "   - Create new project from GitHub"
echo "   - Set source directory to 'api/'"
echo "   - Deploy and get your backend URL"
echo ""
echo "2. Update vercel.json with your backend URL"
echo "3. Deploy frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Set root directory to 'frontend/'"
echo "   - Deploy"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
echo "🎯 Your app will be live at: https://your-app-name.vercel.app" 