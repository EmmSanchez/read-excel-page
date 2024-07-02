import { create } from "zustand";

interface LoadingState {
  isTableLoading: boolean 
  setIsTableLoading: (isTableLoading: boolean) => void
}

export const useTableLoading = create<LoadingState>((set) => ({
  isTableLoading: false,
  setIsTableLoading: (isTableLoading) => set(state => ({ isTableLoading }))
}))