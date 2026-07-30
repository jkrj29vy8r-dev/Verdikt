import { create } from "zustand";

/**
 * Global UI state.
 *
 * Scope discipline: this store holds only *ephemeral, cross-cutting* UI state
 * (overlays, menus) that many unrelated components toggle. Server data belongs
 * in the data layer (Supabase + Server Components); form and local state belong
 * in the component. Keeping that boundary crisp is what keeps the store small.
 */
interface UIState {
  commandMenuOpen: boolean;
  mobileNavOpen: boolean;
  setCommandMenuOpen: (open: boolean) => void;
  toggleCommandMenu: () => void;
  setMobileNavOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  commandMenuOpen: false,
  mobileNavOpen: false,
  setCommandMenuOpen: (commandMenuOpen) => set({ commandMenuOpen }),
  toggleCommandMenu: () =>
    set((s) => ({ commandMenuOpen: !s.commandMenuOpen })),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
}));
