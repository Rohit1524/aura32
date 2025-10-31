import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

const MarketData = () => {
  // Mock data - in production, this would come from real APIs
  const commodities = [
    { name: "Gold", price: 2342.50, change: 1.2, unit: "per oz" },
    { name: "Silver", price: 27.85, change: -0.8, unit: "per oz" },
    { name: "Crude Oil", price: 82.45, change: 2.1, unit: "per barrel" },
    { name: "Natural Gas", price: 3.42, change: -1.5, unit: "per MMBtu" },
    { name: "Copper", price: 4.12, change: 0.9, unit: "per lb" },
    { name: "Platinum", price: 995.20, change: 1.7, unit: "per oz" },
  ];

  const indices = [
    { name: "S&P 500", value: 5487.23, change: 0.45 },
    { name: "Dow Jones", value: 42567.89, change: -0.22 },
    { name: "NASDAQ", value: 17234.56, change: 1.12 },
    { name: "Russell 2000", value: 2198.45, change: 0.78 },
  ];

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 text-center space-y-4">
          <h1 className="text-4xl font-bold">Market Data</h1>
          <p className="text-lg text-muted-foreground">
            Real-time commodity prices and market indicators
          </p>
        </div>

        <div className="space-y-8">
          {/* Commodities */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Commodities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {commodities.map((item) => (
                <Card key={item.name} className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.unit}</p>
                    </div>
                    {item.change >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold">${item.price.toFixed(2)}</p>
                    <p
                      className={`text-sm font-semibold mt-1 ${
                        item.change >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {item.change >= 0 ? "+" : ""}
                      {item.change.toFixed(2)}%
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Market Indices */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Market Indices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {indices.map((item) => (
                <Card key={item.name} className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    {item.change >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold">
                      {item.value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p
                      className={`text-sm font-semibold mt-1 ${
                        item.change >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {item.change >= 0 ? "+" : ""}
                      {item.change.toFixed(2)}%
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-6 bg-muted/30">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Note:</strong> This is demonstration data. In a production environment, 
              data would be sourced from real-time market data APIs.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketData;
