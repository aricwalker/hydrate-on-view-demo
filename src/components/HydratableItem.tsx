import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
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
  const staticHtmlRef = useRef<string>('');
  
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
    if (containerRef.current && !staticHtmlRef.current) {
      staticHtmlRef.current = containerRef.current.innerHTML;
    }
  }, []);

  useEffect(() => {
    if (inView) {
      // Let React render <ItemView>
      console.log('Hydrating component:', id);
    } else if (containerRef.current) {
      containerRef.current.innerHTML = staticHtmlRef.current;
      console.log('Dehydrated component:', id);
    }
  }, [inView, id]);

  return (
    <div ref={setRefs} data-id={id} className="min-h-[120px] mb-4">
      {inView && <ItemView id={id} inView={inView} />}
    </div>
  );
}