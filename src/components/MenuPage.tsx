import { useState } from "react";
import { Link } from "react-router-dom";
import { menuItems } from "../data/menu";
import { useCart } from "../context/CartContext";
import { useMenu } from "../context/MenuContext";
import { formatPrice } from "../utils/formatPrice";
import MenuItemCard from "./MenuItemCard";
import type { MenuCategory } from "../types";

type Tab = "전체" | MenuCategory;

const TABS: Tab[] = ["전체", "음식", "음료"];

export default function MenuPage() {
  const { totalItems, totalPrice } = useCart();
  const { soldOutIds } = useMenu();
  const [activeTab, setActiveTab] = useState<Tab>("전체");

  const filtered =
    activeTab === "전체"
      ? menuItems
      : menuItems.filter((item) => item.category === activeTab);

  return (
    <div className={`pt-3 ${totalItems > 0 ? "pb-28" : ""}`}>
      <div className="flex gap-2 px-4 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === tab
                ? "bg-blue-900 text-white"
                : "bg-[#0d1a33] text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 px-4">
        {filtered.map((item) => (
          <MenuItemCard
            key={item.id}
            item={soldOutIds.has(item.id) ? { ...item, soldOut: true } : item}
          />
        ))}
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur border-t border-[#0d1a33]">
          <Link
            to="/cart"
            className="flex items-center justify-between bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            <span>장바구니 ({totalItems})</span>
            <span>{formatPrice(totalPrice)}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
