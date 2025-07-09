import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// In-memory storage for documents (in production, you'd use a database)
let indexedDocuments: any = {};
let documentIndexer: any = null;

export async function POST(request: NextRequest) {
  try {
    const { user_message, api_key, analysis_type } = await request.json();

    if (!api_key) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey: api_key });

    // Create specialized system message based on analysis type
    const systemMessage = createSystemMessage(analysis_type || 'general');

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

function createSystemMessage(analysisType: string): string {
  let baseMessage = "You are a specialized Financial Document Assistant for analysts and investors. ";
  
  // Add specialized instructions based on analysis type
  switch (analysisType) {
    case "financial":
      baseMessage += `
        Focus on financial analysis including:
        - Revenue and profit analysis
        - Financial ratios and metrics
        - Growth trends and drivers
        - Cash flow analysis
        - Balance sheet insights
        Provide specific numbers and percentages when available.
      `;
      break;
    case "risk":
      baseMessage += `
        Focus on risk assessment including:
        - Credit and market risks
        - Operational risks
        - Regulatory risks
        - Liquidity risks
        - Industry-specific risks
        Provide risk ratings and mitigation strategies when possible.
      `;
      break;
    case "valuation":
      baseMessage += `
        Focus on valuation analysis including:
        - Company valuation estimates
        - Comparable company analysis
        - DCF (Discounted Cash Flow) metrics
        - Multiples analysis (P/E, EV/EBITDA, etc.)
        - Growth projections
        Provide valuation ranges and key assumptions.
      `;
      break;
    default: // general
      baseMessage += `
        Provide comprehensive financial analysis including:
        - Key financial highlights
        - Performance metrics
        - Risk factors
        - Growth opportunities
        - Investment considerations
        Be thorough but concise in your analysis.
      `;
  }
  
  baseMessage += " Always provide clear, actionable insights for financial analysts and investors.";
  return baseMessage;
} 