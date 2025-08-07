import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { createPortal } from 'react-dom';
import { ItemView } from './ItemView';
import { useItemStore } from '../lib/store';

// A different path with rendering to static markup
// import ReactDOMServer from 'react-dom/server';
// hydrationContainer.innerHTML = ReactDOMServer.renderToStaticMarkup

interface HydratableItemProps {
  id: string;
}

export function HydratableItem({ id }: HydratableItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hydrationRef = useRef<HTMLDivElement>(null);
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

    if (inView && hydrationContainer && !isHydrated) {
      try {
        setIsHydrated(true);
        console.log('Hydrated component:', id);
      } catch (error) {
        console.error('Failed to hydrate component:', error);
      }
    } else if (!inView && isHydrated) {
      try {
        // Defer unmounting to avoid race conditions
        setTimeout(() => {
          setIsHydrated(false);
          console.log('Dehydrated component:', id);
        }, 0);
      } catch (error) {
        console.error('Failed to unmount component:', error);
      }
    }
  }, [inView, id, isHydrated]);

  useEffect(() => {
    return () => {
      // Cleanup is handled by React when component unmounts
      if (isHydrated) {
        console.log('Cleanup component:', id);
      }
    };
  }, [id, isHydrated]);

  return (
    <div ref={setRefs} data-id={id} className="min-h-[120px] mb-4">
      {!isHydrated ? (
        <div className="p-4 bg-muted/30 border rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
          <h3 className="font-semibold text-lg text-foreground mb-2">{item?.title}</h3>
          <p className="text-muted-foreground leading-relaxed">{item?.detail}</p>
          <div className="mt-3 text-xs text-muted-foreground">
            🌵 Dehydrated component #{id}
          </div>
        </div>
      ) : null}
      <div ref={hydrationRef} />
      {isHydrated && hydrationRef.current && createPortal(
        <ItemView id={id} />,
        hydrationRef.current
      )}
    </div>
  );
}