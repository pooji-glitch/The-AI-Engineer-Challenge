# 📊 Financial Document Assistant for Analysts & Investors

> **Transform financial documents into AI-powered insights!** Upload financial reports, spreadsheets, and documents to get specialized analysis for investment decisions.

## 🚀 What's This All About?

This is a specialized AI application designed for **financial analysts and investors** that lets you:
- 📄 **Upload Multiple Document Types** - PDFs, Excel spreadsheets, CSV files, Word documents, and text files
- 🧠 **Specialized Financial Analysis** - Get AI-powered insights tailored for investment analysis
- 🔍 **Smart Document Search** - AI finds the most relevant financial data from your documents
- 💬 **Real-time Financial Chat** - Ask questions about financial metrics, risks, and valuation
- 📊 **Analysis Types** - Choose from General, Financial, Risk Assessment, or Valuation analysis

Think of it as having a **financial analyst AI assistant** that can read and analyze any financial document! 📈➡️🤖

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python
- **AI**: OpenAI GPT-4 + AIMakerSpace for RAG
- **Document Processing**: Pandas, OpenPyXL, python-docx, PyPDF2
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
   - Upload financial documents and start analyzing! 📊

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

### ✨ What Makes This Awesome for Financial Analysis

- **Multi-Format Document Processing**: Handles PDFs, Excel, CSV, Word, and TXT files
- **Specialized Analysis Types**: 
  - **General Analysis**: Comprehensive financial overview
  - **Financial Analysis**: Revenue, ratios, growth trends
  - **Risk Assessment**: Credit, market, operational risks
  - **Valuation Analysis**: DCF, multiples, comparable analysis
- **Smart Document Search**: Semantic search through financial content
- **Real-time Streaming**: See financial insights as they're generated
- **Beautiful Financial UI**: Modern, professional design with financial theming
- **Document Management**: View uploaded financial documents and clear them
- **Quick Prompts**: Pre-built financial analysis questions
- **Secure**: API keys handled securely through user input

### 🔧 Technical Features

- **Vector Search**: Semantic search through financial document content
- **Streaming Responses**: Real-time financial analysis experience
- **CORS Handling**: Production-ready cross-origin requests
- **Error Handling**: Graceful error management
- **TypeScript**: Full type safety
- **Responsive Design**: Works on all devices
- **Financial Document Processing**: Specialized extractors for different file types

## 📊 Supported Document Types

- **PDF Files**: Financial reports, earnings releases, prospectuses
- **Excel Files (.xlsx, .xls)**: Financial models, spreadsheets, data tables
- **CSV Files**: Financial data, market data, transaction records
- **Word Documents (.docx, .doc)**: Financial reports, analysis documents
- **Text Files (.txt)**: Financial data, notes, reports

## 🎯 How It Works

1. **Upload**: User uploads financial documents (PDF, Excel, CSV, Word, TXT)
2. **Process**: Backend extracts text and creates embeddings
3. **Index**: Financial content is stored in a vector database
4. **Chat**: User asks financial analysis questions
5. **Search**: AI finds relevant financial document chunks
6. **Analyze**: AI generates specialized financial insights based on analysis type

## 🚀 Performance

- **Fast**: Optimized for quick financial analysis responses
- **Scalable**: Built for production workloads
- **Efficient**: Smart caching and vector search
- **Reliable**: Robust error handling for financial data

## 🛡️ Security

- **No API Key Storage**: Keys are passed per request
- **CORS Protection**: Configured for production domains
- **Input Validation**: All inputs are validated
- **Error Sanitization**: Safe error messages

## 💼 Use Cases for Financial Professionals

### For Investment Analysts:
- Analyze earnings reports and financial statements
- Extract key metrics and ratios
- Compare financial performance across periods
- Identify growth drivers and risk factors

### For Portfolio Managers:
- Review company financials for investment decisions
- Assess risk factors in investment portfolios
- Analyze valuation metrics and multiples
- Monitor financial health of holdings

### For Financial Advisors:
- Review client financial documents
- Analyze investment opportunities
- Assess risk profiles
- Generate financial insights for clients

### For Corporate Finance:
- Analyze financial models and projections
- Review budget and forecast documents
- Assess financial performance metrics
- Generate financial analysis reports

## 🤝 Contributing

Want to make this even better for financial analysis? 

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing financial analysis feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📈 Roadmap

- [ ] **Real-time Market Data Integration**
- [ ] **Advanced Financial Modeling Tools**
- [ ] **Portfolio Analysis Features**
- [ ] **Regulatory Compliance Analysis**
- [ ] **Multi-language Financial Document Support**
- [ ] **Advanced Charting and Visualization**

## 📞 Support

Need help with financial analysis features? 

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-repo/discussions)

---

**Made with ❤️ for Financial Analysts and Investors**

*Transform your financial documents into actionable investment insights!* 📊✨ 