import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Forward the request to your backend API
    const backendResponse = await fetch('http://localhost:8000/api/documents', {
      method: 'GET',
    });

    if (!backendResponse.ok) {
      throw new Error('Backend API request failed');
    }

    const data = await backendResponse.json();
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('Documents API error:', error);
    return NextResponse.json(
      { 
        error: "I'm sorry, I'm having trouble fetching document information right now. Please try again later."
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Forward the request to your backend API
    const backendResponse = await fetch('http://localhost:8000/api/documents', {
      method: 'DELETE',
    });

    if (!backendResponse.ok) {
      throw new Error('Backend API request failed');
    }

    const data = await backendResponse.json();
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('Documents API error:', error);
    return NextResponse.json(
      { 
        error: "I'm sorry, I'm having trouble clearing documents right now. Please try again later."
      },
      { status: 500 }
    );
  }
} 