import { create } from "zustand";

interface UserState {
  userProfile: string | null,
  setUserProfile: ( userProfile: string ) => void
}

export const useUserStore = create<UserState>((set) => ({
  userProfile: null,
  setUserProfile: (userProfile) => set(state => ({ userProfile: userProfile}))
}))