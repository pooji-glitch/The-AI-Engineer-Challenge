import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { message, apiKey, analysisType } = await request.json();

    if (!message || !apiKey) {
      return NextResponse.json(
        { error: 'Message and API key are required' },
        { status: 400 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey: apiKey });

    // Create specialized system message based on analysis type
    const systemMessage = createSystemMessage(analysisType || 'general');

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
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