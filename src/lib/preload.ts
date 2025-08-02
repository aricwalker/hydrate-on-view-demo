import { useItemStore } from './store';

async function preload() {
  try {
    const res = await fetch('/items.json');
    if (!res.ok) {
      throw new Error(`Failed to fetch items: ${res.status} ${res.statusText}`);
    }
    const items = await res.json();
    useItemStore.getState().setItems(items);
    console.log('Items preloaded successfully:', Object.keys(items).length, 'items');
  } catch (error) {
    console.error('Failed to preload items:', error);
    // Fallback to empty items
    useItemStore.getState().setItems({});
  }
}

preload();