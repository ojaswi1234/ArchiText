
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { architecturalDesignGeneration } from "@/ai/flows/architectural-design-generation-flow";
import { Loader2, Send, Lightbulb, Sparkles } from "lucide-react";
import { saveArchitecture } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

export default function DesignPage() {
  const [requirements, setRequirements] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!requirements.trim()) {
      toast({
        title: "Requirements needed",
        description: "Please enter some system requirements to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await architecturalDesignGeneration({ requirements });
      const id = Math.random().toString(36).substring(2, 9);
      
      saveArchitecture({
        ...result,
        id,
        requirements,
        createdAt: new Date().toISOString(),
      });

      router.push(`/architectures/${id}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Generation failed",
        description: "There was an error generating your architecture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-headline font-bold">New Architecture</h1>
            <p className="text-muted-foreground text-lg">
              Describe your system requirements in natural language. Be specific about scale, user types, and core features.
            </p>
          </div>

          <Card className="glass-panel border-primary/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                System Requirements
              </CardTitle>
              <CardDescription>
                Example: "A real-time notification system that can handle 10k users, using WebSockets and a scalable backend."
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea 
                placeholder="Type your requirements here..." 
                className="min-h-[200px] text-lg bg-black/20 border-white/10 focus:border-primary/50 transition-all font-body"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <SuggestionButton onClick={() => setRequirements("E-commerce platform with microservices, global search, and inventory management.")} label="E-commerce" />
                  <SuggestionButton onClick={() => setRequirements("Social media app with live streaming, real-time chat, and content delivery network.")} label="Social Media" />
                </div>
                
                <Button 
                  onClick={handleGenerate} 
                  disabled={isLoading || !requirements.trim()}
                  className="bg-primary hover:bg-primary/90 px-8 h-12 rounded-full font-bold shadow-lg shadow-primary/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Designing...
                    </>
                  ) : (
                    <>
                      Design Architecture <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            <Card className="bg-black/10 border-white/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-secondary font-semibold">
                <Lightbulb className="h-5 w-5" />
                Tips for better results
              </div>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                <li>Specify expected user load and traffic patterns.</li>
                <li>Mention any specific compliance requirements (GDPR, HIPAA).</li>
                <li>Define latency and availability constraints.</li>
                <li>Indicate preferred tech stacks if any.</li>
              </ul>
            </Card>
            <Card className="bg-black/10 border-white/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-secondary font-semibold">
                <Sparkles className="h-5 w-5" />
                What's included?
              </div>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                <li>Production-ready component breakdown.</li>
                <li>Azure cost estimation based on real pricing.</li>
                <li>Dockerized boilerplate code for services.</li>
                <li>Detailed architectural rationale.</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function SuggestionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onClick}
      className="rounded-full border-white/10 hover:bg-white/5 hover:text-white text-xs text-muted-foreground"
    >
      {label}
    </Button>
  );
}
