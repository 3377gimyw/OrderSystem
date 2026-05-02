import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { submitOrder } from "../utils/submitOrder";
import { formatPrice } from "../utils/formatPrice";

export default function OrderForm() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [tableNumber, setTableNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submittedRef = useRef(false);

  if (items.length === 0 && !submittedRef.current) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitError("");

    const num = parseInt(tableNumber, 10);
    if (isNaN(num) || num < 1 || num > 30) {
      setError("테이블 번호는 1~30 사이의 숫자를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await submitOrder({
        tableNumber: num,
        items: items.map((item) => ({
          name: item.menuItem.name,
          quantity: item.quantity,
          price: item.menuItem.price,
        })),
        totalPrice,
        timestamp: new Date().toISOString(),
      });

      const orderedItems = items.map((item) => ({
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.menuItem.price,
      }));
      submittedRef.current = true;
      navigate("/confirmation", {
        replace: true,
        state: { tableNumber: num, totalPrice, items: orderedItems },
      });
      clearCart();
    } catch {
      setSubmitError("주문 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6">
      <h2 className="text-white text-xl font-bold mb-6">주문 확인</h2>

      <div className="bg-[#080f1e] rounded-xl p-4 mb-6">
        {items.map((item) => (
          <div
            key={item.menuItem.id}
            className="flex justify-between py-2 text-sm"
          >
            <span className="text-gray-300">
              {item.menuItem.name} x {item.quantity}
            </span>
            <span className="text-gray-300">
              {formatPrice(item.menuItem.price * item.quantity)}
            </span>
          </div>
        ))}
        <div className="flex justify-between pt-3 mt-2 border-t border-[#0d1a33]">
          <span className="text-white font-bold">총 금액</span>
          <span className="text-blue-400 font-bold">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label
          htmlFor="tableNumber"
          className="block text-white font-medium mb-2"
        >
          테이블 번호
        </label>
        <input
          id="tableNumber"
          type="number"
          min="1"
          max="30"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          placeholder="1~30"
          className="w-full bg-[#080f1e] border border-[#0d1a33] text-white rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-700 transition-colors"
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        {submitError && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 rounded-xl p-3 mt-4 text-sm">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-blue-900 hover:bg-blue-800 disabled:bg-[#080f1e] disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              주문 중...
            </span>
          ) : submitError ? (
            "다시 시도"
          ) : (
            "주문 전송"
          )}
        </button>
      </form>
    </div>
  );
}
