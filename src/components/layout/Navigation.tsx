
"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, History, PlusCircle } from "lucide-react";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#26202B]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(114,51,230,0.5)] group-hover:shadow-[0_0_20px_rgba(114,51,230,0.7)] transition-all">A</div>
          <span className="font-headline font-bold text-2xl tracking-tight hidden sm:inline-block">ArchiText</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/design" className="hover:text-primary flex items-center gap-1.5 transition-colors">
            <PlusCircle className="h-4 w-4" /> New Design
          </Link>
          <Link href="/history" className="hover:text-primary flex items-center gap-1.5 transition-colors">
            <History className="h-4 w-4" /> History
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/history">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              Dashboard
            </Button>
          </Link>
          <Link href="/design">
            <Button size="sm" className="bg-primary hover:bg-primary/90 rounded-full px-5">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
