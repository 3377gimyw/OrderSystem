import { useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

const BANK_ACCOUNT = "국민은행 000-0000-0000-00 홍길동";

interface OrderedItem {
  name: string;
  quantity: number;
  price: number;
}

export default function OrderConfirmation() {
  const location = useLocation();
  const state = location.state as {
    tableNumber: number;
    totalPrice: number;
    items: OrderedItem[];
  } | null;

  const [showPayment, setShowPayment] = useState(true);

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const items: OrderedItem[] = state.items ?? [];

  return (
    <>
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
          테이블 <span className="text-white font-bold">{state.tableNumber}</span>번
        </p>
        <p className="text-blue-400 font-bold text-lg mb-8">
          {formatPrice(state.totalPrice)}
        </p>
        <button
          onClick={() => setShowPayment(true)}
          className="text-blue-400 text-sm underline mb-6"
        >
          입금 정보 다시 보기
        </button>
        <Link
          to="/"
          className="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          추가 주문하기
        </Link>
      </div>

      {showPayment && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/80"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-[#080f1e] border border-[#0d1a33] rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-white text-lg font-bold mb-1 text-center">
              입금 안내
            </h3>
            <p className="text-gray-400 text-sm text-center mb-5">
              주문 후 아래 계좌로 입금해 주세요
            </p>

            <div className="bg-black rounded-xl p-3 mb-5 text-center">
              <p className="text-blue-400 font-bold text-base">{BANK_ACCOUNT}</p>
            </div>

            <div className="space-y-2 mb-4">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-300">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-gray-300">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-3 border-t border-[#0d1a33] mb-6">
              <span className="text-white font-bold">총 입금액</span>
              <span className="text-blue-400 font-bold text-lg">
                {formatPrice(state.totalPrice)}
              </span>
            </div>

            <button
              onClick={() => setShowPayment(false)}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
