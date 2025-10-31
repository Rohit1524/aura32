import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

export const FinancialCalculator = () => {
  const [values, setValues] = useState({
    revenue: "",
    costs: "",
    expenses: "",
    investment: "",
    growthRate: "",
  });

  const [results, setResults] = useState({
    profit: 0,
    margin: 0,
    roi: 0,
    projected: 0,
  });

  const calculate = () => {
    const revenue = parseFloat(values.revenue) || 0;
    const costs = parseFloat(values.costs) || 0;
    const expenses = parseFloat(values.expenses) || 0;
    const investment = parseFloat(values.investment) || 0;
    const growthRate = parseFloat(values.growthRate) || 0;

    const profit = revenue - costs - expenses;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const roi = investment > 0 ? ((profit - investment) / investment) * 100 : 0;
    const projected = revenue * (1 + growthRate / 100);

    setResults({
      profit,
      margin,
      roi,
      projected,
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Calculator className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Financial Calculator</h2>
          <p className="text-sm text-muted-foreground">
            Calculate key financial metrics
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="revenue">Annual Revenue ($)</Label>
            <Input
              id="revenue"
              type="number"
              value={values.revenue}
              onChange={(e) => setValues({ ...values, revenue: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="costs">Cost of Goods Sold ($)</Label>
            <Input
              id="costs"
              type="number"
              value={values.costs}
              onChange={(e) => setValues({ ...values, costs: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expenses">Operating Expenses ($)</Label>
            <Input
              id="expenses"
              type="number"
              value={values.expenses}
              onChange={(e) => setValues({ ...values, expenses: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="investment">Initial Investment ($)</Label>
            <Input
              id="investment"
              type="number"
              value={values.investment}
              onChange={(e) => setValues({ ...values, investment: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="growthRate">Expected Growth Rate (%)</Label>
            <Input
              id="growthRate"
              type="number"
              value={values.growthRate}
              onChange={(e) => setValues({ ...values, growthRate: e.target.value })}
              placeholder="0.00"
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
          Calculate
        </Button>

        {results.profit !== 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <Card className="p-4 bg-primary/5">
              <p className="text-sm text-muted-foreground mb-1">Net Profit</p>
              <p className="text-2xl font-bold text-primary">
                ${results.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </Card>

            <Card className="p-4 bg-primary/5">
              <p className="text-sm text-muted-foreground mb-1">Profit Margin</p>
              <p className="text-2xl font-bold text-primary">
                {results.margin.toFixed(2)}%
              </p>
            </Card>

            <Card className="p-4 bg-primary/5">
              <p className="text-sm text-muted-foreground mb-1">ROI</p>
              <p className="text-2xl font-bold text-primary">
                {results.roi.toFixed(2)}%
              </p>
            </Card>

            <Card className="p-4 bg-primary/5">
              <p className="text-sm text-muted-foreground mb-1">Projected Revenue</p>
              <p className="text-2xl font-bold text-primary">
                ${results.projected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </Card>
          </div>
        )}
      </div>
    </Card>
  );
};
