import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

const SECTION_LIMITS: Record<string, number> = {
  A: 4, B: 4, C: 6, D: 6, E: 6, F: 7, G: 7, H: 8,
};

// URL (QR code) section letter → display/storage section number.
// A=1, B=2, ..., H=8. URL form stays alphabet; everything else is numeric.
const SECTION_TO_NUMBER: Record<string, string> = {
  A: "1", B: "2", C: "3", D: "4", E: "5", F: "6", G: "7", H: "8",
};

// Maps URL QR code values (alphabet form) to the canonical alphabet table value.
// The result is then converted to numeric form before storage.
const TABLE_ALIAS: Record<string, string> = {
  "C-6": "A-6",
  "D-6": "A-5",
  "F-7": "B-0",
};

function isValidTable(value: string): boolean {
  const match = value.toUpperCase().match(/^([A-H])-(\d+)$/);
  if (!match) return false;
  const section = match[1];
  const num = parseInt(match[2], 10);
  return num >= 1 && num <= (SECTION_LIMITS[section] ?? 0);
}

function toNumericTable(alphaTable: string): string {
  const match = alphaTable.toUpperCase().match(/^([A-H])-(\d+)$/);
  if (!match) return alphaTable;
  return `${SECTION_TO_NUMBER[match[1]]}-${match[2]}`;
}

export function useTablePrefill() {
  const [params] = useSearchParams();
  const { setTableNumber } = useCart();

  useEffect(() => {
    const raw = params.get("t") ?? params.get("table");
    if (!raw) return;
    const normalized = raw.toUpperCase();
    if (normalized in TABLE_ALIAS) {
      setTableNumber(toNumericTable(TABLE_ALIAS[normalized]));
      return;
    }
    if (!isValidTable(normalized)) return;
    setTableNumber(toNumericTable(normalized));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
