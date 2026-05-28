import { useState } from "react";
import { menuItems } from "../data/menu";
import { useMenu } from "../context/MenuContext";
import { adminResetTable } from "../utils/adminResetTable";

const ADMIN_PASSWORD = "garden2026@";
const SESSION_KEY = "bar.adminAuth";

const SECTIONS: { label: string; count: number; extras?: string[] }[] = [
  { label: "1", count: 4, extras: ["1-5", "1-6"] },
  { label: "2", count: 4, extras: ["2-0"] },
  { label: "3", count: 6 },
  { label: "4", count: 6 },
  { label: "5", count: 6 },
  { label: "6", count: 7 },
  { label: "7", count: 7 },
  { label: "8", count: 8 },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(
    () => window.sessionStorage.getItem(SESSION_KEY) === "1"
  );
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  const [pendingTable, setPendingTable] = useState<string | null>(null);
  const [busyTable, setBusyTable] = useState<string | null>(null);
  const [tableToast, setTableToast] = useState("");
  const [tableError, setTableError] = useState("");

  const [busyToggle, setBusyToggle] = useState<string | null>(null);
  const [toggleError, setToggleError] = useState("");

  const { soldOutIds, toggleSoldOut } = useMenu();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
    setPwInput("");
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  const handleConfirmReset = async () => {
    if (pendingTable == null) return;
    const table = pendingTable;
    setPendingTable(null);
    setBusyTable(table);
    setTableError("");
    try {
      await adminResetTable(table);
      setTableToast(`테이블 ${table} 초기화 완료`);
      setTimeout(() => setTableToast(""), 2500);
    } catch (err) {
      setTableError(err instanceof Error ? err.message : "초기화 실패");
    } finally {
      setBusyTable(null);
    }
  };

  const handleToggle = async (id: string) => {
    setBusyToggle(id);
    setToggleError("");
    try {
      await toggleSoldOut(id);
    } catch (err) {
      setToggleError(err instanceof Error ? err.message : "변경 실패");
    } finally {
      setBusyToggle(null);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h2 className="text-white text-2xl font-bold mb-6">관리자 로그인</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              placeholder="비밀번호"
              autoFocus
              className="w-full bg-[#0d0303] border border-[#1f0808] text-white rounded-xl px-4 py-3 text-base focus:outline-none focus:border-red-700 transition-colors"
            />
            {pwError && (
              <p className="text-red-400 text-sm mt-2">비밀번호가 올바르지 않습니다.</p>
            )}
            <button
              type="submit"
              disabled={!pwInput}
              className="w-full mt-4 bg-red-900 hover:bg-red-800 disabled:bg-[#0d0303] disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              확인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1f0808]">
        <h2 className="text-white text-xl font-bold">관리자</h2>
        <button
          onClick={handleLogout}
          className="text-gray-400 text-sm px-3 py-1.5 rounded-lg hover:bg-[#1f0808] transition-colors"
        >
          로그아웃
        </button>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-10 items-start">

        {/* Left: sold-out management */}
        <div className="w-72 shrink-0">
          <h3 className="text-white font-semibold text-base mb-3">메뉴 품절 관리</h3>
          {toggleError && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 rounded-xl p-3 text-sm mb-3">
              {toggleError}
            </div>
          )}
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isSoldOut = soldOutIds.has(item.id);
              const busy = busyToggle === item.id;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-[#0d0303] border border-[#1f0808] rounded-xl px-4 py-3"
                >
                  <div>
                    <span className="text-white text-sm">{item.name}</span>
                    {isSoldOut && (
                      <span className="ml-2 text-red-400 text-xs">품절</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggle(item.id)}
                    disabled={busy}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap ${
                      isSoldOut
                        ? "bg-green-900/50 hover:bg-green-900 text-green-300"
                        : "bg-red-900/50 hover:bg-red-900 text-red-300"
                    }`}
                  >
                    {busy ? "..." : isSoldOut ? "판매 재개" : "품절 처리"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="self-stretch w-px bg-[#1f0808] shrink-0" />

        {/* Right: table reset */}
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-1">
            <h3 className="text-white font-semibold text-base">테이블 초기화</h3>
            <span className="text-gray-500 text-xs">
              새 손님이 도착했을 때 해당 테이블을 초기화하세요
            </span>
          </div>

          {tableError && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 rounded-xl p-3 text-sm mb-4 mt-3">
              {tableError}
            </div>
          )}

          <div className="mt-4 space-y-2">
            {SECTIONS.map(({ label, count, extras }) => {
              const tables = [
                ...Array.from({ length: count }, (_, i) => `${label}-${i + 1}`),
                ...(extras ?? []),
              ];
              return (
                <div key={label} className="flex items-center gap-4">
                  <span className="text-gray-400 font-bold text-sm w-5 shrink-0 text-center">
                    {label}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {tables.map((t) => (
                      <button
                        key={t}
                        onClick={() => setPendingTable(t)}
                        disabled={busyTable === t}
                        className="bg-[#0d0303] hover:bg-[#1f0808] disabled:opacity-50 border border-[#1f0808] text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm min-w-[64px]"
                      >
                        {busyTable === t ? "..." : t}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirm reset modal */}
      {pendingTable != null && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center px-5 z-50"
          onClick={() => setPendingTable(null)}
        >
          <div
            className="bg-[#0d0303] border border-[#1f0808] rounded-xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white font-semibold text-lg mb-1">
              테이블 {pendingTable} 초기화
            </p>
            <p className="text-gray-400 text-sm mb-6">
              이 테이블의 주문 내역이 손님에게 보이지 않게 됩니다. 시트의 데이터는
              유지됩니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingTable(null)}
                className="flex-1 bg-[#1f0808] hover:bg-[#2e0c0c] text-white py-2.5 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 bg-red-900 hover:bg-red-800 text-white font-bold py-2.5 rounded-lg transition-colors"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}

      {tableToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-900/90 border border-green-800 text-green-200 text-sm px-5 py-2.5 rounded-full whitespace-nowrap">
          {tableToast}
        </div>
      )}
    </div>
  );
}
