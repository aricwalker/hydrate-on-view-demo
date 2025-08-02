import { create } from 'zustand';

interface Item {
  title: string;
  detail: string;
}

interface ItemStore {
  items: Record<string, Item>;
  setItems: (data: Record<string, Item>) => void;
}

export const useItemStore = create<ItemStore>((set) => ({
  items: {},
  setItems: (data) => set({ items: data }),
}));