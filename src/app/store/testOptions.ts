import { create } from "zustand";

interface OptionsContextType {
  options: string[] | null;
  setOptions: (options: string[]) => void;
}

export const useTestOptionsStore = create<OptionsContextType>((set) => ({
  options: null,
  setOptions: (options) => set(state => ({ options: options }))
}))