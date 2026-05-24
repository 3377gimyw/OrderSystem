import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import type { OrderHistoryEntry } from "../types";
import { useCart } from "../context/CartContext";
import { fetchOrderHistory } from "../utils/fetchOrderHistory";
import { formatPrice } from "../utils/formatPrice";

const BANK_NAME = "토스뱅크";
const BANK_ACCOUNT_NUMBER = "1002-5786-3351";
const BANK_HOLDER = "김성국";

function stripSeconds(timestamp: string): string {
  return timestamp.replace(/:\d{2}$/, "");
}

function PaymentModal({
  order,
  onClose,
}: {
  order: OrderHistoryEntry;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `${BANK_NAME} ${BANK_ACCOUNT_NUMBER} ${BANK_HOLDER}\n입금액: ${formatPrice(order.totalPrice)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0d0303] border border-[#1f0808] rounded-2xl w-full max-w-sm p-6"
      >
        <h3 className="text-white text-lg font-bold mb-1 text-center">
          입금 안내
        </h3>
        <p className="text-gray-400 text-xs text-center mb-5">
          {stripSeconds(order.timestamp)}
        </p>

        <div className="bg-black rounded-xl p-3 mb-5">
          <p className="text-gray-400 text-xs text-center mb-1">
            {BANK_NAME} · {BANK_HOLDER}
          </p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-red-400 font-bold text-base">
              {BANK_ACCOUNT_NUMBER}
            </p>
            <button
              onClick={handleCopy}
              className="bg-red-900 hover:bg-red-800 active:scale-95 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
            >
              {copied ? "복사됨" : "복사"}
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-300">
                {item.name} × {item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-3 border-t border-[#1f0808] mb-6">
          <span className="text-white font-bold">총 입금액</span>
          <span className="text-white font-bold text-lg">
            {formatPrice(order.totalPrice)}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-red-900 hover:bg-red-800 text-white font-bold py-3 rounded-xl transition-colors"
        >
          확인
        </button>
      </div>
    </div>,
    document.body
  );
}

export default function OrderHistoryPage() {
  const { tableNumber } = useCart();
  const [orders, setOrders] = useState<OrderHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentOrder, setPaymentOrder] = useState<OrderHistoryEntry | null>(null);

  const load = async () => {
    if (tableNumber == null) return;
    setLoading(true);
    setError("");
    try {
      const result = await fetchOrderHistory(tableNumber);
      setOrders(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "주문 내역 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableNumber]);

  if (tableNumber == null) {
    return (
      <div className="px-5 py-12 text-center">
        <p className="text-gray-400 text-sm mb-4">
          테이블 번호가 설정되지 않았습니다.
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

  return (
    <div className="px-5 pt-5 pb-10 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white text-lg font-bold">주문 내역</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            테이블 {tableNumber}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="text-red-400 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-900/30 disabled:opacity-50 transition-colors flex items-center gap-1.5"
        >
          {loading && (
            <span className="inline-block w-3.5 h-3.5 border-2 border-red-400/40 border-t-red-400 rounded-full animate-spin" />
          )}
          새로고침
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-400 rounded-xl p-3 text-sm mb-3">
          {error}
        </div>
      )}

      {loading && orders.length === 0 && (
        <div className="flex justify-center py-12">
          <span className="inline-block w-8 h-8 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <p className="text-gray-500 text-center py-12 text-sm">
          아직 주문 내역이 없습니다
        </p>
      )}

      <div className="space-y-3">
        {orders.map((order, i) => (
          <div
            key={order.orderId || `${order.timestamp}-${i}`}
            className="bg-black border border-[#1f0808] rounded-xl p-3"
          >
            <div className="mb-2">
              <span className="text-gray-400 text-xs">
                {stripSeconds(order.timestamp)}
              </span>
            </div>
            <div className="space-y-1 mb-2">
              {order.items.map((item, j) => (
                <div
                  key={j}
                  className="flex justify-between text-sm text-gray-300"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setPaymentOrder(order)}
              className="text-red-400 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-900/30 transition-colors w-full mb-2"
            >
              입금정보 다시보기
            </button>
            <div className="flex items-center justify-between pt-2 border-t border-[#1f0808]">
              <span className="text-gray-400 text-xs">합계</span>
              <span className="text-white font-bold text-sm">
                {formatPrice(order.totalPrice)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {paymentOrder && (
        <PaymentModal
          order={paymentOrder}
          onClose={() => setPaymentOrder(null)}
        />
      )}
    </div>
  );
}
