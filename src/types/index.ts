export type MenuCategory = "음식" | "음료";

export interface MenuItem {
  id: string;
  name: string;
  nameEn?: string;
  price: number;
  category: MenuCategory;
  description?: string;
  image?: string;
  soldOut?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  orderId: string;
  tableNumber: string;
  depositorName: string;
  items: { name: string; quantity: number; price: number }[];
  totalPrice: number;
  timestamp: string;
}

export interface OrderHistoryEntry {
  orderId: string;
  timestamp: string;
  items: { name: string; quantity: number }[];
  totalPrice: number;
  status: string;
}
