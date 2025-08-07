import React from 'react';
import { useItemStore } from '../lib/store';

interface ItemViewProps {
  id: string;
  inView: boolean;
}

export function ItemView({ id, inView }: ItemViewProps) {
  const item = useItemStore((s) => s.items[id]);
  
  if (!item) {
    return (
      <div className="p-4 bg-muted/50 rounded-lg animate-pulse">
        <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-muted rounded w-full"></div>
        <div className="mt-2 text-xs text-muted-foreground">
          Loading item #{id}...
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-card border rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
      <h3 className="font-semibold text-lg text-foreground mb-2">{item.title}</h3>
      <p className="text-muted-foreground leading-relaxed">{item.detail}</p>
      <div className="mt-3 text-xs text-muted-foreground">
        {inView ? "✨ Hydrated component" : "👀 Not in view"} #{id}
      </div>
    </div>
  );
}