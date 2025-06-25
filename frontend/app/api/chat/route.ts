import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Forward the request to your backend API
    const backendResponse = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        developer_message: "You are a helpful AI assistant. Provide clear, concise, and accurate responses.",
        user_message: message,
        model: "gpt-4.1-mini",
        api_key: process.env.OPENAI_API_KEY || "your-api-key-here"
      }),
    });

    if (!backendResponse.ok) {
      throw new Error('Backend API request failed');
    }

    const data = await backendResponse.json();
    
    return NextResponse.json({
      response: data.response || "I'm sorry, I couldn't process your request at the moment."
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        response: "I'm sorry, I'm having trouble connecting to the server right now. Please try again later."
      },
      { status: 500 }
    );
  }
} 