import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useMenu } from "../context/MenuContext";
import { submitOrder } from "../utils/submitOrder";
import { formatPrice } from "../utils/formatPrice";

const BANK_NAME = "토스뱅크";
const BANK_ACCOUNT_NUMBER = "1002-5786-3351";
const BANK_HOLDER = "김성국";

export default function OrderForm() {
  const { items, totalPrice, clearCart, orderId, tableNumber } = useCart();
  const { soldOutIds } = useMenu();
  const navigate = useNavigate();
  const [depositorName, setDepositorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const handleCopy = async () => {
    const text = `${BANK_NAME} ${BANK_ACCOUNT_NUMBER} ${BANK_HOLDER}\n입금액: ${formatPrice(totalPrice)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);

    const orderable = items.filter((item) => !soldOutIds.has(item.menuItem.id));
    if (orderable.length === 0) {
      setSubmitError("품절된 메뉴만 담겨 있어 주문할 수 없습니다. 메뉴를 다시 선택해주세요.");
      return;
    }
    const orderableTotal = orderable.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );

    setLoading(true);
    try {
      await submitOrder({
        orderId,
        tableNumber,
        depositorName,
        items: orderable.map((item) => ({
          name: item.menuItem.name,
          quantity: item.quantity,
          price: item.menuItem.price,
        })),
        totalPrice: orderableTotal,
        timestamp: new Date().toISOString(),
      });

      const orderedItems = orderable.map((item) => ({
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.menuItem.price,
      }));
      submittedRef.current = true;
      navigate("/confirmation", {
        replace: true,
        state: { tableNumber, totalPrice: orderableTotal, items: orderedItems, depositorName },
      });
      clearCart();
    } catch {
      setSubmitError("주문 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <h2 className="text-white text-xl font-bold mb-6">주문 확인</h2>

      {/* Bank account + price */}
      <div className="bg-[#0d0303] border border-[#1f0808] rounded-xl p-4 mb-4">
        <p className="text-gray-400 text-xs text-center mb-1">
          {BANK_NAME} · {BANK_HOLDER}
        </p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <p className="text-red-400 font-bold text-base">
            {BANK_ACCOUNT_NUMBER}
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="bg-red-900 hover:bg-red-800 active:scale-95 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
          >
            {copied ? "복사됨" : "복사"}
          </button>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-[#1f0808]">
          <span className="text-gray-400 text-sm">입금 금액</span>
          <span className="text-white font-bold text-lg">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      {/* Depositor name input */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-5">
          <label className="block text-white font-semibold text-base mb-2">
            입금자명 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={depositorName}
            onChange={(e) => setDepositorName(e.target.value)}
            placeholder="입금자 이름을 입력하세요"
            className="w-full bg-[#0d0303] border-2 border-[#3a0f0f] text-white rounded-xl px-4 py-3 text-base focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600"
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
          className="w-full bg-red-500 hover:bg-red-400 active:scale-[0.98] text-white font-bold text-lg py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              주문 중...
            </span>
          ) : submitError ? (
            "다시 시도"
          ) : (
            "주문 전송하기"
          )}
        </button>
      </form>

      {/* Order summary (secondary) */}
      <div className="bg-[#0d0303] border border-[#1f0808] rounded-xl p-4">
        <div className="flex justify-between pb-2 mb-2 border-b border-[#1f0808]">
          <span className="text-gray-400 text-xs">테이블</span>
          <span className="text-white text-xs font-bold">{tableNumber}</span>
        </div>
        {items.map((item) => (
          <div key={item.menuItem.id} className="flex justify-between py-1 text-xs">
            <span className="text-gray-400">
              {item.menuItem.name} × {item.quantity}
            </span>
            <span className="text-gray-400">
              {formatPrice(item.menuItem.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

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
