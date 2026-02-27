"use client";

import React, { useEffect, useState, useId } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    });

    const renderChart = async () => {
      if (!chart) return;
      try {
        setError(false);
        const { svg } = await mermaid.render(`mermaid-${id}`, chart);
        setSvg(svg);
      } catch (err) {
        console.error('Mermaid render failed:', err);
        setError(true);
      }
    };

    renderChart();
  }, [chart, id]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6 text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
        <p className="text-sm font-medium">Failed to render architecture diagram. Invalid Mermaid syntax.</p>
      </div>
    );
  }

  return (
    <div 
      className="flex justify-center w-full overflow-auto bg-black/40 rounded-lg border border-white/5 p-4 min-h-[300px]"
      dangerouslySetInnerHTML={{ __html: svg || '<div class="animate-pulse flex items-center justify-center w-full h-full text-muted-foreground">Rendering diagram...</div>' }} 
    />
  );
}