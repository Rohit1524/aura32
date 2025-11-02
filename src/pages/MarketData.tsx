import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MarketData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const { toast } = useToast();
  
  const [commodities, setCommodities] = useState([
    { name: "Gold", value: "2,350.00", unit: "/oz", change: "+0.4", isPositive: true },
    { name: "Silver", value: "28.50", unit: "/oz", change: "+1.2", isPositive: true },
    { name: "Crude Oil", value: "85.50", unit: "/bbl", change: "-0.8", isPositive: false },
    { name: "Natural Gas", value: "2.45", unit: "/mmbtu", change: "+0.6", isPositive: true },
  ]);

  const [indices, setIndices] = useState([
    { name: "S&P 500", value: "5,200.00", change: "+0.5", isPositive: true },
    { name: "Dow Jones", value: "38,500.00", change: "+0.3", isPositive: true },
    { name: "NASDAQ", value: "16,200.00", change: "+0.8", isPositive: true },
    { name: "Russell 2000", value: "2,050.75", change: "+0.2", isPositive: true },
  ]);

  useEffect(() => {
    fetchMarketData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('market-data');

      if (error) throw error;

      if (data.commodities) setCommodities(data.commodities);
      if (data.indices) setIndices(data.indices);
      if (data.lastUpdated) {
        const date = new Date(data.lastUpdated);
        setLastUpdated(date.toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      toast({
        title: "Failed to Update",
        description: "Could not fetch latest market data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">Market Data</h1>
            <p className="text-lg text-muted-foreground">
              Real-time commodity prices and market indices
            </p>
            {lastUpdated && (
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: {lastUpdated}
              </p>
            )}
          </div>
          {isLoading && (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          )}
        </div>

        <div className="grid gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Commodities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {commodities.map((commodity) => (
                <Card key={commodity.name} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{commodity.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">${commodity.value}</span>
                      <span className="text-sm text-muted-foreground">{commodity.unit}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${commodity.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {commodity.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="font-semibold">{commodity.change}%</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Market Indices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {indices.map((index) => (
                <Card key={index.name} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{index.name}</span>
                    <span className="text-2xl font-bold">{index.value}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${index.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {index.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="font-semibold">{index.change}%</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketData;
