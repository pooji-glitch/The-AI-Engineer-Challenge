import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// In-memory storage for documents (in production, you'd use a database)
let indexedDocuments: any = {};
let documentIndexer: any = null;

export async function POST(request: NextRequest) {
  try {
    const { user_message, api_key } = await request.json();

    if (!api_key) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey: api_key });

    // For now, we'll create a simple response without RAG
    // In a full implementation, you'd implement the PDF indexing and search here
    const systemMessage = "You are a helpful AI assistant. Provide clear, concise, and accurate responses based on the available information.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: user_message }
      ],
      stream: false
    });

    const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ response });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 