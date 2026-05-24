import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

const SECTION_LIMITS: Record<string, number> = {
  A: 4, B: 4, C: 6, D: 6, E: 6, F: 7, G: 7, H: 8,
};

function isValidTable(value: string): boolean {
  const match = value.toUpperCase().match(/^([A-H])-(\d+)$/);
  if (!match) return false;
  const section = match[1];
  const num = parseInt(match[2], 10);
  return num >= 1 && num <= (SECTION_LIMITS[section] ?? 0);
}

export function useTablePrefill() {
  const [params] = useSearchParams();
  const { setTableNumber } = useCart();

  useEffect(() => {
    const raw = params.get("t") ?? params.get("table");
    if (!raw) return;
    const normalized = raw.toUpperCase();
    if (!isValidTable(normalized)) return;
    setTableNumber(normalized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
