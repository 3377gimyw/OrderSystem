import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { fetchSoldOut } from "../utils/fetchSoldOut";
import { setSoldOut } from "../utils/setSoldOut";
import { useCart } from "./CartContext";

interface MenuContextType {
  soldOutIds: Set<string>;
  toggleSoldOut: (id: string) => Promise<void>;
}

const MenuContext = createContext<MenuContextType | null>(null);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [soldOutIds, setSoldOutIds] = useState<Set<string>>(new Set());
  const { items: cartItems, removeItem } = useCart();

  // Refs keep the effect closure from going stale without adding cartItems/removeItem
  // to deps (which would cause the effect to fire on every cart change).
  const cartItemsRef = useRef(cartItems);
  cartItemsRef.current = cartItems;
  const removeItemRef = useRef(removeItem);
  removeItemRef.current = removeItem;

  useEffect(() => {
    fetchSoldOut().then((ids) => setSoldOutIds(new Set(ids)));
    const interval = setInterval(() => {
      fetchSoldOut().then((ids) => setSoldOutIds(new Set(ids)));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    cartItemsRef.current.forEach((ci) => {
      if (soldOutIds.has(ci.menuItem.id)) removeItemRef.current(ci.menuItem.id);
    });
  }, [soldOutIds]);

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
