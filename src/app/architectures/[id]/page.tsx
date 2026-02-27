
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { getArchitectureById, SavedArchitecture } from "@/lib/storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Network, 
  BarChart3, 
  DollarSign, 
  Code2, 
  ArrowLeft, 
  Download, 
  Loader2, 
  AlertTriangle,
  Info
} from "lucide-react";
import Link from "next/link";
import { architecturalTradeoffAnalysis, ArchitecturalTradeoffAnalysisOutput } from "@/ai/flows/architectural-tradeoff-analysis-flow";
import { estimateAzureCost, AzureCostEstimationOutput } from "@/ai/flows/azure-cost-estimation";
import { generateBoilerplateCode, BoilerplateCodeGenerationOutput } from "@/ai/flows/boilerplate-code-generation-flow";

export default function ArchitectureDetailPage() {
  const { id } = useParams() as { id: string };
  const [arch, setArch] = useState<SavedArchitecture | null>(null);
  
  // Analysis States
  const [tradeoffs, setTradeoffs] = useState<ArchitecturalTradeoffAnalysisOutput | null>(null);
  const [loadingTradeoffs, setLoadingTradeoffs] = useState(false);
  
  const [costs, setCosts] = useState<AzureCostEstimationOutput | null>(null);
  const [loadingCosts, setLoadingCosts] = useState(false);
  
  const [code, setCode] = useState<BoilerplateCodeGenerationOutput | null>(null);
  const [loadingCode, setLoadingCode] = useState(false);

  useEffect(() => {
    const data = getArchitectureById(id);
    if (data) setArch(data);
  }, [id]);

  const loadTradeoffs = async () => {
    if (!arch || tradeoffs) return;
    setLoadingTradeoffs(true);
    try {
      const result = await architecturalTradeoffAnalysis({
        architectureDescription: arch.diagramDescription,
        architecturalChoices: arch.components.map(c => c.name),
      });
      setTradeoffs(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTradeoffs(false);
    }
  };

  const loadCosts = async () => {
    if (!arch || costs) return;
    setLoadingCosts(true);
    try {
      const result = await estimateAzureCost({
        architectureDescription: arch.diagramDescription,
        components: arch.components.map(c => ({
          name: c.name,
          serviceType: c.type,
          region: "East US", // Default region for estimation
          specifications: { tier: "Standard", purpose: c.purpose }
        })),
      });
      setCosts(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCosts(false);
    }
  };

  const loadCode = async () => {
    if (!arch || code) return;
    setLoadingCode(true);
    try {
      const result = await generateBoilerplateCode({
        architectureDescription: `Components: ${JSON.stringify(arch.components)}. Rationale: ${arch.rationale}`,
      });
      setCode(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCode(false);
    }
  };

  if (!arch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <Link href="/history" className="text-secondary hover:text-secondary/80 flex items-center gap-1 text-sm font-medium transition-colors mb-2">
              <ArrowLeft className="h-4 w-4" /> Back to History
            </Link>
            <h1 className="text-3xl font-headline font-bold">System Architecture</h1>
            <p className="text-muted-foreground">Generated on {new Date(arch.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10 h-10 px-4 rounded-full">
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
            <Button className="bg-primary hover:bg-primary/90 h-10 px-6 rounded-full">
              Deploy to Azure
            </Button>
          </div>
        </div>

        <Tabs defaultValue="design" className="space-y-6">
          <TabsList className="bg-black/20 p-1 border border-white/5 rounded-full">
            <TabsTrigger value="design" className="rounded-full px-6 flex items-center gap-2">
              <Network className="h-4 w-4" /> Architecture
            </TabsTrigger>
            <TabsTrigger value="tradeoffs" onClick={loadTradeoffs} className="rounded-full px-6 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Trade-offs
            </TabsTrigger>
            <TabsTrigger value="cost" onClick={loadCosts} className="rounded-full px-6 flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Cloud Cost
            </TabsTrigger>
            <TabsTrigger value="code" onClick={loadCode} className="rounded-full px-6 flex items-center gap-2">
              <Code2 className="h-4 w-4" /> Boilerplate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="glass-panel border-white/5">
                  <CardHeader>
                    <CardTitle className="text-xl">Architectural Overview</CardTitle>
                    <CardDescription>Visual representation of component interactions.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px] flex items-center justify-center bg-black/40 rounded-lg border border-white/5 relative group">
                    <div className="text-center space-y-4 max-w-md p-6">
                      <Network className="h-12 w-12 text-primary mx-auto opacity-50 group-hover:opacity-100 transition-opacity" />
                      <div className="font-code text-xs text-muted-foreground whitespace-pre-wrap">
                        {arch.diagramDescription}
                      </div>
                      <p className="text-xs text-muted-foreground italic">Diagram rendering component would load this description into Mermaid.js or similar visualizer.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-white/5">
                  <CardHeader>
                    <CardTitle className="text-xl">Rationale</CardTitle>
                  </CardHeader>
                  <CardContent className="font-body text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {arch.rationale}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="glass-panel border-white/5">
                  <CardHeader>
                    <CardTitle className="text-xl">Components</CardTitle>
                    <CardDescription>{arch.components.length} identified modules</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {arch.components.map((comp, idx) => (
                      <div key={idx} className="p-3 bg-black/20 rounded-lg border border-white/5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-secondary">{comp.name}</span>
                          <Badge variant="outline" className="bg-primary/10 border-primary/20 text-[10px] h-5">{comp.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{comp.purpose}</p>
                        <div className="text-[10px] font-code text-primary-foreground/50 bg-primary/5 p-1 rounded">
                          {comp.technology}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-secondary/5 border-secondary/20 border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Info className="h-4 w-4 text-secondary" />
                      Requirements Metadata
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    <p className="line-clamp-6 italic">"{arch.requirements}"</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tradeoffs" className="animate-in fade-in duration-500">
            {loadingTradeoffs ? (
              <LoadingState message="Analyzing architectural decisions and trade-offs..." />
            ) : tradeoffs ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tradeoffs.analysisResults.map((result, idx) => (
                  <Card key={idx} className="glass-panel border-white/5">
                    <CardHeader className="pb-3 border-b border-white/5">
                      <CardTitle className="text-lg text-secondary">{result.choice}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-2">
                        <div className="p-6 border-r border-white/5 space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-green-400">Benefits</h4>
                          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                            {result.benefits.map((b, i) => <li key={i}>{b}</li>)}
                          </ul>
                        </div>
                        <div className="p-6 space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">Drawbacks</h4>
                          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                            {result.drawbacks.map((d, i) => <li key={i}>{d}</li>)}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="cost" className="animate-in fade-in duration-500">
            {loadingCosts ? (
              <LoadingState message="Calculating Azure infrastructure costs..." />
            ) : costs ? (
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-[#7233E6]/10 to-transparent border-primary/20">
                  <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center md:text-left">
                      <h2 className="text-xl font-headline">Total Estimated Monthly Cost</h2>
                      <p className="text-muted-foreground text-sm max-w-md">Estimated based on standard Azure pricing for East US. Includes basic configuration and traffic assumptions.</p>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-headline font-bold text-secondary">${costs.totalMonthlyCostUSD}</div>
                      <span className="text-xs text-muted-foreground uppercase tracking-widest">USD / Month</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {costs.costBreakdown.map((item, idx) => (
                    <Card key={idx} className="glass-panel border-white/5">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-sm text-secondary font-bold">{item.componentName}</CardTitle>
                          <span className="text-lg font-bold text-white">${item.estimatedMonthlyCostUSD}</span>
                        </div>
                        <CardDescription className="text-[10px]">{item.serviceType}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">{item.details}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-black/20 border-white/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Assumptions & Constraints
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">{costs.assumptions}</p>
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="code" className="animate-in fade-in duration-500">
             {loadingCode ? (
              <LoadingState message="Generating Dockerized boilerplate services..." />
            ) : code ? (
              <Card className="bg-[#1e1e1e] border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-white/5 bg-black/20">
                  <div>
                    <CardTitle className="text-lg font-headline">Service Boilerplate</CardTitle>
                    <CardDescription>Multi-service docker-compose setup</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-full h-8">
                    <Download className="mr-2 h-3 w-3" /> Copy All
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-auto max-h-[600px] p-6 font-code text-sm">
                    <div className="whitespace-pre-wrap text-muted-foreground">
                      {code.dockerizedBoilerplateCode}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-primary blur-2xl opacity-20 animate-pulse rounded-full" />
        <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
      </div>
      <p className="text-lg text-muted-foreground font-headline animate-pulse">{message}</p>
    </div>
  );
}
