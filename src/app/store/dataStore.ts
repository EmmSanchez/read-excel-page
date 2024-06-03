import { create } from "zustand";

interface DataState {
  excelData: (string | number | boolean | null)[][] | null
  setExcelData: (excelData: (string | number | boolean | null)[][] | null) => void
}

export const useDataStore = create<DataState>((set) => ({
  excelData: null,
  setExcelData: (excelData) => set(state => ({ excelData: excelData }))
}))