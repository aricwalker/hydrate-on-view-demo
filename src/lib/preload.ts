import { useItemStore } from './store';

async function preload() {
  try {
    const res = await fetch('/items.json');
    const items = await res.json();
    useItemStore.getState().setItems(items);
  } catch (error) {
    console.error('Failed to preload items:', error);
  }
}

preload();