import React from 'react';
import { HydratableItem } from './components/HydratableItem';
import './lib/preload';

function App() {
  const total = 100;
  const ids = Array.from({ length: total }, (_, i) => (i + 1).toString());

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Hydrate‑on‑View Demo
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This demonstrates efficient component hydration based on viewport visibility. 
            Components are mounted only when they enter the viewport and unmounted when they leave, 
            optimizing memory usage for large lists.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          {ids.map((id) => (
            <HydratableItem key={id} id={id} />
          ))}
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Scroll to see hydration in action • {total} items loaded</p>
        </div>
      </div>
    </div>
  );
}

export default App