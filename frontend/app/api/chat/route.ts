import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, apiKey } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is required' },
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
        user_message: message,
        model: "gpt-4o-mini",
        api_key: apiKey
      }),
    });

    if (!backendResponse.ok) {
      throw new Error('Backend API request failed');
    }

    // Handle streaming response
    const reader = backendResponse.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let responseText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      responseText += chunk;
    }
    
    return NextResponse.json({
      response: responseText
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