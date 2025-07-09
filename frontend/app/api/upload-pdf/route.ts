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

    // Validate file type
    const allowedExtensions = ['.pdf', '.xlsx', '.xls', '.csv', '.docx', '.doc', '.txt'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Supported: PDF, Excel, CSV, Word, TXT' },
        { status: 400 }
      );
    }

    // For now, just return success since we can't process files in Vercel serverless functions
    // In a real implementation, you'd want to use a service like AWS S3 or similar
    return NextResponse.json({
      message: 'File uploaded successfully',
      filename: file.name,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Document upload API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "I'm sorry, I'm having trouble uploading the financial document right now. Please try again later."
      },
      { status: 500 }
    );
  }
} 