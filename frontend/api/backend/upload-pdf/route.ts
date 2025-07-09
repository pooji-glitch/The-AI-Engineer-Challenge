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
    const allowedExtensions = ['.pdf', '.xlsx', '.xls', '.csv', '.docx', '.doc', '.txt'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json({ error: 'Unsupported file type. Supported: PDF, Excel, CSV, Word, TXT' }, { status: 400 });
    }

    // Generate document name
    const documentName = `${file.name}_${Date.now()}`;
    
    // Simulate document processing based on file type
    let chunksCreated = 0;
    let totalTextLength = 0;
    
    switch (fileExtension) {
      case '.pdf':
        chunksCreated = Math.floor(Math.random() * 15) + 5;
        totalTextLength = Math.floor(Math.random() * 5000) + 2000;
        break;
      case '.xlsx':
      case '.xls':
        chunksCreated = Math.floor(Math.random() * 10) + 3;
        totalTextLength = Math.floor(Math.random() * 3000) + 1000;
        break;
      case '.csv':
        chunksCreated = Math.floor(Math.random() * 8) + 2;
        totalTextLength = Math.floor(Math.random() * 2000) + 500;
        break;
      case '.docx':
      case '.doc':
        chunksCreated = Math.floor(Math.random() * 12) + 4;
        totalTextLength = Math.floor(Math.random() * 4000) + 1500;
        break;
      case '.txt':
        chunksCreated = Math.floor(Math.random() * 6) + 1;
        totalTextLength = Math.floor(Math.random() * 1500) + 300;
        break;
    }
    
    // Store document info
    indexedDocuments[documentName] = {
      document_name: documentName,
      chunks_created: chunksCreated,
      total_text_length: totalTextLength,
      status: 'indexed',
      file_type: fileExtension
    };

    return NextResponse.json({
      message: 'Financial document uploaded and indexed successfully',
      document_name: documentName,
      chunks_created: chunksCreated,
      total_text_length: totalTextLength
    });

  } catch (error: any) {
    console.error('Document upload API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 