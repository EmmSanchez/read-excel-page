import { create } from "zustand";
import { filteredParticipant } from "@/app/types/filteredParticipant";

interface FilteredParticipantsDataSate {
  filteredParticipants: filteredParticipant[] | null
  setFilteredParticipants: (filteredParticipants: filteredParticipant[] | null) => void
}

export const useFilteredParticipantsDataStore = create<FilteredParticipantsDataSate>((set) => ({
  filteredParticipants: null,
  setFilteredParticipants: (filteredParticipants) => set(state => ({filteredParticipants: filteredParticipants}))
}))