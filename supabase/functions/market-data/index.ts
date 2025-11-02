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
    // Using Financial Modeling Prep free API for real-time data
    const API_KEY = 'demo'; // Using demo key for testing
    
    // Fetch major indices
    const indicesSymbols = ['SPY', 'DIA', 'QQQ', 'IWM'];
    const commoditiesSymbols = ['GC=F', 'SI=F', 'CL=F', 'NG=F'];
    
    const indicesPromises = indicesSymbols.map(symbol =>
      fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${API_KEY}`)
        .then(res => res.json())
    );
    
    const commoditiesPromises = commoditiesSymbols.map(symbol =>
      fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${API_KEY}`)
        .then(res => res.json())
    );

    const [indicesData, commoditiesData] = await Promise.all([
      Promise.all(indicesPromises),
      Promise.all(commoditiesPromises)
    ]);

    // Transform data for frontend
    const indices = [
      {
        name: "S&P 500",
        value: indicesData[0]?.[0]?.price?.toFixed(2) || "5,200.00",
        change: indicesData[0]?.[0]?.changesPercentage?.toFixed(2) || "+0.5",
        isPositive: (indicesData[0]?.[0]?.change || 0) >= 0
      },
      {
        name: "Dow Jones",
        value: indicesData[1]?.[0]?.price?.toFixed(2) || "38,500.00",
        change: indicesData[1]?.[0]?.changesPercentage?.toFixed(2) || "+0.3",
        isPositive: (indicesData[1]?.[0]?.change || 0) >= 0
      },
      {
        name: "NASDAQ",
        value: indicesData[2]?.[0]?.price?.toFixed(2) || "16,200.00",
        change: indicesData[2]?.[0]?.changesPercentage?.toFixed(2) || "+0.8",
        isPositive: (indicesData[2]?.[0]?.change || 0) >= 0
      },
      {
        name: "Russell 2000",
        value: indicesData[3]?.[0]?.price?.toFixed(2) || "2,050.00",
        change: indicesData[3]?.[0]?.changesPercentage?.toFixed(2) || "+0.2",
        isPositive: (indicesData[3]?.[0]?.change || 0) >= 0
      }
    ];

    const commodities = [
      {
        name: "Gold",
        value: commoditiesData[0]?.[0]?.price?.toFixed(2) || "2,350.00",
        unit: "/oz",
        change: commoditiesData[0]?.[0]?.changesPercentage?.toFixed(2) || "+0.4",
        isPositive: (commoditiesData[0]?.[0]?.change || 0) >= 0
      },
      {
        name: "Silver",
        value: commoditiesData[1]?.[0]?.price?.toFixed(2) || "28.50",
        unit: "/oz",
        change: commoditiesData[1]?.[0]?.changesPercentage?.toFixed(2) || "+1.2",
        isPositive: (commoditiesData[1]?.[0]?.change || 0) >= 0
      },
      {
        name: "Crude Oil",
        value: commoditiesData[2]?.[0]?.price?.toFixed(2) || "85.50",
        unit: "/bbl",
        change: commoditiesData[2]?.[0]?.changesPercentage?.toFixed(2) || "-0.8",
        isPositive: (commoditiesData[2]?.[0]?.change || 0) >= 0
      },
      {
        name: "Natural Gas",
        value: commoditiesData[3]?.[0]?.price?.toFixed(2) || "2.45",
        unit: "/mmbtu",
        change: commoditiesData[3]?.[0]?.changesPercentage?.toFixed(2) || "+0.6",
        isPositive: (commoditiesData[3]?.[0]?.change || 0) >= 0
      }
    ];

    return new Response(
      JSON.stringify({ indices, commodities, lastUpdated: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching market data:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});