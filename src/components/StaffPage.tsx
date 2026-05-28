import { useEffect, useState } from "react";
import { resetTableHistory } from "../utils/resetTableHistory";

const SECRET_KEY = "bar.staffSecret";

const SECTIONS: { label: string; count: number }[] = [
  { label: "1", count: 4 },
  { label: "2", count: 4 },
  { label: "3", count: 6 },
  { label: "4", count: 6 },
  { label: "5", count: 6 },
  { label: "6", count: 7 },
  { label: "7", count: 7 },
  { label: "8", count: 8 },
];

export default function StaffPage() {
  const [secret, setSecret] = useState<string | null>(null);
  const [secretInput, setSecretInput] = useState("");
  const [pendingTable, setPendingTable] = useState<string | null>(null);
  const [busyTable, setBusyTable] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = window.sessionStorage.getItem(SECRET_KEY);
    if (stored) setSecret(stored);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(""), 2000);
    return () => window.clearTimeout(id);
  }, [toast]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretInput) return;
    window.sessionStorage.setItem(SECRET_KEY, secretInput);
    setSecret(secretInput);
    setSecretInput("");
  };

  const handleConfirmReset = async () => {
    if (pendingTable == null || !secret) return;
    const table = pendingTable;
    setPendingTable(null);
    setBusyTable(table);
    setError("");
    try {
      await resetTableHistory(table, secret);
      setToast(`테이블 ${table} 초기화 완료`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "초기화 실패";
      setError(msg);
      if (msg === "인증 실패") {
        window.sessionStorage.removeItem(SECRET_KEY);
        setSecret(null);
      }
    } finally {
      setBusyTable(null);
    }
  };

  if (!secret) {
    return (
      <div className="px-5 pt-12 max-w-md mx-auto">
        <h2 className="text-white text-lg font-bold mb-4">스태프 로그인</h2>
        <form onSubmit={handleUnlock}>
          <input
            type="password"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            placeholder="비밀번호"
            className="w-full bg-[#0d0303] border border-[#1f0808] text-white rounded-xl px-4 py-3 text-base focus:outline-none focus:border-red-700 transition-colors"
          />
          <button
            type="submit"
            disabled={!secretInput}
            className="w-full mt-4 bg-red-900 hover:bg-red-800 disabled:bg-[#0d0303] disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            확인
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="px-5 pt-5 pb-10 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-white text-lg font-bold">테이블 초기화</h2>
        <button
          onClick={() => {
            window.sessionStorage.removeItem(SECRET_KEY);
            setSecret(null);
          }}
          className="text-gray-400 text-xs px-2 py-1 rounded hover:bg-[#1f0808] transition-colors"
        >
          로그아웃
        </button>
      </div>
      <p className="text-gray-400 text-xs mb-4">
        새 손님이 도착했을 때 해당 테이블의 주문 내역을 초기화하세요.
      </p>

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-400 rounded-xl p-3 text-sm mb-3">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {SECTIONS.map(({ label, count }) => (
          <div key={label}>
            <p className="text-gray-500 text-xs mb-1.5">{label}구역</p>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: count }, (_, i) => {
                const t = `${label}-${i + 1}`;
                return (
                  <button
                    key={t}
                    onClick={() => setPendingTable(t)}
                    disabled={busyTable === t}
                    className="bg-[#0d0303] hover:bg-[#1f0808] disabled:opacity-50 border border-[#1f0808] text-white font-medium py-3 rounded-lg transition-colors text-sm"
                  >
                    {busyTable === t ? "..." : t}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

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
              테이블 {pendingTable} 초기화
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

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-900/90 border border-green-800 text-green-200 text-sm px-4 py-2 rounded-full">
          {toast}
        </div>
      )}
    </div>
  );
}
