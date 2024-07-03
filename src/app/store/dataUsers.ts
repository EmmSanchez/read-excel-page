import { create } from "zustand";

interface User {
  username: string;
  password: string;
  rol: string;
}

interface UsersContextType {
  users: User[];
  setUsers: (users: User[]) => void;
}

export const useDataUsersStore = create<UsersContextType>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
}));
