import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { createRoot, Root } from 'react-dom/client';
import { ItemView } from './ItemView';

interface HydratableItemProps {
  id: string;
}

export function HydratableItem({ id }: HydratableItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hydrationRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Root | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  
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
        <div className="p-4 bg-muted/30 border border-dashed rounded-lg">
          <em className="text-sm text-muted-foreground">📱 Item {id} — static preview</em>
        </div>
      ) : null}
      <div ref={hydrationRef} />
    </div>
  );
}