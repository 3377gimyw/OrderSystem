import { useState } from "react";
import { menuItems } from "../data/menu";
import { useMenu } from "../context/MenuContext";
import { adminResetTable } from "../utils/adminResetTable";

const ADMIN_PASSWORD = "garden2026@";
const SESSION_KEY = "bar.adminAuth";
const TABLES = Array.from({ length: 48 }, (_, i) => i + 1);

export default function AdminPage() {
  const [authed, setAuthed] = useState(
    () => window.sessionStorage.getItem(SESSION_KEY) === "1"
  );
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  const [pendingTable, setPendingTable] = useState<number | null>(null);
  const [busyTable, setBusyTable] = useState<number | null>(null);
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
      setTableToast(`테이블 ${table}번 초기화 완료`);
      setTimeout(() => setTableToast(""), 2000);
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
      <div className="px-5 pt-12 max-w-md mx-auto">
        <h2 className="text-white text-lg font-bold mb-4">관리자 로그인</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            placeholder="비밀번호"
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
    );
  }

  return (
    <div className="px-5 pt-5 pb-16 max-w-md mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg font-bold">관리자</h2>
        <button
          onClick={handleLogout}
          className="text-gray-400 text-xs px-2 py-1 rounded hover:bg-[#1f0808] transition-colors"
        >
          로그아웃
        </button>
      </div>

      {/* Menu soldOut toggles */}
      <section>
        <h3 className="text-white font-semibold mb-2">메뉴 품절 관리</h3>
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
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
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
      </section>

      {/* Table reset */}
      <section>
        <h3 className="text-white font-semibold mb-1">테이블 초기화</h3>
        <p className="text-gray-400 text-xs mb-3">
          새 손님이 도착했을 때 해당 테이블의 주문 내역을 초기화하세요.
        </p>
        {tableError && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 rounded-xl p-3 text-sm mb-3">
            {tableError}
          </div>
        )}
        <div className="grid grid-cols-5 gap-2">
          {TABLES.map((t) => (
            <button
              key={t}
              onClick={() => setPendingTable(t)}
              disabled={busyTable === t}
              className="bg-[#0d0303] hover:bg-[#1f0808] disabled:opacity-50 border border-[#1f0808] text-white font-medium py-3 rounded-lg transition-colors"
            >
              {busyTable === t ? "..." : t}
            </button>
          ))}
        </div>
      </section>

      {/* Confirm reset modal */}
      {pendingTable != null && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center px-5 z-50"
          onClick={() => setPendingTable(null)}
        >
          <div
            className="bg-[#0d0303] border border-[#1f0808] rounded-xl p-5 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white font-medium mb-1">
              테이블 {pendingTable}번 초기화
            </p>
            <p className="text-gray-400 text-sm mb-5">
              이 테이블의 주문 내역이 손님에게 보이지 않게 됩니다. 시트의 데이터는
              유지됩니다.
            </p>
            <div className="flex gap-2">
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-900/90 border border-green-800 text-green-200 text-sm px-4 py-2 rounded-full">
          {tableToast}
        </div>
      )}
    </div>
  );
}
