import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessPlan } from "@/components/tools/BusinessPlan";
import { SwotAnalysis } from "@/components/tools/SwotAnalysis";
import { FinancialCalculator } from "@/components/tools/FinancialCalculator";

const Tools = () => {
  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 text-center space-y-4">
          <h1 className="text-4xl font-bold">Business Tools</h1>
          <p className="text-lg text-muted-foreground">
            Interactive tools to help you build and grow your business
          </p>
        </div>

        <Tabs defaultValue="business-plan" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="business-plan">Business Plan</TabsTrigger>
            <TabsTrigger value="swot">SWOT Analysis</TabsTrigger>
            <TabsTrigger value="financial">Financial Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="business-plan">
            <BusinessPlan />
          </TabsContent>

          <TabsContent value="swot">
            <SwotAnalysis />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Tools;
