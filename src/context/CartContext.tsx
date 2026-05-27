import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { CartItem, MenuItem } from "../types";

interface CartContextType {
  items: CartItem[];
  addItem: (menuItem: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  decrementItem: (menuItemId: string) => void;
  incrementItem: (menuItemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  orderId: string;
  tableNumber: string | null;
  setTableNumber: (n: string | null) => void;
}

const CartContext = createContext<CartContextType | null>(null);

function newOrderId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState<string>(() => newOrderId());
  const [tableNumber, setTableNumberState] = useState<string | null>(null);

  const setTableNumber = (n: string | null) => {
    setTableNumberState(n);
  };

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

  // Uses a functional updater so rapid taps always read the latest quantity,
  // preventing stale-closure double-taps from re-adding a just-deleted item.
  const decrementItem = (menuItemId: string) => {
    setItems((prev) =>
      prev.flatMap((item) => {
        if (item.menuItem.id !== menuItemId) return [item];
        if (item.quantity <= 1) return [];
        return [{ ...item, quantity: item.quantity - 1 }];
      })
    );
  };

  const incrementItem = (menuItemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.menuItem.id === menuItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
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
        decrementItem,
        incrementItem,
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
