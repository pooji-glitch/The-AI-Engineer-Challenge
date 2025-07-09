# 🤖 AI Chat with PDF Magic ✨

> **Turn any PDF into your personal AI assistant!** Upload documents and chat with them using the power of RAG (Retrieval-Augmented Generation).

## 🚀 What's This All About?

This is a super cool AI chat application that lets you:
- 📄 **Upload PDFs** - Any document, any size
- 🧠 **Chat with your docs** - Ask questions, get intelligent answers
- 🔍 **Smart search** - AI finds the most relevant parts of your documents
- 💬 **Real-time chat** - Get instant responses as you type

Think of it as having a conversation with your documents! 📚➡️🤖

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python
- **AI**: OpenAI GPT-4 + AIMakerSpace for RAG
- **Deployment**: Vercel (Frontend) + Railway (Backend)

## 🎯 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- OpenAI API key (get one at [openai.com](https://openai.com))

### Local Development

1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd The-AI-Engineer-Challenge
   ```

2. **Start the backend**
   ```bash
   cd api
   pip install -r requirements.txt
   PYTHONPATH=.. uvicorn app:app --host 0.0.0.0 --port 8000
   ```

3. **Start the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Open your browser**
   - Go to `http://localhost:3000`
   - Enter your OpenAI API key
   - Upload a PDF and start chatting! 🎉

## 🌐 Deploy to Vercel

### Option 1: Deploy Frontend Only (Recommended for Demo)

Since you want to deploy just on Vercel, we'll use a serverless approach:

1. **Fork this repository** to your GitHub account

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository
   - Set the **Root Directory** to `frontend`
   - Deploy! 🚀

3. **Configure Environment Variables** (Optional)
   - In your Vercel project settings
   - Add `NEXT_PUBLIC_BACKEND_URL` with your backend URL

### Option 2: Full Stack Deployment

For a complete deployment:

1. **Deploy Backend to Railway**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub
   - Set source directory to `api/`
   - Deploy and get your backend URL

2. **Deploy Frontend to Vercel**
   - Follow Option 1 steps above
   - Update `vercel.json` with your Railway backend URL

## 🎨 Features

### ✨ What Makes This Awesome

- **Smart Document Processing**: Extracts text and creates searchable chunks
- **Intelligent Chat**: Uses RAG to provide context-aware responses
- **Real-time Streaming**: See responses as they're generated
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Document Management**: View uploaded docs and clear them
- **Secure**: API keys handled securely through user input

### 🔧 Technical Features

- **Vector Search**: Semantic search through document content
- **Streaming Responses**: Real-time chat experience
- **CORS Handling**: Production-ready cross-origin requests
- **Error Handling**: Graceful error management
- **TypeScript**: Full type safety
- **Responsive Design**: Works on all devices

## 🎯 How It Works

1. **Upload**: User uploads a PDF file
2. **Process**: Backend extracts text and creates embeddings
3. **Index**: Content is stored in a vector database
4. **Chat**: User asks questions
5. **Search**: AI finds relevant document chunks
6. **Respond**: AI generates answers based on document context

## 🚀 Performance

- **Fast**: Optimized for quick responses
- **Scalable**: Built for production workloads
- **Efficient**: Smart caching and vector search
- **Reliable**: Robust error handling

## 🛡️ Security

- **No API Key Storage**: Keys are passed per request
- **CORS Protection**: Configured for production domains
- **Input Validation**: All inputs are validated
- **Error Sanitization**: Safe error messages

## 🤝 Contributing

Want to make this even cooler? 

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [OpenAI](https://openai.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Vercel](https://vercel.com/)

---

**Ready to chat with your documents?** 🚀

[Deploy Now](https://vercel.com) | [View Demo](your-demo-url) | [Report Issues](your-issues-url) 