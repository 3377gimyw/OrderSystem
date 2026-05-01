import { Link, useLocation, Navigate } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

export default function OrderConfirmation() {
  const location = useLocation();
  const state = location.state as {
    tableNumber: number;
    totalPrice: number;
  } | null;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-green-900/30 border border-green-800 rounded-full w-16 h-16 flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-white text-2xl font-bold mb-2">
        주문이 완료되었습니다!
      </h2>
      <p className="text-gray-400 mb-1">
        테이블 <span className="text-white font-bold">{state.tableNumber}</span>
        번
      </p>
      <p className="text-blue-400 font-bold text-lg mb-8">
        {formatPrice(state.totalPrice)}
      </p>
      <Link
        to="/"
        className="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-xl transition-colors"
      >
        추가 주문하기
      </Link>
    </div>
  );
}
