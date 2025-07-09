'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface Document {
  document_name: string;
  chunks_created: number;
  total_text_length: number;
}

interface FinancialMetrics {
  revenue?: string;
  profit?: string;
  growth?: string;
  risk?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisType, setAnalysisType] = useState<'general' | 'financial' | 'risk' | 'valuation'>('general');
  const [extractedMetrics, setExtractedMetrics] = useState<FinancialMetrics>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Load documents on component mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(Object.values(data.documents || {}));
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/msword', // .doc
        'text/plain'
      ];
      
      if (allowedTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.xlsx') || 
          file.name.endsWith('.xls') || file.name.endsWith('.csv') || file.name.endsWith('.docx') || 
          file.name.endsWith('.doc') || file.name.endsWith('.txt')) {
        setSelectedFile(file);
      } else {
        alert('Please select a valid financial document (PDF, Excel, CSV, Word, or TXT)');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !apiKey) {
      alert('Please select a financial document and enter your OpenAI API key');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('api_key', apiKey);

      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Financial document uploaded successfully! ${data.chunks_created} chunks created.`);
        setSelectedFile(null);
        loadDocuments(); // Refresh document list
      } else {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.error}`);
      }
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClearDocuments = async () => {
    if (!confirm('Are you sure you want to clear all financial documents?')) return;

    try {
      const response = await fetch('/api/documents', {
        method: 'DELETE',
      });

      if (response.ok) {
        setDocuments([]);
        alert('All financial documents cleared successfully');
      } else {
        alert('Failed to clear documents');
      }
    } catch (error) {
      alert('Failed to clear documents');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !apiKey) {
      if (!apiKey) {
        alert('Please enter your OpenAI API key first');
      }
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          apiKey: apiKey,
          analysisType: analysisType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, I'm having trouble connecting to the server right now. Please try again later.",
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting to the server right now. Please try again later.",
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const getQuickPrompts = () => {
    const prompts = {
      general: [
        "Summarize the key financial highlights",
        "What are the main risks mentioned?",
        "Extract key performance metrics"
      ],
      financial: [
        "Analyze revenue trends",
        "Calculate key financial ratios",
        "Identify growth drivers"
      ],
      risk: [
        "Assess credit risk factors",
        "Identify market risks",
        "Evaluate operational risks"
      ],
      valuation: [
        "Estimate company valuation",
        "Analyze comparable companies",
        "Calculate DCF metrics"
      ]
    };
    return prompts[analysisType] || prompts.general;
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Financial Document Assistant
          </h1>
          <p className="text-gray-600">
            AI-powered analysis for financial analysts and investors
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">📈 Financial Analysis</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">📋 Document Processing</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">🎯 Investment Insights</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">🔧 Configuration</h2>
              
              {/* API Key Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔑 OpenAI API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Analysis Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📊 Analysis Type
                </label>
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="general">General Analysis</option>
                  <option value="financial">Financial Analysis</option>
                  <option value="risk">Risk Assessment</option>
                  <option value="valuation">Valuation Analysis</option>
                </select>
              </div>

              {/* Document Upload */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">📁 Document Upload</h3>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept=".pdf,.xlsx,.xls,.csv,.docx,.doc,.txt"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || !apiKey || uploading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? '📤 Uploading...' : '📤 Upload Financial Document'}
                  </button>
                  <p className="text-xs text-gray-500">
                    Supported: PDF, Excel, CSV, Word, TXT
                  </p>
                </div>
              </div>

              {/* Document Management */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-800">📚 Financial Documents</h3>
                  <button
                    onClick={handleClearDocuments}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  {documents.length === 0 ? (
                    <p className="text-sm text-gray-500">No financial documents uploaded</p>
                  ) : (
                    documents.map((doc, index) => (
                      <div key={index} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                        <div className="font-medium">{doc.document_name}</div>
                        <div className="text-xs text-gray-500">
                          {doc.chunks_created} chunks • {doc.total_text_length} characters
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Prompts */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">⚡ Quick Prompts</h3>
                <div className="space-y-2">
                  {getQuickPrompts().map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="w-full text-left p-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Controls */}
              <div>
                <button
                  onClick={clearChat}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                >
                  🗑️ Clear Chat
                </button>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">💬 Financial Analysis Chat</h2>
                <p className="text-sm text-gray-600">
                  Ask questions about your financial documents and get AI-powered insights!
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <div className="mb-4">
                      <span className="text-4xl">📊</span>
                    </div>
                    <p className="text-lg font-medium mb-2">Welcome to Financial Document Assistant</p>
                    <p className="text-sm">Upload financial documents and start analyzing with AI-powered insights!</p>
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-gray-400">💡 Try asking:</p>
                      <p className="text-xs text-gray-500">• "What are the key financial metrics?"</p>
                      <p className="text-xs text-gray-500">• "Analyze the risk factors mentioned"</p>
                      <p className="text-xs text-gray-500">• "Summarize the revenue trends"</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-75 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        <span className="text-sm">🤖 AI is analyzing your financial documents...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about financial metrics, risks, valuation, or trends..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading || !apiKey}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    📤 Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 