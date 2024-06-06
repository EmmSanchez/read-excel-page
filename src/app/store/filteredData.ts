import { create } from "zustand";

interface FilteredDataSate {
  filteredExcelData: (string | number | boolean | null)[][] | null
  setFilteredExcelData: (excelData: (string | number | boolean | null)[][] | null) => void
}

export const useFilteredDataStore = create<FilteredDataSate>((set) => ({
  filteredExcelData: null,
  setFilteredExcelData: (filteredExcelData) => set(state => ({filteredExcelData: filteredExcelData}))
}))