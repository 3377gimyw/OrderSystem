import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { OrderHistoryEntry } from "../types";
import { fetchOrderHistory } from "../utils/fetchOrderHistory";
import { formatPrice } from "../utils/formatPrice";

interface Props {
  tableNumber: number;
  onClose: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  신규: "bg-blue-900/40 text-blue-300 border border-blue-800",
  준비중: "bg-amber-900/40 text-amber-300 border border-amber-800",
  완료: "bg-green-900/40 text-green-300 border border-green-800",
};

export default function OrderHistory({ tableNumber, onClose }: Props) {
  const [orders, setOrders] = useState<OrderHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
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
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#080f1e] border-t border-[#0d1a33] rounded-t-2xl w-full max-w-md max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h3 className="text-white text-lg font-bold">주문 내역</h3>
            <p className="text-gray-400 text-xs mt-0.5">
              테이블 {tableNumber}번
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="text-blue-400 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-900/30 disabled:opacity-50 transition-colors"
            >
              {loading ? "..." : "새로고침"}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1"
              aria-label="닫기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-5 pb-6 flex-1">
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 rounded-xl p-3 text-sm mb-3">
              {error}
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <p className="text-gray-500 text-center py-12 text-sm">
              아직 주문 내역이 없습니다
            </p>
          )}

          <div className="space-y-3">
            {orders.map((order, i) => {
              const statusClass =
                STATUS_STYLES[order.status] ??
                "bg-gray-800 text-gray-300 border border-gray-700";
              return (
                <div
                  key={order.orderId || `${order.timestamp}-${i}`}
                  className="bg-black border border-[#0d1a33] rounded-xl p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs">
                      {order.timestamp}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusClass}`}
                    >
                      {order.status || "-"}
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
                  <div className="flex justify-between pt-2 border-t border-[#0d1a33]">
                    <span className="text-gray-400 text-xs">합계</span>
                    <span className="text-blue-400 font-bold text-sm">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
