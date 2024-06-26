import { create } from "zustand";
import { SVGProps } from "react";

interface Link {
  name: string, 
  href: string, 
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
}

interface NavLinksContextType {
  links: Link[];
  setLinks: (links: Link[]) => void;
}

export const useNavLinksStore = create<NavLinksContextType>((set) => ({
  links: [],
  setLinks: (links) => set({ links }),
}));