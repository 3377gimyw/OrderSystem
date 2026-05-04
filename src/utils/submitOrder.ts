import type { Order } from "../types";

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export async function submitOrder(order: Order): Promise<{ result: string }> {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error("Google Apps Script URL이 설정되지 않았습니다.");
  }

  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    throw new Error(`주문 전송 실패 (HTTP ${res.status})`);
  }

  const json = (await res.json()) as { result: string; message?: string };
  if (json.result !== "success") {
    throw new Error(json.message ?? "주문 전송 실패");
  }

  return json;
}
