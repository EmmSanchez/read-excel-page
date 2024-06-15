import { create } from "zustand";

interface OptionsContextType {
  options: string[];
  setOptions: (options: string[]) => void;
}

export const useTestOptionsStore = create<OptionsContextType>((set) => ({
  options: ['SS2023', 'AP2023'],
  setOptions: (options) => set(state => ({ options: options }))
}))