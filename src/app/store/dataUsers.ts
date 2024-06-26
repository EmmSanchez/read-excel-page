import { create } from "zustand";

interface User {
  _id: string;
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
