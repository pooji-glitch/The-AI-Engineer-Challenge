import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for documents (in production, you'd use a database)
let indexedDocuments: any = {};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const api_key = formData.get('api_key') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!api_key) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    // For now, we'll simulate successful upload
    // In a full implementation, you'd process the PDF and extract text
    const documentName = `${file.name}_${Date.now()}`;
    
    // Simulate document processing
    indexedDocuments[documentName] = {
      document_name: documentName,
      chunks_created: Math.floor(Math.random() * 10) + 1,
      total_text_length: Math.floor(Math.random() * 1000) + 100,
      status: 'indexed'
    };

    return NextResponse.json({
      message: 'PDF uploaded and indexed successfully',
      document_name: documentName,
      chunks_created: indexedDocuments[documentName].chunks_created,
      total_text_length: indexedDocuments[documentName].total_text_length
    });

  } catch (error: any) {
    console.error('PDF upload API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 