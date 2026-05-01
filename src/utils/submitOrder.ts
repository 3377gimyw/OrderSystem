import type { Order } from "../types";

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export async function submitOrder(order: Order): Promise<{ result: string }> {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error("Google Apps Script URL이 설정되지 않았습니다.");
  }

  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify(order),
  });

  return { result: "success" };
}
