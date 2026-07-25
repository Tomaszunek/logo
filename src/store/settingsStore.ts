import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsStore {
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      animationsEnabled: true,
      setAnimationsEnabled: (enabled) => {
        set({ animationsEnabled: enabled });
      },
    }),
    {
      name: "logo-playground-settings",
    },
  ),
);
