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

    // Create a new FormData to forward to the backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);
    backendFormData.append('api_key', apiKey);

    // Forward the request to your backend API
    const backendResponse = await fetch('http://localhost:8000/api/upload-pdf', {
      method: 'POST',
      body: backendFormData,
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