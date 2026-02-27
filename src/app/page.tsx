
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlusCircle, History, Zap, Shield, Globe, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10" />
          
          <div className="max-w-6xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight tracking-tight">
              Design <span className="gradient-text">Production-Ready</span> <br /> Architectures in Minutes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
              ArchiText transforms natural language requirements into comprehensive system designs, complete with trade-off analysis, cost estimation, and boilerplate code.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/design">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-full font-medium">
                  Start Designing <PlusCircle className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/history">
                <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/10 h-12 rounded-full font-medium">
                  View Past Designs <History className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Zap className="h-8 w-8 text-secondary" />}
                title="AI Architecture Generation"
                description="Instantly generate complex system diagrams and component lists from simple text requirements."
              />
              <FeatureCard 
                icon={<Shield className="h-8 w-8 text-secondary" />}
                title="Trade-off Analysis"
                description="Understand the pros and cons of every architectural decision with AI-driven insights."
              />
              <FeatureCard 
                icon={<Globe className="h-8 w-8 text-secondary" />}
                title="Cloud Cost Estimation"
                description="Get accurate monthly Azure cost projections based on your specific workload specifications."
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-6">
          <Card className="max-w-4xl mx-auto glass-panel border-primary/20">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl font-headline font-bold">Ready to build the future?</h2>
              <p className="text-muted-foreground text-lg">
                Join thousands of architects who use ArchiText to bridge the gap between ideation and deployment.
              </p>
              <Link href="/design" className="inline-block mt-4">
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full px-8">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 bg-background">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white">A</div>
            <span className="font-headline font-bold text-xl tracking-tight">ArchiText</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 ArchiText. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="glass-panel hover:border-primary/40 transition-all group">
      <CardHeader className="space-y-4">
        <div className="p-3 bg-primary/10 w-fit rounded-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-base">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
