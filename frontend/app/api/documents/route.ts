import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Use Vercel Python function for documents
    const backendResponse = await fetch('/api/backend/documents', {
      method: 'GET',
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.detail || 'Backend API request failed');
    }

    const data = await backendResponse.json();
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('Documents API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "I'm sorry, I'm having trouble loading documents right now. Please try again later."
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Use Vercel Python function for documents
    const backendResponse = await fetch('/api/backend/documents', {
      method: 'DELETE',
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.detail || 'Backend API request failed');
    }

    const data = await backendResponse.json();
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('Documents API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "I'm sorry, I'm having trouble clearing documents right now. Please try again later."
      },
      { status: 500 }
    );
  }
} 