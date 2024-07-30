import { create } from "zustand";
import { ParticipantData } from "@/app/types/ClientParticipant";

interface ParticipantsDataSate {
  participants: ParticipantData[] | null
  setParticipants: (participants: ParticipantData[] | null) => void
}

export const useParticipantsDataStore = create<ParticipantsDataSate>((set) => ({
  participants: null,
  setParticipants: (participants) => set(state => ({participants: participants}))
}))