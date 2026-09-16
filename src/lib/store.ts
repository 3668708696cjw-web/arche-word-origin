import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
  saved: string[];
  recent: string[];
  toggleSaved: (k: string) => void;
  addRecent: (k: string) => void;
};

export const useArcheStore = create<Store>()(
  persist(
    (set, get) => ({
      saved: [],
      recent: [],
      toggleSaved: (k) => {
        const cur = get().saved;
        set({ saved: cur.includes(k) ? cur.filter((x) => x !== k) : [k, ...cur].slice(0, 400) });
      },
      addRecent: (k) => {
        const cur = get().recent.filter((x) => x !== k);
        set({ recent: [k, ...cur].slice(0, 24) });
      },
    }),
    { name: "arche-store" },
  ),
);
