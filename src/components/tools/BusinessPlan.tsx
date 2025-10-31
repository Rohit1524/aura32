import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const BusinessPlan = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    description: "",
    targetMarket: "",
    goals: "",
  });
  const [generatedPlan, setGeneratedPlan] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const prompt = `Create a comprehensive business plan for:
Business Name: ${formData.businessName}
Industry: ${formData.industry}
Description: ${formData.description}
Target Market: ${formData.targetMarket}
Goals: ${formData.goals}

Include: Executive Summary, Market Analysis, Products/Services, Marketing Strategy, Financial Projections, and Implementation Timeline.`;

      const { data, error } = await supabase.functions.invoke("business-assistant", {
        body: { message: prompt },
      });

      if (error) throw error;

      setGeneratedPlan(data.response);
      toast({
        title: "Success!",
        description: "Business plan generated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate business plan",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedPlan], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.businessName || "business"}-plan.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Business Plan Generator</h2>
            <p className="text-sm text-muted-foreground">
              Create a professional business plan in minutes
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                placeholder="Enter your business name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
                placeholder="e.g., Technology, Retail, Healthcare"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe what your business does"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetMarket">Target Market</Label>
            <Textarea
              id="targetMarket"
              value={formData.targetMarket}
              onChange={(e) =>
                setFormData({ ...formData, targetMarket: e.target.value })
              }
              placeholder="Who are your customers?"
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">Business Goals</Label>
            <Textarea
              id="goals"
              value={formData.goals}
              onChange={(e) =>
                setFormData({ ...formData, goals: e.target.value })
              }
              placeholder="What do you want to achieve?"
              rows={2}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Business Plan"
            )}
          </Button>
        </form>
      </Card>

      {generatedPlan && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Your Business Plan</h3>
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap">
            {generatedPlan}
          </div>
        </Card>
      )}
    </div>
  );
};
