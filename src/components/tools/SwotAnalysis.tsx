import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

export const SwotAnalysis = () => {
  const [swot, setSwot] = useState({
    strengths: "",
    weaknesses: "",
    opportunities: "",
    threats: "",
  });

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">SWOT Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Identify key factors affecting your business
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="strengths" className="text-green-600 font-semibold">
            Strengths
          </Label>
          <Textarea
            id="strengths"
            value={swot.strengths}
            onChange={(e) => setSwot({ ...swot, strengths: e.target.value })}
            placeholder="What are your competitive advantages?"
            rows={6}
            className="border-green-200 focus:border-green-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weaknesses" className="text-red-600 font-semibold">
            Weaknesses
          </Label>
          <Textarea
            id="weaknesses"
            value={swot.weaknesses}
            onChange={(e) => setSwot({ ...swot, weaknesses: e.target.value })}
            placeholder="What areas need improvement?"
            rows={6}
            className="border-red-200 focus:border-red-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="opportunities" className="text-blue-600 font-semibold">
            Opportunities
          </Label>
          <Textarea
            id="opportunities"
            value={swot.opportunities}
            onChange={(e) => setSwot({ ...swot, opportunities: e.target.value })}
            placeholder="What market opportunities exist?"
            rows={6}
            className="border-blue-200 focus:border-blue-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="threats" className="text-orange-600 font-semibold">
            Threats
          </Label>
          <Textarea
            id="threats"
            value={swot.threats}
            onChange={(e) => setSwot({ ...swot, threats: e.target.value })}
            placeholder="What external risks do you face?"
            rows={6}
            className="border-orange-200 focus:border-orange-400"
          />
        </div>
      </div>
    </Card>
  );
};
