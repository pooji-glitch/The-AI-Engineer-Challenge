'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

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

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
      {/* Animated Gradient Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-full opacity-30 blur-3xl animate-pulse z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400 via-green-300 to-yellow-200 rounded-full opacity-20 blur-3xl animate-pulse z-0" />

      {/* Header */}
      <header className="relative z-10 py-8 text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 drop-shadow-lg">
          Vibe Coded LLM Chat
        </h1>
        <p className="mt-2 text-lg text-gray-700 font-medium">
          Chat with your AI assistant in style ✨
        </p>
      </header>

      {/* Chat Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl bg-white/80 rounded-2xl shadow-2xl p-6 flex flex-col h-[32rem]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-16 animate-fade-in">
                <p>Start a conversation by typing a message below!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`relative max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-md transition-all duration-300 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white rounded-br-none'
                        : 'bg-gradient-to-br from-gray-200 via-white to-purple-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <span className="block text-base font-medium">
                      {message.text}
                    </span>
                    <span className={`block text-xs mt-1 text-right ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-purple-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.sender === 'assistant' && (
                      <span className="absolute -top-3 left-2 text-xs text-purple-400 font-bold animate-bounce">AI</span>
                    )}
                    {message.sender === 'user' && (
                      <span className="absolute -top-3 right-2 text-xs text-blue-200 font-bold animate-bounce">You</span>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-gradient-to-br from-gray-200 via-purple-100 to-blue-100 text-gray-900 px-5 py-3 rounded-2xl shadow-md flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="ml-2 text-purple-400 font-medium">AI is typing...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form
            className="mt-4 flex space-x-3"
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 text-gray-900 shadow-sm text-base transition-all duration-200"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-gray-500 text-sm">
        <span>
          Made with <span className="text-pink-400">♥</span> for the AI Engineer Challenge &middot; Powered by Next.js &amp; Tailwind CSS
        </span>
      </footer>
    </div>
  );
} 