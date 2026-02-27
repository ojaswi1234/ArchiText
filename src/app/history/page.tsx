
"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { getSavedArchitectures, SavedArchitecture } from "@/lib/storage";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Layers, ExternalLink, ArrowRight, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const [designs, setDesigns] = useState<SavedArchitecture[]>([]);

  useEffect(() => {
    setDesigns(getSavedArchitectures());
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-headline font-bold">Architecture History</h1>
              <p className="text-muted-foreground text-lg">Manage and review your saved system designs.</p>
            </div>
            <Link href="/design">
              <Button className="bg-primary hover:bg-primary/90 rounded-full px-6">
                <PlusCircle className="mr-2 h-4 w-4" /> New Design
              </Button>
            </Link>
          </div>

          {designs.length === 0 ? (
            <div className="py-20 text-center space-y-6 bg-black/10 rounded-2xl border border-white/5">
              <Layers className="h-16 w-16 text-muted-foreground mx-auto opacity-20" />
              <div className="space-y-2">
                <h2 className="text-xl font-headline font-semibold">No designs yet</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">Your system architectures will appear here once you've generated them using ArchiText.</p>
              </div>
              <Link href="/design">
                <Button variant="outline" className="border-primary/20 rounded-full">
                  Create your first design
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design) => (
                <Card key={design.id} className="glass-panel hover:border-primary/40 transition-all flex flex-col h-full group">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] h-5">
                        {design.components.length} Components
                      </Badge>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(design.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="text-xl line-clamp-1 font-headline">{design.id.toUpperCase()}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs italic">
                      "{design.requirements}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {design.components.slice(0, 3).map((c, i) => (
                          <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-muted-foreground">
                            {c.name}
                          </span>
                        ))}
                        {design.components.length > 3 && (
                          <span className="text-[10px] text-muted-foreground px-1">+{design.components.length - 3} more</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {design.rationale}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-white/5">
                    <Link href={`/architectures/${design.id}`} className="w-full">
                      <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-white transition-all rounded-full justify-between">
                        View Details <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
