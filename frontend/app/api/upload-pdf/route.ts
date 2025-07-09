import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const apiKey = formData.get('api_key') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is required' },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Convert file to base64 for Vercel Python function
    const arrayBuffer = await file.arrayBuffer();
    const fileData = Buffer.from(arrayBuffer).toString('base64');

    // Use Vercel Python function for upload
    const backendResponse = await fetch('/api/backend/upload-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: fileData,
        api_key: apiKey,
        filename: file.name,
      }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.detail || 'Backend API request failed');
    }

    const data = await backendResponse.json();
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('PDF upload API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "I'm sorry, I'm having trouble uploading the PDF right now. Please try again later."
      },
      { status: 500 }
    );
  }
} 