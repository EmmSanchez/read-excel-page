import { create } from "zustand";

interface Range {
  minAge: number | null;
  maxAge: number | null;
  value: number | null;
}

interface RangesContextType {
  ageRanges: Range[];
  setAgeRanges: (ageRanges: Range[]) => void;
}

export const useAgesStore = create<RangesContextType>((set) => ({
  ageRanges: [],
  setAgeRanges: (ageRanges) => set({ ageRanges }),
}));
