import { Link } from "react-router-dom";
import { menuItems } from "../data/menu";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import MenuItemCard from "./MenuItemCard";

export default function MenuPage() {
  const { totalItems, totalPrice } = useCart();

  return (
    <div className="pb-24 pt-3">
      <div className="grid grid-cols-1 gap-3 px-4">
        {menuItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur border-t border-[#0d1a33]">
          <Link
            to="/cart"
            className="flex items-center justify-between w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            <span>장바구니 보기 ({totalItems})</span>
            <span>{formatPrice(totalPrice)}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
