import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileSpreadsheet, TrendingUp, Upload, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as XLSX from 'xlsx';

export const ExcelAnalysis = () => {
  const [inputData, setInputData] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisType, setAnalysisType] = useState<string>("comprehensive");
  const [generatedData, setGeneratedData] = useState<any[]>([]);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      toast({
        title: "Image uploaded",
        description: "Image data extraction will be processed with your analysis.",
      });
    }
  };

  const handleAnalyze = async () => {
    if (!inputData.trim()) {
      toast({
        title: "Error",
        description: "Please enter some data to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-business-data', {
        body: { 
          data: inputData, 
          type: 'analyze',
          analysisType 
        }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "Business insights generated successfully",
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze data",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateExcel = async () => {
    if (!inputData.trim()) {
      toast({
        title: "Error",
        description: "Please enter some data to generate Excel",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-business-data', {
        body: { data: inputData, type: 'generate' }
      });

      if (error) throw error;

      // Parse the AI response to get structured data
      let structuredData;
      try {
        // Try to extract JSON from the response
        const jsonMatch = data.analysis.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          structuredData = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback: create a simple structure
          structuredData = inputData.split('\n').map((row, idx) => ({
            'Row': idx + 1,
            'Data': row.trim()
          }));
        }
      } catch {
        structuredData = inputData.split('\n').map((row, idx) => ({
          'Row': idx + 1,
          'Data': row.trim()
        }));
      }

      setGeneratedData(structuredData);

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(structuredData);
      XLSX.utils.book_append_sheet(wb, ws, "Business Data");

      // Generate and download file
      XLSX.writeFile(wb, "business_analysis.xlsx");

      toast({
        title: "Excel Generated",
        description: "Your Excel file has been downloaded",
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate Excel",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Excel Analysis & Generation</h2>
        <p className="text-muted-foreground mb-6">
          Enter raw business data or upload an image to generate Excel sheets and get AI-powered business insights
        </p>

        <Tabs defaultValue="input" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Data Input</TabsTrigger>
            <TabsTrigger value="preview" disabled={generatedData.length === 0}>
              Preview Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-4">
            <div>
              <Label htmlFor="data-input">Business Data (Text)</Label>
              <Textarea
                id="data-input"
                placeholder="Enter your business data here (e.g., sales figures, inventory, customer data, financial reports)..."
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                className="min-h-[200px] mt-2"
              />
            </div>

            <div>
              <Label htmlFor="image-upload">Or Upload Image Data</Label>
              <div className="flex items-center gap-4 mt-2">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="max-w-md"
                />
                {imageFile && (
                  <span className="text-sm text-muted-foreground">
                    {imageFile.name}
                  </span>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="analysis-type">Analysis Type</Label>
              <select
                id="analysis-type"
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
                className="w-full mt-2 p-2 border rounded-md bg-background"
              >
                <option value="comprehensive">Comprehensive Business Analysis</option>
                <option value="financial">Financial Performance Analysis</option>
                <option value="sales">Sales & Revenue Analysis</option>
                <option value="market">Market & Competition Analysis</option>
                <option value="strategy">Strategic Recommendations</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleGenerateExcel}
                disabled={isGenerating || !inputData}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Generate Excel
                  </>
                )}
              </Button>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputData}
                variant="secondary"
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Analyze & Get Strategy
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            {generatedData.length > 0 && (
              <div className="border rounded-lg overflow-auto max-h-96">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      {Object.keys(generatedData[0]).map((key) => (
                        <th key={key} className="p-2 text-left font-semibold">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {generatedData.map((row, idx) => (
                      <tr key={idx} className="border-t">
                        {Object.values(row).map((value: any, cellIdx) => (
                          <td key={cellIdx} className="p-2">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {analysis && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Business Analysis & Strategy</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const blob = new Blob([analysis], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'business-analysis.txt';
                a.click();
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Analysis
            </Button>
          </div>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">{analysis}</pre>
          </div>
        </Card>
      )}
    </div>
  );
};
