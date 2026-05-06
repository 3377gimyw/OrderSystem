import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import CartItemComponent from "./CartItem";

export default function Cart() {
  const { items, totalPrice, tableNumber } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="text-gray-400 text-lg mb-4">장바구니가 비어있습니다</p>
        <Link
          to="/"
          className="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          메뉴 보기
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 pb-28">
      <h2 className="text-white text-xl font-bold py-4">장바구니</h2>
      <div>
        {items.map((item) => (
          <CartItemComponent key={item.menuItem.id} item={item} />
        ))}
      </div>
      <div className="flex items-center justify-between py-4 border-t border-[#0d1a33] mt-2">
        <span className="text-gray-400 font-medium">총 금액</span>
        <span className="text-white text-xl font-bold">
          {formatPrice(totalPrice)}
        </span>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur border-t border-[#0d1a33]">
        {tableNumber == null && (
          <p className="text-amber-400 text-xs text-center mb-2">
            테이블의 QR 코드를 다시 스캔해 주세요.
          </p>
        )}
        <button
          onClick={() => navigate("/order")}
          disabled={tableNumber == null}
          className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-[#080f1e] disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-colors"
        >
          주문하기
        </button>
      </div>
    </div>
  );
}
