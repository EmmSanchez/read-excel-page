import { create } from "zustand";

interface LoadingState {
  isGetDataFetchFinished: boolean 
  setIsGetDataFetchFinished: (isGetDataFetchFinished: boolean) => void
}

export const useIsGetDataFetchFinished = create<LoadingState>((set) => ({
  isGetDataFetchFinished: false,
  setIsGetDataFetchFinished: (isGetDataFetchFinished) => set(state => ({ isGetDataFetchFinished }))
}))