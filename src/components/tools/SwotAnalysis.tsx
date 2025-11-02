import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const SwotAnalysis = () => {
  const [businessData, setBusinessData] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [swot, setSwot] = useState({
    strengths: "",
    weaknesses: "",
    opportunities: "",
    threats: "",
  });
  const { toast } = useToast();

  const analyzeSwot = async () => {
    if (!businessData.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide business data for analysis",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('swot-analysis', {
        body: { businessData }
      });

      if (error) throw error;

      // Parse the AI response and populate SWOT fields
      const analysis = data.analysis;
      const sections = {
        strengths: "",
        weaknesses: "",
        opportunities: "",
        threats: ""
      };

      // Extract sections from the analysis
      const strengthsMatch = analysis.match(/Strengths?:?\s*([\s\S]*?)(?=Weaknesses?:|$)/i);
      const weaknessesMatch = analysis.match(/Weaknesses?:?\s*([\s\S]*?)(?=Opportunities?:|$)/i);
      const opportunitiesMatch = analysis.match(/Opportunities?:?\s*([\s\S]*?)(?=Threats?:|$)/i);
      const threatsMatch = analysis.match(/Threats?:?\s*([\s\S]*?)$/i);

      if (strengthsMatch) sections.strengths = strengthsMatch[1].trim();
      if (weaknessesMatch) sections.weaknesses = weaknessesMatch[1].trim();
      if (opportunitiesMatch) sections.opportunities = opportunitiesMatch[1].trim();
      if (threatsMatch) sections.threats = threatsMatch[1].trim();

      setSwot(sections);
      toast({
        title: "Analysis Complete",
        description: "SWOT analysis has been generated successfully",
      });
    } catch (error) {
      console.error('Error analyzing SWOT:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze business data",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI-Powered SWOT Analysis</h2>
            <p className="text-sm text-muted-foreground">
              Provide your business information and get an automated SWOT analysis
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessData">Business Information</Label>
          <Textarea
            id="businessData"
            value={businessData}
            onChange={(e) => setBusinessData(e.target.value)}
            placeholder="Describe your business, products/services, market position, competitors, challenges, etc..."
            rows={6}
            className="resize-none"
          />
        </div>

        <Button 
          onClick={analyzeSwot} 
          disabled={isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Generate SWOT Analysis'
          )}
        </Button>
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
