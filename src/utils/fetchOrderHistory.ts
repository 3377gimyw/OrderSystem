import type { OrderHistoryEntry } from "../types";

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export async function fetchOrderHistory(
  table: number
): Promise<OrderHistoryEntry[]> {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error("Google Apps Script URL이 설정되지 않았습니다.");
  }

  const url = `${GOOGLE_SCRIPT_URL}?table=${encodeURIComponent(table)}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    throw new Error(`주문 내역 조회 실패 (HTTP ${res.status})`);
  }

  const json = (await res.json()) as {
    result: string;
    orders?: OrderHistoryEntry[];
    message?: string;
  };
  if (json.result !== "success") {
    throw new Error(json.message ?? "주문 내역 조회 실패");
  }

  return json.orders ?? [];
}
