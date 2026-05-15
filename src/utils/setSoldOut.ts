const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
const ADMIN_SECRET = "garden2026@";

export async function setSoldOut(soldOutIds: string[]): Promise<void> {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error("Google Apps Script URL이 설정되지 않았습니다.");
  }
  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action: "setSoldOut", soldOutIds, secret: ADMIN_SECRET }),
  });
  if (!res.ok) throw new Error(`설정 실패 (HTTP ${res.status})`);
  const json = (await res.json()) as { result: string; message?: string };
  if (json.result !== "success") throw new Error(json.message ?? "설정 실패");
}
