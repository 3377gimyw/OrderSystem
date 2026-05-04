import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { OrderHistoryEntry } from "../types";
import { useCart } from "../context/CartContext";
import { fetchOrderHistory } from "../utils/fetchOrderHistory";
import { formatPrice } from "../utils/formatPrice";

const STATUS_STYLES: Record<string, string> = {
  신규: "bg-blue-900/40 text-blue-300 border border-blue-800",
  준비중: "bg-amber-900/40 text-amber-300 border border-amber-800",
  완료: "bg-green-900/40 text-green-300 border border-green-800",
};

function stripSeconds(timestamp: string): string {
  return timestamp.replace(/:\d{2}$/, "");
}

export default function OrderHistoryPage() {
  const { tableNumber } = useCart();
  const [orders, setOrders] = useState<OrderHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          className="inline-block bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-5 rounded-xl transition-colors"
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
            테이블 {tableNumber}번
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="text-blue-400 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-900/30 disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : "새로고침"}
        </button>
      </div>

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
                  {stripSeconds(order.timestamp)}
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
  );
}
