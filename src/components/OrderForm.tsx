import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { submitOrder } from "../utils/submitOrder";
import { formatPrice } from "../utils/formatPrice";

export default function OrderForm() {
  const { items, totalPrice, clearCart, orderId, tableNumber } = useCart();
  const navigate = useNavigate();
  const [depositorName, setDepositorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const submittedRef = useRef(false);

  if (items.length === 0 && !submittedRef.current) {
    return <Navigate to="/" replace />;
  }

  if (tableNumber == null) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-gray-300 text-sm mb-2">
          테이블 번호가 확인되지 않았습니다.
        </p>
        <p className="text-gray-500 text-xs mb-6">
          테이블의 QR 코드를 다시 스캔해 주세요.
        </p>
        <Link
          to="/"
          className="inline-block bg-red-900 hover:bg-red-800 text-white font-medium py-2 px-5 rounded-xl transition-colors"
        >
          메뉴로 돌아가기
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      await submitOrder({
        orderId,
        tableNumber,
        depositorName,
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
        state: { tableNumber, totalPrice, items: orderedItems, depositorName },
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

      <div className="bg-[#0d0303] rounded-xl p-4 mb-6">
        <div className="flex justify-between pb-3 mb-2 border-b border-[#1f0808]">
          <span className="text-gray-400 text-sm">테이블</span>
          <span className="text-white font-bold">{tableNumber}</span>
        </div>
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
        <div className="flex justify-between pt-3 mt-2 border-t border-[#1f0808]">
          <span className="text-white font-bold">총 금액</span>
          <span className="text-white font-bold">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-1">입금자명</label>
          <input
            type="text"
            value={depositorName}
            onChange={(e) => setDepositorName(e.target.value)}
            placeholder="입금자 이름을 입력하세요"
            className="w-full bg-[#0d0303] border border-[#1f0808] text-white rounded-xl px-4 py-3 text-base focus:outline-none focus:border-red-700 transition-colors"
          />
        </div>

        {submitError && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 rounded-xl p-3 mb-4 text-sm">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !depositorName.trim()}
          className="w-full bg-red-900 hover:bg-red-800 disabled:bg-[#0d0303] disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-colors"
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

      {showConfirm && createPortal(
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div className="bg-[#0d0303] border border-[#1f0808] rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-white text-lg font-bold text-center mb-2">
              입금자명이 맞나요?
            </h3>
            <p className="text-red-400 font-bold text-center text-xl mb-6">
              {depositorName}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-[#1f0808] hover:bg-[#2a0a0a] text-white font-bold py-3 rounded-xl transition-colors"
              >
                수정하기
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-red-900 hover:bg-red-800 text-white font-bold py-3 rounded-xl transition-colors"
              >
                맞습니다
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
