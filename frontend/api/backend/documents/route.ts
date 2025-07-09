import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for documents (in production, you'd use a database)
let indexedDocuments: any = {};

export async function GET() {
  try {
    return NextResponse.json({
      documents: indexedDocuments,
      total_documents: Object.keys(indexedDocuments).length
    });
  } catch (error: any) {
    console.error('Documents API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Clear all documents
    indexedDocuments = {};
    
    return NextResponse.json({
      message: 'All documents cleared successfully'
    });
  } catch (error: any) {
    console.error('Documents API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 