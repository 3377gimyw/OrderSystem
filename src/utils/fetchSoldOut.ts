const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export async function fetchSoldOut(): Promise<string[]> {
  if (!GOOGLE_SCRIPT_URL) return [];
  try {
    const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=soldOut`);
    if (!res.ok) return [];
    const json = (await res.json()) as {
      result: string;
      soldOutIds?: string[];
    };
    return json.result === "success" ? (json.soldOutIds ?? []) : [];
  } catch {
    return [];
  }
}
