import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { createRoot, Root } from 'react-dom/client';
import { ItemView } from './ItemView';
import { useItemStore } from '../lib/store';

interface HydratableItemProps {
  id: string;
}

export function HydratableItem({ id }: HydratableItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hydrationRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Root | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Access item data for static preview
  const item = useItemStore((s) => s.items[id]);
  
  const { ref: inViewRef, inView } = useInView({ 
    rootMargin: '200px',
    threshold: 0
  });

  const setRefs = (el: HTMLDivElement | null) => {
    containerRef.current = el;
    inViewRef(el);
  };

  useEffect(() => {
    const hydrationContainer = hydrationRef.current;
    
    if (inView && hydrationContainer && !rootRef.current && !isHydrated) {
      try {
        const root = createRoot(hydrationContainer);
        rootRef.current = root;
        root.render(<ItemView id={id} />);
        setIsHydrated(true);
      } catch (error) {
        console.error('Failed to hydrate component:', error);
      }
    } else if (!inView && rootRef.current && isHydrated) {
      try {
        rootRef.current.unmount();
        rootRef.current = null;
        setIsHydrated(false);
      } catch (error) {
        console.error('Failed to unmount component:', error);
      }
    }
  }, [inView, id, isHydrated]);

  useEffect(() => {
    return () => {
      if (rootRef.current) {
        try {
          rootRef.current.unmount();
          rootRef.current = null;
        } catch (error) {
          console.error('Failed to cleanup component:', error);
        }
      }
    };
  }, []);

  return (
    <div ref={setRefs} data-id={id} className="min-h-[120px] mb-4">
      {!isHydrated ? (
        <div className="p-4 bg-card border rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
          {item ? (
            <>
              <h3 className="font-semibold text-lg text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.detail}</p>
              <div className="mt-3 text-xs text-muted-foreground">
                📱 Static preview #{id}
              </div>
            </>
          ) : (
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="mt-2 text-xs text-muted-foreground">
                Loading item #{id}...
              </div>
            </div>
          )}
        </div>
      ) : null}
      <div ref={hydrationRef} />
    </div>
  );
}