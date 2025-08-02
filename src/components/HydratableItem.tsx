import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { createRoot, Root } from 'react-dom/client';
import { ItemView } from './ItemView';

interface HydratableItemProps {
  id: string;
}

export function HydratableItem({ id }: HydratableItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Root | null>(null);
  const { ref: inViewRef, inView } = useInView({ 
    rootMargin: '200px',
    threshold: 0
  });

  const setRefs = (el: HTMLDivElement | null) => {
    ref.current = el;
    inViewRef(el);
  };

  useEffect(() => {
    const el = ref.current;
    if (inView && el && !rootRef.current) {
      const root = createRoot(el);
      rootRef.current = root;
      root.render(<ItemView id={id} />);
    } else if (!inView && rootRef.current) {
      rootRef.current.unmount();
      rootRef.current = null;
      if (el) {
        el.innerHTML = `
          <div class="p-4 bg-muted/30 border border-dashed rounded-lg">
            <em class="text-sm text-muted-foreground">📱 Item ${id} — static preview</em>
          </div>
        `;
      }
    }
  }, [inView, id]);

  useEffect(() => {
    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={setRefs} data-id={id} className="min-h-[120px] mb-4">
      <div className="p-4 bg-muted/30 border border-dashed rounded-lg">
        <em className="text-sm text-muted-foreground">📱 Item {id} — static preview</em>
      </div>
    </div>
  );
}