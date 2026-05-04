import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-[#0d1a33]">
      <div className="flex items-center justify-between px-4 h-14">
        <Link to="/" className="text-lg font-bold text-white">
          주문 내역
        </Link>
        <Link
          to="/history"
          className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
          aria-label="주문 내역"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9h6m-6 4h4"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}
