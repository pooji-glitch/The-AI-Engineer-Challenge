import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // For now, return empty documents list since we're not storing files
    // In a real implementation, you'd want to use a database or file storage service
    return NextResponse.json({
      documents: []
    });

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
    // For now, just return success since we're not storing files
    // In a real implementation, you'd want to clear documents from storage
    return NextResponse.json({
      message: 'Documents cleared successfully'
    });

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