export type MenuCategory = "안주" | "식사";

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
  tableNumber: number;
  items: { name: string; quantity: number; price: number }[];
  totalPrice: number;
  timestamp: string;
}
