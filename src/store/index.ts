import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface SiteState {
  activeSection: string;
  activeCodeTab: string;
  setActiveSection: (section: string) => void;
  setActiveCodeTab: (tab: string) => void;
}

export const useSiteStore = create<SiteState>()(
  immer((set) => ({
    activeSection: "hero",
    activeCodeTab: "manifest",
    setActiveSection: (section) =>
      set((state) => {
        state.activeSection = section;
      }),
    setActiveCodeTab: (tab) =>
      set((state) => {
        state.activeCodeTab = tab;
      }),
  }))
);
