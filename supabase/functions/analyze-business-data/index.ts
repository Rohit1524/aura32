import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data, type, analysisType = 'comprehensive' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let prompt = '';
    if (type === 'analyze') {
      const analysisPrompts: Record<string, string> = {
        comprehensive: `Provide a comprehensive business analysis including:
1. Current business condition assessment
2. Financial health indicators
3. Operational efficiency analysis
4. Key insights and trends
5. Market position evaluation
6. Specific selling strategies for improving future sales
7. Risk assessment and mitigation strategies
8. Actionable recommendations with priority levels`,
        financial: `Provide a detailed financial analysis including:
1. Revenue and profitability analysis
2. Cash flow assessment
3. Cost structure evaluation
4. Financial ratios and KPIs
5. Budget performance
6. Investment opportunities
7. Financial forecasting recommendations`,
        sales: `Provide a sales-focused analysis including:
1. Sales performance metrics
2. Revenue trends and patterns
3. Customer acquisition analysis
4. Sales channel effectiveness
5. Conversion rate optimization
6. Pricing strategy recommendations
7. Sales growth opportunities`,
        market: `Provide a market analysis including:
1. Market position and share
2. Competitive landscape analysis
3. Industry trends and dynamics
4. Customer behavior insights
5. Market opportunities and threats
6. Differentiation strategies
7. Market expansion recommendations`,
        strategy: `Provide strategic recommendations including:
1. Business growth strategies
2. Competitive advantages to leverage
3. Product/service optimization
4. Market positioning strategies
5. Long-term strategic goals
6. Implementation roadmap
7. Success metrics and KPIs`
      };
      
      prompt = `${analysisPrompts[analysisType] || analysisPrompts.comprehensive}

Data: ${data}

Provide a detailed, structured analysis with specific data points and actionable insights.`;
    } else if (type === 'generate') {
      prompt = `Analyze and convert the following raw business data into a well-structured format suitable for an Excel spreadsheet. 

Requirements:
1. Intelligently parse the data and identify appropriate column headers
2. Organize related information into logical columns
3. Handle dates, numbers, and text appropriately
4. Create consistent formatting
5. Include calculated fields if relevant (totals, percentages, etc.)
6. Return a JSON array where each object represents a row

Data: ${data}

Return ONLY valid JSON in this format: [{"column1": "value", "column2": "value"}, ...]
Make the structure as meaningful and useful as possible based on the data provided.`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'You are a business analyst expert specializing in data analysis and strategic planning.' 
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limits exceeded, please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required, please add funds to your Lovable AI workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    const result = await response.json();
    const analysis = result.choices[0].message.content;

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-business-data function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
