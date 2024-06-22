import { create } from "zustand";

interface MongoFile {
  _id: string;
  name: string;
  size: number;
}

interface FileState {
  file: File | null 
  setFile: (file: File | null) => void
}

export const useFileStore = create<FileState>((set) => ({
  file: null,
  setFile: (file) => set(state => ({ file: file }))
}))