import { Link } from "react-router-dom";
import { menuItems } from "../data/menu";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import MenuItemCard from "./MenuItemCard";

export default function MenuPage() {
  const { totalItems, totalPrice, tableNumber } = useCart();

  const showStickyBar = totalItems > 0 || tableNumber != null;

  return (
    <div className={`pt-3 ${showStickyBar ? "pb-28" : ""}`}>
      <div className="grid grid-cols-1 gap-3 px-4">
        {menuItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>

      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur border-t border-[#0d1a33]">
          {totalItems > 0 ? (
            <div className="flex items-stretch gap-2">
              <Link
                to="/cart"
                className="flex-1 flex items-center justify-between bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl transition-colors"
              >
                <span>장바구니 ({totalItems})</span>
                <span>{formatPrice(totalPrice)}</span>
              </Link>
              {tableNumber != null && (
                <Link
                  to="/history"
                  className="flex items-center bg-[#0d1a33] hover:bg-[#15264d] text-blue-300 font-medium px-4 rounded-xl transition-colors"
                  aria-label="주문 내역"
                >
                  내역
                </Link>
              )}
            </div>
          ) : (
            tableNumber != null && (
              <Link
                to="/history"
                className="block w-full text-center bg-[#0d1a33] hover:bg-[#15264d] text-blue-300 font-medium py-3 px-6 rounded-xl transition-colors"
              >
                테이블 {tableNumber}번 · 주문 내역 보기
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}
