import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { CartItem, MenuItem } from "../types";

interface CartContextType {
  items: CartItem[];
  addItem: (menuItem: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  orderId: string;
  tableNumber: number | null;
  setTableNumber: (n: number | null) => void;
}

const CartContext = createContext<CartContextType | null>(null);

const TABLE_STORAGE_KEY = "bar.tableNumber";

function newOrderId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readStoredTableNumber(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(TABLE_STORAGE_KEY);
  if (!raw) return null;
  const n = parseInt(raw, 10);
  if (isNaN(n) || n < 1 || n > 30) return null;
  return n;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState<string>(() => newOrderId());
  const [tableNumber, setTableNumberState] = useState<number | null>(() =>
    readStoredTableNumber()
  );

  const setTableNumber = (n: number | null) => {
    setTableNumberState(n);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (tableNumber == null) {
      window.localStorage.removeItem(TABLE_STORAGE_KEY);
    } else {
      window.localStorage.setItem(TABLE_STORAGE_KEY, String(tableNumber));
    }
  }, [tableNumber]);

  const addItem = (menuItem: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const removeItem = (menuItemId: string) => {
    setItems((prev) => prev.filter((item) => item.menuItem.id !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setOrderId(newOrderId());
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        orderId,
        tableNumber,
        setTableNumber,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
