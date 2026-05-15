import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchSoldOut } from "../utils/fetchSoldOut";
import { setSoldOut } from "../utils/setSoldOut";

interface MenuContextType {
  soldOutIds: Set<string>;
  toggleSoldOut: (id: string) => Promise<void>;
}

const MenuContext = createContext<MenuContextType | null>(null);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [soldOutIds, setSoldOutIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSoldOut().then((ids) => setSoldOutIds(new Set(ids)));
  }, []);

  const toggleSoldOut = async (id: string) => {
    const next = new Set(soldOutIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    await setSoldOut([...next]);
    setSoldOutIds(next);
  };

  return (
    <MenuContext.Provider value={{ soldOutIds, toggleSoldOut }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used within a MenuProvider");
  return context;
}
