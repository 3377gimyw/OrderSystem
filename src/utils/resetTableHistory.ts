const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export async function resetTableHistory(
  table: number,
  secret: string
): Promise<void> {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error("Google Apps Script URL이 설정되지 않았습니다.");
  }

  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action: "reset", table, secret }),
  });

  if (!res.ok) {
    throw new Error(`초기화 실패 (HTTP ${res.status})`);
  }

  const json = (await res.json()) as { result: string; message?: string };
  if (json.result !== "success") {
    throw new Error(json.message ?? "초기화 실패");
  }
}
